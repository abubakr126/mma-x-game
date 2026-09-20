/* =========================================================
   MMA X — GAME ENGINE
   ========================================================= */

"use strict";

/* =========================================================
   GAME STATE
   ========================================================= */

const DEFAULT_STATE = {
    language: null,

    player: {
        name: "PLAYER",
        level: 1,
        xp: 0,
        coins: 1000,
        wins: 0,
        losses: 0,
        fights: 0,

        selectedFighter: "shadow",
        selectedArena: "classic",

        unlockedFighters: ["shadow"],
        unlockedArenas: ["classic"],
        unlockedAbilities: ["powerStrike"],

        training: {
            strength: 0,
            speed: 0,
            defense: 0,
            stamina: 0
        }
    },

    settings: {
        sound: true,
        music: true
    }
};

let gameState = loadGame();

let currentScreen = "home";

let selectedFighterId = null;
let selectedArenaId = "classic";

let currentEnemy = null;

let fightState = {
    active: false,
    playerHP: 100,
    enemyHP: 100,
    playerMaxHP: 100,
    enemyMaxHP: 100,
    playerStamina: 100,
    enemyStamina: 100,
    timer: 180,
    round: 1,
    blocking: false,
    dodging: false,
    specialCooldown: 0,
    enemyActionTimer: null,
    timerInterval: null
};

/* =========================================================
   FIGHTERS
   ========================================================= */

const FIGHTERS = [

    {
        id: "shadow",
        name: "Shadow",
        style: "Balanced MMA",
        rarity: "common",
        avatar: "🥷",
        health: 90,
        strength: 78,
        speed: 86,
        defense: 78,
        stamina: 90,
        ability: "Power Strike",
        description: "A balanced fighter with excellent speed."
    },

    {
        id: "titan",
        name: "Titan",
        style: "Heavy Striker",
        rarity: "rare",
        avatar: "🦾",
        health: 110,
        strength: 96,
        speed: 62,
        defense: 82,
        stamina: 75,
        ability: "Titan Smash",
        description: "Powerful attacks with incredible strength."
    },

    {
        id: "blaze",
        name: "Blaze",
        style: "Kick Boxer",
        rarity: "rare",
        avatar: "🔥",
        health: 88,
        strength: 82,
        speed: 96,
        defense: 70,
        stamina: 92,
        ability: "Fire Kick",
        description: "Extremely fast and dangerous at range."
    },

    {
        id: "phantom",
        name: "Phantom",
        style: "Counter Fighter",
        rarity: "epic",
        avatar: "👻",
        health: 92,
        strength: 84,
        speed: 98,
        defense: 94,
        stamina: 88,
        ability: "Ghost Step",
        description: "A master of movement and counter attacks."
    },

    {
        id: "viper",
        name: "Viper",
        style: "Submission Specialist",
        rarity: "epic",
        avatar: "🐍",
        health: 96,
        strength: 89,
        speed: 90,
        defense: 91,
        stamina: 94,
        ability: "Venom Combo",
        description: "Fast combinations and technical defense."
    },

    {
        id: "inferno",
        name: "Inferno",
        style: "Elite Striker",
        rarity: "legendary",
        avatar: "👹",
        health: 105,
        strength: 100,
        speed: 94,
        defense: 91,
        stamina: 96,
        ability: "Inferno Rage",
        description: "An elite fighter with devastating attacks."
    },

    {
        id: "apex",
        name: "Apex",
        style: "Complete Fighter",
        rarity: "legendary",
        avatar: "🦁",
        health: 115,
        strength: 98,
        speed: 97,
        defense: 98,
        stamina: 100,
        ability: "Apex Mode",
        description: "A complete MMA fighter with almost no weakness."
    },

    {
        id: "storm",
        name: "Storm",
        style: "Speed Specialist",
        rarity: "epic",
        avatar: "⚡",
        health: 91,
        strength: 86,
        speed: 100,
        defense: 87,
        stamina: 97,
        ability: "Lightning Rush",
        description: "The fastest fighter in the roster."
    }

];

/* =========================================================
   ARENAS
   ========================================================= */

const ARENAS = [

    {
        id: "classic",
        name: "Classic Arena",
        icon: "🏟️",
        unlocked: true
    },

    {
        id: "night",
        name: "Night Arena",
        icon: "🌃",
        unlocked: false,
        requirement: "Level 5"
    },

    {
        id: "champion",
        name: "Champion Arena",
        icon: "🏆",
        unlocked: false,
        requirement: "Tournament"
    },

    {
        id: "neon",
        name: "Neon Arena",
        icon: "🌆",
        unlocked: false,
        requirement: "Level 10"
    },

    {
        id: "underground",
        name: "Underground Arena",
        icon: "🥊",
        unlocked: false,
        requirement: "10 Wins"
    },

    {
        id: "legend",
        name: "Legend Arena",
        icon: "👑",
        unlocked: false,
        requirement: "Level 20"
    }

];

/* =========================================================
   SHOP ITEMS
   ========================================================= */

const SHOP_ITEMS = [

    {
        id: "titan",
        type: "fighter",
        name: "Titan",
        icon: "🦾",
        price: 800
    },

    {
        id: "blaze",
        type: "fighter",
        name: "Blaze",
        icon: "🔥",
        price: 1000
    },

    {
        id: "phantom",
        type: "fighter",
        name: "Phantom",
        icon: "👻",
        price: 1600
    },

    {
        id: "viper",
        type: "fighter",
        name: "Viper",
        icon: "🐍",
        price: 1800
    },

    {
        id: "inferno",
        type: "fighter",
        name: "Inferno",
        icon: "👹",
        price: 3000
    },

    {
        id: "apex",
        type: "fighter",
        name: "Apex",
        icon: "🦁",
        price: 5000
    },

    {
        id: "night",
        type: "arena",
        name: "Night Arena",
        icon: "🌃",
        price: 1500
    },

    {
        id: "neon",
        type: "arena",
        name: "Neon Arena",
        icon: "🌆",
        price: 2500
    },

    {
        id: "powerStrike",
        type: "ability",
        name: "Power Strike",
        icon: "⚡",
        price: 700
    },

    {
        id: "rage",
        type: "ability",
        name: "Rage Mode",
        icon: "🔥",
        price: 1500
    }

];

/* =========================================================
   TRANSLATIONS
   ========================================================= */

