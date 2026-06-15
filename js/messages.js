// messages.js — the cat's voice. Built-in pools of lines, plus helpers that
// weave in the sender's custom compliments and merge everything for a given
// moment. Kept as plain data so it's trivial to extend.

// Lines the cat says when you pet it.
const PET_LINES = [
  'mrrrp 💛',
  '*purrs*',
  'that\'s the spot~',
  'i love you, you know',
  'do that again :3',
  '*happy wiggle*',
  'best human ever',
  'nya~',
];

// Warm replies when you feed it a compliment.
const COMPLIMENT_REPLIES = [
  'you\'re sweeter, though',
  'stop it, i\'m blushing 🥺',
  '*melts into a puddle*',
  'i\'m keeping that one forever',
  'okay now i love you MORE',
  'tell me again? :3',
  'my whole heart, honestly',
];

// Things the cat says spontaneously while idle, by mood.
const IDLE_LINES = {
  ecstatic: ['today is the best day', 'i could purr forever', 'everything is perfect now'],
  happy: ['you\'re here, so i\'m happy', 'i was hoping you\'d visit', 'hi you 💛'],
  content: ['just cozy here', 'thinking about you', 'mmm, sleepy'],
  lonely: ['it\'s been a little quiet…', 'i kept your spot warm', 'i was waiting'],
  sad: ['i missed you a lot', 'don\'t go too long next time?', 'i saved a smile for you'],
};

// Extra-cute reactions triggered by keywords in a fed compliment.
const KEYWORD_BONUS = [
  { test: /\blove\b|\badore\b/i, line: 'i love you too. so much. 💖', hearts: 8 },
  { test: /\bmiss(ed)?\b/i, line: 'i missed you every second', hearts: 6 },
  { test: /\bcute\b|\badorable\b/i, line: '*does a little spin* 🌀', hearts: 5 },
  { test: /\bpretty\b|\bbeautiful\b|\bgorgeous\b/i, line: 'not as pretty as you 😽', hearts: 5 },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Greeting shown when the page opens, based on how long you were away.
export function greeting(phase, gift, state) {
  const name = gift.to ? gift.to : 'you';
  const cat = gift.catName || 'your cat';
  switch (phase) {
    case 'first':
      return gift.note
        ? gift.note
        : `hi ${name} — ${cat} has been waiting just for you 💛`;
    case 'moments':
      return `back already? ${cat} is delighted 😸`;
    case 'minutes':
      return `you're back! ${cat} perked right up`;
    case 'hours':
      return `there you are — i missed you 🥺`;
    case 'days': {
      const d = state.__daysAway || 1;
      return `you were gone ${d} day${d === 1 ? '' : 's'}… i saved a smile for you 💛`;
    }
    default:
      return `hi ${name} 💛`;
  }
}

// A random pet reaction line.
export function petLine() {
  return pick(PET_LINES);
}

// Reaction to a fed compliment. Returns { line, hearts } — checks the sender's
// world first (their custom lines never appear here; this is the cat's reply),
// applies any keyword bonus, otherwise a default warm reply.
export function complimentReaction(text) {
  for (const bonus of KEYWORD_BONUS) {
    if (bonus.test.test(text)) return { line: bonus.line, hearts: bonus.hearts };
  }
  return { line: pick(COMPLIMENT_REPLIES), hearts: 4 };
}

// A spontaneous idle line for the current mood, blended with the sender's
// custom compliments so the cat sometimes "remembers" their words unprompted.
export function idleLine(mood, customCompliments) {
  const pool = (IDLE_LINES[mood] || IDLE_LINES.content).slice();
  if (customCompliments && customCompliments.length && Math.random() < 0.4) {
    return pick(customCompliments);
  }
  return pick(pool);
}

// If today matches one of the sender's special occasions, return its message.
export function occasionMessage(occasions, now) {
  if (!occasions || !occasions.length) return null;
  const today = new Date(now);
  const md = (d) => `${d.getMonth() + 1}-${d.getDate()}`;
  const todayMd = md(today);
  for (const occ of occasions) {
    if (!occ.date) continue;
    const d = new Date(occ.date + 'T00:00:00');
    if (Number.isNaN(d.getTime())) continue;
    if (md(d) === todayMd) return occ.msg || `happy ${occ.label}! 🎉`;
  }
  return null;
}
