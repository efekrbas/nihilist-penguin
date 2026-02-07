// ===== Nihilist Penguin - Main Game Engine =====

// DOM Elements
const nameScreen = document.getElementById('name-screen');
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const leaderboardScreen = document.getElementById('leaderboard-screen');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// UI Elements
const playerNameInput = document.getElementById('player-name');
const playerDisplay = document.getElementById('player-display');
const playerNameGame = document.getElementById('player-name-game');
const distanceDisplay = document.getElementById('distance');
const highScoreDisplay = document.getElementById('high-score');
const quoteDisplay = document.getElementById('quote-display');
const finalDistance = document.getElementById('final-distance');
const finalHighScore = document.getElementById('final-high-score');
const finalQuote = document.getElementById('final-quote');
const leaderboardList = document.getElementById('leaderboard-list');

// Buttons
const enterBtn = document.getElementById('enter-btn');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const menuBtn = document.getElementById('menu-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const leaderboardBackBtn = document.getElementById('leaderboard-back-btn');

// Settings Elements
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const settingsClose = document.getElementById('settings-close');
const langEnBtn = document.getElementById('lang-en');
const langTrBtn = document.getElementById('lang-tr');
const musicSelect = document.getElementById('music-select');

// ===== Language System =====
let currentLanguage = localStorage.getItem('nihilistPenguinLang') || 'en';

const TRANSLATIONS = {
    en: {
        tagline: '"Nothing has meaning... but we keep walking anyway."',
        enterName: 'Enter your name, traveler...',
        penguinName: 'Penguin Name',
        enter: 'ENTER',
        welcome: 'Welcome,',
        start: 'START',
        leaderboard: '🏆 LEADERBOARD',
        mobileInstr: '📱 Mobile: Tap the screen',
        desktopInstr: '💻 Desktop: Space or ↑',
        settings: '⚙️ Settings',
        language: 'Language',
        music: 'Music',
        noMusic: '-- No Music --',
        play: '▶ Play',
        stop: '⏹ Stop',
        leaderboardTitle: '🏆 LEADERBOARD',
        back: '← BACK',
        distance: 'DISTANCE',
        best: 'BEST',
        journeyEnd: 'JOURNEY ENDED',
        thisTime: 'This time',
        farthest: 'Farthest',
        tryAgain: 'TRY AGAIN',
        mainMenu: 'MAIN MENU',
        leaderboardEmpty: 'No scores yet... Be the first!'
    },
    tr: {
        tagline: '"Hiçbir şeyin anlamı yok... ama yine de yürüyoruz."',
        enterName: 'Adını gir, yolcu...',
        penguinName: 'Penguen Adı',
        enter: 'GİRİŞ',
        welcome: 'Hoş geldin,',
        start: 'BAŞLA',
        leaderboard: '🏆 SKOR TABLOSU',
        mobileInstr: '📱 Mobil: Ekrana dokun',
        desktopInstr: '💻 Masaüstü: Space veya ↑',
        settings: '⚙️ Ayarlar',
        language: 'Dil',
        music: 'Müzik',
        noMusic: '-- Müzik Yok --',
        play: '▶ Oynat',
        stop: '⏹ Durdur',
        leaderboardTitle: '🏆 SKOR TABLOSU',
        back: '← GERİ',
        distance: 'MESAFE',
        best: 'EN İYİ',
        journeyEnd: 'YOLCULUK BİTTİ',
        thisTime: 'Bu sefer',
        farthest: 'En uzak',
        tryAgain: 'TEKRAR DENE',
        mainMenu: 'ANA MENÜ',
        leaderboardEmpty: 'Henüz skor yok... İlk sen ol!'
    }
};

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('nihilistPenguinLang', lang);

    // Update quotes language
    if (typeof setQuoteLanguage === 'function') {
        setQuoteLanguage(lang);
    }

    // Update language buttons
    langEnBtn.classList.toggle('active', lang === 'en');
    langTrBtn.classList.toggle('active', lang === 'tr');

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (TRANSLATIONS[lang][key]) {
            el.textContent = TRANSLATIONS[lang][key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (TRANSLATIONS[lang][key]) {
            el.placeholder = TRANSLATIONS[lang][key];
        }
    });
}

// ===== Music System =====
let bgMusic = new Audio();
bgMusic.loop = true;
bgMusic.volume = 0.5;