const TRANSLATIONS = {

    uz: {

        loading: "Yuklanmoqda...",
        chooseLanguage: "Tilni tanlang",
        selectLanguage: "O‘yindagi tilni tanlang",

        ultimateFightingGame: "ULTIMATE JANG O‘YINI",

        play: "O‘YNASH",
        tournament: "TURNIR",
        training: "MASHG‘ULOT",
        fighters: "JANGCHILAR",
        shop: "DO‘KON",
        settings: "SOZLAMALAR",
        profile: "PROFIL",
        home: "BOSH SAHIFA",

        back: "Orqaga",
        chooseFighter: "Jangchini tanlang",
        selectYourFighter: "O‘zingizga jangchi tanlang",

        all: "Barchasi",
        common: "Oddiy",
        rare: "Noyob",
        epic: "Epik",
        legendary: "Afsonaviy",

        health: "Sog‘liq",
        strength: "Kuch",
        speed: "Tezlik",
        defense: "Himoya",
        stamina: "Chidamlilik",

        select: "TANLASH",
        chooseArena: "Arenani tanlang",
        selectArena: "Jang arenasini tanlang",
        arenas: "Arenalar",

        startFight: "JANGNI BOSHLASH",

        round: "RAUND",
        punch: "ZARBA",
        kick: "TEPISH",
        special: "MAXSUS",
        block: "HIMOYA",
        dodge: "QOCHISH",

        becomeChampion: "Chempion bo‘ling",
        startTournament: "TURNIRNI BOSHLASH",

        improveFighter: "Jangchingizni rivojlantiring",
        train: "MASHQ",

        unlockItems: "Yangi narsalarni oching",
        abilities: "Qobiliyatlar",

        level: "Daraja",
        wins: "G‘ALABALAR",
        losses: "MAG‘LUBIYATLAR",
        fights: "JANGlar",
        winRate: "G‘ALABA FOIZI",

        yourProgress: "Sizning natijalaringiz",

        language: "Til",
        sound: "Ovoz",
        soundEffects: "Ovoz effektlari",
        music: "Musiqa",
        backgroundMusic: "Fon musiqasi",
        controls: "Boshqaruv",
        controlSettings: "Boshqaruv sozlamalari",

        gameSettings: "O‘yin sozlamalari",
        resetProgress: "Progressni tiklash",
        resetWarning: "Barcha progressni o‘chirish",

        victory: "G‘ALABA!",
        defeat: "MAG‘LUBIYAT",
        rematch: "QAYTA JANG",
        mainMenu: "ASOSIY MENYU"
    },

    en: {

        loading: "Loading...",
        chooseLanguage: "Choose Language",
        selectLanguage: "Select your language",

        ultimateFightingGame: "ULTIMATE FIGHTING GAME",

        play: "PLAY",
        tournament: "TOURNAMENT",
        training: "TRAINING",
        fighters: "FIGHTERS",
        shop: "SHOP",
        settings: "SETTINGS",
        profile: "PROFILE",
        home: "HOME",

        back: "Back",
        chooseFighter: "Choose Fighter",
        selectYourFighter: "Select your fighter",

        all: "All",
        common: "Common",
        rare: "Rare",
        epic: "Epic",
        legendary: "Legendary",

        health: "Health",
        strength: "Strength",
        speed: "Speed",
        defense: "Defense",
        stamina: "Stamina",

        select: "SELECT",
        chooseArena: "Choose Arena",
        selectArena: "Select your battle arena",
        arenas: "Arenas",

        startFight: "START FIGHT",

        round: "ROUND",
        punch: "PUNCH",
        kick: "KICK",
        special: "SPECIAL",
        block: "BLOCK",
        dodge: "DODGE",

        becomeChampion: "Become the champion",
        startTournament: "START TOURNAMENT",

        improveFighter: "Improve your fighter",
        train: "TRAIN",

        unlockItems: "Unlock new items",
        abilities: "Abilities",

        level: "Level",
        wins: "Wins",
        losses: "Losses",
        fights: "Fights",
        winRate: "Win Rate",

        yourProgress: "Your progress",

        language: "Language",
        sound: "Sound",
        soundEffects: "Sound effects",
        music: "Music",
        backgroundMusic: "Background music",
        controls: "Controls",
        controlSettings: "Control settings",

        gameSettings: "Game settings",
        resetProgress: "Reset Progress",
        resetWarning: "Delete all game progress",

        victory: "VICTORY!",
        defeat: "DEFEAT",
        rematch: "REMATCH",
        mainMenu: "MAIN MENU"
    },

    tr: {

        loading: "Yükleniyor...",
        chooseLanguage: "Dil Seç",
        selectLanguage: "Dilinizi seçin",

        ultimateFightingGame: "ULTIMATE DÖVÜŞ OYUNU",

        play: "OYNA",
        tournament: "TURNUVA",
        training: "ANTRENMAN",
        fighters: "DÖVÜŞÇÜLER",
        shop: "MAĞAZA",
        settings: "AYARLAR",
        profile: "PROFİL",
        home: "ANA SAYFA",

        back: "Geri",
        chooseFighter: "Dövüşçü Seç",
        selectYourFighter: "Dövüşçünüzü seçin",

        all: "Tümü",
        common: "Yaygın",
        rare: "Nadir",
        epic: "Destansı",
        legendary: "Efsanevi",

        health: "Sağlık",
        strength: "Güç",
        speed: "Hız",
        defense: "Savunma",
        stamina: "Dayanıklılık",

        select: "SEÇ",
        chooseArena: "Arena Seç",
        selectArena: "Dövüş arenasını seçin",
        arenas: "Arenalar",

        startFight: "DÖVÜŞÜ BAŞLAT",

        round: "RAUNT",
        punch: "YUMRUK",
        kick: "TEKME",
        special: "ÖZEL",
        block: "SAVUN",
        dodge: "KAÇ",

        becomeChampion: "Şampiyon ol",
        startTournament: "TURNUVAYI BAŞLAT",

        improveFighter: "Dövüşçünü geliştir",
        train: "ANTRENMAN",

        unlockItems: "Yeni eşyaların kilidini aç",
        abilities: "Yetenekler",

        level: "Seviye",
        wins: "Galibiyet",
        losses: "Mağlubiyet",
        fights: "Dövüş",
        winRate: "Galibiyet Oranı",

        yourProgress: "İlerlemeniz",

        language: "Dil",
        sound: "Ses",
        soundEffects: "Ses efektleri",
        music: "Müzik",
        backgroundMusic: "Arka plan müziği",
        controls: "Kontroller",
        controlSettings: "Kontrol ayarları",

        gameSettings: "Oyun ayarları",
        resetProgress: "İlerlemeyi Sıfırla",
        resetWarning: "Tüm oyun ilerlemesini sil",

        victory: "ZAFER!",
        defeat: "MAĞLUBİYET",
        rematch: "TEKRAR DÖVÜŞ",
        mainMenu: "ANA MENÜ"
    },

    es: {

        loading: "Cargando...",
        chooseLanguage: "Elegir idioma",
        selectLanguage: "Selecciona tu idioma",

        ultimateFightingGame: "JUEGO DE LUCHA DEFINITIVO",

        play: "JUGAR",
        tournament: "TORNEO",
        training: "ENTRENAMIENTO",
        fighters: "LUCHADORES",
        shop: "TIENDA",
        settings: "AJUSTES",
        profile: "PERFIL",
        home: "INICIO",

        back: "Atrás",
        chooseFighter: "Elegir luchador",
        selectYourFighter: "Selecciona tu luchador",

        all: "Todos",
        common: "Común",
        rare: "Raro",
        epic: "Épico",
        legendary: "Legendario",

        health: "Salud",
        strength: "Fuerza",
        speed: "Velocidad",
        defense: "Defensa",
        stamina: "Resistencia",

        select: "SELECCIONAR",
        chooseArena: "Elegir arena",
        selectArena: "Selecciona la arena",
        arenas: "Arenas",

        startFight: "EMPEZAR PELEA",

        round: "ASALTO",
        punch: "PUÑETAZO",
        kick: "PATADA",
        special: "ESPECIAL",
        block: "BLOQUEAR",
        dodge: "ESQUIVAR",

        becomeChampion: "Conviértete en campeón",
        startTournament: "EMPEZAR TORNEO",

        improveFighter: "Mejora tu luchador",
        train: "ENTRENAR",

        unlockItems: "Desbloquea nuevos objetos",
        abilities: "Habilidades",

        level: "Nivel",
        wins: "Victorias",
        losses: "Derrotas",
        fights: "Peleas",
        winRate: "Porcentaje de victorias",

        yourProgress: "Tu progreso",

        language: "Idioma",
        sound: "Sonido",
        soundEffects: "Efectos de sonido",
        music: "Música",
        backgroundMusic: "Música de fondo",
        controls: "Controles",
        controlSettings: "Configuración de controles",

        gameSettings: "Ajustes del juego",
        resetProgress: "Restablecer progreso",
        resetWarning: "Eliminar todo el progreso",

        victory: "¡VICTORIA!",
        defeat: "DERROTA",
        rematch: "REVANCHA",
        mainMenu: "MENÚ PRINCIPAL"
    },

    ar: {

        loading: "جار التحميل...",
        chooseLanguage: "اختر اللغة",
        selectLanguage: "اختر لغتك",

        ultimateFightingGame: "لعبة القتال النهائية",

        play: "لعب",
        tournament: "البطولة",
        training: "التدريب",
        fighters: "المقاتلون",
        shop: "المتجر",
        settings: "الإعدادات",
        profile: "الملف الشخصي",
        home: "الرئيسية",

        back: "رجوع",
        chooseFighter: "اختر المقاتل",
        selectYourFighter: "اختر مقاتلك",

        all: "الكل",
        common: "عادي",
        rare: "نادر",
        epic: "ملحمي",
        legendary: "أسطوري",

        health: "الصحة",
        strength: "القوة",
        speed: "السرعة",
        defense: "الدفاع",
        stamina: "التحمل",

        select: "اختيار",
        chooseArena: "اختر الحلبة",
        selectArena: "اختر حلبة القتال",
        arenas: "الحلبات",

        startFight: "ابدأ القتال",

        round: "الجولة",
        punch: "لكمة",
        kick: "ركلة",
        special: "خاص",
        block: "دفاع",
        dodge: "مراوغة",

        becomeChampion: "كن البطل",
        startTournament: "ابدأ البطولة",

        improveFighter: "طور مقاتلك",
        train: "تدريب",

        unlockItems: "افتح عناصر جديدة",
        abilities: "القدرات",

        level: "المستوى",
        wins: "الانتصارات",
        losses: "الهزائم",
        fights: "المعارك",
        winRate: "نسبة الفوز",

        yourProgress: "تقدمك",

        language: "اللغة",
        sound: "الصوت",
        soundEffects: "المؤثرات الصوتية",
        music: "الموسيقى",
        backgroundMusic: "موسيقى الخلفية",
        controls: "التحكم",
        controlSettings: "إعدادات التحكم",

        gameSettings: "إعدادات اللعبة",
        resetProgress: "إعادة ضبط التقدم",
        resetWarning: "حذف كل تقدم اللعبة",

        victory: "انتصار!",
        defeat: "هزيمة",
        rematch: "إعادة القتال",
        mainMenu: "القائمة الرئيسية"
    },

    "pt-BR": {

        loading: "Carregando...",
        chooseLanguage: "Escolha o idioma",
        selectLanguage: "Selecione seu idioma",

        ultimateFightingGame: "JOGO DE LUTA DEFINITIVO",

        play: "JOGAR",
        tournament: "TORNEIO",
        training: "TREINO",
        fighters: "LUTADORES",
        shop: "LOJA",
        settings: "CONFIGURAÇÕES",
        profile: "PERFIL",
        home: "INÍCIO",

        back: "Voltar",
        chooseFighter: "Escolha o lutador",
        selectYourFighter: "Selecione seu lutador",

        all: "Todos",
        common: "Comum",
        rare: "Raro",
        epic: "Épico",
        legendary: "Lendário",

        health: "Vida",
        strength: "Força",
        speed: "Velocidade",
        defense: "Defesa",
        stamina: "Resistência",

        select: "SELECIONAR",
        chooseArena: "Escolha a arena",
        selectArena: "Selecione sua arena",
        arenas: "Arenas",

        startFight: "COMEÇAR LUTA",

        round: "ROUND",
        punch: "SOCO",
        kick: "CHUTE",
        special: "ESPECIAL",
        block: "DEFESA",
        dodge: "ESQUIVA",

        becomeChampion: "Torne-se campeão",
        startTournament: "COMEÇAR TORNEIO",

        improveFighter: "Melhore seu lutador",
        train: "TREINAR",

        unlockItems: "Desbloqueie novos itens",
        abilities: "Habilidades",

        level: "Nível",
        wins: "Vitórias",
        losses: "Derrotas",
        fights: "Lutas",
        winRate: "Taxa de vitória",

        yourProgress: "Seu progresso",

        language: "Idioma",
        sound: "Som",
        soundEffects: "Efeitos sonoros",
        music: "Música",
        backgroundMusic: "Música de fundo",
        controls: "Controles",
        controlSettings: "Configurações de controle",

        gameSettings: "Configurações do jogo",
        resetProgress: "Redefinir progresso",
        resetWarning: "Excluir todo o progresso",

        victory: "VITÓRIA!",
        defeat: "DERROTA",
        rematch: "REVANCHE",
        mainMenu: "MENU PRINCIPAL"
    }

};

