/**
 * Currency HUD — instant FX converter for Even G2 (Even Hub publication build).
 *
 * Voice input uses **bring-your-own-key** Groq Whisper.
 *
 * Supports 7 UI languages (see ./i18n.ts). All user-visible strings come from
 * the `L()` helper so the same code path works regardless of language.
 */
import {
  waitForEvenAppBridge,
  EvenAppBridge,
  TextContainerProperty,
  TextContainerUpgrade,
  ListContainerProperty,
  ListItemContainerProperty,
  CreateStartUpPageContainer,
  RebuildPageContainer,
  OsEventTypeList,
  EventSourceType,
  type EvenHubEvent,
} from '@evenrealities/even_hub_sdk'

import { DigitWheel } from './input-wheel'
import { getRates, fetchRates, convert, unitRate, type RatesPayload } from './rates'
import { formatAmount, withCommas, roundWith, decimalsFor, unitPhrase, shortDate } from './format'
import { L, LANGS, setLang, getLang, type Lang } from './i18n'

const SETTINGS_KEY = 'g2-currency-hub.settings.v1'
const GROQ_KEY = 'g2-currency-hub.groq-key.v1'
const CURRENCIES = ['USD','EUR','GBP','CNY','KRW','THB','SGD','AUD','HKD','JPY']

const RECORD_MS = 3000
const SAMPLE_RATE = 16000
const BYTES_PER_SEC = SAMPLE_RATE * 2
const MAX_RECORD_BYTES = Math.ceil((RECORD_MS / 1000 + 1) * BYTES_PER_SEC)

const HEADER_ID = 1
const LIST_ID = 2
const HINT_ID = 3
const PAGE_ID = 1

interface Settings { src: string; tgt: string }
const DEFAULT_SETTINGS: Settings = { src: 'USD', tgt: 'JPY' }
function saveSettings(s: Settings): void {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)) } catch { /* quota */ }
}
function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch { return { ...DEFAULT_SETTINGS } }
}
let settings: Settings = loadSettings()

function getGroqKey(): string | null {
  try {
    const k = localStorage.getItem(GROQ_KEY)
    return k && k.startsWith('gsk_') ? k : null
  } catch { return null }
}

// ---------- Audio helpers ----------
function pcmChunkToBytes(p: unknown): Uint8Array {
  if (p instanceof Uint8Array) return p
  if (Array.isArray(p)) return Uint8Array.from(p as number[])
  if (typeof p === 'string') {
    const bin = atob(p); const u = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i)
    return u
  }
  return new Uint8Array()
}
function pcmToWav(pcm: Uint8Array, sampleRate = SAMPLE_RATE, channels = 1, bits = 16): Blob {
  const blockAlign = (channels * bits) / 8
  const byteRate = sampleRate * blockAlign
  const buffer = new ArrayBuffer(44 + pcm.length)
  const view = new DataView(buffer)
  const w = (off: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)) }
  w(0, 'RIFF'); view.setUint32(4, 36 + pcm.length, true); w(8, 'WAVE')
  w(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true)
  view.setUint16(22, channels, true); view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true); view.setUint16(32, blockAlign, true); view.setUint16(34, bits, true)
  w(36, 'data'); view.setUint32(40, pcm.length, true)
  new Uint8Array(buffer, 44).set(pcm)
  return new Blob([buffer], { type: 'audio/wav' })
}

async function transcribe(wav: Blob, key: string): Promise<string> {
  const form = new FormData()
  form.append('file', wav, 'audio.wav')
  form.append('model', 'whisper-large-v3-turbo')
  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  })
  if (res.status === 401) throw new Error('Bad API key (401)')
  if (!res.ok) throw new Error(`STT ${res.status} ${(await res.text().catch(() => '')).slice(0, 80)}`)
  const j = (await res.json()) as { text?: string }
  return (j.text ?? '').trim()
}

