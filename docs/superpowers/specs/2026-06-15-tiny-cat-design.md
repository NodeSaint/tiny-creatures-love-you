# 🐱 Tiny Cat That Loves You — Design Spec

**Date:** 2026-06-15
**Status:** Approved, building v1

## Concept

A single static web page (vanilla HTML/CSS/JS) hosted on GitHub Pages. A cute
CSS/SVG cat that remembers you, reacts to your return, and can be petted and fed
compliments. Anyone can craft a personalized version for their significant other
and share it as a single link — no backend, no accounts, no database.

Emotional core: *a cozy window where a tiny cat waits for you.* When the
recipient opens it, the cat is instantly happy. Come back after time away and it
reacts — "I missed you", "you were gone 3 days… I saved a smile for you."

## Architecture

- **Pure static site.** No backend, no build step. ES modules served directly.
- **Two modes on one page, decided by the URL:**
  - **Create mode** (no `#` fragment): sender fills a form, gets a shareable link.
  - **Pet mode** (`#<compressed-data>` present): recipient sees their personalized cat.
- **Data flow:** form → JS object → JSON → `LZString.compressToEncodedURIComponent`
  → URL fragment. On load: read fragment → decompress → render pet mode.
- **Privacy by design:** all personalized data lives in the URL *fragment* (after
  `#`), which browsers never transmit to any server. The love notes physically
  cannot leak. Tradeoff: link-preview crawlers can't read the fragment, so the
  WhatsApp/iMessage preview card is generic for everyone (acceptable — and good
  for privacy).
- **One dependency:** `lz-string` (~5KB, vendored in `/vendor`, no runtime CDN).

## Create form (full kit)

- Recipient's name (used in greetings)
- Opening note (shown once on first open)
- Cat's name
- Cat color — ~6 presets (cream, grey, orange, black, pink, blue)
- Custom compliments — sender's own sweet lines / inside jokes (merged with built-in pool)
- Special-occasion messages — optional birthday/anniversary lines + dates
- Output: shareable link with Copy button and live Preview

All free-text fields length-capped to keep the compressed link DM-friendly.

## Cat — moods & memory

Happiness state `0–100` + mood label drives face/animation:
`ecstatic > happy > content > lonely > sad`.

- **Memory** (localStorage, keyed per-link): stores `happiness` + `lastVisit`.
- **Return reactions** by time away: minutes → "you're back!"; hours → "I missed
  you"; days → "you were gone N days… I saved a smile for you".
- **Decay:** happiness drifts down gently while away (never cruel), so cheering
  the cat up means something.
- **First-ever open:** plays opening note, instant happy reaction.

## Interactions

- **Pet** (click/tap): squash-and-stretch, hearts float up, happiness +, purr, sweet line.
- **Feed a compliment** (text input): cat reacts adorably, happiness +, warm reply.
  Keyword bonuses (e.g. "love" → extra hearts) as a nice-to-have.
- Message sources: sender's custom pool + built-in defaults + occasion lines.

## Aesthetic direction

- Tone: soft / dreamy / toy-like, executed with precision.
- Type: `Fredoka` (display) + `Nunito` (body).
- Color: living dusk sky — cream + peach → dusty-lavender gradient that shifts
  with real time of day; one coral/rose accent.
- Motion: cat breathes, blinks, squashes; hearts burst on pet; staggered page-load reveal.

## File structure

```
index.html
css/style.css
js/main.js        — mode routing (create vs pet)
js/creator.js     — form → link
js/cat.js         — SVG cat rendering, moods, animations
js/state.js       — localStorage: happiness, lastVisit, decay
js/messages.js    — default compliment/reaction pools
js/share.js       — compress/decompress (lz-string)
vendor/lz-string.min.js
assets/           — favicon + OG card (added later)
```

## Out of scope (v1, YAGNI)

Sound/music, multiple creatures, accounts, analytics, third-party link
shortener, mini-games beyond pet + feed.

## Parked for later

Favicon + WhatsApp/iMessage OG preview card (generic, static).
