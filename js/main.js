// main.js — entry point + router. The URL decides the mode: a gift in the
// fragment means "pet mode" for a recipient; an empty fragment means "create
// mode" for someone making a cat to send.

import { readGiftFromUrl } from './share.js';
import { startPet } from './pet.js';
import { startCreator } from './creator.js';

// Tint the dusk sky to roughly match the real time of day.
function applyTimeOfDay() {
  const h = new Date().getHours();
  let phase = 'dusk';
  if (h >= 5 && h < 9) phase = 'dawn';
  else if (h >= 9 && h < 17) phase = 'day';
  else if (h >= 17 && h < 21) phase = 'dusk';
  else phase = 'night';
  document.body.dataset.sky = phase;
}

function show(viewId) {
  document.querySelectorAll('.view').forEach((v) => {
    v.hidden = v.id !== viewId;
  });
}

function boot() {
  applyTimeOfDay();
  const gift = readGiftFromUrl();

  if (gift) {
    show('pet-view');
    startPet(gift, document.getElementById('pet-view'));
  } else {
    show('create-view');
    startCreator(document.getElementById('create-view'));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
