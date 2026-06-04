/**
 * Currency formatting + rounding helpers.
 */
export type Rounding = 'round' | 'ceil' | 'floor'

const SYMBOLS: Record<string, string> = {
  USD: '$',  EUR: '€',  GBP: '£',  CNY: '¥',  KRW: '₩',
  TWD: 'NT$', THB: '฿', SGD: 'S$', AUD: 'A$', HKD: 'HK$',
  JPY: '¥',
}

export function symbolOf(code: string): string {
  return SYMBOLS[code] ?? code
}

export function roundWith(n: number, decimals: number, mode: Rounding): number {
  const p = Math.pow(10, decimals)
  if (mode === 'ceil') return Math.ceil(n * p) / p
  if (mode === 'floor') return Math.floor(n * p) / p
  return Math.round(n * p) / p
}

/** "1234567.89" -> "1,234,567.89" (locale-free, simple comma group). */
export function withCommas(n: number, decimals: number): string {
  const fixed = n.toFixed(decimals)
  const [intPart, frac] = fixed.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return frac !== undefined ? `${grouped}.${frac}` : grouped
}

/**
 * Sensible decimals per currency and magnitude.
 * - JPY/KRW: no fractional units in everyday use → 0 unless the value is < 1.
 * - Everything else: 2 unless the value is < 1 (then 4 so "15円 → $0.0944" isn't rounded to 0).
 */
export function decimalsFor(code: string, value: number): number {
  const abs = Math.abs(value)
  if (code === 'JPY' || code === 'KRW') return abs > 0 && abs < 1 ? 2 : 0
  return abs > 0 && abs < 1 ? 4 : 2
}

export function formatAmount(amount: number, code: string, decimals = 2): string {
  return `${symbolOf(code)}${withCommas(amount, decimals)}`
}

/** "$1 = ¥158.74" — caption for the per-unit rate. */
export function unitPhrase(src: string, tgt: string, rate: number): string {
  const d = decimalsFor(tgt, rate)
  return `${symbolOf(src)}1 = ${symbolOf(tgt)}${withCommas(rate, d)}`
}

/** "6/3" (no year) from a YYYY-MM-DD string. */
export function shortDate(ymd: string): string {
  const m = ymd.match(/^\d{4}-(\d{2})-(\d{2})$/)
  if (!m) return ymd
  return `${Number(m[1])}/${Number(m[2])}`
}
