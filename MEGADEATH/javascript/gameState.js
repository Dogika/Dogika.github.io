let canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = g_screenWidth;
    canvas.height = g_screenHeight;
let ctx = canvas.getContext("2d");

let g_gameLoaded = false;

let g_screenCenterFocus_x = G_SCREEN_CENTER_FOCUS_START_X;
let g_screenCenterFocus_y = G_SCREEN_CENTER_FOCUS_START_Y;
let g_screenBoundLeft = -g_screenWidth*0.5;
let g_screenBoundRight = g_screenWidth*0.5;
let g_screenBoundTop = -g_screenHeight*0.5;
let g_screenBoundBottom = g_screenHeight*0.5;

let g_paragraph = new Paragraph(g_screenWidth*0.5, g_screenHeight*0.7, {
    color: Color.WHITE,
    align: "center",
    font: "40px VCR OSD Mono"
});

let g_bloodSplatters = [];

let g_patternInstances = [];
let g_patternInstanceIDs = 0;
let g_enemyInstances = [];
let g_enemyInstanceIDs = 0;
let g_playerBulletInstances = [];
let g_playerBulletInstanceIDs = 0;

let g_consumableInstances = [];

let g_spawnPortals = [];

let g_playerBulletGradients = [];

let g_playerHitscanInstances = [];
let g_playerFadinHitscans = [];

let g_magnetInstances = [];
let g_coinInstances = [];

let g_screenShakeMagnitude = 0;

let g_loopColors = [];
let g_loopColorIDs = 0;

let g_timeline; // Event[]
let g_nextEvent_ptr;
let g_previousTime = 0;
let g_currentTime = 0;
let g_gameWindow = -1;
let g_gameLost = false;
let g_stats = {
    iTimeUsed : 0,
    damageDealt: 0,
    enemiesKilled: 0
};

let g_target = {
    x: 0,
    y: 0
};

let g_currentRoom;
let g_currentLevel;

let g_lightSource = [0, 0, 200];
let g_lightOn = true;

let g_bosses = [];
let g_timeSinceLastBossAttack;

let g_shootingLaser = false;

let g_titleAlpha = 1;

let g_timeDialation = 1;
let g_invTimeDialation = 1/g_timeDialation;

const g_mouse = {
    x: 0, y: 0,
    down: false,
    down2: false
};

let g_keyboard = {
    w: false,
    a: false,
    s: false,
    d: false,
    
    p: false,
    l: false,
    ";": false,
    "'": false
};
let g_trigger = {};

let g_bgm = {
    outOfCombat: new Howl({
        src: ['https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/0-1 Clean.wav'],
        loop: true
    }),
    inCombat: new Howl({
        src: ['https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/0-1.wav'],
        loop: true
    }),
    title: new Howl({
        src: ['https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/ezyZip.mp3'],
        loop: true
    })
};

let soundEffects = {
    revolverShoot: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/Shoot1.wav'),
    nailgunSpin: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/MachineGunSpin.wav'),
    nailgunFire: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/MachineGun2.wav'),
    shotgunFire: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/Steampunk%20Weapons%20-%20Shotgun%202%20-%20Shot%20-%2001.wav'),
    dash: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/Dodge3.wav'),
    step: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/footstep_heavy1.wav'),
    hit: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/punch_grit_wet_impact_05.wav'),
    hurt: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/Terraria%20Male%20Damage%20Sound%20Effect.wav'),
    explosion: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/ThatExplosionSound.wav'),
    pickup: new Audio('https://raw.githubusercontent.com/Dogika/compsci-contest-2025/refs/heads/main/ipucss.wav')
}

let g_volumeTotal = 0.5;
let g_volumeMusic = 0.5*g_volumeTotal;
let g_volumeSound = 0.5*g_volumeTotal;

let g_paused = false;
let g_pauseDifference = 0;
let g_pauseStart;

function playSound(sound, volume=1) {
    sound.volume = volume;
    sound.currentTime = 0;
    sound.play();
}


let g_camera = {
    x: g_screenWidth * 0.5 - G_PLAYER_START_X * G_CAMERA_CENTER_PERCENT - g_screenCenterFocus_x * (1-G_CAMERA_CENTER_PERCENT),
    y: g_screenHeight * 0.5 - G_PLAYER_START_Y * G_CAMERA_CENTER_PERCENT - g_screenCenterFocus_y * (1-G_CAMERA_CENTER_PERCENT),
    shakeEnergy: 0
}

let g_settings = {
    timer: false,
    leftHandedModed: false
}

let g_player = {};

let g_unlocks = {};

let g_buttonsList = [];

let g_inCombat = false;

function setTimeDialation(newTimeDialation) {
    return; // no
    g_timeDialation = newTimeDialation;
    g_invTimeDialation = 1/newTimeDialation;
    bgm.outOfCombat.playbackRate = newTimeDialation;
    bgm.inCombat.playbackRate = newTimeDialation;
}

function resetGame() {
    
    g_bgm.outOfCombat.volume(g_volumeMusic);
    g_bgm.inCombat.volume(0);
    
    g_bgm.outOfCombat.seek(0);
    g_bgm.inCombat.seek(0);
    
    playSound(soundEffects.step, 0);
    soundEffects.step.playbackRate = 2;
    
    g_titleAlpha = 1;
    g_bosses = [];
    
    g_currentLevel = TUTORIAL;
    let newRoom_i = Math.floor((G_PLAYER_START_X + g_screenWidth*0.5)/g_screenWidth);
    let newRoom_j = Math.floor((G_PLAYER_START_Y + g_screenHeight*0.5)/g_screenHeight);
    g_currentRoom = g_currentLevel[newRoom_j][newRoom_i];
    g_screenCenterFocus_x = newRoom_i * g_screenWidth;
    g_screenCenterFocus_y = newRoom_j * g_screenHeight;
    
    g_paragraph.align = "center";
    g_paragraph.x = g_screenWidth*0.5;
    g_paragraph.y = g_screenHeight*0.7;
    
    g_nextEvent_ptr = undefined;
    g_timeline = [];
    g_patternInstances = [];
    g_patternInstanceIDs = 0;
    g_enemyInstances = [];
    g_enemyInstanceIDs = 0;
    g_playerBulletInstances = [];
    g_magnetInstances = [];
    g_playerFadinHitscans = [];
    g_spawnPortals = [];
    g_player = new Player(G_PLAYER_START_X, G_PLAYER_START_Y, G_PLAYER_START_VX, G_PLAYER_START_VY);
    g_player.room_i = newRoom_i;
    g_player.room_j = newRoom_j;
    g_boss_ptr = undefined;
    
    for (let i = 0; i < g_currentLevel.length; i++)
    for (let j = 0; j < g_currentLevel[0].length; j++) {
        let room = g_currentLevel[i][j];
        
        if (!room) continue;
        
        room.reset();
    }
    
    g_paragraph.textObjects = [];
    
    g_timeline.push(new Event(g_currentTime, function() {
        g_paragraph.textObjects.push(new TypedText("Goal: Find a weapon.", 0, 20));
    }));
    g_timeline.push(new Event(g_currentTime+120+500, function() {
        g_paragraph.textObjects.push(new TypedText("The glowing orbs", 0, 20));
        g_paragraph.textObjects.push(new TypedText("are weapons.", 0, 20));
    }));
}

function resetStats(stats=g_stats) {
    g_stats.iTimeUsed = 0;
    g_stats.damageDealt = 0;
    g_stats.enemiesKilled = 0;
};
