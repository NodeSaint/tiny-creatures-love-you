// state.js — the cat's memory. Persists happiness + last-visit time per gift in
// localStorage, applies gentle decay while you're away, and classifies how long
// you've been gone so the cat can react on your return.

const MIN_HAPPINESS = 25; // it gets lonely, never miserable
const MAX_HAPPINESS = 100;
const START_HAPPINESS = 78;

// How much happiness drains per hour away. Tuned for a gentle slide so the
// absence reads as a gradient rather than slamming to the floor: from a fresh
// ~78, roughly a day away → content, two days → lonely, three days → sad (the
// teardrop face), bottoming out at MIN_HAPPINESS just past the three-day mark.
const DECAY_PER_HOUR = 0.7;

const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;

function clamp(n) {
  return Math.max(MIN_HAPPINESS, Math.min(MAX_HAPPINESS, n));
}

// Load saved state for this gift, or seed a fresh one for a first-ever visit.
export function loadState(key, now) {
  let saved = null;
  try {
    const raw = localStorage.getItem(key);
    if (raw) saved = JSON.parse(raw);
  } catch (_) {
    /* storage unavailable or corrupt — treat as first visit */
  }

  if (!saved || typeof saved.happiness !== 'number') {
    return {
      happiness: START_HAPPINESS,
      lastVisit: now,
      firstSeen: now,
      msAway: 0,
      isFirstVisit: true,
    };
  }

  const msAway = Math.max(0, now - (saved.lastVisit || now));
  const decay = (msAway / HOUR) * DECAY_PER_HOUR;
  return {
    happiness: clamp(saved.happiness - decay),
    lastVisit: saved.lastVisit || now,
    firstSeen: saved.firstSeen || now,
    msAway,
    isFirstVisit: false,
  };
}

// Persist the current happiness and stamp this visit.
export function saveState(key, state, now) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        happiness: clamp(state.happiness),
        lastVisit: now,
        firstSeen: state.firstSeen || now,
      })
    );
  } catch (_) {
    /* private mode / storage full — cat just won't remember, that's ok */
  }
}

// Nudge happiness by a delta, clamped. Returns the new value.
export function adjustHappiness(state, delta) {
  state.happiness = clamp(state.happiness + delta);
  return state.happiness;
}

// Map happiness to a mood label that drives the cat's face/animation.
export function moodFor(happiness) {
  if (happiness >= 90) return 'ecstatic';
  if (happiness >= 70) return 'happy';
  if (happiness >= 50) return 'content';
  if (happiness >= 35) return 'lonely';
  return 'sad';
}

// Classify how long the visitor was away, for the return greeting.
export function awayPhase(state) {
  if (state.isFirstVisit) return 'first';
  const ms = state.msAway;
  if (ms < 1000 * 60 * 2) return 'moments'; // < 2 min — basically still here
  if (ms < HOUR) return 'minutes';
  if (ms < DAY) return 'hours';
  return 'days';
}

// Whole days away, for the "you were gone N days" line.
export function daysAway(state) {
  return Math.max(1, Math.round(state.msAway / DAY));
}
