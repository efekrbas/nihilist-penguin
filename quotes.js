// Nihilist Penguin - Quotes
// Existential quotes inspired by Werner Herzog's documentary.

// ===== ENGLISH QUOTES =====
const QUOTES_EN = [
    // Existential thoughts
    "Nothing has meaning... but we keep walking anyway.",
    "Where am I going? Does it matter?",
    "The colony is behind me. Now it's just me and infinity.",
    "The mountains are calling me... or so I think.",
    "Every step is one step closer to nothingness.",

    // Melancholic
    "I don't even feel the cold anymore.",
    "Loneliness... perhaps it's the only reality.",
    "I don't look back. Why would I?",
    "It's snowing. It's always snowing.",
    "This journey has no end. Maybe it never did.",

    // Absurd
    "Why do I walk? Why do they stop?",
    "Maybe I'm crazy. Maybe they are.",
    "What's beyond the mountains? Probably more mountains.",
    "I'm tired of eating fish.",
    "Everyone in the colony was the same. I... am different.",

    // Glimmers of hope (ironic)
    "Maybe there's an answer beyond the mountains.",
    "Or nothing. Nothing is beautiful too.",
    "At least the view is nice... I think.",
    "Walking is nice. Stopping... is strange.",
    "Darkness is approaching. But isn't it always?",

    // Werner Herzog references
    "Nature here is cruel and absurd.",
    "The universe doesn't care. It never did.",
    "Chaos. Chaos everywhere. Inside me too.",
    "Searching for meaning... perhaps the greatest mistake.",
    "But still, one more step..."
];

// ===== ENGLISH GAME OVER QUOTES =====
const GAME_OVER_QUOTES_EN = [
    "And so the journey ended... this time.",
    "We fell. But can you walk without falling?",
    "Every end is a new beginning. Or not.",
    "The ice won. It always does.",
    "Maybe next time... maybe.",
    "Trying again... the essence of existence.",
    "Giving up is easy. But penguins don't give up... I think.",
    "The mountains are still there. Waiting."
];

// Get a random quote
function getRandomQuote() {
    return QUOTES_EN[Math.floor(Math.random() * QUOTES_EN.length)];
}

// Get a random game over quote
function getGameOverQuote() {
    return GAME_OVER_QUOTES_EN[Math.floor(Math.random() * GAME_OVER_QUOTES_EN.length)];
}
