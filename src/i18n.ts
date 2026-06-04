/**
 * Lightweight i18n — 7 supported languages.
 *
 * Detection priority: explicit user choice (localStorage) → navigator.language.
 * All zh-* locales fall through to zh-CN (we only ship simplified).
 */

export type Lang = 'en' | 'ja' | 'zh-CN' | 'de' | 'ko' | 'es' | 'fr'

export const LANGS: { code: Lang; native: string }[] = [
  { code: 'en',    native: 'English' },
  { code: 'ja',    native: '日本語' },
  { code: 'zh-CN', native: '简体中文' },
  { code: 'de',    native: 'Deutsch' },
  { code: 'ko',    native: '한국어' },
  { code: 'es',    native: 'Español' },
  { code: 'fr',    native: 'Français' },
]

const LANG_KEY = 'g2-currency-hub.lang.v1'

export interface Strings {
  // Boot
  boot: string
  loadingRates: string
  // Menu
  menuVoice: string
  menuKeypad: string
  menuSettings: string
  disclaimer: string
  // Recording / STT
  recording: string
  recordingLeft: (n: number) => string
  recognizing: string
  pleaseWait: string
  audioTooShort: string
  // Not heard
  couldNotHear: string
  noNumberHeard: string
  // Voice setup
  voiceSetupTitle: string
  voiceSetupBody: string
  // Wheel
  wheelHint1: string
  wheelHint2: string
  // Result
  rateUnavailable: string
  // Settings
  settingsTitle: string
  saveAndBack: string
  savingRefreshing: string
  // Currency picker
  chooseFrom: string
  chooseTo: string
  pickHint: string
  // Common hints
  tapBack: string
  tapRetry: string
  dblBack: string
  dblCancel: string
  // Language picker
  language: string
  chooseLanguage: string
  // Phone panel
  appTitle: string
  phoneSubtitle: string
  apiKeyLabel: string
  apiKeyPlaceholder: string
  show: string
  hide: string
  save: string
  clear: string
  statusEnabled: (prefix: string) => string
  statusDisabled: string
  statusPasteFirst: string
  statusBadKey: string
  cardBodyIntro: (groqLink: string) => string
  howToGet: string
  step1: (consoleLink: string) => string
  step2: string
  step3: string
  step4: string
  withoutKey: string
  bootingBridge: string
  privacyLink: string
  ratesFooter: (link: string) => string
}

// ---------- English (master) ----------
const en: Strings = {
  boot: 'Currency HUD',
  loadingRates: 'Loading rates…',

  menuVoice: 'Voice',
  menuKeypad: 'Keypad',
  menuSettings: 'Settings',
  disclaimer: 'Info only · not financial advice',

  recording: '● Recording…',
  recordingLeft: (n) => `${n}s left`,
  recognizing: '🔎 Recognizing…',
  pleaseWait: 'Please wait',
  audioTooShort: 'Audio too short',

  couldNotHear: 'Could not hear',
  noNumberHeard: 'No number heard',

  voiceSetupTitle: 'Voice needs a Groq key',
  voiceSetupBody: 'Open this app in the\nEven Realities app on\nyour phone and paste\nyour gsk_... key.',

  wheelHint1: '↑↓ = digit · tap = next / back',
  wheelHint2: '< taps back one digit · dbl = OK',

  rateUnavailable: 'Rate not available',

  settingsTitle: 'Settings',
  saveAndBack: 'dbl = save & back',
  savingRefreshing: 'Saving… refreshing rates…',

  chooseFrom: 'Choose From',
  chooseTo: 'Choose To',
  pickHint: 'tap = pick · dbl = cancel',

  tapBack: 'tap = back',
  tapRetry: 'tap = retry',
  dblBack: 'dbl = back',
  dblCancel: 'dbl = cancel',

  language: 'Language',
  chooseLanguage: 'Choose Language',

  appTitle: 'Currency HUD',
  phoneSubtitle: 'Configure voice input for your Even G2.',
  apiKeyLabel: 'Groq API key (optional)',
  apiKeyPlaceholder: 'gsk_...',
  show: 'Show',
  hide: 'Hide',
  save: 'Save',
  clear: 'Clear',
  statusEnabled: (prefix) => `Voice enabled · key saved (${prefix}…)`,
  statusDisabled: 'Voice disabled · no key set',
  statusPasteFirst: 'Please paste your gsk_... key first.',
  statusBadKey: 'That does not look like a Groq key (should start with gsk_).',
  cardBodyIntro: (groqLink) => `Voice input uses ${groqLink}'s Whisper API with <strong>your own API key</strong>. Audio is sent directly from the Even app to Groq — never to us.`,
  howToGet: 'How to get a key (free, 1 min):',
  step1: (link) => `1. Open ${link} on this phone or a computer`,
  step2: '2. Sign in with Google or GitHub',
  step3: '3. "Create API Key" → copy the <code>gsk_...</code> string',
  step4: '4. Paste it above and tap <strong>Save</strong>',
  withoutKey: 'Without a key, Voice will show a setup reminder. Keypad input still works fine.',
  bootingBridge: 'Booting bridge…',
  privacyLink: 'Privacy',
  ratesFooter: (link) => `Rates from ${link} (ECB). Info only — not financial advice.`,
}

