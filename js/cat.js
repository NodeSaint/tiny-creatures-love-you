// cat.js — the cat itself. Pure SVG built from rounded shapes, with swappable
// mood expressions, blinking, breathing (via CSS), squash-and-stretch on pet,
// and floating heart bursts. No image assets.

// Fur palettes. Each: base fur, a darker shade for ears/shading, and a lighter
// belly. Nose, cheeks and eyes stay constant so every cat reads as cute.
export const COLORS = {
  cream: { fur: '#F2D3A0', dark: '#E2B677', belly: '#FBEFD6' },
  grey: { fur: '#BCC4D0', dark: '#9AA3B2', belly: '#E6EAF0' },
  orange: { fur: '#F6A95E', dark: '#E78B3C', belly: '#FBE0C2' },
  black: { fur: '#615B70', dark: '#4A4556', belly: '#857F92' },
  pink: { fur: '#F4AFC2', dark: '#E891A8', belly: '#FBDDE6' },
  blue: { fur: '#A6C4E8', dark: '#84A8D6', belly: '#DBE8F6' },
};

// Mouth shapes per mood (SVG path data in the head's coordinate space).
const MOUTHS = {
  ecstatic: 'M104 134 Q120 150 136 134',
  happy: 'M106 133 Q120 145 134 133',
  content: 'M110 134 Q120 140 130 134',
  lonely: 'M110 138 Q120 134 130 138',
  sad: 'M108 142 Q120 134 132 142',
};

const SVG_NS = 'http://www.w3.org/2000/svg';

function el(name, attrs) {
  const node = document.createElementNS(SVG_NS, name);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  return node;
}

export class Cat {
  constructor(mountEl, { color = 'cream', name = '' } = {}) {
    this.mount = mountEl;
    this.color = COLORS[color] ? color : 'cream';
    this.name = name;
    this.mood = 'content';
    this._blinkTimer = null;
    this._build();
  }

