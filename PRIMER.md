# PRIMER — session continuity

Context so any new session can pick up where the last left off.

## What this is

"A Tiny Cat That Loves You" — a static GitHub Pages game. A cute SVG cat you can
personalise and send to your SO via a single link. The cat remembers visits and
reacts emotionally to your return. Built for a girlfriend, shippable to the public.

## Current state (2026-06-15) — LIVE

- **Built, deployed, and verified end-to-end.** v1 is complete and shipped.
- **Live:** https://nodesaint.github.io/tiny-creatures-love-you/
- **Repo:** github.com/NodeSaint/tiny-creatures-love-you (public). `main` is
  deployed via Pages; `dev` is the working branch. Both currently in sync.
- Stack: vanilla HTML/CSS/JS ES modules, one vendored dep (`lz-string`). No backend.
- Design/decisions: `docs/superpowers/specs/2026-06-15-tiny-cat-design.md`.

## Done this session

- Full game: create form + live preview, pet/feed interactions, SVG cat (5 moods,
  blink/breathe/squash, heart bursts, 6 colours), localStorage memory + decay,
  return greetings, living dusk sky.
- Verified in headless Chromium: create → share (≈190-char link) → first-open
  greeting → pet → feed (keyword bonus) → simulated 3-days-away return. 0 errors.
- Favicon (`assets/favicon.svg` + PNGs) + 1200×630 link-preview card
  (`assets/og-card.jpg`, 47KB) + full OG/Twitter meta.
- Humaniser pass on all user-facing copy: removed em-dash overuse + rule-of-three,
  enforced British English. 0 em dashes left in shipped HTML.

## Key design decisions (don't re-litigate)

- Personalise-and-share link, data in URL `#fragment` (never sent to a server →
  private). Chose this over fork-and-edit / Firebase.
- Cat creature, full-kit create form, in-URL compression (NO backend, NO
  third-party shortener). Link-preview cards are generic by necessity (crawlers
  can't read the fragment) — this is fine/good.
- Emojis kept on purpose (brand personality, not AI decoration).

## Open items (next session)

1. **DECISION (user's call, still unanswered):** decay curve. The cat hits
   peak-sad after ~1.5 days away (floors at MIN_HAPPINESS=25 in `js/state.js`,
   DECAY_PER_HOUR=1.6). Keep as-is, or slow the slide so 3 days looks sadder
   than 1 day? Tune `DECAY_PER_HOUR` / `MIN_HAPPINESS` if softening.
2. **`LICENSE` file missing** — README claims MIT but there's no licence file. Add one.
3. **Optional polish (not required):** sound toggle, more cat colours, one-tap
   "share to WhatsApp" button, and a test on a real iOS Safari device (only
   headless Chromium has been driven so far).

## How to run / rebuild assets

```bash
python3 -m http.server 8000        # ES modules need a server, not file://
```
Card/favicon were rendered with Playwright (installed in /tmp/tcverify during the
build session; reinstall with `npm i playwright` if regenerating). The card
source is the CARD template inside the render script.

## Branching

`feature/* → dev → main`. `main` only gets stable code (it's the deployed branch).
Commit author identity: NodeSaint (noreply email, no Claude co-author).
