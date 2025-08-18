const [g_screenWidth, g_screenHeight, g_screenScale] = findResolution(window.innerWidth, window.innerHeight);

function findResolution(width, height) {
    
    // aspect ratio 16:9
    
    let w_ar = 16;
    let h_ar = 9;
    
    let f = Math.min(width/w_ar, height/h_ar);
    
    return [f * w_ar-10, f * h_ar-10, f];
}

Array.prototype.remove = function(index) {
    return this.splice(index, 1)[0];   
};

function mod(n, m) {
  return ((n % m) + m) % m;
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}