  _build() {
    const c = COLORS[this.color];
    this.mount.classList.add('cat-stage');
    this.mount.style.setProperty('--fur', c.fur);
    this.mount.style.setProperty('--fur-dark', c.dark);
    this.mount.style.setProperty('--belly', c.belly);

    // Heart layer sits above the SVG.
    this.heartLayer = document.createElement('div');
    this.heartLayer.className = 'heart-layer';

    const svg = el('svg', {
      viewBox: '0 0 240 290',
      class: 'cat-svg mood-content',
      role: 'img',
      'aria-label': (this.name || 'A tiny cat') + ' looking at you',
    });
    this.svg = svg;

    // --- a single group we breathe/squash as a whole ---
    const body = el('g', { class: 'cat-body' });

    // Tail — sways from where it meets the body.
    this.tail = el('path', {
      class: 'cat-tail',
      d: 'M178 232 q52 -2 44 -54 q-4 -34 -30 -34 q-20 0 -16 22 q4 18 18 14 q10 -2 6 -14',
      fill: c.dark,
    });
    body.appendChild(this.tail);

    // Body + belly + paws.
    body.appendChild(el('ellipse', { cx: 120, cy: 214, rx: 72, ry: 64, fill: c.fur }));
    body.appendChild(el('ellipse', { cx: 120, cy: 230, rx: 44, ry: 46, fill: c.belly }));
    body.appendChild(el('ellipse', { cx: 92, cy: 268, rx: 20, ry: 13, fill: c.fur }));
    body.appendChild(el('ellipse', { cx: 148, cy: 268, rx: 20, ry: 13, fill: c.fur }));

    // Ears (outer + inner).
    body.appendChild(el('path', { d: 'M52 70 L74 16 L104 56 Z', fill: c.fur }));
    body.appendChild(el('path', { d: 'M188 70 L166 16 L136 56 Z', fill: c.fur }));
    body.appendChild(el('path', { d: 'M64 62 L77 32 L94 56 Z', fill: '#F7A8B8' }));
    body.appendChild(el('path', { d: 'M176 62 L163 32 L146 56 Z', fill: '#F7A8B8' }));

    // Head.
    body.appendChild(el('ellipse', { cx: 120, cy: 108, rx: 80, ry: 72, fill: c.fur }));

    // Cheeks (blush) — opacity driven by happiness.
    this.cheekL = el('ellipse', { cx: 76, cy: 128, rx: 14, ry: 9, fill: '#F6889E', opacity: 0.5 });
    this.cheekR = el('ellipse', { cx: 164, cy: 128, rx: 14, ry: 9, fill: '#F6889E', opacity: 0.5 });
    body.appendChild(this.cheekL);
    body.appendChild(this.cheekR);

    // Whiskers.
    const whisk = (d) => el('path', { d, class: 'whisker', stroke: c.dark, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' });
    body.appendChild(whisk('M40 112 q30 -6 44 2'));
    body.appendChild(whisk('M42 128 q28 2 42 4'));
    body.appendChild(whisk('M200 112 q-30 -6 -44 2'));
    body.appendChild(whisk('M198 128 q-28 2 -42 4'));

    // Eyes — open ellipses (blinkable) + happy arcs; visibility by mood class.
    this.eyesOpen = el('g', { class: 'eyes-open' });
    this.eyesOpen.appendChild(el('ellipse', { cx: 92, cy: 104, rx: 9, ry: 12, fill: '#3A3340' }));
    this.eyesOpen.appendChild(el('ellipse', { cx: 148, cy: 104, rx: 9, ry: 12, fill: '#3A3340' }));
    this.eyesOpen.appendChild(el('circle', { cx: 95, cy: 100, r: 3, fill: '#fff' }));
    this.eyesOpen.appendChild(el('circle', { cx: 151, cy: 100, r: 3, fill: '#fff' }));
    body.appendChild(this.eyesOpen);

    this.eyesArc = el('g', { class: 'eyes-arc' });
    this.eyesArc.appendChild(el('path', { d: 'M82 106 q10 -14 20 0', stroke: '#3A3340', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }));
    this.eyesArc.appendChild(el('path', { d: 'M138 106 q10 -14 20 0', stroke: '#3A3340', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }));
    body.appendChild(this.eyesArc);

    // Teardrop for the saddest mood.
    this.tear = el('circle', { class: 'cat-tear', cx: 92, cy: 120, r: 4, fill: '#8EC6F2', opacity: 0 });
    body.appendChild(this.tear);

    // Nose (little heart-ish) + mouth.
    body.appendChild(el('path', { d: 'M114 122 q6 -7 12 0 q-6 8 -6 8 q0 0 -6 -8', fill: '#E5728A' }));
    this.mouth = el('path', { class: 'cat-mouth', d: MOUTHS.content, stroke: '#7A5C57', 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' });
    body.appendChild(this.mouth);

    svg.appendChild(body);
    this.mount.appendChild(svg);
    this.mount.appendChild(this.heartLayer);
  }

  setMood(mood) {
    if (!MOUTHS[mood]) mood = 'content';
    this.mood = mood;
    this.svg.setAttribute('class', 'cat-svg mood-' + mood);
    this.mouth.setAttribute('d', MOUTHS[mood]);
    this.tear.setAttribute('opacity', mood === 'sad' ? 1 : 0);

    // Cheeks glow brighter the happier it is.
    const blush = { ecstatic: 0.85, happy: 0.65, content: 0.45, lonely: 0.3, sad: 0.2 }[mood];
    this.cheekL.setAttribute('opacity', blush);
    this.cheekR.setAttribute('opacity', blush);
  }

  // Quick squash-and-stretch when petted.
  squash() {
    this.svg.classList.remove('is-squashing');
    // Force reflow so the animation can retrigger on rapid pets.
    void this.svg.offsetWidth;
    this.svg.classList.add('is-squashing');
  }

  // A single natural blink (no-op visually when arc eyes are showing).
  blink() {
    this.eyesOpen.classList.add('is-blinking');
    setTimeout(() => this.eyesOpen.classList.remove('is-blinking'), 160);
  }

  // Schedule gentle random blinking forever.
  startBlinking() {
    const loop = () => {
      this.blink();
      this._blinkTimer = setTimeout(loop, 2600 + Math.random() * 3800);
    };
    this._blinkTimer = setTimeout(loop, 1800 + Math.random() * 2200);
  }

  stop() {
    if (this._blinkTimer) clearTimeout(this._blinkTimer);
  }

  // Float a burst of hearts up from the cat.
  burstHearts(count = 5) {
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'floaty-heart';
      heart.textContent = Math.random() < 0.25 ? '✨' : '💛';
      const x = 30 + Math.random() * 40; // % across the stage
      heart.style.left = x + '%';
      heart.style.fontSize = 14 + Math.random() * 16 + 'px';
      heart.style.animationDuration = 1.1 + Math.random() * 0.9 + 's';
      heart.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
      this.heartLayer.appendChild(heart);
      setTimeout(() => heart.remove(), 2200);
    }
  }
}
