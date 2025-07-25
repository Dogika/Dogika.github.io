const G_BULLET_NAILGUN = new PlayerBulletType(13, 1.3, "triangle", 2, Color.WHITE, true, true, true, 1000, true, true, 8, 11, Color.CYAN);
const G_BULLET_SHOTGUN = new PlayerBulletType(100, 6, "circle", 1, Color.ORANGE, false, true, false, undefined, undefined, undefined, 10, 12, Color.ORANGE);

let g_weaponPistol = new Weapon("pistol", 490, 1, function() {
    playSound(soundEffects.revolverShoot, g_volumeSound)
    
    g_weaponPistol.lastUsed = g_currentTime;

    g_screenShakeMagnitude = 0.5;
    
    createPlayerHitscan(G_HITSCAN_BULLET, 0, 0);
});

let g_weaponNailgun = new Weapon("nailgun", 40, 0.01, function() {
    if (soundEffects.nailgunSpin.paused) 
        soundEffects.nailgunSpin.play();
    soundEffects.nailgunSpin.volume = 0.4*g_volumeSound;
    soundEffects.nailgunSpin.loop = true;
    
    playSound(soundEffects.nailgunFire, 0.6*g_volumeSound);
    
    g_weaponNailgun.lastUsed = g_currentTime;
    g_screenShakeMagnitude = 0.4;
    
    let [dx, dy] = MathHelper.setMagnitude(g_player.radius, [g_target.x - g_player.x, g_target.y - g_player.y]);
    
    let pos_x = g_player.x + dy;
    let pos_y = g_player.y - dx;
    
    let direction_x = dx / g_player.radius;
    let direction_y = dy / g_player.radius;
    
    let spreadAngle = Math.PI*0.25;
    let minSpeed = 0.81;
    let maxSpeed = 1.35;
    
    WeaponHelper.fireShots(G_BULLET_NAILGUN, pos_x, pos_y, direction_x, direction_y, 1, spreadAngle, minSpeed, maxSpeed);
    
        pos_x = g_player.x - dy;
        pos_y = g_player.y + dx;
    
    WeaponHelper.fireShots(G_BULLET_NAILGUN, pos_x, pos_y, direction_x, direction_y, 1, spreadAngle, minSpeed, maxSpeed);
});

let g_weaponLaser = new Weapon("laser", null, 0.4, function() {
    g_weaponLaser.lastUsed = g_currentTime;
    
    g_player.laser.type.width = G_HITSCAN_LASER.width;
    
    let [dx, dy] = MathHelper.normalize([g_player.vx, g_player.vy]);
    let eyePos_x = dx * 0.809016994375 + dy * 0.587785252292;
    let eyePos_y = dx * -0.587785252292 + dy * 0.809016994375;
    
    eyePos_x *= 5;
    eyePos_y *= 5;
    setPlayerHitscan(g_player.laser, eyePos_x, eyePos_y);
});

let g_weaponShotgun = new Weapon("shotgun", 920, 0.02, function() {
    
    playSound(soundEffects.shotgunFire, 0.5*g_volumeSound);
    
    g_weaponShotgun.lastUsed = g_currentTime;

    g_screenShakeMagnitude = 0.7;
    
    let [dx, dy] = MathHelper.setMagnitude(g_player.radius, [g_target.x - g_player.x, g_target.y - g_player.y]);
    
    let pos_x = g_player.x + dy;
    let pos_y = g_player.y + dx;
    
    let direction_x = dx / g_player.radius;
    let direction_y = dy / g_player.radius;
    
    const spreadAngle = Math.PI*0.4;
    
    WeaponHelper.fireShots(G_BULLET_SHOTGUN, pos_x, pos_y, direction_x, direction_y, 7, spreadAngle, 0.675);
});

const g_weaponList = {
    "pistol": g_weaponPistol,
    "nailgun": g_weaponNailgun,
    "laser": g_weaponLaser,
    "shotgun": g_weaponShotgun
}

const G_HITSCAN_LASER = new HitscanType(0.4, 5, Color.RED);

const G_HITSCAN_BULLET = new HitscanType(150, 3.6, Color.YELLOW, true); // has fade instead of insta disappearing

