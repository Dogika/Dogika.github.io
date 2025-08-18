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
    
    let font1 = new FontFaceObserver('Moped');
    font1.load().then(function () {
        console.log('Moped is available');
        requestAnimationFrame(setInitialTime);
    }, function () {
        console.log('Moped is not available');
        requestAnimationFrame(setInitialTime);
    });
    
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
    if (g_gameWindow == "audioCheck") { // initial state
        WindowAudioCheck();
    }
    if (g_gameWindow == "title") {
        WindowTitle();
    }
    if (g_gameWindow == "game") {
        updateGame(deltaTime);
    }
    if (g_gameWindow == "shop") {
        updateShop(deltaTime);
    }
    
    g_previousTime = p_currentTime;
    requestAnimationFrame(tick);
}

function updateDropoff(deltaTime) {
    displayUI();
}

function updateShop(deltaTime) {
    displayUI();
    ShopHelper_updateItems(g_currentRoom.shop, deltaTime);
    ShopHelper_displayItems(g_currentRoom.shop);
}

function updateGame(deltaTime) {
    if (!g_nextEvent_ptr) {
        g_nextEvent_ptr = g_timeline.remove(0);
    }
    while (g_nextEvent_ptr != undefined && g_currentTime > g_nextEvent_ptr.timestamp) {
        g_nextEvent_ptr.executableMethod();
        g_timeline.sort(function(a, b){return a.timestamp - b.timestamp});
        g_nextEvent_ptr = g_timeline.remove(0);
    }
    g_currentRoom.displayBackground();
    updateBall();
    displayBall();
    g_currentRoom.displayForeground(deltaTime);
    displayUI();
    displayHarvester();
    //BeeHelper.updateBees();
}

function displayHarvester() {
    let g_tip = {};
    g_tip["shovel"] = [0, 80];
    let [dx, dy] = g_tip["shovel"];
    ctx.fillStyle = "black";
    ctx.fillRect(g_mouse.x + dx, g_mouse.y - dy, 20, 80);
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function displayUI() {
    
    let progressFraction = g_pollen/g_backpack[g_currentBackpack].capacity;
    
    let y = 0.05*g_screenHeight;
    
    let progressColor = rgbToHex(progressFraction*255, (1-progressFraction)*255, 0);
    let progressText = g_pollen + " / " + g_backpack[g_currentBackpack].capacity;
    
    ctx.lineCap = "round";
    
    ctx.lineWidth = 30;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0.05*g_screenWidth, y);
    ctx.lineTo(0.25*g_screenWidth, y);
    ctx.stroke();
    
    ctx.lineWidth = 15;
    ctx.strokeStyle = "gray";
    ctx.beginPath();
    ctx.moveTo(0.05*g_screenWidth, y);
    ctx.lineTo(0.25*g_screenWidth, y);
    ctx.stroke();
    
    if (g_pollen !== 0) {
        ctx.lineWidth = 15;
        ctx.strokeStyle = progressColor;
        ctx.beginPath();
        ctx.moveTo(0.05*g_screenWidth, y);
        ctx.lineTo((0.05 + 0.2*progressFraction)*g_screenWidth, y);
        ctx.stroke();
    }
    
    ctx.lineCap = "butt";
    
    ctx.textAlign = "center";
    ctx.font = 35+"px Moped"
    ctx.lineCap = "round";
    ctx.lineWidth = 15;
    ctx.letterSpacing = 5+"px";
    ctx.strokeStyle = "black";
    ctx.lineJoin = "round";
    ctx.strokeText(progressText + " Pollen", 0.15*g_screenWidth, y);
    ctx.lineCap = "butt";
    ctx.fillStyle = progressColor;
    ctx.fillText(progressText + " Pollen", 0.15*g_screenWidth, y);
    ctx.lineJoin = "miter";
    
    ctx.lineCap = "butt";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeText(g_honey + " Honey", 0.85*g_screenWidth, y);
    ctx.lineCap = "butt";
    ctx.fillStyle = "white";
    ctx.fillText(g_honey + " Honey", 0.85*g_screenWidth, y);
    ctx.lineJoin = "miter";
}

function Event(timestamp, fn) {
    this.timestamp = timestamp;
    this.executableMethod = fn;
}

