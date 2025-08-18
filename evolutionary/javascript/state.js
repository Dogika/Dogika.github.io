//contains default states

let canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = g_screenWidth;
    canvas.height = g_screenHeight;
    canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }
let ctx = canvas.getContext("2d");

let g_mouse = {};

let g_currentTime;
let g_previousTime;
let g_timeline = [];
let g_nextEvent_ptr;

let g_window = "audioCheck";

let g_keyboard = {};

function initializeGameState() {
    
}