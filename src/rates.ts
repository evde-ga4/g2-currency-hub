/**
 * Exchange-rate fetcher — calls our Cloudflare Workers proxy.
 *
 * Why a proxy instead of api.frankfurter.app directly:
 *   Some WebView environments (notably the Even Realities review tester)
 *   reported CORS / network failures hitting Frankfurter directly. Going
 *   through the proxy guarantees CORS headers and lets us cache the daily
 *   payload server-side as well.
 *
 * Worker endpoint:
 *   GET https://currency-g2-proxy.evde.workers.dev/rates
 *   -> { base: "JPY", date: "YYYY-MM-DD", rates: { USD: 0.0063, ... } }
 */
export interface RatesPayload {
  base: string
  date: string
  rates: Record<string, number>
  fetchedAt: number
}

const STORAGE_KEY = 'g2-currency-hub.rates.v1'

const ENV = ((import.meta as unknown as { env?: Record<string, string> }).env) ?? {}
// In dev, we hit the proxy directly (Vite no longer rewrites /frankfurter).
const PROXY_BASE = ENV.VITE_API_BASE ?? 'https://currency-g2-proxy.evde.workers.dev'

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
  const r = await fetch(`${PROXY_BASE}/rates`)
  if (!r.ok) throw new Error(`rates HTTP ${r.status}`)
  const body = (await r.json()) as { base?: string; date?: string; rates?: Record<string, number> }
  const payload: RatesPayload = {
    base: body.base ?? 'JPY',
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
  const d = new Date(p.date + 'T00:00:00Z').getTime()
  return (Date.now() - d) > 3 * 24 * 60 * 60 * 1000
}
