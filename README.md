# g2-currency-hub

Currency HUD — Even G2 plugin for instant FX conversion, **prepared for Even Hub public submission**.

- **No backend.** Rates come from [Frankfurter](https://www.frankfurter.app/) directly.
- **Voice (optional) uses Bring-Your-Own Groq Whisper key.** Users paste a free
  Groq API key in the phone-side settings; audio goes straight to Groq.
- Root double-tap = system exit dialog (`shutDownPageContainer(1)`).
- Full lifecycle handlers (`ABNORMAL_EXIT_EVENT`, `SYSTEM_EXIT_EVENT`,
  `FOREGROUND_EXIT_EVENT`, `FOREGROUND_ENTER_EVENT`).
- `Info only · not financial advice` footer.

## Dev
```
npm install
```

```
npm run dev
```

```
npm run sim
```

For real-device testing, see `SUBMISSION.md` and use:
```
npx evenhub qr
```

## Pack & submit
```
npm run build
```

```
npm run pack
```

Upload `currency-hud.ehpk` via [evenhub.evenrealities.com](https://evenhub.evenrealities.com).