/* =========================================================
   DOM HELPERS
   ========================================================= */

function $(selector) {
    return document.querySelector(selector);
}

function $all(selector) {
    return document.querySelectorAll(selector);
}

/* =========================================================
   SAVE SYSTEM
   ========================================================= */

function saveGame() {

    try {
        localStorage.setItem(
            "mmaXSave",
            JSON.stringify(gameState)
        );
    } catch (error) {
        console.error("Save error:", error);
    }
}

function loadGame() {

    try {

        const saved = localStorage.getItem("mmaXSave");

        if (!saved) {
            return structuredClone(DEFAULT_STATE);
        }

        const parsed = JSON.parse(saved);

        return mergeObjects(
            structuredClone(DEFAULT_STATE),
            parsed
        );

    } catch (error) {

        console.error("Load error:", error);

        return structuredClone(DEFAULT_STATE);
    }
}

function mergeObjects(target, source) {

    for (const key in source) {

        if (
            source[key] &&
            typeof source[key] === "object" &&
            !Array.isArray(source[key])
        ) {

            target[key] = mergeObjects(
                target[key] || {},
                source[key]
            );

        } else {

            target[key] = source[key];

        }
    }

    return target;
}

/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    startLoading();

});

/* =========================================================
   LOADING
   ========================================================= */

function startLoading() {

    const progress = $("#loading-progress");
    const loadingText = $(".loading-text");

    let value = 0;

    const interval = setInterval(() => {

        value += Math.floor(Math.random() * 15) + 5;

        if (value >= 100) {
            value = 100;
            clearInterval(interval);

            setTimeout(() => {

                const loadingScreen = $("#loading-screen");

                loadingScreen.classList.add("hidden");

                initializeGame();

            }, 350);
        }

        if (progress) {
            progress.style.width = `${value}%`;
        }

    }, 120);

    if (loadingText) {
        loadingText.textContent = "Loading...";
    }
}