const RAINBOW_LASER = new Pattern(
    new BulletType([new BulletBehavior(0,    0.05,     0,  0, 0),
                    new BulletBehavior(1300, 0,        0,  0, 0),
                    new BulletBehavior(2000, 0,    0.001,  0, 0, true)
                    ], 1, 6 * G_PREFERED_SCALAR, "circle", 0, 1, Color.RED, 
    ), 8, 0, 2, 0.6, 1, 0, 0, 0, 30, false
);


const ARROW_SPRAY_1 = new Pattern(
    new BulletType([new BulletBehavior(1000, 0.15, 0, 0, 0)], 15, 5 * G_PREFERED_SCALAR, "triangle", 0, 1, Color.RED
    ), 1, 0, 3, 1, 1, 0, 0, 0, 0, true
);

const ARROW_SPRAY_2 = new Pattern(
    new BulletType([new BulletBehavior(1000, 0.15, 0, 0, 0)], 15, 5 * G_PREFERED_SCALAR, "diamond", 0, 1, Color.GREEN
    ), 1, 0, 4, 0.5, 1, 0, 0, 0, 0, true
);

const AREA_DENIAL = new Pattern(
    new BulletType([new BulletBehavior(1000, 0.05, 0, 0, 0)], 30, 5 * G_PREFERED_SCALAR, "circle", 0, 1, Color.WHITE
    ), 7, 0, 1, 0, 1, 0, 0, 0, 0, false
);

const SLAP_CANNON_1 = new Pattern(
    new BulletType([new BulletBehavior(0, 0.05, 0, 0, 0),
                    new BulletBehavior(1500, 0.2, 0, 0, 0, true)
                    ], 16, 5 * G_PREFERED_SCALAR, "triangle", 0, 1, Color.BLACK
    ), 1, Math.PI * 0.3, 1, 0, 4, 0.5, 0, 0, 0, true
);

const SLAP_CANNON_2 = new Pattern(
    new BulletType([new BulletBehavior(0, 0.05, 0, 0, 0),
                    new BulletBehavior(1500, 0.2, 0, 0, 0, true)
                    ], 16, 5 * G_PREFERED_SCALAR, "triangle", 0, 1, Color.WHITE
    ), 1, Math.PI * -0.3, 1, 0, 4, 0.5, 0, 0, 0, true
);

const SWIFT_DAGGERS = new Pattern(
    new BulletType([new BulletBehavior(0, 0.15, -0.0002, 0, 0),
                    new BulletBehavior(500, 0, 0, 0, 0),
                    new BulletBehavior(1000, 0.25, 0, 0, Math.PI*0.25),
                    new BulletBehavior(1200, 0.25, 0, 0, -Math.PI*0.5),
                    new BulletBehavior(1400, 0.25, 0, 0, Math.PI*0.5),
                    new BulletBehavior(1600, 0.25, 0, 0, -Math.PI*0.5),
                    new BulletBehavior(1800, 0.25, 0, 0, Math.PI*0.5),
                    new BulletBehavior(2000, 0.25, 0, 0, -Math.PI*0.5)
                    ], 25, 5 * G_PREFERED_SCALAR, "diamond", 0, 1, Color.CYAN
    ), 3, 0, 1, 0, 1, 0, 0, 0, 0, false
);

const ENEMY_TYPE_1 = new EnemyType(
    G_BOSS_NAME_0, [
        new PatternGroup(0, 0, RAINBOW_LASER, 20, 30, 0.5, Color.RED, 1),
        new PatternGroup(1, 0, ARROW_SPRAY_1,  4,  1000, 0),
        new PatternGroup(1, 250, ARROW_SPRAY_2,  4,  1000, 0),
        new PatternGroup(1, 200, AREA_DENIAL,  2,   2000, 90),
        new PatternGroup(2, 0, RAINBOW_LASER, 50, 20,   0.5, Color.RED, 1),
        new PatternGroup(3, 0, ARROW_SPRAY_1, 20,  666,  0),
        new PatternGroup(3, 250, ARROW_SPRAY_2, 20,  666,  0),
        new PatternGroup(3, 200, AREA_DENIAL, 10,  1333, 90)], 
    new SniperMovementBehavior(0, 0.2, 0.000001, 0.001, 200, 400, 100),
    new AttackRandomBehavior(), 
    G_BOSS_MAX_HEALTH*0.8, 30, Color.YELLOW
);

