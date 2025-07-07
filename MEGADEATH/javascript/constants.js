const g_collide = true;

const G_X = 0;
const G_Y = 1;
const G_Z = 2;

const G_X_AXIS = [1, 0, 0];
const G_Y_AXIS = [0, 1, 0];
const G_Z_AXIS = [0, 0, 1];

const G_FARAWAY = 10e6;

const G_PLAYER_SMEAR_PERCENT = 0.6;
const G_PLAYER_BASE_SPEED = 0.15;
const G_MAX_STAMINA = 3;
const G_STAMINA_REGEN = 0.001;
const G_PLAYER_MAX_STAMINA = 3;
const G_PLAYER_DASH_MULTIPLIER = 7;
const G_COLOR_WALL = "#C0C0C0";
const G_COLOR_FLOOR = "#303030";
const G_CAMERA_DECAY_SPEED = 0.008;
const G_CAMERA_CENTER_PERCENT = 0.3;
const G_SCREEN_SHAKE_DECAY = 0.01;

const G_SHOTGUN_SHOTS = 10;
const G_SHOTGUN_SPEED_RANGE = 0.01;
const G_SHOTGUN_SPEED_SHIFT = 0.01;
const G_SHOTGUN_BULLET_DIFFERENCE = 0.6;
const G_BULLET_FRICTION = 0.001;
const G_MAGNET_LIFE = 3000;

const G_PUNCH_DURATION = 100;

const G_BLOOD_DURATION = 600;
const G_BLOOD_MAX_RADIUS = 65;

const g_screenWidth = window.innerHeight*0.95;
const g_screenHeight = window.innerHeight*0.95;


const G_SCREEN_CENTER_FOCUS_START_X = 0;
const G_SCREEN_CENTER_FOCUS_START_Y = 0;

const G_BULLET_BARRIER_X = g_screenWidth;
const G_BULLET_BARRIER_Y = g_screenHeight;

const G_WALL_THICKNESS = 0;
const G_COLLISION_DAMAGE = 10;

const G_TARGET_MOUSE = true;

const G_PLAYER_START_X = 0;
const G_PLAYER_START_Y = g_screenHeight*0.4;
let difference_y = G_SCREEN_CENTER_FOCUS_START_Y - G_PLAYER_START_Y;
let topLeft = G_PLAYER_START_X - G_SCREEN_CENTER_FOCUS_START_X + difference_y < 0;
let topRight = G_SCREEN_CENTER_FOCUS_START_X - G_PLAYER_START_X + difference_y < 0;
const G_PLAYER_START_VX = 0.00000001 * (topLeft - topRight);
const G_PLAYER_START_VY = 0.00000001 * (1 - topLeft - topRight);

const G_PREFERED_SCALAR = g_screenHeight/500;


const G_PLAYER_MAX_HEALTH = 100;
const G_BOSS_MAX_HEALTH = 8000;
const G_BOSS_NAME_0 = "SUN, THE PURITY OF HEAVEN";
const G_LEVEL_TITLE_0 = "KILL THE SUN";
const G_LEVEL_SUBTITLE_0 = "PRELUDE /// FIRST";

const Color = {
    RED: '#FF0000',
    GREEN: '#00FF00',
    BLUE: '#0000FF',
    YELLOW: '#FFFF00',
    CYAN: '#00FFFF',
    ORANGE: '#FFA500',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    GRAY: '#CCCCCC',
    PURPLE: '#9B30FF'
};

const SPONGEBOB_SPRITE = new Image();
SPONGEBOB_SPRITE.src = "https://codehs.com/uploads/cd4f63027e37b2dda278f63ff52a08ee";
const G_SPONGEBOB_WIDTH = SPONGEBOB_SPRITE.naturalWidth * 0.12;
const G_SPONGEBOB_HEIGHT = SPONGEBOB_SPRITE.naturalHeight * 0.12;

const PLAYER_SPRITE = new Image();
PLAYER_SPRITE.src = "https://codehs.com/uploads/451f71a7f1db1bd096698a4a6248621b";

const PORTAL_SPRITE = new Image();
PORTAL_SPRITE.src = "https://codehs.com/uploads/e3ae02ac799dbd2774fec784b5f41180";

Array.prototype.remove = function(index) {
    return this.splice(index, 1)[0];   
};

function mod(n, m) {
  return ((n % m) + m) % m;
}
