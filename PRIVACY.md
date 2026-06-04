# Currency HUD — Privacy Policy

_Last updated: 2026-06-04_

Currency HUD is a free Even G2 plugin that converts foreign-currency amounts to
your home currency. We collect no personal data and operate no servers of our own.

## What the app does

- **Foreign-exchange rates** are fetched directly from the public
  [Frankfurter](https://www.frankfurter.app/) API (European Central Bank reference rates).
  The app makes one HTTPS GET per day to `https://api.frankfurter.app/latest`.
  No identifying information is sent.

- **Voice input (optional)** is processed by **Groq's Whisper API** using
  **an API key you provide yourself**. Audio is sent directly from the Even
  Realities app to `https://api.groq.com` using your key. We do not relay or
  store audio or keys. Voice input is disabled by default; you opt in by adding
  a Groq API key in the phone-side settings panel.

- **Settings** (selected currency pair, Groq API key) are stored locally on your
  device via the standard `localStorage` API. They never leave the device unless
  you explicitly use Voice (which sends audio + key to Groq).

## What the app does NOT do

- No analytics, no telemetry, no crash reporting, no advertising IDs.
- No account with us, no login, no identity tracking.
- No background activity.
- No microphone access until you tap Voice with a Groq key configured.
- Exchange rates are shown for **informational reference only**; the app does
  not offer financial advice or execute trades.

## Third-party services

- [Frankfurter](https://www.frankfurter.app/) — daily ECB FX rates (free, no key).
- [Groq](https://groq.com/) — speech-to-text via Whisper. Used only when you opt
  in by entering your own API key. Audio is sent under your key, governed by
  [Groq's privacy policy](https://groq.com/privacy-policy/).

## Permissions used

- `network` — `https://api.frankfurter.app` (rates) and `https://api.groq.com`
  (voice STT, only when you have configured a key).
- `g2-microphone` — used only while the Voice screen is active, after you have
  configured an API key. The recording stops as soon as transcription is done.

## Contact

If you have questions about this policy, contact: info@evde.jp
