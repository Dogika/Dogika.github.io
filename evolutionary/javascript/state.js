//contains default states

let canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = g_screenWidth;
    canvas.height = g_screenHeight;
    canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }
let ctx = canvas.getContext("2d");

let g_mouse = {};

let g_timeWhenMovePressed = 0;
let g_triggers = {
    anyMovePressed: false,
    speedupPressed: false
};

let g_currentTime;
let g_previousTime;
let g_timeline = [];
let g_nextEvent_ptr;

let g_movespeed = 0.1;

let g_x = 0;
let g_y = 0;
let g_camera_x = 0;
let g_camera_y = 0;

let g_zoom = 5;

let g_window = "audioCheck";

let g_keyboard = {};

let g_creatures = [];

let g_foodtypes = [];
let g_foods = [];
let g_seeds = [];

let g_soil=[[]];

let G_SOIL_LENGTH = 10;

let g_rainLevel = 0.1;
let g_rainDroplets = [];

function initializeGameState() {
    g_foodtypes = createFoodtypes(10);
    g_seeds = createSeeds(100);

    g_camera_x = 0;//-g_screenWidth*(g_zoom*0.5-0.5);
    g_camera_y = 0;//-g_screenHeight*(g_zoom*0.5-0.5);

    for (let i = 0; i < G_SOIL_LENGTH; i++) {
        g_soil[i] = [];
        for (let j = 0; j < G_SOIL_LENGTH; j++) {
            g_soil[i][j] = new Soil();
        }
    }
}