function keyDown(e) {
    if (e.ctrlKey == true) e.preventDefault();
    let lowerKeyse = e.key.toLowerCase();
    g_keyboard[lowerKeyse] = true;
    
    if (g_gameWindow === "game") {
        if (g_currentRoom.shop && directionEqualsInput(g_currentRoom.shop.side)) {
            g_gameWindow = "shop";
            g_currentRoom.shop.selector = 0;
            for (let i = 0; i < g_currentRoom.shop.items.length; i++) {
                let item = g_currentRoom.shop.items[i];
                
                item.size = MAX_ITEM_SIZE / (i + 1);
                item.x = i * 600 + g_screenWidth*0.5;
            }
        } else {
            for (let i = 0; i < g_currentRoom.navigators.length; i++) {
                let navigator = g_currentRoom.navigators[i];
                
                if (getDirection() === navigator.side) {
                    g_currentRoom = g_rooms[navigator.destination];
                    if (g_currentRoom.field) {
                        g_ball.x = Math.random() * (g_currentRoom.field.tileWidth * g_currentRoom.field.grid[0].length - 2 * 32) + 32 + g_currentRoom.field.x;
                        g_ball.y = Math.random() * (g_currentRoom.field.tileHeight * g_currentRoom.field.grid.length - 2 * 32) + 32 + g_currentRoom.field.y;
                        g_ball.enragedTime = 0;
                    }
                    break;
                }
            }
        }
    } else if (g_gameWindow === "shop" && directionEqualsInput(g_currentRoom.shop.side)) {
        g_gameWindow = "game";
    }
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
    
    //g_movementTool = "mouse";
    
    if (e.type === "mousedown") {
        g_mouse.down = true;
        if (g_gameWindow === "shop") {
            if (!g_shop)
                g_shop = g_currentRoom.shop;
            
            if (g_shop.canScroll) {
                let s = g_mouse.x / g_screenWidth;
                if (s < 0.4)
                    ShopHelper_recede(g_shop);
                else if (s > 0.6)
                    ShopHelper_proceed(g_shop);
                else
                    ShopHelper_order(g_shop);
                g_shop.canScroll = false;
            }
        }
    } else if (e.type === "mouseup") {
        g_mouse.down = false;
        g_ball.canClick = true;
        if (g_shop) g_shop.canScroll = true;
        if (!g_mouse.disabled)
        for(let i = 0; i < g_buttonInstances.length; i++){
            checkIfButtonClicked(g_buttonInstances[i]);
        }
        if (g_gameWindow === "game") {
            for(let i = 0; i < g_currentRoom.navigators.length; i++) {
                let navigator = g_currentRoom.navigators[i]
                if (navigator.touching(g_mouse.x, g_mouse.y)) {
                    g_currentRoom = g_rooms[navigator.destination];
                    if (g_currentRoom.field) {
                        g_ball.x = Math.random() * (g_currentRoom.field.tileWidth * g_currentRoom.field.grid[0].length - 2 * 32) + 32 + g_currentRoom.field.x;
                        g_ball.y = Math.random() * (g_currentRoom.field.tileHeight * g_currentRoom.field.grid.length - 2 * 32) + 32 + g_currentRoom.field.y;
                        g_ball.enragedTime = 0;
                    }
                    break
                }
            }
            
            if (g_currentRoom.shop && ShopHelper_touchingShop(g_currentRoom.shop)) {
                g_gameWindow = "shop";
                g_currentRoom.shop.selector = 0;
                for (let i = 0; i < g_currentRoom.shop.items.length; i++) {
                    let item = g_currentRoom.shop.items[i];
                    
                    item.size = MAX_ITEM_SIZE / (i + 1);
                    item.x = i * 600 + g_screenWidth*0.5;
                }
            }
        } else if (g_gameWindow === "shop" && ShopHelper_touchingShop(g_currentRoom.shop)) {
            g_gameWindow = "game";
        }
        
        g_mouse.disabled = false;
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

function checkIfButtonClicked(button) {
    let relativeMouse_x = g_mouse.x + button.x - 0.5*g_screenWidth;
    let relativeMouse_y = g_mouse.y + button.y - 0.5*g_screenHeight;
    let touchingMousePointer = button.touching(relativeMouse_x, relativeMouse_y);
    if (touchingMousePointer) {
        button.fn();
    }
}

function getDirection() {
    if (getControl("moveUp")) return "up";
    if (getControl("moveDown")) return "down";
    if (getControl("moveLeft")) return "left";
    if (getControl("moveRight")) return "right";
}

function getControl(controlType) {
    
    if (controlType == "moveUp")      return g_keyboard["w"] || g_keyboard["arrowup"];
    if (controlType == "moveLeft")    return g_keyboard["a"] || g_keyboard["arrowleft"];
    if (controlType == "moveDown")    return g_keyboard["s"] || g_keyboard["arrowdown"];
    if (controlType == "moveRight")   return g_keyboard["d"] || g_keyboard["arrowright"];
    if (controlType == "selectLeft")  return g_keyboard["q"];
    if (controlType == "selectRight") return g_keyboard["e"];
    
    throw new Error("CustomError: controlType '"+controlType+"' not registered!");
}