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

function WindowTitle() {
    ctx.fillStyle = "black";
    ctx.font = "80pt Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Dotty Clicker 2", 0.5*g_screenWidth, 0.25*g_screenHeight);
    
    g_buttonInstances = [];
    
    g_buttonInstances.push(new Button("Start", "30pt Arial", 0, 15, 120, 35, function() {
            g_buttonInstances = [];
            g_gameWindow = "game";
    }));
    
    g_buttonInstances.push(new Button("Load", "30pt Arial", 0, -65, 120, 35, function() {
            g_buttonInstances = [];
            g_gameWindow = "mainMenu";
    }));
    
    g_buttonInstances.push(new Button("Settings", "30pt Arial", 0, -145, 120, 35, function() {
            g_buttonInstances = [];
            g_gameWindow = "mainMenu";
    }));
    
    for (let i = 0; i < g_buttonInstances.length; i++) {
        let button = g_buttonInstances[i];
        
        let relativeMouse_x = g_mouse.x + button.x - 0.5*g_screenWidth;
        let relativeMouse_y = g_mouse.y + button.y - 0.5*g_screenHeight;
        let touchingMousePointer = relativeMouse_x > -button.hw
                                    && relativeMouse_x < button.hw
                                    && relativeMouse_y > -button.hh
                                    && relativeMouse_y < button.hh;
        if (touchingMousePointer && g_mouse.down) {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 5;
            ctx.strokeRect(0.5*g_screenWidth + button.x - button.hw, 0.5*g_screenHeight - button.y - button.hh + 3, button.hw + button.hw, button.hh + button.hh);
            
            ctx.fillStyle = "black";
            ctx.font = button.font;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(button.display, 0.5*g_screenWidth+button.x, 0.5*g_screenHeight-button.y + 3);
        } else {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 5;
            ctx.globalAlpha = 0.5;
            ctx.strokeRect(0.5*g_screenWidth + button.x - button.hw, 0.5*g_screenHeight - button.y - button.hh + 3, button.hw + button.hw, button.hh + button.hh);
            ctx.globalAlpha = 1;
            ctx.strokeRect(0.5*g_screenWidth + button.x - button.hw, 0.5*g_screenHeight - button.y - button.hh, button.hw + button.hw, button.hh + button.hh);
            
            ctx.fillStyle = "black";
            ctx.font = button.font;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.globalAlpha = 0.5;
            ctx.fillText(button.display, 0.5*g_screenWidth+button.x, 0.5*g_screenHeight-button.y + 3);
            ctx.globalAlpha = 1;
            ctx.fillText(button.display, 0.5*g_screenWidth+button.x, 0.5*g_screenHeight-button.y);
        }
    }
}

function Button(display, font, x, y, hw, hh, fn) {
    this.display = display;
    this.font = font;
    this.fn = fn;
    this.x = x;
    this.y = y;
    this.hw = hw;
    this.hh = hh;
    this.touching = function(x, y) {
        return x > -this.hw
            && x < this.hw
            && y > -this.hh
            && y < this.hh;
    }
}