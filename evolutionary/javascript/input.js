function keyDown(e) {
    if (e.ctrlKey == true) e.preventDefault();
    let lowerKeyse = e.key.toLowerCase();
    g_keyboard[lowerKeyse] = true;
}

function keyUp(e) {
    let lowerKeyse = e.key.toLowerCase();
    g_keyboard[lowerKeyse] = false;
}

function mouseEvent(e) {
    let canvas = document.getElementById("canvas");
    let bounds = canvas.getBoundingClientRect();
    
    g_mouse.x = e.pageX - bounds.left; // - scrollX;
    g_mouse.y = e.pageY - bounds.top; // - scrollY;
    g_mouse.x *= canvas.width/bounds.width; // rescale mouse coordinates to canvas pixels
    g_mouse.y *= canvas.height/bounds.height;

    if (e.type === "mousedown") {
        g_mouse.down = true;
    } else if (e.type === "mouseup") {
        g_mouse.down = false;
    }
}

function directionEqualsInput(direction) {
    return getControl("move" + capitalizeFirstLetter(direction));
}

function touchEvent(e) {
    if (e.touches.length > 0) {
        let touch = e.touches.item(0);
        g_mouse.x = touch.clientX - 2*touch.radiusX;
        g_mouse.y = touch.clientY - 2*touch.radiusY;
    }
    if (e.type === "touchstart") {
        g_mouse.down = true;
    } else if (e.type === "touchend") {
        g_mouse.down = false;
        g_ball.canClick = true;
        g_mouse.disabled = false;
    }
}

function getDirection() {
    if (getControl("moveUp")) return "up";
}

function getControl(controlType) {
    
    if (controlType == "up") return g_keyboard["w"] || g_keyboard["arrowup"];
    if (controlType == "left") return g_keyboard["a"] || g_keyboard["arrowleft"];
    if (controlType == "down") return g_keyboard["s"] || g_keyboard["arrowdown"];
    if (controlType == "right") return g_keyboard["d"] || g_keyboard["arrowright"];
    if (controlType == "speedup") return g_keyboard[" "];
    if (controlType == "rain") return g_keyboard["1"];
    
    throw new Error("CustomError: controlType '"+controlType+"' not registered!");

}