function CollectPattern() {
    this.points = [];
    this.previousWhiteCollect = 0;
    this.previousRedCollect = 0;
    this.previousBlueCollect = 0;
    this.addTile = function(j, i, p) {
        this.points.push([j, i, p]);
        return this;
    }
    this.collect = function(grid, i, j) {
        this.previousWhiteCollect = 0;
        this.previousRedCollect = 0;
        this.previousBlueCollect = 0;
        
        let r_x, r_y;
        
        let dx = g_ball.x - g_mouse.x;
        let dy = g_ball.y - g_mouse.y;
        
        let add = dx + dy;
        let sub = dx - dy;
        
        if (add > 0) {
            if (sub > 0) {
                r_x = 1;
                r_y = 0; // Right
            } else {
                r_x = 0;
                r_y = 1; // Up
            }
        } else {
            if (sub > 0) {
                r_x = 0;
                r_y = -1; // Down
            } else {
                r_x = -1;
                r_y = 0; // Left
            }
        }
        
        for (let [dj, di, p] of this.points) {
            let rotated_dj = dj * r_x + di * -r_y;
            let rotated_di = dj * r_y + di * r_x;
            
            dj = rotated_dj;
            di = rotated_di;
            
            if (i + di >= grid.length
                || i + di <= -1
                || j + dj >= grid[0].length
                || j + dj <= -1
            ) {
                continue;
            }
            
            let tile = grid[i + di][j + dj];
            let newHealth = Math.max(0, tile.health - p*tile.level);
            let pollenCollected = (tile.health - newHealth);
            let newPollen = Math.min(g_pollen + pollenCollected, g_backpack[g_currentBackpack].capacity);
            pollenCollected = newPollen - g_pollen;
            g_pollen = newPollen;
            tile.health -= pollenCollected;
            
            
            if (tile.color === "Red") {
                this.previousRedCollect += pollenCollected;
            } else if (tile.color === "Blue") {
                this.previousBlueCollect += pollenCollected;
            } else {
                this.previousWhiteCollect += pollenCollected;
            }
        }
    }
}

function updateBall() {
    let dx = g_ball.x - g_mouse.x;
    let dy = g_ball.y - g_mouse.y;
    if (dx * dx + dy * dy < 32 * 32 + 32 * 32 && g_mouse.down && g_ball.canClick) {
        if (g_pollen < g_backpack[g_currentBackpack].capacity) {
            let [i, j] = findFieldCoordinate(g_ball.x, g_ball.y);
            g_collectPatterns["shovel"].collect(g_currentRoom.field.grid, i, j);
            
            pollenAlert(
                g_collectPatterns["shovel"].previousRedCollect, 
                g_collectPatterns["shovel"].previousBlueCollect,
                g_collectPatterns["shovel"].previousWhiteCollect, 
                i, j
            );
    
            g_ball.x = Math.random() * (g_currentRoom.field.tileWidth * g_currentRoom.field.grid[0].length - 2 * 32) + 32 + g_currentRoom.field.x;
            g_ball.y = Math.random() * (g_currentRoom.field.tileHeight * g_currentRoom.field.grid.length - 2 * 32) + 32 + g_currentRoom.field.y;
        
        } else {
            g_ball.enragedTime = g_currentTime;
        }
        
        g_ball.canClick = false;
    }
}

function findFieldCoordinate(x, y) {
    let field = g_currentRoom.field;
    let i, j;
    j = Math.floor((x - field.x) / field.tileWidth);
    i = Math.floor((y - field.y) / field.tileHeight);
    return [i, j];
}

function displayBall() {
    if (!g_currentRoom.field) return;
    
    let x = g_ball.x;
    let y = g_ball.y;
    
    let color = "#2b8f3d";
    
    if (g_currentTime - g_ball.enragedTime < 1000) {
        let f = (g_currentTime - g_ball.enragedTime)/1000;
        x += Math.cos(Math.random()*2*Math.PI) * 10 * (1-f);
        y += Math.sin(Math.random()*2*Math.PI) * 10 * (1-f);
        color = rgbToHex(Math.floor(43*f) + 255*(1-f), Math.floor(143*f), Math.floor(61*f));
    }
    
    drawCircle(x, y, 32, color);
}

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function Bee() {
    this.findTargetFlower = function() {
        let currentField = g_currentRoom.field;
        
        let i = Math.random() * currentField.length;
        let j = Math.random() * currentField[0].length;
        
        let flower_x = currentField.x + G_TILE_SIZE * (0.5 + j);
        let flower_y = currentField.y + G_TILE_SIZE * (0.5 + i);
        
        [this.vx, this.vy] = MathHelper.setMagnitude(G_BEE_SPEED, [flower_x - this.x, flower_y - this.y]);
        
        this.currentFlower = currentField[i][j];
        this.state = "targetFlower";
    }
    this.updatePosition = function(deltaTime) {
        if (this.state === "targetFlower") {
            this.x += this.vx * deltaTime;
            this.y += this.vy * deltaTime;
            
            let dx = this.flower.x - this.x;
            let dy = this.flower.y - this.y;
            if (dx * dx + dy * dy < 100) {
                this.state = "collectPollen";
            }
        }
    }
}

class BeeHelper {
    static updateBees(p_beeInstances, deltaTime) {
        let i = 0;
        while (i < p_beeInstances.length) {
            let bee = p_beeInstances[i];
            
            if (!bee.currentFlower && g_currentRoom.field) {
                bee.findTargetFlower();
            }
            
            bee.updatePosition(deltaTime);
            bee.display();
            
            i++;
        }
    }
}

/*
Types of bees:
Gigachad bee - ability: aim trainer but combo kinda like coconut from bss
Caseoh - he rolls around - ability: spawns treats and falls down as meteors for each treat collected
*/