const ENEMY_TYPE_2 = new EnemyType(
    "HELLFIRE", [
        new PatternGroup(1, 0, RAINBOW_LASER, 10, 30, 0.5, Color.RED, 1),
        new PatternGroup(0, 0, ARROW_SPRAY_1, 2,  333,  0),
        new PatternGroup(0, 250, ARROW_SPRAY_2, 2,  333,  0),
        new PatternGroup(0, 200, AREA_DENIAL, 1,  666, 90)], 
    new MoveTowardBehavior(0, 0.3, 0.00001, 0.001), 
    new AttackDistanceBasedBehavior([200, 1000]), 
    G_BOSS_MAX_HEALTH*0.4, 30, Color.RED
);

const ENEMY_TYPE_3 = new EnemyType(
    "SUNSHINE & RAINBOWS", [
        new PatternGroup(6, 0, SWIFT_DAGGERS, 2, 100, 0),
        new PatternGroup(0, 0, SWIFT_DAGGERS, 10, 250, 0.5),
        new PatternGroup(1, 0, SLAP_CANNON_1, 1, 0, 0),
        new PatternGroup(2, 0, SLAP_CANNON_2, 1, 0, 0),
        new PatternGroup(3, 0, SLAP_CANNON_1, 2, 1000, 0),
        new PatternGroup(3, 0, SLAP_CANNON_2, 2, 1000, 0),
        new PatternGroup(4, 0, SLAP_CANNON_1, 3, 500, 0),
        new PatternGroup(5, 0, SLAP_CANNON_2, 3, 500, 0)], 
        new MoveNowhereBehavior(0),
        new AttackRandomBehavior(),
        G_BOSS_MAX_HEALTH*0.2, 15, Color.ORANGE
);

const TUT_PUNCH_RM = new RoomInstance(0, 0, new RoomType([]), 
    function(prev_x, prev_y, new_x, new_y, r=0) {
        let [base_x, base_y] = this.baseCollisions(prev_x, prev_y, new_x, new_y, r);
        return [base_x, base_y];
    },
    undefined,
    function() {
        const WALL_BORDER = g_screenWidth*0.5;
        const DOOR_RAD = 50;
        ctx.fillStyle = Color.BLACK;
        ctx.fillRect(0, 0, g_screenWidth, g_camera.y-WALL_BORDER);
        ctx.fillRect(0, 0, g_camera.x-WALL_BORDER, g_screenHeight);
        ctx.fillRect(0, g_screenHeight, g_screenWidth, g_camera.y-WALL_BORDER);
        ctx.fillRect(g_screenWidth, 0, g_camera.x-WALL_BORDER, g_camera.y-DOOR_RAD);
        ctx.fillRect(g_screenWidth+g_camera.x-WALL_BORDER, g_camera.y+DOOR_RAD, g_screenWidth, g_screenHeight);
    }, function() {
        resetStats();
        g_unlocks = {};
        g_consumableInstances.push(new Consumable(this.j * g_screenWidth, this.i * g_screenWidth, 
            function() {
                g_unlocks["pistol"] = true;
                g_player.selectedWeapon = "pistol";
                playSound(soundEffects.pickup, 2*g_volumeSound);
                g_paragraph.textObjects = [];
                g_paragraph.textObjects.push(new TypedText("To switch between weapons", 0, 20));
                g_paragraph.textObjects.push(new TypedText("press keys 1-4.", 0, 20));
            },
            7, 3, Color.YELLOW, Color.WHITE
        ));
    },
    undefined,
    [
        new Door(-100, 100, "right", "open")
    ]
);

