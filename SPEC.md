# Currency HUD — Spec (Even Hub publication build, BYO Groq key)

## Goal
Show a foreign-currency amount in your home currency instantly on the Even G2 HUD,
with **zero backend cost** for the developer, while still supporting voice input
on iPhone (where Web Speech API is unavailable in WKWebView).

## Architecture
```
G2 glasses ── BLE ── Even App / WebView ─┬─ HTTPS ─→ api.frankfurter.app  (rates)
                                          └─ HTTPS ─→ api.groq.com         (voice STT, user's key)
```

No server of our own. The user supplies a free Groq API key in the phone-side
settings panel; voice audio is sent directly to Groq with their key.

## Phone-side UI (index.html)
The host page IS the user-facing settings panel:
- Password-style input for the Groq API key
- "Show / Hide" toggle, Save / Clear buttons
- Status indicator ("Voice enabled" / "Voice disabled")
- Step-by-step instructions for getting a free Groq key
- Link to privacy policy

## Glasses-side flow
- **menu** — `[Voice]` / `[Keypad]` / `[Settings]`. dbl = system exit dialog.
- **voiceSetup** (Voice without key) — instructs user to add key on phone.
- **recording** — bridge.audioControl(true), 3-second capture window.
- **transcribing** — POST WAV directly to api.groq.com with `Bearer ${key}`.
- **result** — converted amount with rate + date.
- **notheard** — STT returned non-numeric or empty.
- **wheel** — 6-digit wheel for manual entry.
- **settings** — pair `[From]` / `[To]`. dbl = save & refresh rates.
- **pickCurrency** — 10-currency picker.

## LocalStorage keys
| Key | Value | Set by |
|---|---|---|
| `g2-currency-hub.settings.v1` | `{src, tgt}` | glasses Settings, phone (future) |
| `g2-currency-hub.groq-key.v1` | `gsk_...` string | phone Settings panel |

## Differences from g2-currency-hub (Web Speech build, earlier draft)
| | Web Speech build | BYO Groq build |
|---|---|---|
| iPhone voice | not supported | works |
| Android voice | works if API supported | works |
| User onboarding | none | one-time Groq signup |
| Developer cost | zero | zero |
| Abuse risk | zero | zero (user pays Groq if any) |

## Required submission artefacts (not yet produced)
1. Monochrome icon (foreground + background)
2. Screenshots from simulator
3. Privacy policy hosted at a public URL