// Load saved music selection
const savedMusic = localStorage.getItem('nihilistPenguinMusic') || '';
musicSelect.value = savedMusic;

// Save music selection when changed
musicSelect.addEventListener('change', () => {
    localStorage.setItem('nihilistPenguinMusic', musicSelect.value);
});

function playMusic() {
    const selectedMusic = musicSelect.value;
    if (selectedMusic) {
        bgMusic.src = selectedMusic;
        bgMusic.play().catch(err => console.log('Music play error:', err));
    }
}

function stopMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

// ===== Settings Modal =====
function openSettings() {
    settingsModal.classList.add('active');
}

function closeSettings() {
    settingsModal.classList.remove('active');
}

// Settings Event Listeners
settingsBtn.addEventListener('click', openSettings);
settingsClose.addEventListener('click', closeSettings);
settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        closeSettings();
    }
});

langEnBtn.addEventListener('click', () => setLanguage('en'));
langTrBtn.addEventListener('click', () => setLanguage('tr'));

// ===== Player Info =====
let playerName = localStorage.getItem('nihilistPenguinPlayerName') || '';


// ===== Skor Tablosu (Firebase) =====
let leaderboardData = [];

// Firebase'den leaderboard'u dinle (realtime)
function initLeaderboardListener() {
    leaderboardRef.orderByChild('score').limitToLast(10).on('value', (snapshot) => {
        leaderboardData = [];
        snapshot.forEach((child) => {
            leaderboardData.push({
                key: child.key,
                ...child.val()
            });
        });
        // Skora göre sırala (yüksekten düşüğe)
        leaderboardData.sort((a, b) => b.score - a.score);

        // Eğer leaderboard ekranı açıksa güncelle
        if (leaderboardScreen.classList.contains('active')) {
            renderLeaderboard();
        }
    });
}

function getLeaderboard() {
    return leaderboardData;
}

async function saveToLeaderboard(name, score) {
    try {
        // Aynı oyuncuyu bul
        const snapshot = await leaderboardRef.orderByChild('name').equalTo(name).once('value');

        if (snapshot.exists()) {
            // Mevcut oyuncunun skorunu güncelle (sadece daha yüksekse)
            snapshot.forEach((child) => {
                const existingScore = child.val().score;
                if (score > existingScore) {
                    leaderboardRef.child(child.key).update({ score: score });
                }
            });
        } else {
            // Yeni oyuncu ekle
            leaderboardRef.push({
                name: name,
                score: score,
                timestamp: Date.now()
            });
        }
    } catch (error) {
        console.error('Firebase kaydetme hatası:', error);
        // Fallback: localStorage'a kaydet
        saveToLocalStorage(name, score);
    }
}

// Fallback fonksiyonu (Firebase çalışmazsa)
function saveToLocalStorage(name, score) {
    let leaderboard = JSON.parse(localStorage.getItem('nihilistPenguinLeaderboard') || '[]');
    const existingPlayer = leaderboard.find(entry => entry.name === name);

    if (existingPlayer) {
        if (score > existingPlayer.score) {
            existingPlayer.score = score;
        }
    } else {
        leaderboard.push({ name, score });
    }

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem('nihilistPenguinLeaderboard', JSON.stringify(leaderboard));
}

function renderLeaderboard() {
    const leaderboard = getLeaderboard();

    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = `<p class="leaderboard-empty">${TRANSLATIONS[currentLanguage].leaderboardEmpty}</p>`;
        return;
    }

    let html = '';
    leaderboard.forEach((entry, index) => {
        let rankClass = 'normal';
        let rankText = `${index + 1}.`;

        if (index === 0) {
            rankClass = 'gold';
            rankText = '🥇';
        } else if (index === 1) {
            rankClass = 'silver';
            rankText = '🥈';
        } else if (index === 2) {
            rankClass = 'bronze';
            rankText = '🥉';
        }

        html += `
            <div class="leaderboard-item ${rankClass}">
                <span class="leaderboard-rank ${rankClass}">${rankText}</span>
                <span class="leaderboard-name">${escapeHtml(entry.name)}</span>
                <span class="leaderboard-score">${entry.score}m</span>
            </div>
        `;
    });

    leaderboardList.innerHTML = html;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Leaderboard listener'ı başlat
initLeaderboardListener();