const TUT_DASH_RM = new RoomInstance(0, 1, new RoomType(
    [[new Event(0, new SpawnEnemyMethod(ENEMY_TYPE_3,  g_screenWidth*0.3, -g_screenHeight*0.3, true)),
      new Event(0, new SpawnEnemyMethod(ENEMY_TYPE_3,  g_screenWidth*0.3,  g_screenHeight*0.3, true))]]
    ), 
    function(prev_x, prev_y, new_x, new_y, r=0) {
        let [base_x, base_y] = this.baseCollisions(prev_x, prev_y, new_x, new_y, r);
        return [base_x, base_y];
    },
    undefined,
    function() {
        const WALL_BORDER = g_screenWidth*0.5;
        const DOOR_RAD = 50;
        let rel_cx = g_camera.x + g_screenCenterFocus_x;
        let rel_cy = g_camera.y + g_screenCenterFocus_y;
        ctx.fillStyle = Color.BLACK;
        ctx.fillRect(0, 0, g_screenWidth, rel_cy-WALL_BORDER);
        ctx.fillRect(0, g_screenHeight, g_screenWidth, rel_cy-WALL_BORDER);
        ctx.fillRect(g_screenWidth, 0, rel_cx-WALL_BORDER, rel_cy-DOOR_RAD);
        ctx.fillRect(g_screenWidth+rel_cx-WALL_BORDER, rel_cy+DOOR_RAD, g_screenWidth, g_screenHeight);
        ctx.fillRect(0, 0, rel_cx-WALL_BORDER, rel_cy-DOOR_RAD);
        ctx.fillRect(0, rel_cy+DOOR_RAD, rel_cx-WALL_BORDER, g_screenHeight);
    }, function() {
        g_bgm.outOfCombat.play();
        g_bgm.inCombat.play();
        this.started = true;
        let r = this;
        g_paragraph.textObjects = [];
        g_paragraph.textObjects.push(new TypedText("Click and aim to shoot.", 0, 20));
        ParagraphHelper.sendAlert("Kill it!!!");
        g_consumableInstances.push(new Consumable((this.j-0.36) * g_screenWidth, this.i * g_screenWidth, 
            function() {
                g_unlocks["shotgun"] = true;
                playSound(soundEffects.pickup, 2*g_volumeSound);
                g_player.selectedWeapon = "shotgun";
                RoomHelper.closeDoors(r, "all");
            },
            14, 8, Color.ORANGE, Color.WHITE
        ));
    },
    function() {
        RoomHelper.openDoors(this, "all");
    },
    [
        new Door(-100, 100, "left", "open"),
        new Door(-100, 100, "right", "open")
    ]
);
const TUT_HEAL_RM = new RoomInstance(0, 2, new RoomType([]), 
    function(prev_x, prev_y, new_x, new_y, r=0) {
        let [base_x, base_y] = this.baseCollisions(prev_x, prev_y, new_x, new_y, r);
        return [base_x, base_y];
    },
    undefined,
    function() {
        const WALL_BORDER = g_screenWidth*0.5;
        const DOOR_RAD = 50;
        let rel_cx = g_camera.x + g_screenCenterFocus_x;
        let rel_cy = g_camera.y + g_screenCenterFocus_y;
        ctx.fillStyle = Color.BLACK;
        ctx.fillRect(0, 0, g_screenWidth, rel_cy-WALL_BORDER);
        ctx.fillRect(0, g_screenHeight, g_screenWidth, rel_cy-WALL_BORDER);
        ctx.fillRect(g_screenWidth, 0, rel_cx-WALL_BORDER, rel_cy-DOOR_RAD);
        ctx.fillRect(g_screenWidth+rel_cx-WALL_BORDER, rel_cy+DOOR_RAD, g_screenWidth, g_screenHeight);
        ctx.fillRect(0, 0, rel_cx-WALL_BORDER, rel_cy-DOOR_RAD);
        ctx.fillRect(0, rel_cy+DOOR_RAD, rel_cx-WALL_BORDER, g_screenHeight);
    },
    function() {
        g_paragraph.textObjects = [];
    },
    undefined,
    [
        new Door(-100, 100, "left", "open"),
        new Door(-100, 100, "right", "open")
    ]
);

