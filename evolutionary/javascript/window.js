function WindowAudioCheck() {
    // buffer until player clicks
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, g_screenWidth, g_screenHeight);
    
    ctx.fillStyle = "black";
    ctx.font = "10pt Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Click to run game.", 0.5*g_screenWidth, 0.5*g_screenHeight);
    if (g_mouse.down) {
        g_gameWindow = "title"
        g_mouse.disabled = true;
    }
}

function WindowRun() {
    drawBackground();
}

function drawBackground() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, g_screenWidth, g_screenHeight);
    
    var pattern = ctx.createPattern(createPatternImage(), "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, g_screenWidth, g_screenHeight);

    function createPatternImage() {
        var ctx = document.createElement("canvas").getContext("2d");
        ctx.canvas.width = ctx.canvas.height = 4;   // = size of pattern base
        ctx.fillStyle = "#fff";
        ctx.fillRect(0,0,1,1);
        return ctx.canvas;                          // canvas can be used as image source
    }
}