// ===== Oyun Sabitleri =====
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const INITIAL_SPEED = 5;
const SPEED_INCREMENT = 0.001;
const MAX_SPEED = 12;
const GROUND_HEIGHT = 80;
const PENGUIN_WIDTH = 50;
const PENGUIN_HEIGHT = 60;
const OBSTACLE_WIDTH = 40;
const MIN_OBSTACLE_HEIGHT = 30;
const MAX_OBSTACLE_HEIGHT = 70;
const OBSTACLE_GAP = 300;
const QUOTE_INTERVAL = 500; // Her 500 metrede bir alıntı

// ===== Oyun Durumu =====
let gameState = {
    isRunning: false,
    isPaused: false,
    distance: 0,
    highScore: parseInt(localStorage.getItem('nihilistPenguinHighScore')) || 0,
    speed: INITIAL_SPEED,
    lastQuoteDistance: 0
};

// ===== Penguen Objesi =====
let penguin = {
    x: 80,
    y: 0,
    width: PENGUIN_WIDTH,
    height: PENGUIN_HEIGHT,
    velocityY: 0,
    isJumping: false,
    frame: 0,
    frameCount: 0
};

// ===== Engeller =====
let obstacles = [];
let particles = [];

// ===== Arka Plan Elementleri =====
let mountains = [];
let snowflakes = [];
let clouds = [];

// ===== Canvas Boyutlandırma =====
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    penguin.y = canvas.height - GROUND_HEIGHT - penguin.height;
    initBackground();
}

// ===== Arka Plan Başlatma =====
function initBackground() {
    // Dağlar
    mountains = [];
    for (let i = 0; i < 5; i++) {
        mountains.push({
            x: i * (canvas.width / 3),
            width: 200 + Math.random() * 150,
            height: 100 + Math.random() * 100,
            layer: Math.floor(Math.random() * 3)
        });
    }

    // Kar taneleri
    snowflakes = [];
    for (let i = 0; i < 50; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 1 + Math.random() * 2,
            speed: 1 + Math.random() * 2,
            opacity: 0.3 + Math.random() * 0.5
        });
    }

    // Bulutlar
    clouds = [];
    for (let i = 0; i < 3; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: 50 + Math.random() * 100,
            width: 80 + Math.random() * 60,
            speed: 0.2 + Math.random() * 0.3
        });
    }
}

// ===== İsim Girişi =====
function enterGame() {
    const name = playerNameInput.value.trim();

    if (name.length < 1) {
        playerNameInput.style.borderColor = '#ec4899';
        playerNameInput.placeholder = 'Bir isim gir!';
        return;
    }

    playerName = name;
    localStorage.setItem('nihilistPenguinPlayerName', playerName);

    // Menüye geç
    showMenu();
}

function showMenu() {
    // Tüm ekranları gizle
    nameScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    gameoverScreen.classList.remove('active');
    leaderboardScreen.classList.remove('active');

    // Menüyü göster
    playerDisplay.textContent = playerName;
    menuScreen.classList.add('active');
}

function showLeaderboard() {
    menuScreen.classList.remove('active');
    renderLeaderboard();
    leaderboardScreen.classList.add('active');
}

// ===== Oyun Başlatma =====
function startGame() {
    gameState.isRunning = true;
    gameState.distance = 0;
    gameState.speed = INITIAL_SPEED;
    gameState.lastQuoteDistance = 0;

    penguin.y = canvas.height - GROUND_HEIGHT - penguin.height;
    penguin.velocityY = 0;
    penguin.isJumping = false;

    obstacles = [];
    particles = [];

    menuScreen.classList.remove('active');
    gameoverScreen.classList.remove('active');
    gameScreen.classList.add('active');

    // Oyuncu adını göster
    playerNameGame.textContent = playerName;

    highScoreDisplay.textContent = gameState.highScore + 'm';
    quoteDisplay.classList.remove('visible');

    // Play selected music when game starts
    playMusic();

    requestAnimationFrame(gameLoop);
}

// ===== Zıplama =====
function jump() {
    if (!penguin.isJumping && gameState.isRunning) {
        penguin.velocityY = JUMP_FORCE;
        penguin.isJumping = true;
        createJumpParticles();
    }
}

// ===== Parçacık Efektleri =====
function createJumpParticles() {
    for (let i = 0; i < 5; i++) {
        particles.push({
            x: penguin.x + penguin.width / 2,
            y: penguin.y + penguin.height,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 2,
            radius: 2 + Math.random() * 3,
            life: 1,
            color: '#7dd3fc'
        });
    }
}

