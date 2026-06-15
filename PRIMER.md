# PRIMER — session continuity

Context so any new session can pick up where the last left off.

## What this is

"A Tiny Cat That Loves You" — a static GitHub Pages game. A cute SVG cat you can
personalize and send to your SO via a single link. The cat remembers visits and
reacts emotionally to your return. Built for a girlfriend, shippable to the public.

## Current state (2026-06-15)

- **v1 build complete on the `dev` branch.** All modules written and wired.
- Architecture, decisions, and scope are in
  [`docs/superpowers/specs/2026-06-15-tiny-cat-design.md`](docs/superpowers/specs/2026-06-15-tiny-cat-design.md).
- Stack: vanilla HTML/CSS/JS ES modules, one vendored dep (`lz-string`). No backend.

## Key design decisions (don't re-litigate)

- **Personalize-and-share link**, data in the URL `#fragment` (never sent to a
  server → private). Chose this over fork-and-edit / Firebase.
- **Cat** creature (not blob/star/ghost). **Full-kit** create form.
- **In-URL compression** for short links — NO third-party shortener, NO backend
  (keeps it private + bloat-free).
- Link-preview cards are **generic by necessity** (crawlers can't read the
  fragment). This is fine/good.

## How to run

```bash
python3 -m http.server 8000   # ES modules need a server, not file://
```

## Branching

`feature/* → dev → main`. Currently on `dev`. `main` only gets stable code.

## Next / open tasks

- [ ] Manual browser pass: create flow, share link round-trip, return-visit
      greetings (test by editing `lastVisit` in localStorage), reduced-motion.
- [ ] Design the favicon image + WhatsApp/iMessage OG card (`assets/og-card.png`)
      and point `og:image` at it.
- [ ] Add live GitHub Pages URL to README + the demo link.
- [ ] Optional polish: sound toggle, more cat colours, share-to-WhatsApp button.
