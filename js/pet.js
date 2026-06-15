// pet.js — brings a gift to life. Renders the cat, plays the return greeting,
// wires up petting + feeding, drifts through idle lines, and remembers happiness
// across visits. Reused by the creator's live preview (preview = no saving).

import { Cat } from './cat.js';
import { giftKey } from './share.js';
import {
  loadState,
  saveState,
  adjustHappiness,
  moodFor,
  awayPhase,
  daysAway,
} from './state.js';
import {
  greeting,
  petLine,
  complimentReaction,
  idleLine,
  occasionMessage,
} from './messages.js';

const PET_GAIN = 3;
const FEED_GAIN = 6;

export function startPet(gift, root, { preview = false } = {}) {
  const now = Date.now();
  const key = giftKey(gift);
  const state = preview
    ? { happiness: 82, lastVisit: now, firstSeen: now, msAway: 0, isFirstVisit: true }
    : loadState(key, now);
  state.__daysAway = daysAway(state);

  const mount = root.querySelector('.cat-mount');
  const speech = root.querySelector('.speech');
  const meterFill = root.querySelector('.mood-fill');
  const feedForm = root.querySelector('.feed');
  const feedInput = root.querySelector('.feed-input');

  mount.innerHTML = '';
  const cat = new Cat(mount, { color: gift.color, name: gift.catName });

  let lastInteraction = now;

  function refresh() {
    const mood = moodFor(state.happiness);
    cat.setMood(mood);
    if (meterFill) meterFill.style.width = state.happiness + '%';
    return mood;
  }

  // Fade a new line into the speech bubble.
  function say(text) {
    if (!speech) return;
    speech.classList.remove('pop');
    void speech.offsetWidth;
    speech.textContent = text;
    speech.classList.add('pop');
  }

  function persist() {
    if (!preview) saveState(key, state, now);
  }

  // --- opening sequence ---
  const mood = refresh();
  cat.startBlinking();

  const phase = awayPhase(state);
  say(greeting(phase, gift, state));

  // If today is a special occasion, surface it a beat after the greeting.
  const occ = occasionMessage(gift.occasions, now);
  if (occ) setTimeout(() => say(occ), 2600);

  // A happy little welcome bounce.
  setTimeout(() => {
    cat.squash();
    cat.burstHearts(mood === 'sad' ? 3 : 5);
  }, 400);

  persist();

  // --- petting (click/tap the cat) ---
  function pet() {
    lastInteraction = Date.now();
    cat.squash();
    cat.burstHearts(3 + Math.floor(Math.random() * 3));
    adjustHappiness(state, PET_GAIN);
    refresh();
    say(petLine());
    persist();
  }
  mount.addEventListener('click', pet);
  mount.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pet();
    }
  });
  mount.tabIndex = 0;
  mount.setAttribute('role', 'button');
  mount.setAttribute('aria-label', 'Pet ' + (gift.catName || 'the cat'));

  // --- feeding compliments ---
  if (feedForm && feedInput) {
    feedForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = feedInput.value.trim();
      if (!text) return;
      lastInteraction = Date.now();
      const reaction = complimentReaction(text);
      cat.burstHearts(reaction.hearts);
      adjustHappiness(state, FEED_GAIN);
      refresh();
      say(reaction.line);
      persist();
      feedInput.value = '';
    });
  }

  // --- idle chatter ---
  const idleTimer = setInterval(() => {
    if (Date.now() - lastInteraction < 8000) return; // don't talk over interaction
    if (Math.random() < 0.6) say(idleLine(cat.mood, gift.compliments));
  }, 9000);

  // Tidy up if the caller tears the preview down.
  return function destroy() {
    clearInterval(idleTimer);
    cat.stop();
    mount.removeEventListener('click', pet);
  };
}