function createCrashParticles() {
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: penguin.x + penguin.width / 2,
            y: penguin.y + penguin.height / 2,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            radius: 3 + Math.random() * 5,
            life: 1,
            color: '#ec4899'
        });
    }
}

// ===== Engel Oluşturma =====
function spawnObstacle() {
    const lastObstacle = obstacles[obstacles.length - 1];
    const minX = lastObstacle ? lastObstacle.x + OBSTACLE_GAP : canvas.width + 100;

    if (!lastObstacle || lastObstacle.x < canvas.width - OBSTACLE_GAP) {
        const height = MIN_OBSTACLE_HEIGHT + Math.random() * (MAX_OBSTACLE_HEIGHT - MIN_OBSTACLE_HEIGHT);
        const type = Math.random() > 0.3 ? 'ice' : 'pit';

        obstacles.push({
            x: canvas.width + 50,
            y: canvas.height - GROUND_HEIGHT - height,
            width: OBSTACLE_WIDTH + Math.random() * 20,
            height: height,
            type: type,
            passed: false
        });
    }
}

// ===== Çarpışma Kontrolü =====
function checkCollision() {
    const penguinBox = {
        x: penguin.x + 10,
        y: penguin.y + 5,
        width: penguin.width - 20,
        height: penguin.height - 10
    };

    for (let obstacle of obstacles) {
        if (obstacle.type === 'ice') {
            const obstacleBox = {
                x: obstacle.x,
                y: obstacle.y,
                width: obstacle.width,
                height: obstacle.height
            };

            if (penguinBox.x < obstacleBox.x + obstacleBox.width &&
                penguinBox.x + penguinBox.width > obstacleBox.x &&
                penguinBox.y < obstacleBox.y + obstacleBox.height &&
                penguinBox.y + penguinBox.height > obstacleBox.y) {
                return true;
            }
        } else if (obstacle.type === 'pit') {
            // Çukur kontrolü
            if (penguinBox.x + penguinBox.width > obstacle.x &&
                penguinBox.x < obstacle.x + obstacle.width &&
                penguinBox.y + penguinBox.height >= canvas.height - GROUND_HEIGHT) {
                return true;
            }
        }
    }
    return false;
}

// ===== Game Over =====
function gameOver() {
    gameState.isRunning = false;
    createCrashParticles();

    // Stop background music when penguin dies
    stopMusic();

    const finalScore = Math.floor(gameState.distance);

    // Skor tablosuna kaydet
    saveToLeaderboard(playerName, finalScore);

    // Yüksek skor güncelle
    if (finalScore > gameState.highScore) {
        gameState.highScore = finalScore;
        localStorage.setItem('nihilistPenguinHighScore', gameState.highScore);
    }

    // UI Güncelle
    finalDistance.textContent = finalScore + 'm';
    finalHighScore.textContent = gameState.highScore + 'm';
    finalQuote.textContent = '"' + getGameOverQuote() + '"';

    setTimeout(() => {
        gameScreen.classList.remove('active');
        gameoverScreen.classList.add('active');
    }, 500);
}

// ===== Alıntı Gösterme =====
function showQuote() {
    if (gameState.distance - gameState.lastQuoteDistance >= QUOTE_INTERVAL) {
        gameState.lastQuoteDistance = gameState.distance;
        quoteDisplay.textContent = '"' + getRandomQuote() + '"';
        quoteDisplay.classList.add('visible');

        setTimeout(() => {
            quoteDisplay.classList.remove('visible');
        }, 4000);
    }
}

// ===== Çizim Fonksiyonları =====

// Arka plan
function drawBackground() {
    // Gradyan gökyüzü
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(0.5, '#1a1a3a');
    gradient.addColorStop(1, '#2a2a4a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bulutlar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let cloud of clouds) {
        drawCloud(cloud);
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.width < 0) {
            cloud.x = canvas.width + cloud.width;
        }
    }

    // Dağlar
    for (let mountain of mountains) {
        const alpha = 0.2 + mountain.layer * 0.1;
        const color = `rgba(100, 120, 150, ${alpha})`;
        drawMountain(mountain, color);

        mountain.x -= gameState.speed * (0.1 + mountain.layer * 0.05);
        if (mountain.x + mountain.width < 0) {
            mountain.x = canvas.width + 50;
        }
    }

    // Kar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let flake of snowflakes) {
        ctx.globalAlpha = flake.opacity;
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();

        flake.y += flake.speed;
        flake.x += Math.sin(flake.y * 0.01) * 0.5;

        if (flake.y > canvas.height) {
            flake.y = -5;
            flake.x = Math.random() * canvas.width;
        }
    }
    ctx.globalAlpha = 1;
}