// ---------- Japanese ----------
const ja: Strings = {
  boot: 'Currency HUD',
  loadingRates: 'レート取得中…',

  menuVoice: '音声入力',
  menuKeypad: '桁入力',
  menuSettings: '設定',
  disclaimer: '参考情報のみ · 投資助言ではありません',

  recording: '● 録音中…',
  recordingLeft: (n) => `あと ${n} 秒`,
  recognizing: '🔎 認識中…',
  pleaseWait: 'お待ちください',
  audioTooShort: '音声が短すぎます',

  couldNotHear: '聞き取れませんでした',
  noNumberHeard: '数字が認識できません',

  voiceSetupTitle: 'Voice には Groq キーが必要',
  voiceSetupBody: 'iPhone の Even App で\nこのアプリを開いて\ngsk_... キーを貼り付けて\nください。',

  wheelHint1: '↑↓ = 数字 · tap = 次桁/戻る',
  wheelHint2: '< で 1 桁戻る · dbl = 確定',

  rateUnavailable: 'レートが取得できていません',

  settingsTitle: '設定',
  saveAndBack: 'dbl = 保存して戻る',
  savingRefreshing: '保存中… レート更新中…',

  chooseFrom: 'From 通貨選択',
  chooseTo: 'To 通貨選択',
  pickHint: 'tap = 決定 · dbl = キャンセル',

  tapBack: 'tap = 戻る',
  tapRetry: 'tap = もう一度',
  dblBack: 'dbl = 戻る',
  dblCancel: 'dbl = 中止',

  language: '言語',
  chooseLanguage: '言語選択',

  appTitle: 'Currency HUD',
  phoneSubtitle: 'Even G2 の音声入力を設定します。',
  apiKeyLabel: 'Groq API キー（任意）',
  apiKeyPlaceholder: 'gsk_...',
  show: '表示',
  hide: '隠す',
  save: '保存',
  clear: 'クリア',
  statusEnabled: (prefix) => `音声有効 · キー保存済 (${prefix}…)`,
  statusDisabled: '音声は無効です · キー未設定',
  statusPasteFirst: 'まず gsk_... のキーを貼り付けてください。',
  statusBadKey: 'Groq キーではないようです（gsk_ で始まるはず）。',
  cardBodyIntro: (groqLink) => `音声入力は ${groqLink} の Whisper API を <strong>ご自身の API キー</strong> で利用します。音声は Even App から直接 Groq に送信され、私たちのサーバーは経由しません。`,
  howToGet: 'キーの取得方法（無料・1 分）:',
  step1: (link) => `1. ${link} をスマホかPCで開く`,
  step2: '2. Google または GitHub でサインイン',
  step3: '3. "Create API Key" → <code>gsk_...</code> 文字列をコピー',
  step4: '4. 上の欄に貼り付けて <strong>Save</strong>',
  withoutKey: 'キーが無い場合、Voice はセットアップ案内を表示します。Keypad 入力は引き続き使えます。',
  bootingBridge: 'ブリッジ起動中…',
  privacyLink: 'プライバシー',
  ratesFooter: (link) => `レートは ${link}（ECB）から。参考情報のみ、投資助言ではありません。`,
}

