// Nihilist Penguin - Quotes / Düşünceler
// Werner Herzog'un belgeselinden ilham alan varoluşsal alıntılar

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

// ===== TURKISH QUOTES =====
const QUOTES_TR = [
    // Varoluşsal düşünceler
    "Hiçbir şeyin anlamı yok... ama yine de yürüyoruz.",
    "Nereye gidiyorum? Önemli mi?",
    "Koloni geride kaldı. Şimdi sadece ben ve sonsuzluk.",
    "Dağlar beni çağırıyor... ya da öyle sanıyorum.",
    "Her adım, hiçliğe bir adım daha.",

    // Melankolik
    "Soğuk bile hissetmiyorum artık.",
    "Yalnızlık... belki de tek gerçeklik bu.",
    "Arkama bakmıyorum. Neden bakayım ki?",
    "Kar yağıyor. Her zaman kar yağıyor.",
    "Bu yolculuğun sonu yok. Belki de hiç yoktu.",

    // Absürt
    "Neden yürüyorum? Neden duruyorlar?",
    "Belki de deliyim. Belki onlar deli.",
    "Dağların ardında ne var? Muhtemelen daha çok dağ.",
    "Balık yemekten sıkıldım.",
    "Kolonide herkes aynıydı. Ben... farklıyım.",

    // Umut kırıntıları (ironic)
    "Belki dağların ardında bir cevap vardır.",
    "Ya da hiçbir şey. Hiçbir şey de güzel.",
    "En azından manzara güzel... sanırım.",
    "Yürümek güzel. Durmak... tuhaf.",
    "Karanlık yaklaşıyor. Ama her zaman öyle değil mi?",

    // Werner Herzog referansları
    "Doğa burada acımasız ve saçma.",
    "Evren umursamıyor. Hiç umursamadı.",
    "Kaos. Her yerde kaos. İçimde de.",
    "Anlam aramak... belki de en büyük hata.",
    "Ama yine de, bir adım daha..."
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

// ===== TURKISH GAME OVER QUOTES =====
const GAME_OVER_QUOTES_TR = [
    "Ve böylece yolculuk sona erdi... bu sefer.",
    "Düştük. Ama düşmeden yürümek mümkün mü?",
    "Her son, yeni bir başlangıç. Ya da değil.",
    "Buz kazandı. Her zaman kazanır.",
    "Belki bir dahaki sefere... belki.",
    "Yeniden denemek... varoluşun özeti.",
    "Pes etmek kolay. Ama penguen pes etmez... galiba.",
    "Dağlar hâlâ orada. Bekliyor."
];

// Get current language (will be set by game.js)
let currentQuoteLanguage = 'en';

// Set quote language
function setQuoteLanguage(lang) {
    currentQuoteLanguage = lang;
}

// Get random quote based on current language
function getRandomQuote() {
    const quotes = currentQuoteLanguage === 'tr' ? QUOTES_TR : QUOTES_EN;
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// Get random game over quote based on current language
function getGameOverQuote() {
    const quotes = currentQuoteLanguage === 'tr' ? GAME_OVER_QUOTES_TR : GAME_OVER_QUOTES_EN;
    return quotes[Math.floor(Math.random() * quotes.length)];
}