function drawCloud(cloud) {
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, 30, 0, Math.PI * 2);
    ctx.arc(cloud.x + 25, cloud.y - 10, 25, 0, Math.PI * 2);
    ctx.arc(cloud.x + 50, cloud.y, 30, 0, Math.PI * 2);
    ctx.arc(cloud.x + 25, cloud.y + 10, 20, 0, Math.PI * 2);
    ctx.fill();
}

function drawMountain(mountain, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(mountain.x, canvas.height - GROUND_HEIGHT);
    ctx.lineTo(mountain.x + mountain.width / 2, canvas.height - GROUND_HEIGHT - mountain.height);
    ctx.lineTo(mountain.x + mountain.width, canvas.height - GROUND_HEIGHT);
    ctx.closePath();
    ctx.fill();

    // Kar tepesi
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.moveTo(mountain.x + mountain.width / 2, canvas.height - GROUND_HEIGHT - mountain.height);
    ctx.lineTo(mountain.x + mountain.width / 2 - 20, canvas.height - GROUND_HEIGHT - mountain.height + 30);
    ctx.lineTo(mountain.x + mountain.width / 2 + 20, canvas.height - GROUND_HEIGHT - mountain.height + 30);
    ctx.closePath();
    ctx.fill();
}

// Zemin
function drawGround() {
    // Ana zemin
    const groundGradient = ctx.createLinearGradient(0, canvas.height - GROUND_HEIGHT, 0, canvas.height);
    groundGradient.addColorStop(0, '#e8f0ff');
    groundGradient.addColorStop(1, '#c4d4e8');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);

    // Zemin çizgisi
    ctx.strokeStyle = 'rgba(74, 158, 255, 0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - GROUND_HEIGHT);
    ctx.lineTo(canvas.width, canvas.height - GROUND_HEIGHT);
    ctx.stroke();
}