// ---------- Simplified Chinese ----------
const zhCN: Strings = {
  boot: 'Currency HUD',
  loadingRates: '正在加载汇率…',

  menuVoice: '语音',
  menuKeypad: '键盘',
  menuSettings: '设置',
  disclaimer: '仅供参考 · 不构成投资建议',

  recording: '● 录音中…',
  recordingLeft: (n) => `剩余 ${n} 秒`,
  recognizing: '🔎 识别中…',
  pleaseWait: '请稍候',
  audioTooShort: '音频太短',

  couldNotHear: '无法识别',
  noNumberHeard: '未识别到数字',

  voiceSetupTitle: '语音需要 Groq 密钥',
  voiceSetupBody: '请在手机的 Even App\n中打开本应用,粘贴\n您的 gsk_... 密钥。',

  wheelHint1: '↑↓ = 数字 · 单击 = 下一位/返回',
  wheelHint2: '在 < 时单击退一位 · 双击 = 确定',

  rateUnavailable: '无法获取汇率',

  settingsTitle: '设置',
  saveAndBack: '双击 = 保存并返回',
  savingRefreshing: '保存中… 正在更新汇率…',

  chooseFrom: '选择源货币',
  chooseTo: '选择目标货币',
  pickHint: '单击 = 选择 · 双击 = 取消',

  tapBack: '单击 = 返回',
  tapRetry: '单击 = 重试',
  dblBack: '双击 = 返回',
  dblCancel: '双击 = 取消',

  language: '语言',
  chooseLanguage: '选择语言',

  appTitle: 'Currency HUD',
  phoneSubtitle: '为您的 Even G2 配置语音输入。',
  apiKeyLabel: 'Groq API 密钥（可选）',
  apiKeyPlaceholder: 'gsk_...',
  show: '显示',
  hide: '隐藏',
  save: '保存',
  clear: '清除',
  statusEnabled: (prefix) => `语音已启用 · 密钥已保存 (${prefix}…)`,
  statusDisabled: '语音已禁用 · 未设置密钥',
  statusPasteFirst: '请先粘贴您的 gsk_... 密钥。',
  statusBadKey: '看起来不是 Groq 密钥（应以 gsk_ 开头）。',
  cardBodyIntro: (groqLink) => `语音输入通过 ${groqLink} 的 Whisper API,使用 <strong>您自己的 API 密钥</strong>。音频从 Even App 直接发送到 Groq,不经过我们的服务器。`,
  howToGet: '获取密钥（免费,1 分钟）:',
  step1: (link) => `1. 在手机或电脑上打开 ${link}`,
  step2: '2. 使用 Google 或 GitHub 登录',
  step3: '3. "Create API Key" → 复制 <code>gsk_...</code> 字符串',
  step4: '4. 粘贴到上方并点击 <strong>保存</strong>',
  withoutKey: '没有密钥时,语音会显示设置提示。键盘输入依然可用。',
  bootingBridge: '正在启动桥接…',
  privacyLink: '隐私',
  ratesFooter: (link) => `汇率来自 ${link}（欧洲央行）。仅供参考,不构成投资建议。`,
}

