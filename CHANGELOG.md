# Changelog

All notable changes to this project are documented here.

## Deployed

### 2026-06-15 — first deploy (branch: `main` → GitHub Pages)
- Pushed `main` + `dev` to `github.com/NodeSaint/tiny-creatures-love-you` (public).
- Enabled GitHub Pages (main / root). Live at
  https://nodesaint.github.io/tiny-creatures-love-you/
- Verified end-to-end in a headless browser: create → share link (188 chars) →
  first-open greeting → pet (hearts + line) → feed "i love you" (keyword bonus) →
  simulated 3-days-away return ("I saved a smile for you", sad face + teardrop).
  Zero console errors.

### 2026-06-15 — licence + gentler decay
- Added `LICENSE` (MIT, © NodeSaint) to match the README.
- Softened the happiness decay (`DECAY_PER_HOUR` 1.6 → 0.7 in `js/state.js`).
  Previously the cat hit the floor (sad) in ~1.4 days; now the absence reads as a
  gradient — ~1 day content, ~2 days lonely, ~3 days sad — bottoming out just
  past the three-day mark.

### 2026-06-15 — bug fixes (mobile scroll + leaks)
- **Mobile scroll clip (the reported bug):** `body` centred content with
  `display:flex; align-items/justify-content:center`, which pushed the top of
  any over-tall content above the scroll origin — unreachable. On mobile the
  create screen's preview cat/heading sat at ~−393px with no way to scroll up.
  Fixed by switching `body` to `flex-direction:column` and centring the view
  with `margin:auto` (collapses to 0 on overflow, so the page scrolls from the
  top). Added a `100vh` fallback for `100dvh`. Verified the pet view now scrolls
  correctly on tiny viewports too.
- **Listener/timer leaks in the live preview (`pet.js`):** `destroy()` only
  removed the click listener; the `keydown` + feed `submit` handlers and two
  opening `setTimeout`s leaked on every debounced preview rebuild. Now all are
  tracked and removed/cleared in `destroy()` (3 adds / 3 removes, symmetric).
- **Clipboard fallback (`creator.js`):** no longer reports "copied!" when the
  `execCommand` fallback fails — shows a manual-copy hint instead.
- **Accessibility:** removed `maximum-scale=1` from the viewport so users can
  pinch-zoom.

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

### 2026-06-15 — favicon + link-preview card
- Added designed cat-face favicon (`assets/favicon.svg` + `favicon-32.png` +
  `apple-touch-icon.png`), replacing the emoji data-URI.
- Added dusk-themed 1200×630 link-preview card (`assets/og-card.jpg`, 47KB —
  under WhatsApp's preview size limit) rendered with the real cat.
- Wired full Open Graph + Twitter Card meta (absolute URLs) + `theme-color`.
