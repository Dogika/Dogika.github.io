function keyDown(e) {
    if (e.ctrlKey == true) e.preventDefault();
    let lowerKeyse = e.key.toLowerCase();
    g_keyboard[lowerKeyse] = true;
}

function keyUp(e) {
    g_keyboard[e.key.toLowerCase()] = false;
    g_keyboard.roomMove = true;
}

function mouseEvent(e) {
    let canvas = document.getElementById("canvas");
    let bounds = canvas.getBoundingClientRect();
    
    g_mouse.x = e.pageX - bounds.left; // - scrollX;
    g_mouse.y = e.pageY - bounds.top; // - scrollY;
    g_mouse.x *= canvas.width/bounds.width; // rescale mouse coordinates to canvas pixels
    g_mouse.y *= canvas.height/bounds.height;
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
    
    if (controlType == "moveUp")      return g_keyboard["w"] || g_keyboard["arrowup"];
    
    throw new Error("CustomError: controlType '"+controlType+"' not registered!");
}