/* =========================================================
   INITIALIZE GAME
   ========================================================= */

function initializeGame() {

    setupEvents();

    updatePlayerUI();

    if (!gameState.language) {

        $("#language-screen").classList.remove("hidden");

    } else {

        $("#app").classList.remove("hidden");

        applyLanguage(gameState.language);

    }

    renderFighters();
    renderShop();
    updateProfile();
}

/* =========================================================
   EVENTS
   ========================================================= */

function setupEvents() {

    /* Language */

    $all(".language-card").forEach(button => {

        button.addEventListener("click", () => {

            const language = button.dataset.language;

            setLanguage(language);

        });

    });


    /* Main menu */

    $("#play-button")?.addEventListener("click", () => {

        openScreen("fighter-select");

    });


    $("#fighters-button")?.addEventListener("click", () => {

        openScreen("fighter-select");

    });


    $("#tournament-button")?.addEventListener("click", () => {

        openScreen("tournament");

    });


    $("#training-button")?.addEventListener("click", () => {

        openScreen("training");

    });


    $("#shop-button")?.addEventListener("click", () => {

        openScreen("shop");

    });


    $("#settings-button")?.addEventListener("click", () => {

        openScreen("settings");

    });


    $("#top-settings-button")?.addEventListener("click", () => {

        openScreen("settings");

    });


    $("#menu-logo-button")?.addEventListener("click", () => {

        openScreen("home");

    });


    /* Fighter */

    $("#select-fighter-button")?.addEventListener(
        "click",
        confirmFighterSelection
    );


    /* Arena */

    $("#start-fight-button")?.addEventListener(
        "click",
        startFight
    );


    $all(".arena-card").forEach(card => {

        card.addEventListener("click", () => {

            selectArena(card.dataset.arena);

        });

    });


    /* Back */

    $all(".back-button").forEach(button => {

        button.addEventListener("click", () => {

            const destination = button.dataset.back || "home";

            openScreen(destination);

        });

    });


    /* Filters */

    $all(".filter-button").forEach(button => {

        button.addEventListener("click", () => {

            $all(".filter-button").forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            renderFighters(button.dataset.filter);

        });

    });


    /* Bottom nav */

    $all(".bottom-nav-item").forEach(button => {

        button.addEventListener("click", () => {

            openScreen(button.dataset.nav);

        });

    });


    /* Settings */

    $("#change-language-button")?.addEventListener(
        "click",
        () => {

            $("#app").classList.add("hidden");

            $("#language-screen").classList.remove("hidden");

        }
    );


    $("#sound-toggle")?.addEventListener("change", event => {

        gameState.settings.sound = event.target.checked;

        saveGame();

    });


    $("#music-toggle")?.addEventListener("change", event => {

        gameState.settings.music = event.target.checked;

        saveGame();

    });


    $("#reset-progress-button")?.addEventListener(
        "click",
        showResetConfirmation
    );


    $("#controls-button")?.addEventListener(
        "click",
        showControls
    );


    /* Fight buttons */

    $("#punch-button")?.addEventListener(
        "click",
        () => playerAttack("punch")
    );


    $("#kick-button")?.addEventListener(
        "click",
        () => playerAttack("kick")
    );


    $("#special-button")?.addEventListener(
        "click",
        () => playerAttack("special")
    );


    $("#block-button")?.addEventListener(
        "mousedown",
        startBlock
    );

    $("#block-button")?.addEventListener(
        "mouseup",
        stopBlock
    );

    $("#block-button")?.addEventListener(
        "mouseleave",
        stopBlock
    );

    $("#dodge-button")?.addEventListener(
        "click",
        playerDodge
    );


    $("#fight-menu-button")?.addEventListener(
        "click",
        showFightMenu
    );


    /* Result */

    $("#rematch-button")?.addEventListener(
        "click",
        startFight
    );


    $("#result-home-button")?.addEventListener(
        "click",
        () => openScreen("home")
    );


    /* Tournament */

    $("#tournament-start-button")?.addEventListener(
        "click",
        startTournament
    );


    /* Training */

    $all(".training-button").forEach(button => {

        button.addEventListener("click", () => {

            const card = button.closest(".training-card");

            if (!card) return;

            trainStat(card.dataset.training);

        });

    });


    /* Shop tabs */

    $all(".shop-tab").forEach(button => {

        button.addEventListener("click", () => {

            $all(".shop-tab").forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            renderShop(button.dataset.shopTab);

        });

    });


    /* Keyboard controls */

    document.addEventListener(
        "keydown",
        handleKeyboard
    );

    document.addEventListener(
        "keyup",
        event => {

            if (
                event.code === "Space" &&
                fightState.active
            ) {

                stopBlock();

            }

        }
    );

}

/* =========================================================
   SCREEN SYSTEM
   ========================================================= */

