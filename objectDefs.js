const G_PLAYER_BULLET_TYPE_1 = new PlayerBulletType(12, 1.3, "triangle", 2, Color.WHITE, true, true, true, 2000, true, true, 8, 11, Color.CYAN);
const G_PLAYER_BULLET_TYPE_2 = new PlayerBulletType(90, 6, "circle", 1, Color.RED, false, true, false, undefined, undefined, undefined, 10, 12, Color.ORANGE);

let g_weaponPistol = new Weapon("pistol", 490, true);
let g_weaponNailgun = new Weapon("nailgun", 40, true);
let g_weaponLaser = new Weapon("laser", null, true);
let g_weaponShotgun = new Weapon("shotgun", 920, true);

const G_HITSCAN_LASER = new HitscanType(0.4, 5, Color.RED);

const G_HITSCAN_BULLET = new HitscanType(180, 3.6, Color.YELLOW, true); // has fade instead of insta disappearing

const PATTERN_1 = new Pattern(
    new BulletType([new BulletBehavior(0,    0.05,     0,  0, 0),
                    new BulletBehavior(1300, 0,        0,  0, 0),
                    new BulletBehavior(2000, 0,    0.001,  0, 0, true)
                    ], 4 * G_PREFERED_SCALAR, "circle", 0, 1, Color.RED, 
    ), 8, 0, 2, 0.6, 1, 0, 0, 0, 30, false
);


const PATTERN_2 = new Pattern(
    new BulletType([new BulletBehavior(0, 0.15, 0, 0, 0)], 5 * G_PREFERED_SCALAR, "triangle", 0, 1, Color.RED
    ), 1, 0, 3, 1, 1, 0, 0, 0, 0, true
);

const PATTERN_3 = new Pattern(
    new BulletType([new BulletBehavior(0, 0.15, 0, 0, 0)], 5 * G_PREFERED_SCALAR, "diamond", 0, 1, Color.GREEN
    ), 1, 0, 4, 0.5, 1, 0, 0, 0, 0, true
);

const PATTERN_4 = new Pattern(
    new BulletType([new BulletBehavior(0, 0.05, 0, 0, 0)], 5 * G_PREFERED_SCALAR, "circle", 0, 1, Color.WHITE
    ), 7, 0, 1, 0, 1, 0, 0, 0, 0, false
);

const ENEMY_TYPE_1 = new EnemyType(
    G_BOSS_NAME_0,
    pattern_loop(10, PATTERN_1, 100, 30, 0.5, Color.RED, 1).concat(
    pattern_loop(4300, PATTERN_2, 20, 500, 0)).concat(
    pattern_loop(4550, PATTERN_3, 20, 500, 0)).concat(
    pattern_loop(4500, PATTERN_4, 10, 1000, 90)).concat(
    pattern_loop(10000, PATTERN_1, 100, 20, 0.5, Color.RED, 1)).concat(
    pattern_loop(14300, PATTERN_2, 40, 333, 0)).concat(
    pattern_loop(14550, PATTERN_3, 40, 333, 0)).concat(
    pattern_loop(14500, PATTERN_4, 20, 666, 90)).concat([
    new SniperMovementBehavior(0, 0.3, 0.000001, 0.001, 150, 500, 150)
    ]), G_BOSS_MAX_HEALTH, 30, Color.YELLOW
);