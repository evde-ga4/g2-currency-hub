/**
 * Exchange-rate fetcher — calls Frankfurter directly (no backend).
 *
 * Frankfurter is CORS-enabled and free (no API key). It returns ECB reference
 * rates, so its "today" is usually the previous business-day EOD. We cache the
 * payload in LocalStorage so we only hit the network when needed.
 */
export interface RatesPayload {
  base: string
  date: string             // YYYY-MM-DD (Frankfurter's date)
  rates: Record<string, number>
  fetchedAt: number        // client-side epoch ms
}

const STORAGE_KEY = 'g2-currency-hub.rates.v1'
const BASE_CCY = 'JPY'
const SYMBOLS = ['USD','EUR','GBP','CNY','KRW','THB','SGD','AUD','HKD']

const ENV = ((import.meta as unknown as { env?: Record<string, string> }).env) ?? {}
// In dev Vite proxies /frankfurter -> api.frankfurter.app to avoid CORS friction.
// In packaged builds we hit the real origin directly (Frankfurter sends CORS).
const FX_BASE = ENV.DEV ? '/frankfurter' : 'https://api.frankfurter.app'

function todayYmd(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function loadCache(): RatesPayload | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as RatesPayload) : null
  } catch { return null }
}

function saveCache(p: RatesPayload): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)) } catch { /* quota */ }
}

export async function fetchRates(): Promise<RatesPayload> {
  const url = `${FX_BASE}/latest?from=${BASE_CCY}&to=${SYMBOLS.join(',')}`
  const r = await fetch(url)
  if (!r.ok) throw new Error(`frankfurter HTTP ${r.status}`)
  const body = (await r.json()) as { base?: string; date?: string; rates?: Record<string, number> }
  const payload: RatesPayload = {
    base: body.base ?? BASE_CCY,
    date: body.date ?? todayYmd(),
    rates: body.rates ?? {},
    fetchedAt: Date.now(),
  }
  saveCache(payload)
  return payload
}

export async function getRates(force = false): Promise<RatesPayload> {
  const cached = loadCache()
  if (!force && cached && cached.date === todayYmd()) return cached
  try { return await fetchRates() }
  catch (e) { if (cached) return cached; throw e }
}

export function convert(amount: number, src: string, tgt: string, rates: RatesPayload): number {
  if (src === tgt) return amount
  const base = rates.base
  const inBase = src === base ? amount : amount / rates.rates[src]
  return tgt === base ? inBase : inBase * rates.rates[tgt]
}

export function unitRate(src: string, tgt: string, rates: RatesPayload): number {
  return convert(1, src, tgt, rates)
}

export function isStale(p: RatesPayload): boolean {
  // Frankfurter publishes ECB rates with up to one business-day lag, so we treat
  // "stale" as 3+ days old to avoid false positives on weekends.
  const d = new Date(p.date + 'T00:00:00Z').getTime()
  return (Date.now() - d) > 3 * 24 * 60 * 60 * 1000
}
