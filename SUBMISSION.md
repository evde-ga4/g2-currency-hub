# Even Hub Submission Checklist — Currency HUD

Source: [App Submission & QA Guidelines](https://hub.evenrealities.com/docs/reference/app-submission)

## Manifest (`app.json`)
- [x] `package_id` — `com.ga4.currencyhud`
- [x] `edition` — `"202601"`
- [x] `name` — `"Currency HUD"` (≤ 20 chars, no "Even")
- [x] `version` — `"0.1.0"`
- [x] `min_app_version` / `min_sdk_version` set
- [x] `entrypoint` resolves to `index.html`
- [x] `permissions` — `network` (Frankfurter + Groq), `g2-microphone`
  (both used in app code)

## Store Listing & Visual Assets
- [ ] **Monochrome icon (foreground + background)** — TODO
- [ ] **Screenshots from simulator** — TODO
- [x] Display name matches manifest

## Privacy
- [x] `PRIVACY.md` covers every permission (network + mic) and the optional
      third-party (Groq) call
- [ ] **Hosted at a public URL** (GitHub Pages / personal site) — TODO
- [x] Backend service domains: Frankfurter (rates) + Groq (voice STT, user's key)

## First-Run Experience
- [x] No black screen on cold start (`Loading rates…` then menu)
- [x] Voice without a key shows an on-glasses setup prompt — does NOT crash
- [x] Settings persisted in `localStorage` — no re-prompts

## Locked-Phone Operation
- [ ] **Manual test**: phone locked, app stays alive 2+ min — TODO
- [ ] **Manual test**: Keypad flow end-to-end, locked phone — TODO

## Exit & Lifecycle
- [x] Root double-tap calls `bridge.shutDownPageContainer(1)`
- [x] `ABNORMAL_EXIT_EVENT (6)` handled — cleanup
- [x] `SYSTEM_EXIT_EVENT (7)` handled — cleanup
- [x] `FOREGROUND_EXIT_EVENT (5)` handled — pause mic
- [x] `FOREGROUND_ENTER_EVENT (4)` handled — resume to menu

## Content & Safety
- [x] No medical / no emergency routing
- [x] Menu footer: "Info only · not financial advice"
- [x] No offensive content

## BYO API key
- [x] Phone-side settings panel in `index.html` for entering the key
- [x] Key stored in `localStorage`, validated by `gsk_` prefix
- [x] On-glasses fallback screen when key missing
- [x] Privacy policy explicitly mentions Groq as third-party

## Final Sanity Check
- [ ] `npm run pack` validates the manifest
- [ ] Sideload via QR, phone locked 5 min — still responsive?
- [ ] Root dbl on real device — does OS exit dialog appear?
- [ ] Re-launch Conversate without restarting glasses?