// Penguen
function drawPenguin() {
    const x = penguin.x;
    const y = penguin.y;
    const w = penguin.width;
    const h = penguin.height;

    // Animasyon frame
    penguin.frameCount++;
    if (penguin.frameCount > 10) {
        penguin.frame = (penguin.frame + 1) % 2;
        penguin.frameCount = 0;
    }

    // Gölge
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, canvas.height - GROUND_HEIGHT + 5, w / 2 - 5, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vücut (oval)
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2 + 5, w / 2 - 5, h / 2 - 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Karın
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2 + 10, w / 3, h / 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Kafa
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 15, 18, 0, Math.PI * 2);
    ctx.fill();

    // Gözler (üzgün bakış)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x + w / 2 - 7, y + 12, 5, 0, Math.PI * 2);
    ctx.arc(x + w / 2 + 7, y + 12, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(x + w / 2 - 6, y + 13, 2, 0, Math.PI * 2);
    ctx.arc(x + w / 2 + 6, y + 13, 2, 0, Math.PI * 2);
    ctx.fill();

    // Üzgün kaşlar
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + w / 2 - 12, y + 6);
    ctx.lineTo(x + w / 2 - 3, y + 8);
    ctx.moveTo(x + w / 2 + 12, y + 6);
    ctx.lineTo(x + w / 2 + 3, y + 8);
    ctx.stroke();

    // Gaga
    ctx.fillStyle = '#ff9900';
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + 15);
    ctx.lineTo(x + w / 2 - 5, y + 22);
    ctx.lineTo(x + w / 2 + 5, y + 22);
    ctx.closePath();
    ctx.fill();

    // Kanatlar (animasyonlu)
    ctx.fillStyle = '#1a1a2e';
    const wingOffset = penguin.isJumping ? -10 : (penguin.frame === 0 ? 0 : 3);

    // Sol kanat
    ctx.beginPath();
    ctx.ellipse(x + 5, y + h / 2 + wingOffset, 8, 20, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Sağ kanat
    ctx.beginPath();
    ctx.ellipse(x + w - 5, y + h / 2 + wingOffset, 8, 20, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Ayaklar
    ctx.fillStyle = '#ff9900';
    ctx.beginPath();
    ctx.ellipse(x + w / 2 - 8, y + h - 5, 8, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w / 2 + 8, y + h - 5, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
}

// Engeller
function drawObstacles() {
    for (let obs of obstacles) {
        if (obs.type === 'ice') {
            // Buz parçası
            const gradient = ctx.createLinearGradient(obs.x, obs.y, obs.x, obs.y + obs.height);
            gradient.addColorStop(0, '#7dd3fc');
            gradient.addColorStop(0.5, '#38bdf8');
            gradient.addColorStop(1, '#0ea5e9');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(obs.x + obs.width / 2, obs.y);
            ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
            ctx.lineTo(obs.x, obs.y + obs.height);
            ctx.closePath();
            ctx.fill();

            // Parlaklık
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.moveTo(obs.x + obs.width / 2, obs.y + 10);
            ctx.lineTo(obs.x + obs.width / 2 + 8, obs.y + obs.height / 2);
            ctx.lineTo(obs.x + obs.width / 2 - 5, obs.y + obs.height / 3);
            ctx.closePath();
            ctx.fill();
        } else if (obs.type === 'pit') {
            // Çukur
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(obs.x, canvas.height - GROUND_HEIGHT, obs.width, GROUND_HEIGHT);

            // Kenar efekti
            ctx.strokeStyle = '#0ea5e9';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(obs.x, canvas.height - GROUND_HEIGHT);
            ctx.lineTo(obs.x, canvas.height);
            ctx.moveTo(obs.x + obs.width, canvas.height - GROUND_HEIGHT);
            ctx.lineTo(obs.x + obs.width, canvas.height);
            ctx.stroke();
        }
    }
}

// Parçacıklar
function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= 0.02;

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
    ctx.globalAlpha = 1;
}

// ===== Güncelleme Fonksiyonları =====
function update() {
    if (!gameState.isRunning) return;

    // Hız artışı
    gameState.speed = Math.min(gameState.speed + SPEED_INCREMENT, MAX_SPEED);

    // Mesafe
    gameState.distance += gameState.speed * 0.1;
    distanceDisplay.textContent = Math.floor(gameState.distance) + 'm';

    // Penguen fiziği
    penguin.velocityY += GRAVITY;
    penguin.y += penguin.velocityY;

    // Zemin kontrolü
    const groundY = canvas.height - GROUND_HEIGHT - penguin.height;
    if (penguin.y >= groundY) {
        penguin.y = groundY;
        penguin.velocityY = 0;
        penguin.isJumping = false;
    }

    // Engel spawn
    spawnObstacle();

    // Engelleri güncelle
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameState.speed;

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }

    // Çarpışma kontrolü
    if (checkCollision()) {
        gameOver();
        return;
    }

    // Alıntı göster
    showQuote();
}

// ===== Ana Oyun Döngüsü =====
function gameLoop() {
    if (!gameState.isRunning) return;

    // Temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Çiz
    drawBackground();
    drawGround();
    drawObstacles();
    drawPenguin();
    drawParticles();

    // Güncelle
    update();

    requestAnimationFrame(gameLoop);
}

// ===== Event Listeners =====

// Pencere boyutlandırma
window.addEventListener('resize', resizeCanvas);

// Klavye kontrolleri
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameState.isRunning) {
            jump();
        }
    }

    // Enter tuşu ile giriş
    if (e.code === 'Enter' && nameScreen.classList.contains('active')) {
        enterGame();
    }
});

// Touch kontrolleri
document.addEventListener('touchstart', (e) => {
    if (gameScreen.classList.contains('active') && gameState.isRunning) {
        e.preventDefault();
        jump();
    }
}, { passive: false });

// Mouse tıklama (oyun alanında)
canvas.addEventListener('click', () => {
    if (gameState.isRunning) {
        jump();
    }
});

// Button events
enterBtn.addEventListener('click', enterGame);
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
leaderboardBtn.addEventListener('click', showLeaderboard);
leaderboardBackBtn.addEventListener('click', showMenu);
menuBtn.addEventListener('click', showMenu);

// ===== Initialization =====
resizeCanvas();
highScoreDisplay.textContent = gameState.highScore + 'm';

// Apply saved language on load
setLanguage(currentLanguage);

// If name was entered before, go directly to menu
if (playerName) {
    playerNameInput.value = playerName;
    showMenu();
}
