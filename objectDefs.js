const G_BULLET_NAILGUN = new PlayerBulletType(15, 1.3, "triangle", 2, Color.WHITE, true, true, true, 2000, true, true, 8, 11, Color.CYAN);
const G_BULLET_SHOTGUN = new PlayerBulletType(110, 6, "circle", 1, Color.ORANGE, false, true, false, undefined, undefined, undefined, 10, 12, Color.ORANGE);

let g_weaponPistol = new Weapon("pistol", 490, function() {
    playSound(soundEffects.revolverShoot, g_volumeSound)
    
    g_weaponPistol.lastUsed = g_currentTime;
    
    createPlayerHitscan(G_HITSCAN_BULLET, 0, 0);
});

let g_weaponNailgun = new Weapon("nailgun", 40, function() {
    if (soundEffects.nailgunSpin.paused) 
        soundEffects.nailgunSpin.play();
    soundEffects.nailgunSpin.volume = 0.4*g_volumeSound;
    soundEffects.nailgunSpin.loop = true;
    
    playSound(soundEffects.nailgunFire, 0.6*g_volumeSound);
    
    g_weaponNailgun.lastUsed = g_currentTime;
    
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

let g_weaponLaser = new Weapon("laser", null, function() {
    g_weaponLaser.lastUsed = g_currentTime;
    
    g_player.laser.type.width = G_HITSCAN_LASER.width;
    
    let [dx, dy] = MathHelper.normalize([g_player.vx, g_player.vy]);
    let eyePos_x = dx * 0.809016994375 + dy * 0.587785252292;
    let eyePos_y = dx * -0.587785252292 + dy * 0.809016994375;
    
    eyePos_x *= 5;
    eyePos_y *= 5;
    setPlayerHitscan(g_player.laser, eyePos_x, eyePos_y);
});

let g_weaponShotgun = new Weapon("shotgun", 920, function() {
    
    playSound(soundEffects.shotgunFire, 0.5*g_volumeSound);
    
    g_weaponShotgun.lastUsed = g_currentTime;
    
    let [dx, dy] = MathHelper.setMagnitude(g_player.radius, [g_target.x - g_player.x, g_target.y - g_player.y]);
    
    let pos_x = g_player.x + dy;
    let pos_y = g_player.y + dx;
    
    let direction_x = dx / g_player.radius;
    let direction_y = dy / g_player.radius;
    
    const spreadAngle = Math.PI*0.4;
    
    WeaponHelper.fireShots(G_BULLET_SHOTGUN, pos_x, pos_y, direction_x, direction_y, 7, spreadAngle, 0.675);
});

const G_HITSCAN_LASER = new HitscanType(0.4, 5, Color.RED);

const G_HITSCAN_BULLET = new HitscanType(200, 3.6, Color.YELLOW, true); // has fade instead of insta disappearing

const PATTERN_1 = new Pattern(
    new BulletType([new BulletBehavior(0,    0.05,     0,  0, 0),
                    new BulletBehavior(1300, 0,        0,  0, 0),
                    new BulletBehavior(2000, 0,    0.001,  0, 0, true)
                    ], 2, 6 * G_PREFERED_SCALAR, "circle", 0, 1, Color.RED, 
    ), 8, 0, 2, 0.6, 1, 0, 0, 0, 30, false
);


const PATTERN_2 = new Pattern(
    new BulletType([new BulletBehavior(0, 0.15, 0, 0, 0)], 5, 5 * G_PREFERED_SCALAR, "triangle", 0, 1, Color.RED
    ), 1, 0, 3, 1, 1, 0, 0, 0, 0, true
);

const PATTERN_3 = new Pattern(
    new BulletType([new BulletBehavior(0, 0.15, 0, 0, 0)], 5, 5 * G_PREFERED_SCALAR, "diamond", 0, 1, Color.GREEN
    ), 1, 0, 4, 0.5, 1, 0, 0, 0, 0, true
);

const PATTERN_4 = new Pattern(
    new BulletType([new BulletBehavior(0, 0.05, 0, 0, 0)], 20, 5 * G_PREFERED_SCALAR, "circle", 0, 1, Color.WHITE
    ), 7, 0, 1, 0, 1, 0, 0, 0, 0, false
);

const ENEMY_TYPE_1 = new EnemyType(
    G_BOSS_NAME_0, [
        new PatternGroup(0, 0, PATTERN_1, 20, 30, 0.5, Color.RED, 1),
        new PatternGroup(1, 0, PATTERN_2,  4,  1000, 0),
        new PatternGroup(1, 250, PATTERN_3,  4,  1000, 0),
        new PatternGroup(1, 200, PATTERN_4,  2,   2000, 90),
        new PatternGroup(2, 0, PATTERN_1, 50, 20,   0.5, Color.RED, 1),
        new PatternGroup(3, 0, PATTERN_2, 20,  666,  0),
        new PatternGroup(3, 250, PATTERN_3, 20,  666,  0),
        new PatternGroup(3, 200, PATTERN_4, 10,  1333, 90)], 
    new SniperMovementBehavior(0, 0.2, 0.000001, 0.001, 200, 400, 100),
    new AttackRandomBehavior(), 
    G_BOSS_MAX_HEALTH*0.8, 30, Color.YELLOW
);

const ENEMY_TYPE_2 = new EnemyType(
    "HELLFIRE", [
        new PatternGroup(1, 0, PATTERN_1, 10, 30, 0.5, Color.RED, 1),
        new PatternGroup(0, 0, PATTERN_2, 2,  333,  0),
        new PatternGroup(0, 250, PATTERN_3, 2,  333,  0),
        new PatternGroup(0, 200, PATTERN_4, 1,  666, 90)], 
    new MoveTowardBehavior(0, 0.3, 0.00001, 0.001), 
    new AttackDistanceBasedBehavior([200, 1000]), 
    G_BOSS_MAX_HEALTH*0.3333, 30, Color.RED
);

const ENEMY_TYPE_3 = new EnemyType(
    "SUNSHINE & RAINBOWS", [
        new PatternGroup(0, 0, PATTERN_1, 50, 30, 0.5, Color.RED, 1),
        new PatternGroup(1, 0, PATTERN_2,  10,  1000, 0),
        new PatternGroup(1, 250, PATTERN_3,  10,  1000, 0),
        new PatternGroup(1, 200, PATTERN_4,  5,   2000, 90),
        new PatternGroup(2, 0, PATTERN_1, 50, 20,   0.5, Color.RED, 1),
        new PatternGroup(3, 0, PATTERN_2, 20,  666,  0),
        new PatternGroup(3, 250, PATTERN_3, 20,  666,  0),
        new PatternGroup(3, 200, PATTERN_4, 10,  1333, 90)], 
        new MoveNowhereBehavior(0),
        new AttackLoopBehavior(),
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
        g_consumableInstances.push(new Consumable(this.j * g_screenWidth, this.i * g_screenWidth, 
            function() {
                g_unlocks["pistol"] = true;
                g_player.selectedWeapon = "pistol";
                g_paragraph.textObjects = [];
                g_paragraph.textObjects.push(new TypedText("To switch between weapons", 0, 20));
                g_paragraph.textObjects.push(new TypedText("press keys 1-4.", 0, 20));
            },
            7, 3, Color.YELLOW, Color.WHITE
        ));
    },
    undefined,
    [
        {
            start: -100,
            end: 100,
            side: "right",
            open: true
        }
    ]
);

const TUT_DASH_RM = new RoomInstance(0, 1, new RoomType(
    [[new Event(0, new SpawnEnemyMethod(ENEMY_TYPE_3, 0, 0, true))]]
    ), function(prev_x, prev_y, new_x, new_y, r=0) {
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
        bgm.outOfCombat.play();
        bgm.inCombat.play();
        this.started = true;
        g_paragraph.textObjects = [];
        g_paragraph.textObjects.push(new TypedText("Click and aim to shoot.", 0, 20));
        ParagraphHelper.sendAlert("Kill it!!!");
        RoomHelper.closeDoors(this, "all");
        g_consumableInstances.push(new Consumable((this.j-0.36) * g_screenWidth, this.i * g_screenWidth, 
            function() {
                g_unlocks["shotgun"] = true;
                g_player.selectedWeapon = "shotgun";
            },
            14, 8, Color.ORANGE, Color.WHITE
        ));
    },
    function() {
        RoomHelper.openDoors(this, "all");
    },
    [
        {
            start: -100,
            end: 100,
            side: "left",
            open: true
        },
        {
            start: -100,
            end: 100,
            side: "right",
            open: true
        },
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
        {
            start: -100,
            end: 100,
            side: "left",
            open: true
        },
        {
            start: -100,
            end: 100,
            side: "right",
            open: true
        },
    ]
);

const TUT_EXIT = new RoomInstance(0, 3, new RoomType(
    [[new Event(0, new SpawnEnemyMethod(ENEMY_TYPE_1, 0, 0, true))],
     [new Event(0, new SpawnEnemyMethod(ENEMY_TYPE_2, 0, 0, true))]]
    ), function(prev_x, prev_y, new_x, new_y, r=0) {
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
        ctx.fillRect(g_screenWidth, 0, rel_cx-WALL_BORDER, g_screenHeight);
        ctx.fillRect(0, g_screenHeight, g_screenWidth, rel_cy-WALL_BORDER);
        ctx.fillRect(0, 0, rel_cx-WALL_BORDER, rel_cy-DOOR_RAD);
        ctx.fillRect(0, rel_cy+DOOR_RAD, rel_cx-WALL_BORDER, g_screenHeight);
    }, function() {
        let roomInstance = this;
        g_consumableInstances.push(new Consumable((this.j+0.4) * g_screenWidth, this.i * g_screenWidth, 
            function() {
                RoomHelper.closeDoors(roomInstance, "all");
                ParagraphHelper.sendAlert("A trap!");
                g_unlocks["nailgun"] = true;
                g_player.selectedWeapon = "nailgun";
                roomInstance.started = true;
            },
            15, 4, Color.CYAN, Color.WHITE
        ));
    }, function() {
        RoomHelper.openDoors(this, "all");
        g_paragraph.textObjects = [];
        g_paragraph.textObjects.push(new TypedText("Congratulations!", 0, 20));
        g_paragraph.textObjects.push(new TypedText("You beat it!", 0, 20));
        g_consumableInstances.push(new Consumable(this.j * g_screenWidth, this.i * g_screenWidth, 
            function() {
                g_unlocks["laser"] = true;
                g_player.selectedWeapon = "laser";
            },
            10, 5, Color.RED, Color.WHITE
        ));
    },
    [
        {
            start: -100,
            end: 100,
            side: "left",
            open: true
        }
    ]
);

const TUTORIAL = [[
    TUT_PUNCH_RM, TUT_DASH_RM, TUT_HEAL_RM, TUT_EXIT
]];

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