// ---------- German ----------
const de: Strings = {
  boot: 'Currency HUD',
  loadingRates: 'Lade Wechselkurse…',

  menuVoice: 'Sprache',
  menuKeypad: 'Tastatur',
  menuSettings: 'Einstellungen',
  disclaimer: 'Nur Information · keine Anlageberatung',

  recording: '● Aufnahme…',
  recordingLeft: (n) => `${n}s übrig`,
  recognizing: '🔎 Erkenne…',
  pleaseWait: 'Bitte warten',
  audioTooShort: 'Audio zu kurz',

  couldNotHear: 'Nicht verstanden',
  noNumberHeard: 'Keine Zahl erkannt',

  voiceSetupTitle: 'Sprache braucht Groq-Schlüssel',
  voiceSetupBody: 'Öffne die App in der\nEven-App auf deinem\nHandy und füge deinen\ngsk_... Schlüssel ein.',

  wheelHint1: '↑↓ = Ziffer · tap = weiter / zurück',
  wheelHint2: '< : ein Schritt zurück · dbl = OK',

  rateUnavailable: 'Kurs nicht verfügbar',

  settingsTitle: 'Einstellungen',
  saveAndBack: 'dbl = speichern & zurück',
  savingRefreshing: 'Speichern… Kurse aktualisieren…',

  chooseFrom: 'Von',
  chooseTo: 'Nach',
  pickHint: 'tap = wählen · dbl = abbrechen',

  tapBack: 'tap = zurück',
  tapRetry: 'tap = erneut',
  dblBack: 'dbl = zurück',
  dblCancel: 'dbl = abbrechen',

  language: 'Sprache',
  chooseLanguage: 'Sprache wählen',

  appTitle: 'Currency HUD',
  phoneSubtitle: 'Spracheingabe für deine Even G2 einrichten.',
  apiKeyLabel: 'Groq API-Schlüssel (optional)',
  apiKeyPlaceholder: 'gsk_...',
  show: 'Zeigen',
  hide: 'Verbergen',
  save: 'Speichern',
  clear: 'Löschen',
  statusEnabled: (prefix) => `Sprache aktiv · Schlüssel gespeichert (${prefix}…)`,
  statusDisabled: 'Sprache deaktiviert · kein Schlüssel',
  statusPasteFirst: 'Bitte zuerst den gsk_... Schlüssel einfügen.',
  statusBadKey: 'Das sieht nicht nach einem Groq-Schlüssel aus (sollte mit gsk_ beginnen).',
  cardBodyIntro: (groqLink) => `Spracheingabe nutzt ${groqLink}s Whisper-API mit <strong>deinem eigenen API-Schlüssel</strong>. Audio wird direkt aus der Even-App an Groq gesendet — nie an uns.`,
  howToGet: 'So bekommst du einen Schlüssel (kostenlos, 1 Min):',
  step1: (link) => `1. ${link} auf Handy oder Computer öffnen`,
  step2: '2. Mit Google oder GitHub anmelden',
  step3: '3. "Create API Key" → <code>gsk_...</code> kopieren',
  step4: '4. Oben einfügen und auf <strong>Speichern</strong> tippen',
  withoutKey: 'Ohne Schlüssel zeigt Sprache einen Einrichtungshinweis. Tastatur funktioniert weiterhin.',
  bootingBridge: 'Bridge wird gestartet…',
  privacyLink: 'Datenschutz',
  ratesFooter: (link) => `Kurse von ${link} (EZB). Nur Information — keine Anlageberatung.`,
}

// ---------- Korean ----------
const ko: Strings = {
  boot: 'Currency HUD',
  loadingRates: '환율 로딩 중…',

  menuVoice: '음성',
  menuKeypad: '키패드',
  menuSettings: '설정',
  disclaimer: '참고용 · 투자 조언 아님',

  recording: '● 녹음 중…',
  recordingLeft: (n) => `${n}초 남음`,
  recognizing: '🔎 인식 중…',
  pleaseWait: '잠시만 기다려 주세요',
  audioTooShort: '오디오가 너무 짧습니다',

  couldNotHear: '인식하지 못했습니다',
  noNumberHeard: '숫자를 듣지 못했습니다',

  voiceSetupTitle: '음성에는 Groq 키가 필요합니다',
  voiceSetupBody: '휴대전화의 Even 앱에서\n이 앱을 열고\ngsk_... 키를\n붙여넣어 주세요.',

  wheelHint1: '↑↓ = 숫자 · 탭 = 다음 / 뒤로',
  wheelHint2: '< 표시에서 탭 = 한 자리 뒤로 · 더블탭 = 확인',

  rateUnavailable: '환율을 가져올 수 없습니다',

  settingsTitle: '설정',
  saveAndBack: '더블탭 = 저장 후 돌아가기',
  savingRefreshing: '저장 중… 환율 새로고침…',

  chooseFrom: 'From 통화 선택',
  chooseTo: 'To 통화 선택',
  pickHint: '탭 = 선택 · 더블탭 = 취소',

  tapBack: '탭 = 뒤로',
  tapRetry: '탭 = 다시',
  dblBack: '더블탭 = 뒤로',
  dblCancel: '더블탭 = 취소',

  language: '언어',
  chooseLanguage: '언어 선택',

  appTitle: 'Currency HUD',
  phoneSubtitle: 'Even G2의 음성 입력을 설정합니다.',
  apiKeyLabel: 'Groq API 키 (선택)',
  apiKeyPlaceholder: 'gsk_...',
  show: '표시',
  hide: '숨기기',
  save: '저장',
  clear: '지우기',
  statusEnabled: (prefix) => `음성 사용 가능 · 키 저장됨 (${prefix}…)`,
  statusDisabled: '음성 비활성화 · 키 없음',
  statusPasteFirst: '먼저 gsk_... 키를 붙여넣어 주세요.',
  statusBadKey: 'Groq 키가 아닌 것 같습니다 (gsk_로 시작해야 합니다).',
  cardBodyIntro: (groqLink) => `음성 입력은 ${groqLink}의 Whisper API를 <strong>본인의 API 키</strong>로 사용합니다. 오디오는 Even 앱에서 직접 Groq로 전송되며, 우리 서버를 거치지 않습니다.`,
  howToGet: '키 받기 (무료, 1분):',
  step1: (link) => `1. 휴대전화나 컴퓨터에서 ${link} 열기`,
  step2: '2. Google 또는 GitHub으로 로그인',
  step3: '3. "Create API Key" → <code>gsk_...</code> 문자열 복사',
  step4: '4. 위에 붙여넣고 <strong>저장</strong> 탭',
  withoutKey: '키가 없으면 음성에서 설정 안내가 표시됩니다. 키패드는 정상 작동합니다.',
  bootingBridge: '브리지 시작 중…',
  privacyLink: '개인정보',
  ratesFooter: (link) => `환율 출처: ${link} (ECB). 참고용 — 투자 조언이 아닙니다.`,
}

