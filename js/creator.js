// creator.js — the "make a cat for someone you love" form. Gathers the gift,
// shows a live, fully interactive preview, and produces the shareable link.

import { COLORS } from './cat.js';
import { buildShareUrl } from './share.js';
import { startPet } from './pet.js';

// Keep free-text capped so the compressed link stays comfortably DM-able.
const LIMITS = { to: 24, note: 140, catName: 18, compliment: 90, occasionMsg: 90 };
const MAX_COMPLIMENTS = 8;
const MAX_OCCASIONS = 3;

export function startCreator(root) {
  const form = root.querySelector('#create-form');
  const colorRow = root.querySelector('#color-row');
  const complimentList = root.querySelector('#compliment-list');
  const addComplimentBtn = root.querySelector('#add-compliment');
  const occasionList = root.querySelector('#occasion-list');
  const addOccasionBtn = root.querySelector('#add-occasion');
  const previewRoot = root.querySelector('#preview');
  const linkOut = root.querySelector('#link-out');
  const linkField = root.querySelector('#link-field');
  const copyBtn = root.querySelector('#copy-btn');
  const openBtn = root.querySelector('#open-btn');

  let selectedColor = 'cream';
  let destroyPreview = null;

  // --- colour swatches ---
  Object.keys(COLORS).forEach((key, i) => {
    const sw = document.createElement('button');
    sw.type = 'button';
    sw.className = 'swatch' + (i === 0 ? ' is-selected' : '');
    sw.style.background = COLORS[key].fur;
    sw.dataset.color = key;
    sw.setAttribute('aria-label', key + ' cat');
    sw.addEventListener('click', () => {
      selectedColor = key;
      colorRow.querySelectorAll('.swatch').forEach((s) => s.classList.remove('is-selected'));
      sw.classList.add('is-selected');
      refreshPreview();
    });
    colorRow.appendChild(sw);
  });

  // --- repeatable compliment rows ---
  function addComplimentRow(value = '') {
    if (complimentList.children.length >= MAX_COMPLIMENTS) return;
    const row = document.createElement('div');
    row.className = 'repeat-row';
    row.innerHTML =
      `<input type="text" class="compliment-input" maxlength="${LIMITS.compliment}" ` +
      `placeholder="e.g. you make my coffee taste better">` +
      `<button type="button" class="remove-row" aria-label="remove">✕</button>`;
    row.querySelector('.remove-row').addEventListener('click', () => {
      row.remove();
      refreshPreview();
    });
    row.querySelector('input').value = value;
    complimentList.appendChild(row);
  }

  // --- repeatable occasion rows ---
  function addOccasionRow() {
    if (occasionList.children.length >= MAX_OCCASIONS) return;
    const row = document.createElement('div');
    row.className = 'repeat-row occasion-row';
    row.innerHTML =
      `<input type="text" class="occasion-label" maxlength="20" placeholder="birthday">` +
      `<input type="date" class="occasion-date">` +
      `<input type="text" class="occasion-msg" maxlength="${LIMITS.occasionMsg}" placeholder="happy birthday, my love 🎂">` +
      `<button type="button" class="remove-row" aria-label="remove">✕</button>`;
    row.querySelector('.remove-row').addEventListener('click', () => row.remove());
    occasionList.appendChild(row);
  }

  addComplimentBtn.addEventListener('click', () => addComplimentRow());
  addOccasionBtn.addEventListener('click', () => addOccasionRow());
  addComplimentRow(); // start with one empty row

  // --- gather the form into a gift object ---
  function collectGift() {
    const get = (sel) => (root.querySelector(sel)?.value || '').trim();
    const compliments = [...complimentList.querySelectorAll('.compliment-input')]
      .map((i) => i.value.trim())
      .filter(Boolean);
    const occasions = [...occasionList.querySelectorAll('.occasion-row')]
      .map((r) => ({
        label: r.querySelector('.occasion-label').value.trim(),
        date: r.querySelector('.occasion-date').value,
        msg: r.querySelector('.occasion-msg').value.trim(),
      }))
      .filter((o) => o.date && (o.msg || o.label));
    return {
      to: get('#f-to').slice(0, LIMITS.to),
      note: get('#f-note').slice(0, LIMITS.note),
      catName: get('#f-catname').slice(0, LIMITS.catName),
      color: selectedColor,
      compliments,
      occasions,
    };
  }

  // --- live preview (a real, pettable cat) ---
  let refreshQueued = null;
  function refreshPreview() {
    // Debounce so typing doesn't rebuild the cat on every keystroke.
    clearTimeout(refreshQueued);
    refreshQueued = setTimeout(() => {
      if (destroyPreview) destroyPreview();
      destroyPreview = startPet(collectGift(), previewRoot, { preview: true });
    }, 250);
  }

  form.addEventListener('input', () => {
    refreshPreview();
    linkOut.hidden = true; // any edit invalidates a shown link
  });

  // --- produce the shareable link ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const gift = collectGift();
    const url = buildShareUrl(gift);
    linkField.value = url;
    openBtn.href = url;
    linkOut.hidden = false;
    linkOut.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(linkField.value);
      copyBtn.textContent = 'copied! 💛';
    } catch (_) {
      linkField.select();
      document.execCommand('copy');
      copyBtn.textContent = 'copied! 💛';
    }
    setTimeout(() => (copyBtn.textContent = 'copy link'), 1800);
  });

  // First paint.
  refreshPreview();
}