function openScreen(screenName) {

    if (fightState.active && screenName !== "fight") {

        showToast(
            "Finish the fight first.",
            "warning"
        );

        return;
    }

    const screens = {

        home: "home-screen",
        fighters: "fighter-select-screen",
        "fighter-select": "fighter-select-screen",
        "fighter-details": "fighter-details-screen",
        arena: "arena-select-screen",
        fight: "fight-screen",
        tournament: "tournament-screen",
        training: "training-screen",
        shop: "shop-screen",
        profile: "profile-screen",
        settings: "settings-screen",
        result: "result-screen"

    };

    const targetId = screens[screenName];

    if (!targetId) return;

    $all(".game-screen").forEach(screen => {

        screen.classList.add("hidden");
        screen.classList.remove("active");

    });

    const target = document.getElementById(targetId);

    if (!target) return;

    target.classList.remove("hidden");
    target.classList.add("active");

    currentScreen = screenName;

    updateNavigation(screenName);

    if (screenName === "profile") {
        updateProfile();
    }

    if (screenName === "fighters") {
        renderFighters();
    }

    if (screenName === "shop") {
        renderShop();
    }

    if (screenName === "settings") {
        updateSettingsUI();
    }
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function updateNavigation(screen) {

    $all(".bottom-nav-item").forEach(button => {

        button.classList.remove("active");

        const nav = button.dataset.nav;

        if (
            nav === screen ||
            (screen === "fighter-select" && nav === "fighters")
        ) {

            button.classList.add("active");

        }

    });

}

/* =========================================================
   LANGUAGE
   ========================================================= */

function setLanguage(language) {

    if (!TRANSLATIONS[language]) return;

    gameState.language = language;

    saveGame();

    $("#language-screen").classList.add("hidden");

    $("#app").classList.remove("hidden");

    applyLanguage(language);

    updateSettingsUI();

    showToast(
        "Language changed.",
        "success"
    );
}

function applyLanguage(language) {

    const dictionary = TRANSLATIONS[language];

    if (!dictionary) return;

    document.documentElement.lang = language;

    document.documentElement.dir =
        language === "ar"
            ? "rtl"
            : "ltr";

    $all("[data-i18n]").forEach(element => {

        const key = element.dataset.i18n;

        if (dictionary[key]) {

            element.textContent = dictionary[key];

        }

    });

    updateSettingsUI();
}

/* =========================================================
   FIGHTER RENDER
   ========================================================= */

function renderFighters(filter = "all") {

    const grid = $("#fighter-grid");

    if (!grid) return;

    grid.innerHTML = "";

    let fighters = FIGHTERS;

    if (filter !== "all") {

        fighters = FIGHTERS.filter(
            fighter => fighter.rarity === filter
        );

    }

    fighters.forEach(fighter => {

        const unlocked =
            gameState.player.unlockedFighters.includes(
                fighter.id
            );

        const card = document.createElement("div");

        card.className = "fighter-card";

        card.innerHTML = `

            <div class="fighter-card-image">
                ${fighter.avatar}
            </div>

            <div
                class="fighter-card-rarity"
                data-rarity="${fighter.rarity}">
                ${fighter.rarity.toUpperCase()}
            </div>

            <div class="fighter-card-info">

                <h3>
                    ${fighter.name}
                </h3>

                <p class="fighter-card-style">
                    ${fighter.style}
                </p>

                <p class="fighter-card-style">
                    ${unlocked ? "✓ Unlocked" : "🔒 Locked"}
                </p>

            </div>
        `;

        card.addEventListener("click", () => {

            showFighterDetails(fighter.id);

        });

        grid.appendChild(card);

    });
}

/* =========================================================
   FIGHTER DETAILS
   ========================================================= */

function showFighterDetails(id) {

    const fighter = getFighter(id);

    if (!fighter) return;

    selectedFighterId = id;

    $("#fighter-large-avatar").textContent =
        fighter.avatar;

    $("#fighter-detail-name").textContent =
        fighter.name;

    $("#fighter-detail-style").textContent =
        fighter.style;

    $("#fighter-rarity").textContent =
        fighter.rarity.toUpperCase();

    updateStat(
        "health",
        fighter.health
    );

    updateStat(
        "strength",
        fighter.strength
    );

    updateStat(
        "speed",
        fighter.speed
    );

    updateStat(
        "defense",
        fighter.defense
    );

    updateStat(
        "stamina",
        fighter.stamina
    );

    openScreen("fighter-details");
}

function updateStat(name, value) {

    const valueElement =
        $(`#detail-${name}-value`);

    const bar =
        $(`#detail-${name}-bar`);

    if (valueElement) {
        valueElement.textContent = value;
    }

    if (bar) {

        const percentage =
            Math.min(100, value);

        setTimeout(() => {

            bar.style.width =
                `${percentage}%`;

        }, 30);

    }
}

/* =========================================================
   FIGHTER SELECTION
   ========================================================= */

function confirmFighterSelection() {

    if (!selectedFighterId) return;

    const unlocked =
        gameState.player.unlockedFighters.includes(
            selectedFighterId
        );

    if (!unlocked) {

        showToast(
            "This fighter is locked.",
            "warning"
        );

        return;
    }

    gameState.player.selectedFighter =
        selectedFighterId;

    saveGame();

    selectedFighterId = null;

    openScreen("arena");

    updatePlayerUI();
}

/* =========================================================
   ARENA
   ========================================================= */

function selectArena(id) {

    const arena = ARENAS.find(
        item => item.id === id
    );

    if (!arena) return;

    if (!isArenaUnlocked(id)) {

        showToast(
            `Arena locked: ${arena.requirement}`,
            "warning"
        );

        return;
    }

    selectedArenaId = id;

    $all(".arena-card").forEach(card => {

        card.classList.remove("selected");

    });

    const selected =
        document.querySelector(
            `.arena-card[data-arena="${id}"]`
        );

    selected?.classList.add("selected");

    gameState.player.selectedArena = id;

    saveGame();
}

function isArenaUnlocked(id) {

    return gameState.player.unlockedArenas.includes(id);

}

/* =========================================================
   START FIGHT
   ========================================================= */

function startFight() {

    const player =
        getFighter(
            gameState.player.selectedFighter
        );

    if (!player) {

        showToast(
            "Select a fighter first.",
            "warning"
        );

        openScreen("fighters");

        return;
    }

    currentEnemy = createEnemy();

    const playerStats =
        calculateFighterStats(player);

    const enemyStats =
        calculateFighterStats(currentEnemy);

    fightState = {

        active: true,

        playerHP: playerStats.health,
        enemyHP: enemyStats.health,

        playerMaxHP: playerStats.health,
        enemyMaxHP: enemyStats.health,

        playerStamina: playerStats.stamina,
        enemyStamina: enemyStats.stamina,

        timer: 180,
        round: 1,

        blocking: false,
        dodging: false,

        specialCooldown: 0,

        enemyActionTimer: null,
        timerInterval: null
    };

    setupFightUI(
        player,
        currentEnemy
    );

    openScreen("fight");

    addCombatLog(
        `${player.name} vs ${currentEnemy.name}!`
    );

    startFightTimer();

    startEnemyAI();
}

/* =========================================================
   ENEMY CREATION
   ========================================================= */

function createEnemy() {

    const available =
        FIGHTERS.filter(
            fighter =>
                fighter.id !==
                gameState.player.selectedFighter
        );

    const random =
        available[
            Math.floor(
                Math.random() * available.length
            )
        ];

    return {
        ...random
    };
}

/* =========================================================
   FIGHTER STATS
   ========================================================= */

function calculateFighterStats(fighter) {

    const training =
        gameState.player.training;

    let strength =
        fighter.strength;

    let speed =
        fighter.speed;

    let defense =
        fighter.defense;

    let stamina =
        fighter.stamina;

    let health =
        fighter.health;

    if (
        fighter.id ===
        gameState.player.selectedFighter
    ) {

        strength +=
            training.strength * 2;

        speed +=
            training.speed * 2;

        defense +=
            training.defense * 2;

        stamina +=
            training.stamina * 2;

        health +=
            training.stamina * 2;

    }

    return {
        health,
        strength,
        speed,
        defense,
        stamina
    };
}

/* =========================================================
   FIGHT UI
   ========================================================= */

function setupFightUI(player, enemy) {

    $("#battle-player-name").textContent =
        player.name;

    $("#battle-enemy-name").textContent =
        enemy.name;

    $("#battle-player-level").textContent =
        `LVL ${gameState.player.level}`;

    $("#battle-enemy-level").textContent =
        `LVL ${Math.max(
            1,
            gameState.player.level +
            Math.floor(Math.random() * 3) - 1
        )}`;

    $("#player-battle-avatar").textContent =
        player.avatar;

    $("#enemy-battle-avatar").textContent =
        enemy.avatar;

    updateFightBars();
}

/* =========================================================
   PLAYER ATTACK
   ========================================================= */

function playerAttack(type) {

    if (!fightState.active) return;

    if (fightState.playerHP <= 0) return;

    if (fightState.playerStamina <= 0) {

        addCombatLog(
            "You are too tired!"
        );

        return;
    }

    const fighter =
        getFighter(
            gameState.player.selectedFighter
        );

    if (!fighter) return;

    let damage = 0;
    let staminaCost = 0;

    if (type === "punch") {

        damage =
            calculateDamage(
                fighter,
                currentEnemy,
                "punch"
            );

        staminaCost = 7;

        addCombatLog(
            `${fighter.name} lands a punch!`
        );

    }

    if (type === "kick") {

        damage =
            calculateDamage(
                fighter,
                currentEnemy,
                "kick"
            );

        staminaCost = 12;

        addCombatLog(
            `${fighter.name} lands a kick!`
        );

    }

    if (type === "special") {

        if (fightState.specialCooldown > 0) {

            addCombatLog(
                "Special attack is cooling down!"
            );

            return;
        }

        damage =
            calculateDamage(
                fighter,
                currentEnemy,
                "special"
            );

        staminaCost = 25;

        fightState.specialCooldown = 5;

        addCombatLog(
            `${fighter.name} uses SPECIAL ATTACK!`
        );

    }

    fightState.enemyHP =
        Math.max(
            0,
            fightState.enemyHP - damage
        );

    fightState.playerStamina =
        Math.max(
            0,
            fightState.playerStamina -
            staminaCost
        );

    updateFightBars();

    if (fightState.enemyHP <= 0) {

        finishFight(true);

    }

}

/* =========================================================
   DAMAGE CALCULATION
   ========================================================= */

function calculateDamage(
    attacker,
    defender,
    attackType
) {

    let stats =
        calculateFighterStats(attacker);

    let defenderStats =
        calculateFighterStats(defender);

    let base = 0;

    if (attackType === "punch") {

        base =
            stats.strength * 0.30 +
            stats.speed * 0.10;

    }

    if (attackType === "kick") {

        base =
            stats.strength * 0.24 +
            stats.speed * 0.20;

    }

    if (attackType === "special") {

        base =
            stats.strength * 0.55 +
            stats.speed * 0.25;

    }

    const defense =
        defenderStats.defense * 0.12;

    let damage =
        base - defense;

    const random =
        0.8 + Math.random() * 0.45;

    damage *= random;

    if (Math.random() < 0.12) {

        damage *= 1.7;

        addCombatLog(
            "💥 CRITICAL HIT!"
        );

    }

    return Math.max(
        2,
        Math.round(damage)
    );
}

/* =========================================================
   BLOCK
   ========================================================= */

function startBlock() {

    if (!fightState.active) return;

    fightState.blocking = true;

    addCombatLog(
        "🛡️ Blocking!"
    );
}

function stopBlock() {

    fightState.blocking = false;

}

/* =========================================================
   DODGE
   ========================================================= */

function playerDodge() {

    if (!fightState.active) return;

    if (fightState.playerStamina < 15) {

        addCombatLog(
            "Not enough stamina to dodge."
        );

        return;
    }

    fightState.playerStamina -= 15;

    fightState.dodging = true;

    addCombatLog(
        "↔️ Dodge!"
    );

    setTimeout(() => {

        fightState.dodging = false;

    }, 700);

    updateFightBars();
}

/* =========================================================
   ENEMY AI
   ========================================================= */

function startEnemyAI() {

    stopEnemyAI();

    fightState.enemyActionTimer =
        setInterval(() => {

            if (!fightState.active) return;

            enemyTurn();

        }, 1300 + Math.random() * 900);
}

function stopEnemyAI() {

    if (fightState.enemyActionTimer) {

        clearInterval(
            fightState.enemyActionTimer
        );

        fightState.enemyActionTimer = null;
    }
}

function enemyTurn() {

    if (!currentEnemy) return;

    const roll = Math.random();

    if (roll < 0.10) {

        enemyBlock();

        return;
    }

    if (roll < 0.20) {

        enemyRecover();

        return;
    }

    if (roll < 0.42) {

        enemyKick();

        return;
    }

    if (roll < 0.92) {

        enemyPunch();

        return;
    }

    enemySpecial();
}

/* =========================================================
   ENEMY ATTACKS
   ========================================================= */

function enemyPunch() {

    if (fightState.enemyStamina < 7) {

        enemyRecover();

        return;
    }

    dealEnemyDamage("punch", 7);
}

function enemyKick() {

    if (fightState.enemyStamina < 12) {

        enemyRecover();

        return;
    }

    dealEnemyDamage("kick", 12);
}

function enemySpecial() {

    if (fightState.enemyStamina < 25) {

        enemyRecover();

        return;
    }

    dealEnemyDamage("special", 25);
}

function dealEnemyDamage(type, staminaCost) {

    const player =
        getFighter(
            gameState.player.selectedFighter
        );

    if (!player) return;

    let damage =
        calculateDamage(
            currentEnemy,
            player,
            type
        );

    fightState.enemyStamina =
        Math.max(
            0,
            fightState.enemyStamina -
            staminaCost
        );

    if (fightState.dodging) {

        addCombatLog(
            "⚡ You dodged the attack!"
        );

        updateFightBars();

        return;
    }

    if (fightState.blocking) {

        damage =
            Math.round(
                damage * 0.3
            );

        addCombatLog(
            `🛡️ Blocked! ${damage} damage`
        );

    } else {

        addCombatLog(
            `${currentEnemy.name} attacks! -${damage} HP`
        );

    }

    fightState.playerHP =
        Math.max(
            0,
            fightState.playerHP - damage
        );

    updateFightBars();

    if (fightState.playerHP <= 0) {

        finishFight(false);

    }
}

/* =========================================================
   ENEMY BLOCK
   ========================================================= */

function enemyBlock() {

    addCombatLog(
        `${currentEnemy.name} is blocking!`
    );

    currentEnemy.isBlocking = true;

    setTimeout(() => {

        if (currentEnemy) {
            currentEnemy.isBlocking = false;
        }

    }, 900);
}

/* =========================================================
   ENEMY RECOVER
   ========================================================= */

function enemyRecover() {

    currentEnemy.enemyRecovering = true;

    fightState.enemyStamina =
        Math.min(
            100,
            fightState.enemyStamina + 18
        );

    addCombatLog(
        `${currentEnemy.name} recovers stamina.`
    );

    updateFightBars();

    setTimeout(() => {

        if (currentEnemy) {
            currentEnemy.enemyRecovering = false;
        }

    }, 500);
}

/* =========================================================
   FIGHT TIMER
   ========================================================= */

function startFightTimer() {

    stopFightTimer();

    updateTimerUI();

    fightState.timerInterval =
        setInterval(() => {

            if (!fightState.active) return;

            fightState.timer--;

            if (
                fightState.specialCooldown > 0
            ) {

                fightState.specialCooldown--;

            }

            regenerateStamina();

            updateTimerUI();

            if (fightState.timer <= 0) {

                finishFight(
                    fightState.playerHP >
                    fightState.enemyHP
                );

            }

        }, 1000);
}

function stopFightTimer() {

    if (fightState.timerInterval) {

        clearInterval(
            fightState.timerInterval
        );

        fightState.timerInterval = null;
    }
}

/* =========================================================
   STAMINA REGEN
   ========================================================= */

function regenerateStamina() {

    if (!fightState.blocking) {

        fightState.playerStamina =
            Math.min(
                100,
                fightState.playerStamina + 1.5
            );

    }

    fightState.enemyStamina =
        Math.min(
            100,
            fightState.enemyStamina + 1
        );

    updateFightBars();
}

/* =========================================================
   TIMER UI
   ========================================================= */

function updateTimerUI() {

    const minutes =
        Math.floor(
            fightState.timer / 60
        );

    const seconds =
        fightState.timer % 60;

    const formatted =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    $("#fight-timer").textContent =
        formatted;
}

/* =========================================================
   FIGHT BARS
   ========================================================= */

function updateFightBars() {

    const playerHPPercent =
        (
            fightState.playerHP /
            fightState.playerMaxHP
        ) * 100;

    const enemyHPPercent =
        (
            fightState.enemyHP /
            fightState.enemyMaxHP
        ) * 100;

    $("#player-health-bar").style.width =
        `${Math.max(0, playerHPPercent)}%`;

    $("#enemy-health-bar").style.width =
        `${Math.max(0, enemyHPPercent)}%`;

    $("#player-stamina-bar").style.width =
        `${fightState.playerStamina}%`;

    $("#enemy-stamina-bar").style.width =
        `${fightState.enemyStamina}%`;

    $("#player-hp-text").textContent =
        `${Math.max(
            0,
            Math.ceil(fightState.playerHP)
        )} / ${fightState.playerMaxHP}`;

    $("#enemy-hp-text").textContent =
        `${Math.max(
            0,
            Math.ceil(fightState.enemyHP)
        )} / ${fightState.enemyMaxHP}`;
}

/* =========================================================
   COMBAT LOG
   ========================================================= */

function addCombatLog(message) {

    const log = $("#combat-log");

    if (!log) return;

    const paragraph =
        document.createElement("p");

    paragraph.textContent = message;

    log.innerHTML = "";

    log.appendChild(paragraph);

}

/* =========================================================
   FINISH FIGHT
   ========================================================= */

function finishFight(playerWon) {

    if (!fightState.active) return;

    fightState.active = false;

    stopFightTimer();
    stopEnemyAI();

    gameState.player.fights++;

    let rewardXP = 20;
    let rewardCoins = 50;

    if (playerWon) {

        gameState.player.wins++;

        rewardXP = 75;
        rewardCoins = 150;

        addXP(rewardXP);

        gameState.player.coins +=
            rewardCoins;

    } else {

        gameState.player.losses++;

        rewardXP = 20;
        rewardCoins = 35;

        addXP(rewardXP);

        gameState.player.coins +=
            rewardCoins;
    }

    saveGame();

    showResult(
        playerWon,
        rewardXP,
        rewardCoins
    );

    updatePlayerUI();
    updateProfile();
}

/* =========================================================
   RESULT
   ========================================================= */

function showResult(
    won,
    xp,
    coins
) {

    $("#result-icon").textContent =
        won ? "🏆" : "🥊";

    $("#result-title").textContent =
        won
            ? getText("victory")
            : getText("defeat");

    $("#result-message").textContent =
        won
            ? "Excellent fight!"
            : "Train harder and come back!";

    $("#reward-xp").textContent =
        `+${xp} XP`;

    $("#reward-coins").textContent =
        `+${coins}`;

    openScreen("result");
}

/* =========================================================
   XP SYSTEM
   ========================================================= */

function addXP(amount) {

    gameState.player.xp += amount;

    while (
        gameState.player.xp >=
        xpRequired(
            gameState.player.level
        )
    ) {

        gameState.player.xp -=
            xpRequired(
                gameState.player.level
            );

        gameState.player.level++;

        showToast(
            `🎉 Level ${gameState.player.level}!`,
            "success"
        );

        unlockLevelRewards();
    }

    saveGame();

    updatePlayerUI();
}

function xpRequired(level) {

    return 100 + (
        (level - 1) * 50
    );
}

/* =========================================================
   LEVEL REWARDS
   ========================================================= */

function unlockLevelRewards() {

    const level =
        gameState.player.level;

    if (
        level >= 5 &&
        !gameState.player.unlockedArenas.includes("night")
    ) {

        gameState.player.unlockedArenas.push(
            "night"
        );

        showToast(
            "🌃 Night Arena unlocked!",
            "success"
        );
    }

    if (
        level >= 10 &&
        !gameState.player.unlockedArenas.includes("neon")
    ) {

        gameState.player.unlockedArenas.push(
            "neon"
        );

        showToast(
            "🌆 Neon Arena unlocked!",
            "success"
        );
    }
}

/* =========================================================
   PLAYER UI
   ========================================================= */

function updatePlayerUI() {

    const player =
        gameState.player;

    $("#coin-count").textContent =
        player.coins;

    $("#top-player-name").textContent =
        player.name;

    $("#top-player-level").textContent =
        player.level;

    const required =
        xpRequired(player.level);

    const xpPercent =
        (player.xp / required) * 100;

    $("#top-xp-progress").style.width =
        `${xpPercent}%`;

    const profileLevel =
        $("#profile-level");

    if (profileLevel) {
        profileLevel.textContent =
            player.level;
    }
}

/* =========================================================
   PROFILE
   ========================================================= */

function updateProfile() {

    const player =
        gameState.player;

    $("#profile-player-name").textContent =
        player.name;

    $("#profile-level").textContent =
        player.level;

    $("#profile-wins").textContent =
        player.wins;

    $("#profile-losses").textContent =
        player.losses;

    $("#profile-fights").textContent =
        player.fights;

    const winRate =
        player.fights === 0
            ? 0
            : Math.round(
                player.wins /
                player.fights *
                100
            );

    $("#profile-winrate").textContent =
        `${winRate}%`;

    const required =
        xpRequired(player.level);

    $("#profile-xp-text").textContent =
        `${player.xp} / ${required}`;

    $("#profile-xp-fill").style.width =
        `${Math.min(
            100,
            player.xp / required * 100
        )}%`;
}

/* =========================================================
   TRAINING
   ========================================================= */

function trainStat(stat) {

    const validStats = [
        "strength",
        "speed",
        "defense",
        "stamina"
    ];

    if (!validStats.includes(stat)) {
        return;
    }

    const cost = 100;

    if (
        gameState.player.coins <
        cost
    ) {

        showToast(
            "Not enough coins.",
            "warning"
        );

        return;
    }

    gameState.player.coins -= cost;

    gameState.player.training[stat]++;

    saveGame();

    updatePlayerUI();

    showToast(
        `${stat.toUpperCase()} +1`,
        "success"
    );
}

/* =========================================================
   SHOP
   ========================================================= */

function renderShop(type = "fighters") {

    const grid =
        $("#shop-grid");

    if (!grid) return;

    grid.innerHTML = "";

    let items =
        SHOP_ITEMS;

    if (type === "fighters") {

        items =
            SHOP_ITEMS.filter(
                item => item.type === "fighter"
            );

    } else if (type === "arenas") {

        items =
            SHOP_ITEMS.filter(
                item => item.type === "arena"
            );

    } else if (type === "abilities") {

        items =
            SHOP_ITEMS.filter(
                item => item.type === "ability"
            );

    }

    items.forEach(item => {

        const card =
            document.createElement("div");

        card.className =
            "shop-card";

        const owned =
            isShopItemOwned(item);

        card.innerHTML = `

            <div class="shop-card-image">
                ${item.icon}
            </div>

            <h3>
                ${item.name}
            </h3>

            <p>
                ${owned ? "✓ Owned" : `${item.price} 🪙`}
            </p>

            <button
                class="shop-buy-button"
                ${owned ? "disabled" : ""}
            >
                ${owned ? "OWNED" : "BUY"}
            </button>

        `;

        const button =
            card.querySelector(
                ".shop-buy-button"
            );

        if (!owned) {

            button.addEventListener(
                "click",
                () => buyItem(item)
            );

        }

        grid.appendChild(card);

    });
}

function isShopItemOwned(item) {

    if (item.type === "fighter") {

        return gameState.player
            .unlockedFighters
            .includes(item.id);

    }

    if (item.type === "arena") {

        return gameState.player
            .unlockedArenas
            .includes(item.id);

    }

    if (item.type === "ability") {

        return gameState.player
            .unlockedAbilities
            .includes(item.id);

    }

    return false;
}

function buyItem(item) {

    if (
        gameState.player.coins <
        item.price
    ) {

        showToast(
            "Not enough coins.",
            "warning"
        );

        return;
    }

    gameState.player.coins -=
        item.price;

    if (item.type === "fighter") {

        gameState.player
            .unlockedFighters
            .push(item.id);

    }

    if (item.type === "arena") {

        gameState.player
            .unlockedArenas
            .push(item.id);

    }

    if (item.type === "ability") {

        gameState.player
            .unlockedAbilities
            .push(item.id);

    }

    saveGame();

    updatePlayerUI();

    renderShop();

    showToast(
        `${item.name} unlocked!`,
        "success"
    );
}

/* =========================================================
   TOURNAMENT
   ========================================================= */

function startTournament() {

    const unlocked =
        gameState.player
            .unlockedFighters;

    if (unlocked.length < 2) {

        showToast(
            "Unlock more fighters first.",
            "warning"
        );

        return;
    }

    gameState.tournament = {

        active: true,
        stage: "quarterFinals",
        wins: 0

    };

    saveGame();

    showToast(
        "Tournament started!",
        "success"
    );

    openScreen("fighters");
}

/* =========================================================
   RESET PROGRESS
   ========================================================= */

function showResetConfirmation() {

    $("#confirm-dialog")
        .classList.remove("hidden");

    $("#confirm-title").textContent =
        "Reset Progress?";

    $("#confirm-message").textContent =
        "All your game progress will be deleted.";

    $("#confirm-cancel").onclick =
        closeConfirm;

    $("#confirm-ok").onclick =
        resetGame;
}

function closeConfirm() {

    $("#confirm-dialog")
        .classList.add("hidden");

}

function resetGame() {

    localStorage.removeItem(
        "mmaXSave"
    );

    gameState =
        structuredClone(
            DEFAULT_STATE
        );

    closeConfirm();

    updatePlayerUI();
    updateProfile();
    renderFighters();
    renderShop();

    showToast(
        "Progress reset.",
        "success"
    );
}

/* =========================================================
   CONTROLS
   ========================================================= */

function showControls() {

    showModal(`

        <h2>🎮 Controls</h2>

        <div style="
            display:grid;
            gap:12px;
            margin-top:20px;
        ">

            <div>
                <strong>👊 A</strong>
                <br>
                Punch
            </div>

            <div>
                <strong>🦵 S</strong>
                <br>
                Kick
            </div>

            <div>
                <strong>⚡ D</strong>
                <br>
                Special
            </div>

            <div>
                <strong>🛡️ Space</strong>
                <br>
                Block
            </div>

            <div>
                <strong>↔️ W</strong>
                <br>
                Dodge
            </div>

        </div>

    `);
}

function handleKeyboard(event) {

    if (!fightState.active) return;

    const key =
        event.key.toLowerCase();

    if (key === "a") {
        playerAttack("punch");
    }

    if (key === "s") {
        playerAttack("kick");
    }

    if (key === "d") {
        playerAttack("special");
    }

    if (key === "w") {
        playerDodge();
    }

    if (event.code === "Space") {

        event.preventDefault();

        startBlock();
    }
}

/* =========================================================
   FIGHT MENU
   ========================================================= */

function showFightMenu() {

    showModal(`

        <h2>🥊 Fight Menu</h2>

        <p style="
            color:#888;
            margin-top:10px;
        ">
            The fight is currently active.
        </p>

        <button
            id="resume-fight"
            class="primary-action-button"
            style="
                width:100%;
                margin-top:20px;
            ">
            Resume Fight
        </button>

    `);

    $("#resume-fight")?.addEventListener(
        "click",
        closeModal
    );
}

/* =========================================================
   MODAL
   ========================================================= */

function showModal(content) {

    $("#modal-content").innerHTML =
        content;

    $("#modal-overlay")
        .classList.remove("hidden");

}

function closeModal() {

    $("#modal-overlay")
        .classList.add("hidden");

}

$("#modal-close")?.addEventListener(
    "click",
    closeModal
);

$("#modal-overlay")?.addEventListener(
    "click",
    event => {

        if (
            event.target.id ===
            "modal-overlay"
        ) {

            closeModal();

        }

    }
);

/* =========================================================
   TOAST
   ========================================================= */

function showToast(
    message,
    type = "normal"
) {

    const container =
        $("#toast-container");

    if (!container) return;

    const toast =
        document.createElement("div");

    toast.className =
        `toast ${type}`;

    toast.textContent =
        message;

    container.appendChild(toast);

    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transform =
            "translateX(20px)";

        setTimeout(() => {

            toast.remove();

        }, 250);

    }, 2500);
}