// ---------- Spanish ----------
const es: Strings = {
  boot: 'Currency HUD',
  loadingRates: 'Cargando tasas…',

  menuVoice: 'Voz',
  menuKeypad: 'Teclado',
  menuSettings: 'Ajustes',
  disclaimer: 'Solo informativo · no es consejo financiero',

  recording: '● Grabando…',
  recordingLeft: (n) => `${n}s restantes`,
  recognizing: '🔎 Reconociendo…',
  pleaseWait: 'Por favor espera',
  audioTooShort: 'Audio demasiado corto',

  couldNotHear: 'No pude escuchar',
  noNumberHeard: 'Ningún número detectado',

  voiceSetupTitle: 'Voz necesita una clave Groq',
  voiceSetupBody: 'Abre esta app en la\nEven Realities app de tu\nteléfono y pega tu\nclave gsk_...',

  wheelHint1: '↑↓ = dígito · tap = siguiente / atrás',
  wheelHint2: '< retrocede un dígito · dbl = OK',

  rateUnavailable: 'Tasa no disponible',

  settingsTitle: 'Ajustes',
  saveAndBack: 'dbl = guardar y volver',
  savingRefreshing: 'Guardando… actualizando tasas…',

  chooseFrom: 'Elegir Desde',
  chooseTo: 'Elegir Hacia',
  pickHint: 'tap = elegir · dbl = cancelar',

  tapBack: 'tap = volver',
  tapRetry: 'tap = reintentar',
  dblBack: 'dbl = volver',
  dblCancel: 'dbl = cancelar',

  language: 'Idioma',
  chooseLanguage: 'Elegir idioma',

  appTitle: 'Currency HUD',
  phoneSubtitle: 'Configura la entrada de voz para tu Even G2.',
  apiKeyLabel: 'Clave API de Groq (opcional)',
  apiKeyPlaceholder: 'gsk_...',
  show: 'Mostrar',
  hide: 'Ocultar',
  save: 'Guardar',
  clear: 'Borrar',
  statusEnabled: (prefix) => `Voz activa · clave guardada (${prefix}…)`,
  statusDisabled: 'Voz desactivada · sin clave',
  statusPasteFirst: 'Pega primero tu clave gsk_...',
  statusBadKey: 'No parece una clave Groq (debería empezar con gsk_).',
  cardBodyIntro: (groqLink) => `La entrada de voz usa la API Whisper de ${groqLink} con <strong>tu propia clave API</strong>. El audio se envía directamente desde la app Even a Groq — nunca a nosotros.`,
  howToGet: 'Cómo obtener una clave (gratis, 1 min):',
  step1: (link) => `1. Abre ${link} en tu teléfono o computadora`,
  step2: '2. Inicia sesión con Google o GitHub',
  step3: '3. "Create API Key" → copia la cadena <code>gsk_...</code>',
  step4: '4. Pégala arriba y toca <strong>Guardar</strong>',
  withoutKey: 'Sin clave, Voz mostrará un recordatorio de configuración. El Teclado funciona igual.',
  bootingBridge: 'Iniciando puente…',
  privacyLink: 'Privacidad',
  ratesFooter: (link) => `Tasas de ${link} (BCE). Solo informativo — no es consejo financiero.`,
}

