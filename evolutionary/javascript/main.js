function start() {
    addEventListener("keydown", keyDown);
    addEventListener("keyup", keyUp);
    
    addEventListener("mousemove", mouseEvent);
    addEventListener("mouseup", mouseEvent);
    addEventListener("mousedown", mouseEvent);
    
    addEventListener("touchstart", touchEvent);
    addEventListener("touchend", touchEvent);
    addEventListener("touchmove", touchEvent);
    
    initializeGameState();
    
    requestAnimationFrame(setInitialTime);
}

function setInitialTime(p_currentTime) {
    g_previousTime = p_currentTime - 1000/60;
    g_currentTime = p_currentTime;
    requestAnimationFrame(tick);
}

function tick(p_currentTime) {
    g_currentTime = p_currentTime;
    let deltaTime = g_currentTime - g_previousTime;
    if (deltaTime > 500)
        deltaTime = 500;
    ctx.clearRect(0, 0, g_screenWidth, g_screenHeight);
    if (g_window == "audioCheck") { // initial state
        WindowAudioCheck();
    }
    if (g_window == "run") {
        WindowRun();
    }
    
    g_previousTime = p_currentTime;
    requestAnimationFrame(tick);
}