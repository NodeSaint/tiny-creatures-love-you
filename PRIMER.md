# PRIMER — session continuity

Context so any new session can pick up where the last left off.

## What this is

"A Tiny Cat That Loves You" — a static GitHub Pages game. A cute SVG cat you can
personalise and send to your SO via a single link. The cat remembers visits and
reacts emotionally to your return. Built for a girlfriend, shippable to the public.

## Current state (2026-06-15) — LIVE & stable

- **Built, deployed, debugged, verified.** No known bugs remain.
- **Live:** https://nodesaint.github.io/tiny-creatures-love-you/
- **Repo:** github.com/NodeSaint/tiny-creatures-love-you (public). `main` is the
  deployed branch (Pages); `dev` is the working branch. Both in sync at the
  latest commit.
- Stack: vanilla HTML/CSS/JS ES modules, one vendored dep (`lz-string`). No backend.
- Design/decisions: `docs/superpowers/specs/2026-06-15-tiny-cat-design.md`.
- Full per-change history is in `CHANGELOG.md` (authoritative record).

## Done (cumulative)

- Full game: create form + live preview, pet/feed interactions, SVG cat (5 moods,
  blink/breathe/squash, heart bursts, 6 colours), localStorage memory + decay,
  return greetings, living dusk sky.
- Favicon + 1200×630 link-preview card + full OG/Twitter meta.
- Humaniser pass on all copy (no em-dash overuse / rule-of-three; British English).
- `LICENSE` (MIT, © NodeSaint).
- Decay curve softened: `DECAY_PER_HOUR = 0.7` in `js/state.js` (≈1 day content,
  2 days lonely, 3 days sad; floor just past 3 days). **This was the resolved
  product decision — don't reopen.**
- Bug fixes (verified at multiple viewports, 0 console errors):
  - Mobile scroll clipping — `body` now `flex-direction:column` + `.view{margin:auto}`
    (plain flex centring clipped tall content above the scroll origin).
  - Preview listener/timer leaks in `pet.js` — `destroy()` now removes all 3
    listeners + clears timers (was only removing click).
  - Clipboard fallback no longer reports false success (`creator.js`).
  - Removed `maximum-scale=1` (pinch-zoom a11y).
- `.nojekyll` added — Pages skips Jekyll (pure-static site). A Jekyll build once
  errored transiently and silently blocked a deploy; this prevents recurrence.

## Open items (next session)

1. **iOS Safari / WebKit pass — NOT done (the one real gap).** Everything was
   verified in headless Chromium only. Safari is where most texted links open.
   Quickest close: run the create→pet→feed→return flow through Playwright's
   `webkit` engine (Safari's renderer). Check `100dvh`, `backdrop-filter`,
   flexbox `margin:auto`, the date picker.
2. **Untested corners:** the clipboard *fallback* branch (happy path works); the
   special-occasion message firing live on its real date.
3. **Optional polish (not required):** sound toggle, more cat colours, one-tap
   "share to WhatsApp" button.

## How to run / verify

```bash
python3 -m http.server 8000        # ES modules need a server, not file://
```
Playwright is installed in /tmp/tcverify (reinstall `npm i playwright` if gone).
Verification scripts used this session: drive.mjs (flow), repro.mjs (layout),
verify.mjs (fix regression), render.mjs/recard.mjs (favicon + card). Card source
is the CARD template literal inside render.mjs.

## Deploy notes

- Pages builds: watch with `gh api repos/NodeSaint/tiny-creatures-love-you/pages/builds/latest`.
- After a push, a build can take ~1 min; verify live with a cache-busting query
  (`?x=$(date +%s%N)`) and an UNAMBIGUOUS marker (e.g. grep `DECAY_PER_HOUR = 0.7`,
  not a string that also matched the old version).

## Branching & identity

`feature/* → dev → main`. `main` only gets stable code (it's deployed).
Commit author: NodeSaint (noreply email, no Claude co-author).