function parseAmount(transcript: string): number | null {
  const m = transcript.replace(/[，、]/g, ',').match(/(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?/)
  if (m) {
    const n = Number(m[1].replace(/,/g, '') + (m[2] ? '.' + m[2] : ''))
    if (Number.isFinite(n)) return n
  }
  const jp = transcript
    .replace(/ひゃく|百/g, '*100')
    .replace(/せん|千/g, '*1000')
    .replace(/まん|万/g, '*10000')
  const m2 = jp.match(/(\d+)/)
  return m2 ? Number(m2[1]) : null
}

// ---------- Container builders ----------
function truncate(s: string, n: number): string { return s.length > n ? s.slice(0, n - 1) + '…' : s }
function headerContainer(content: string, height = 70): TextContainerProperty {
  return new TextContainerProperty({
    xPosition: 0, yPosition: 0, width: 576, height,
    borderWidth: 0, borderColor: 8, paddingLength: 8,
    containerID: HEADER_ID, containerName: 'header', content, isEventCapture: 0,
  })
}
function hintContainer(content: string, y = 252, height = 36): TextContainerProperty {
  return new TextContainerProperty({
    xPosition: 0, yPosition: y, width: 576, height,
    borderWidth: 0, borderColor: 8, paddingLength: 8,
    containerID: HINT_ID, containerName: 'hint', content, isEventCapture: 0,
  })
}
function listContainer(items: string[], y: number, height: number): ListContainerProperty {
  return new ListContainerProperty({
    xPosition: 0, yPosition: y, width: 576, height,
    borderWidth: 0, borderColor: 8, borderRadius: 0, paddingLength: 4,
    containerID: LIST_ID, containerName: 'list', isEventCapture: 1,
    itemContainer: new ListItemContainerProperty({
      itemCount: items.length, itemWidth: 560, isItemSelectBorderEn: 1, itemName: items,
    }),
  })
}
function singleTextPage(content: string, name: string, border = 0): RebuildPageContainer {
  return new RebuildPageContainer({
    containerTotalNum: 1,
    textObject: [new TextContainerProperty({
      xPosition: 0, yPosition: 0, width: 576, height: 288, borderWidth: border, borderColor: 8,
      paddingLength: 10, containerID: PAGE_ID, containerName: name, content, isEventCapture: 1,
    })],
  })
}

// ---------- State ----------
type View =
  | 'menu' | 'recording' | 'transcribing' | 'notheard' | 'voiceSetup'
  | 'wheel' | 'result' | 'settings' | 'pickCurrency' | 'pickLang' | 'error'

let bridge: EvenAppBridge
let view: View = 'menu'
let rates: RatesPayload | null = null
let listIndex = 0

const wheel = new DigitWheel()

let recChunks: Uint8Array[] = []
let recBytes = 0
let recTimer: number | null = null
let recCountdown: number | null = null

let pickFor: 'src' | 'tgt' = 'src'

function setHostStatus(text: string): void {
  const el = document.getElementById('bridgeStatus'); if (el) el.textContent = text
}

function pairCaption(): string {
  if (!rates) return `${settings.src} → ${settings.tgt}\n(${L().loadingRates})`
  const u = unitRate(settings.src, settings.tgt, rates)
  return [`${settings.src} → ${settings.tgt}`,
          `${unitPhrase(settings.src, settings.tgt, u)}  (${shortDate(rates.date)})`].join('\n')
}

// ---------- Menu ----------
function menuItems(): string[] {
  const t = L()
  return [t.menuVoice, t.menuKeypad, t.menuSettings]
}
async function showMenu(): Promise<void> {
  view = 'menu'
  listIndex = 0
  await bridge.rebuildPageContainer(new RebuildPageContainer({
    containerTotalNum: 3,
    textObject: [headerContainer(pairCaption(), 70), hintContainer(L().disclaimer)],
    listObject: [listContainer(menuItems(), 76, 174)],
  }))
  setHostStatus('menu')
}

// ---------- Voice ----------
async function startVoice(): Promise<void> {
  const key = getGroqKey()
  if (!key) { await showVoiceSetup(); return }
  await startRecording(key)
}
async function showVoiceSetup(): Promise<void> {
  view = 'voiceSetup'
  const t = L()
  await bridge.rebuildPageContainer(singleTextPage(
    [t.voiceSetupTitle, '', t.voiceSetupBody, '', t.tapBack].join('\n'),
    'voiceSetup', 1))
  setHostStatus('voiceSetup')
}
async function updateRecordingScreen(remainingSec: number): Promise<void> {
  const bar = '●'.repeat(Math.max(0, Math.ceil(remainingSec)))
  const t = L()
  try {
    await bridge.textContainerUpgrade(new TextContainerUpgrade({
      containerID: PAGE_ID, containerName: 'recording',
      content: [t.recording, '', t.recordingLeft(Math.ceil(remainingSec)), bar, '', t.dblCancel].join('\n'),
    }))
  } catch { /* container may not exist yet */ }
}
async function startRecording(key: string): Promise<void> {
  view = 'recording'
  recChunks = []; recBytes = 0
  const t = L()
  await bridge.rebuildPageContainer(singleTextPage([t.recording, '', t.recordingLeft(RECORD_MS / 1000), '', t.dblCancel].join('\n'), 'recording'))
  setHostStatus('recording')
  try { await bridge.audioControl(true) } catch (e) { await showError(`mic: ${String(e)}`); return }
  const startedAt = Date.now()
  recCountdown = window.setInterval(() => {
    const remaining = (RECORD_MS - (Date.now() - startedAt)) / 1000
    if (remaining > 0) void updateRecordingScreen(remaining)
  }, 500)
  recTimer = window.setTimeout(() => { void stopAndTranscribe(key) }, RECORD_MS)
}
function clearRecTimers(): void {
  if (recTimer !== null) { window.clearTimeout(recTimer); recTimer = null }
  if (recCountdown !== null) { window.clearInterval(recCountdown); recCountdown = null }
}
async function cancelRecording(): Promise<void> {
  clearRecTimers()
  try { await bridge.audioControl(false) } catch { /* ignore */ }
  recChunks = []; recBytes = 0
  await showMenu()
}
async function stopAndTranscribe(key: string): Promise<void> {
  clearRecTimers()
  try { await bridge.audioControl(false) } catch { /* ignore */ }
  view = 'transcribing'
  const t = L()
  await bridge.rebuildPageContainer(singleTextPage([t.recognizing, '', t.pleaseWait].join('\n'), 'transcribing'))
  setHostStatus('transcribing')
  if (recBytes < BYTES_PER_SEC * 1) { await showNotHeard(t.audioTooShort); return }
  const pcm = new Uint8Array(recBytes); let off = 0
  for (const c of recChunks) { pcm.set(c, off); off += c.length }
  recChunks = []; recBytes = 0
  let text: string
  try { text = await transcribe(pcmToWav(pcm), key) }
  catch (e) { await showError(String(e)); return }
  const amount = parseAmount(text)
  if (amount === null) { await showNotHeard(text ? `"${text.slice(0, 24)}"` : t.noNumberHeard); return }
  await showResult(amount)
}

// ---------- Wheel ----------
async function showWheel(): Promise<void> {
  view = 'wheel'
  wheel.reset()
  await bridge.rebuildPageContainer(singleTextPage(wheelScreen(), 'wheel'))
  setHostStatus('wheel')
}
function wheelScreen(): string {
  const t = L()
  return [pairCaption(), '',
    `${settings.src} ${wheel.render()}`, '',
    t.wheelHint1,
    t.wheelHint2].join('\n')
}
async function refreshWheel(): Promise<void> {
  try {
    await bridge.textContainerUpgrade(new TextContainerUpgrade({
      containerID: PAGE_ID, containerName: 'wheel', content: wheelScreen(),
    }))
  } catch { /* container may not exist yet */ }
}

// ---------- Result ----------
async function showResult(amount: number): Promise<void> {
  view = 'result'
  if (!rates) { await showError(L().rateUnavailable); return }
  const raw = convert(amount, settings.src, settings.tgt, rates)
  const decimals = decimalsFor(settings.tgt, raw)
  const converted = roundWith(raw, decimals, 'round')
  const u = unitRate(settings.src, settings.tgt, rates)
  const inDec = Number.isInteger(amount) ? 0 : 2
  await bridge.rebuildPageContainer(singleTextPage(
    [formatAmount(amount, settings.src, inDec),
     `= ${formatAmount(converted, settings.tgt, decimals)}`,
     `${unitPhrase(settings.src, settings.tgt, u)}  (${shortDate(rates.date)})`,
     '', L().tapBack].join('\n'),
    'result', 1))
  setHostStatus(`result: ${amount} ${settings.src} = ${converted} ${settings.tgt}`)
}

// ---------- Error / NotHeard ----------
async function showError(msg: string): Promise<void> {
  view = 'error'
  await bridge.rebuildPageContainer(singleTextPage(['Error', truncate(msg, 100), '', L().tapBack].join('\n'), 'error', 1))
  setHostStatus(`error: ${msg}`)
}
async function showNotHeard(detail: string): Promise<void> {
  view = 'notheard'
  const t = L()
  await bridge.rebuildPageContainer(singleTextPage(
    [t.couldNotHear, truncate(detail, 40), '', t.tapRetry, t.dblBack].join('\n'),
    'notheard', 1))
  setHostStatus(`notheard: ${detail}`)
}

// ---------- Settings ----------
const SETTINGS_FROM = 0
const SETTINGS_TO = 1
const SETTINGS_LANG = 2
function settingsItems(): string[] {
  const langNative = LANGS.find((l) => l.code === getLang())?.native ?? getLang()
  return [`From: ${settings.src}`, `To:   ${settings.tgt}`, `${L().language}: ${langNative}`]
}
async function showSettings(): Promise<void> {
  view = 'settings'
  listIndex = 0
  await bridge.rebuildPageContainer(new RebuildPageContainer({
    containerTotalNum: 3,
    textObject: [headerContainer(L().settingsTitle, 40), hintContainer(L().saveAndBack)],
    listObject: [listContainer(settingsItems(), 44, 206)],
  }))
  setHostStatus('settings')
}
async function pickCurrency(forField: 'src' | 'tgt'): Promise<void> {
  view = 'pickCurrency'
  pickFor = forField
  // OS list always starts visually at index 0; align our listIndex to match
  // so that a tap with no scrolling commits the top item correctly.
  listIndex = 0
  const cur = forField === 'src' ? settings.src : settings.tgt
  const title = `${forField === 'src' ? L().chooseFrom : L().chooseTo}  (now: ${cur})`
  await bridge.rebuildPageContainer(new RebuildPageContainer({
    containerTotalNum: 3,
    textObject: [headerContainer(title, 40), hintContainer(L().pickHint)],
    listObject: [listContainer(CURRENCIES, 44, 206)],
  }))
  setHostStatus(`pickCurrency:${forField}`)
}
function commitCurrencyPick(): void {
  const code = CURRENCIES[listIndex]
  if (pickFor === 'src') settings.src = code
  else settings.tgt = code
  saveSettings(settings)
}

async function pickLanguage(): Promise<void> {
  view = 'pickLang'
  listIndex = 0
  const curNative = LANGS.find((l) => l.code === getLang())?.native ?? getLang()
  const title = `${L().chooseLanguage}  (now: ${curNative})`
  await bridge.rebuildPageContainer(new RebuildPageContainer({
    containerTotalNum: 3,
    textObject: [headerContainer(title, 40), hintContainer(L().pickHint)],
    listObject: [listContainer(LANGS.map((l) => l.native), 44, 206)],
  }))
  setHostStatus('pickLang')
}
function commitLangPick(): void {
  const lang = LANGS[listIndex]?.code as Lang | undefined
  if (lang) setLang(lang)
}

async function commitSettingsAndExit(): Promise<void> {
  saveSettings(settings)
  await bridge.rebuildPageContainer(singleTextPage([L().savingRefreshing].join('\n'), 'refreshing'))
  try { rates = await fetchRates() } catch (e) { console.warn('[currency-hub] refresh on save failed:', e) }
  await showMenu()
}

// ---------- Audio capture ----------
function onAudio(bytes: Uint8Array): void {
  if (view !== 'recording' || bytes.length === 0) return
  if (recBytes + bytes.length > MAX_RECORD_BYTES) return
  recChunks.push(bytes); recBytes += bytes.length
}

// ---------- Gesture classification ----------
type Action = 'click' | 'double' | 'scroll-up' | 'scroll-down' | 'none'
function classify(event: EvenHubEvent): Action {
  if (event.listEvent && typeof event.listEvent.currentSelectItemIndex === 'number') {
    listIndex = event.listEvent.currentSelectItemIndex
  }
  const sub = event.textEvent ?? event.listEvent ?? event.sysEvent
  const type = sub?.eventType
  const source = event.sysEvent?.eventSource
  if (type === OsEventTypeList.DOUBLE_CLICK_EVENT) return 'double'
  if (type === OsEventTypeList.SCROLL_TOP_EVENT) return 'scroll-up'
  if (type === OsEventTypeList.SCROLL_BOTTOM_EVENT) return 'scroll-down'
  if (type === OsEventTypeList.CLICK_EVENT) return 'click'
  if (type === undefined) {
    const touch = source !== undefined && source !== EventSourceType.TOUCH_EVENT_FORM_DUMMY_NULL
    if (touch || event.listEvent) return 'click'
  }
  return 'none'
}

async function onGesture(a: Action): Promise<void> {
  if (a === 'none') return
  switch (view) {
    case 'menu': {
      if (a === 'click') {
        if (listIndex === 0) await startVoice()
        else if (listIndex === 1) await showWheel()
        else if (listIndex === 2) await showSettings()
      } else if (a === 'double') {
        try { await bridge.shutDownPageContainer(1) } catch (e) { console.warn(e) }
      }
      break
    }
    case 'recording':
      if (a === 'double') await cancelRecording()
      break
    case 'transcribing':
      break
    case 'notheard':
      if (a === 'click') await startVoice()
      else if (a === 'double') await showMenu()
      break
    case 'voiceSetup':
      if (a === 'click' || a === 'double') await showMenu()
      break
    case 'wheel':
      if (a === 'scroll-up') { wheel.bump(1); void refreshWheel() }
      else if (a === 'scroll-down') { wheel.bump(-1); void refreshWheel() }
      else if (a === 'click') { wheel.tap(); void refreshWheel() }
      else if (a === 'double') { await showResult(wheel.value()) }
      break
    case 'result':
      if (a === 'click' || a === 'double') await showMenu()
      break
    case 'settings':
      if (a === 'click') {
        if (listIndex === SETTINGS_FROM) await pickCurrency('src')
        else if (listIndex === SETTINGS_TO) await pickCurrency('tgt')
        else if (listIndex === SETTINGS_LANG) await pickLanguage()
      } else if (a === 'double') {
        await commitSettingsAndExit()
      }
      break
    case 'pickCurrency':
      if (a === 'click') { commitCurrencyPick(); await showSettings() }
      else if (a === 'double') { await showSettings() }
      break
    case 'pickLang':
      if (a === 'click') { commitLangPick(); await showSettings() }
      else if (a === 'double') { await showSettings() }
      break
    case 'error':
      await showMenu()
      break
  }
}

function cleanup(): void {
  clearRecTimers()
  try { void bridge?.audioControl(false) } catch { /* ignore */ }
}

async function main(): Promise<void> {
  bridge = await waitForEvenAppBridge()
  await bridge.createStartUpPageContainer(new CreateStartUpPageContainer({
    containerTotalNum: 1,
    textObject: [new TextContainerProperty({
      xPosition: 0, yPosition: 0, width: 576, height: 288, borderWidth: 0, borderColor: 5,
      paddingLength: 10, containerID: PAGE_ID, containerName: 'boot',
      content: `${L().boot}\n\n${L().loadingRates}`, isEventCapture: 1,
    })],
  }))
  try { rates = await getRates(false) }
  catch (e) { console.warn('[currency-hub] rate fetch failed:', e); rates = null }

  bridge.onEvenHubEvent((event) => {
    if (event.audioEvent) { onAudio(pcmChunkToBytes(event.audioEvent.audioPcm)); return }
    const sysType = event.sysEvent?.eventType
    if (sysType === OsEventTypeList.ABNORMAL_EXIT_EVENT || sysType === OsEventTypeList.SYSTEM_EXIT_EVENT) {
      cleanup(); return
    }
    if (sysType === OsEventTypeList.FOREGROUND_EXIT_EVENT) {
      clearRecTimers()
      try { void bridge.audioControl(false) } catch { /* ignore */ }
      return
    }
    if (sysType === OsEventTypeList.FOREGROUND_ENTER_EVENT) {
      if (view !== 'recording') void showMenu()
      return
    }
    void onGesture(classify(event))
  })
  await showMenu()
}

main().catch((err) => {
  console.error('[currency-hub] fatal:', err)
  setHostStatus(`Error: ${String(err)}`)
})
