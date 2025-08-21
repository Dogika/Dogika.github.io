const [g_screenWidth, g_screenHeight, g_screenScale] = findResolution(window.innerWidth, window.innerHeight);

function findResolution(width, height) {
    
    // aspect ratio 16:9
    
    let w_ar = 16;
    let h_ar = 9;
    
    let f = Math.min(width/w_ar, height/h_ar);
    
    return [f * w_ar-10, f * h_ar-10, f];
}

const [g_rainStart_x, g_rainStart_y, g_rainEnd_x, g_rainEnd_y, g_rainDir_x, g_rainDir_y] = findRainStartEnd(135/180*Math.PI);

function findRainStartEnd(angle) {
    let m1 = Math.tan(angle);
    let m2 = -1/m1;

    let rainStart_x = -m2 * g_screenWidth / (m1 - m2) + 1.5*g_screenWidth;
    let rainStart_y = m1 * -m2 * g_screenWidth / (m1 - m2) + 1.5*g_screenHeight;

    let rainEnd_x = ((m2 - m1) * g_screenWidth + g_screenHeight)/(m1-m2) + 1.5*g_screenWidth;
    let rainEnd_y = m2 * (((m2 - m1) * g_screenWidth + g_screenHeight)/(m1-m2)) - m2 * g_screenWidth + 1.5*g_screenHeight;
    
    let g_rainDir_x = Math.cos(angle);
    let g_rainDir_y = Math.sin(angle);

    return [rainStart_x, rainStart_y, rainEnd_x, rainEnd_y, g_rainDir_x, g_rainDir_y];
}

Array.prototype.remove = function(index) {
    return this.splice(index, 1)[0];   
};

function mod(n, m) {
  return ((n % m) + m) % m;
}

function randomCurvedRangeInt(start=0, end=1) {
    return start+Math.floor(Math.random()*Math.random()*Math.random()*(end-start+1))
}

function randomCurvedRangeFloat(start=0, end=1) {
    return start+Math.random()*Math.random()*Math.random()*(end-start);
}

function randomRangeInt(start=0, end=1) {
    return start+Math.floor(Math.random()*(end-start+1))
}

function randomRangeFloat(start=0, end=1) {
    return start+Math.random()*(end-start);
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const G_MOVEMENT_SPEEDUP_DELAY = 2000;
const G_PATTERN_ZOOM_BASE = 5;