const TUT_FINALE = new RoomInstance(0, 3, new RoomType(
    [[new Event(0, new SpawnEnemyMethod(ENEMY_TYPE_1, 0, 0, true))],
     [new Event(0, new SpawnEnemyMethod(ENEMY_TYPE_2, 0, 0, true))]]
    ), 
    function(prev_x, prev_y, new_x, new_y, r=0) {
        let [base_x, base_y] = this.baseCollisions(prev_x, prev_y, new_x, new_y, r);
        return [base_x, base_y];
    },
    undefined,
    function() {
        const WALL_BORDER = g_screenWidth*0.5;
        const DOOR_RAD = 50;
        let rel_cx = g_camera.x + g_screenCenterFocus_x;
        let rel_cy = g_camera.y + g_screenCenterFocus_y;
        ctx.fillStyle = Color.BLACK;
        ctx.fillRect(0, 0, g_screenWidth, rel_cy-WALL_BORDER);
        ctx.fillRect(0, g_screenHeight, g_screenWidth, rel_cy-WALL_BORDER);
        ctx.fillRect(g_screenWidth, 0, rel_cx-WALL_BORDER, rel_cy-DOOR_RAD);
        ctx.fillRect(g_screenWidth+rel_cx-WALL_BORDER, rel_cy+DOOR_RAD, g_screenWidth, g_screenHeight);
        ctx.fillRect(0, 0, rel_cx-WALL_BORDER, rel_cy-DOOR_RAD);
        ctx.fillRect(0, rel_cy+DOOR_RAD, rel_cx-WALL_BORDER, g_screenHeight);
    }, function() {
        let r = this;
        g_consumableInstances.push(new Consumable((this.j+0.4) * g_screenWidth, this.i * g_screenWidth, 
            function() {
                RoomHelper.closeDoors(r, "all");
                playSound(soundEffects.pickup, 2*g_volumeSound);
                ParagraphHelper.sendAlert("A trap!");
                g_unlocks["nailgun"] = true;
                g_player.selectedWeapon = "nailgun";
                r.started = true;
            },
            15, 4, Color.CYAN, Color.WHITE
        ));
    }, function() {
        RoomHelper.openDoors(this, "all");
        g_paragraph.textObjects = [];
        g_paragraph.textObjects.push(new TypedText("You beat it!", 0, 20));
        g_paragraph.textObjects.push(new TypedText("Now head for the exit.", 0, 20));
        g_consumableInstances.push(new Consumable(this.j * g_screenWidth, this.i * g_screenWidth, 
            function() {
                playSound(soundEffects.pickup, 2*g_volumeSound);
                g_unlocks["laser"] = true;
                g_player.selectedWeapon = "laser";
            },
            10, 5, Color.RED, Color.WHITE
        ));
    },
    [
        new Door(-100, 100, "left", "open"),
        new Door(-100, 100, "right", "closed")
    ]
);

const TUT_EXIT = new RoomInstance(0, 2, new RoomType([]), 
    function(prev_x, prev_y, new_x, new_y, r=0) {
        let [base_x, base_y] = this.baseCollisions(prev_x, prev_y, new_x, new_y, r);
        return [base_x, base_y];
    },
    undefined,
    function() {
    },
    function() {
        g_gameWindow = "levelResultsSetup";
    },
    undefined,
    [
        new Door(-100, 100, "left", "open")
    ]
);

const TUTORIAL = [[
    TUT_PUNCH_RM, TUT_DASH_RM, TUT_HEAL_RM, TUT_FINALE, TUT_EXIT
]];

const LEVEL_1 = [
    [LEVEL_1_RM_1, LEVEL_1_RM_2],
    [LEVEL_1_RM_4, LEVEL_1_RM_3]
];



/*
IHE ->
     I
     V
     IH1


const LEVEL_00 = [
    [INTRO_HALLWAY_ENTRANCE],
    [INTRO_HALLWAY_1, INTRO_HALLWAY_2, INTRO_HALLWAY_3],
    [undefined,       undefined,       INTRO_HALLWAY_4, INTRO_HALLWAY_5, INTRO_HALLWAY_6, ENEMY_RM_1]
];*/