/* =========================================================
   SETTINGS UI
   ========================================================= */

function updateSettingsUI() {

    const language =
        gameState.language;

    const names = {

        uz: "O‘zbek tili",
        en: "English",
        tr: "Türkçe",
        es: "Español",
        ar: "العربية",
        "pt-BR": "Português"

    };

    if ($("#current-language")) {

        $("#current-language")
            .textContent =
            names[language] ||
            "O‘zbek tili";

    }

    if ($("#sound-toggle")) {

        $("#sound-toggle").checked =
            gameState.settings.sound;

    }

    if ($("#music-toggle")) {

        $("#music-toggle").checked =
            gameState.settings.music;

    }
}

/* =========================================================
   TEXT HELPER
   ========================================================= */

function getText(key) {

    const language =
        gameState.language || "uz";

    return (
        TRANSLATIONS[language]?.[key] ||
        TRANSLATIONS.en[key] ||
        key
    );
}

/* =========================================================
   FIND FIGHTER
   ========================================================= */

function getFighter(id) {

    return FIGHTERS.find(
        fighter => fighter.id === id
    );

}

/* =========================================================
   SAVE BEFORE PAGE CLOSE
   ========================================================= */

window.addEventListener(
    "beforeunload",
    saveGame
);

/* =========================================================
   PREVENT ACCIDENTAL DOUBLE ACTION
   ========================================================= */

let lastActionTime = 0;

function canPerformAction() {

    const now =
        Date.now();

    if (
        now - lastActionTime <
        100
    ) {

        return false;

    }

    lastActionTime = now;

    return true;
}

/* =========================================================
   DEBUG API
   ========================================================= */

window.MMAX = {

    state: gameState,

    fighters: FIGHTERS,

    arenas: ARENAS,

    save: saveGame,

    reset: resetGame,

    addCoins(amount) {

        gameState.player.coins +=
            Number(amount) || 0;

        saveGame();

        updatePlayerUI();

    },

    addXP(amount) {

        addXP(
            Number(amount) || 0
        );

    }

};

/* =========================================================
   GAME READY
   ========================================================= */

console.log(
    "%cMMA X",
    "font-size:30px;font-weight:bold;color:#e50914"
);

console.log(
    "MMA X Game Engine initialized."
);