// ---------- French ----------
const fr: Strings = {
  boot: 'Currency HUD',
  loadingRates: 'Chargement des taux…',

  menuVoice: 'Voix',
  menuKeypad: 'Clavier',
  menuSettings: 'Réglages',
  disclaimer: 'Information seulement · pas un conseil financier',

  recording: '● Enregistrement…',
  recordingLeft: (n) => `${n}s restantes`,
  recognizing: '🔎 Reconnaissance…',
  pleaseWait: 'Veuillez patienter',
  audioTooShort: 'Audio trop court',

  couldNotHear: 'Non entendu',
  noNumberHeard: 'Aucun nombre détecté',

  voiceSetupTitle: 'La voix nécessite une clé Groq',
  voiceSetupBody: "Ouvre cette appli dans\nl'appli Even Realities\nsur ton téléphone et\ncolle ta clé gsk_...",

  wheelHint1: '↑↓ = chiffre · tap = suivant / retour',
  wheelHint2: '< : reculer d\'un chiffre · dbl = OK',

  rateUnavailable: 'Taux indisponible',

  settingsTitle: 'Réglages',
  saveAndBack: 'dbl = enregistrer et revenir',
  savingRefreshing: 'Enregistrement… mise à jour des taux…',

  chooseFrom: 'Choisir De',
  chooseTo: 'Choisir Vers',
  pickHint: 'tap = choisir · dbl = annuler',

  tapBack: 'tap = retour',
  tapRetry: 'tap = réessayer',
  dblBack: 'dbl = retour',
  dblCancel: 'dbl = annuler',

  language: 'Langue',
  chooseLanguage: 'Choisir la langue',

  appTitle: 'Currency HUD',
  phoneSubtitle: 'Configure la saisie vocale pour ton Even G2.',
  apiKeyLabel: 'Clé API Groq (optionnel)',
  apiKeyPlaceholder: 'gsk_...',
  show: 'Afficher',
  hide: 'Masquer',
  save: 'Enregistrer',
  clear: 'Effacer',
  statusEnabled: (prefix) => `Voix activée · clé enregistrée (${prefix}…)`,
  statusDisabled: 'Voix désactivée · aucune clé',
  statusPasteFirst: 'Colle d\'abord ta clé gsk_...',
  statusBadKey: 'Cela ne ressemble pas à une clé Groq (devrait commencer par gsk_).',
  cardBodyIntro: (groqLink) => `La saisie vocale utilise l'API Whisper de ${groqLink} avec <strong>ta propre clé API</strong>. L'audio est envoyé directement depuis l'appli Even à Groq — jamais à nous.`,
  howToGet: 'Comment obtenir une clé (gratuit, 1 min) :',
  step1: (link) => `1. Ouvre ${link} sur ton téléphone ou un ordinateur`,
  step2: '2. Connecte-toi avec Google ou GitHub',
  step3: '3. "Create API Key" → copie la chaîne <code>gsk_...</code>',
  step4: '4. Colle-la ci-dessus et tape sur <strong>Enregistrer</strong>',
  withoutKey: 'Sans clé, Voix affiche un rappel de configuration. Le Clavier fonctionne toujours.',
  bootingBridge: 'Initialisation du pont…',
  privacyLink: 'Confidentialité',
  ratesFooter: (link) => `Taux de ${link} (BCE). Information seulement — pas un conseil financier.`,
}

const STRINGS: Record<Lang, Strings> = { en, ja, 'zh-CN': zhCN, de, ko, es, fr }

function detect(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY) as Lang | null
    if (saved && saved in STRINGS) return saved
  } catch { /* ignore */ }
  const nav = (typeof navigator !== 'undefined' ? navigator.language : 'en').toLowerCase()
  if (nav.startsWith('ja')) return 'ja'
  if (nav.startsWith('zh')) return 'zh-CN'
  if (nav.startsWith('de')) return 'de'
  if (nav.startsWith('ko')) return 'ko'
  if (nav.startsWith('es')) return 'es'
  if (nav.startsWith('fr')) return 'fr'
  return 'en'
}

let currentLang: Lang = detect()

export function getLang(): Lang { return currentLang }

export function setLang(lang: Lang): void {
  currentLang = lang
  try { localStorage.setItem(LANG_KEY, lang) } catch { /* ignore */ }
}

/** Get the current language's strings table. Call as L().menuVoice */
export function L(): Strings { return STRINGS[currentLang] }
