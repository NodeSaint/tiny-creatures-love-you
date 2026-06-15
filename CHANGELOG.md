# Changelog

All notable changes to this project are documented here.

## [Unreleased] — dev branch

### 2026-06-15 — initial build (branch: `dev`)
- Scaffolded the static project (no backend, no build step).
- `share.js`: encode/decode a "gift" to/from the URL fragment via vendored
  `lz-string`; per-link localStorage key.
- `state.js`: happiness + last-visit memory, gentle decay while away,
  mood classification, away-phase detection.
- `messages.js`: built-in pools (pet lines, compliment replies, idle lines by
  mood, keyword bonuses), occasion messages, custom-compliment blending.
- `cat.js`: SVG cat built from rounded shapes; 5 moods, blinking, breathing,
  squash-and-stretch, floating heart bursts, 6 colour palettes.
- `pet.js`: pet-mode orchestration — greeting, petting, feeding, idle chatter.
- `creator.js`: "make a cat" form with live interactive preview + shareable link.
- `main.js`: URL router (create vs pet) + time-of-day sky.
- `index.html` + `css/style.css`: full UI, "living dusk sky" aesthetic,
  emoji favicon, generic OG preview meta.
- Docs: README, PRIMER, design spec.

### Parked for later
- Favicon image file + designed WhatsApp/iMessage OG preview card (`assets/og-card.png`).
