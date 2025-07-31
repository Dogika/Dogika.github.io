function Room(navigators=undefined, shop=undefined, field=undefined, decorationBackground=undefined, decorationForeground=undefined, NPCs=undefined) {
    this.navigators = navigators;
    this.shop = shop;
    this.field = field;
    this.displayMethodDecorationBackground = decorationBackground;
    this.displayMethodDecorationForeground = decorationForeground;
    this.NPCs = NPCs;
    
    this.displayBackground = function() {
        if (this.displayMethodDecorationBackground)
        this.displayMethodDecorationBackground();
        
        if (this.field)
        RoomHelper_displayField(this.field);
        
        if (this.shop)
        RoomHelper_displayShop(this.shop);
        
        if (this.navigators)
        RoomHelper_displayNavigators(this.navigators);
    }
    
    this.displayForeground = function(deltaTime) {
        if (this.NPCs)
        RoomHelper_displayNPCs(this.NPCs);
        
        if (this.field)
        RoomHelper_displayUpdatePollenAlerts(this.field, deltaTime);
        
        if (this.displayMethodDecorationForeground)
        this.displayMethodDecorationForeground();
    }
}

function RoomHelper_displayField(p_field) {
    //ctx.fillStyle = "#3d623c";
    //ctx.fillRect(this.field.x, this.field.y, this.field.grid[0].length * this.field.tileWidth, this.field.grid.length * this.field.tileHeight);
    for (let i = 0; i < p_field.grid.length; i++)
    for (let j = 0; j < p_field.grid[0].length; j++) {
        let tile = p_field.grid[i][j];
        
        if (!tile.healing && tile.health < tile.MAX_HEALTH) {
            tile.healing = true;
            g_timeline.push(new Event(g_currentTime + 14000 + 500*Math.random(), function() {
                tile.health = Math.min(tile.MAX_HEALTH, tile.health + 10);
                tile.healing = false;
            }));
        }
        
        let x = j * p_field.tileWidth + p_field.x;
        let y = i * p_field.tileHeight + p_field.y;
        
        ctx.globalAlpha = tile.health / tile.MAX_HEALTH;
        ctx.drawImage(g_image["flower"+tile.color+tile.level], x, y, p_field.tileWidth, p_field.tileHeight);
        
    }
    
    ctx.globalAlpha = 1;
}

function RoomHelper_displayShop(p_shop) {
    ctx.drawImage(p_shop.image, p_shop.x, p_shop.y, p_shop.width, p_shop.height);
}

function RoomHelper_displayNavigators(p_navigators) {
    for (let i = 0; i < p_navigators.length; i++) {
        let navigator = p_navigators[i];
        
        navigator.display();
    }
}

function RoomHelper_displayUpdatePollenAlerts(p_field, deltaTime) {
    
    for (let i = 0; i < p_field.grid.length; i++)
    for (let j = 0; j < p_field.grid[0].length; j++) {
        let tile = p_field.grid[i][j];
        let stackLayer = 1;
        
        let x = (j+0.5) * p_field.tileWidth + p_field.x;
        let y = (i+0.5) * p_field.tileHeight + p_field.y;
        
        let k = 0;
        while (k < tile.scoreStack.length) {
            
            let scoreAlert = tile.scoreStack[k];
            
            if (scoreAlert.timestamp <= g_currentTime || scoreAlert.size <= 0) {
                tile.scoreStack.remove(k);
                continue;
            }
            
            for (let l = 0; l < 3; l++) {
                let text = scoreAlert.message[l];
                if (text <= 0) continue;
                
                let color = ["Red", "Blue", "White"][l];
                
                let r = Math.sin((g_currentTime - scoreAlert.timestamp + 3000)*0.01)*Math.PI*0.04;
                
                drawRotatedText(x, y - stackLayer*40, "+" + text, scoreAlert.fontSize*scoreAlert.size+scoreAlert.font, r, 
                    function(text, x, y) {
                        ctx.lineCap = "round";
                        ctx.lineWidth = scoreAlert.size*15;
                        ctx.letterSpacing = 5+"px";
                        ctx.strokeStyle = "black";
                        ctx.lineJoin = "round";
                        ctx.strokeText(text, x, y);
                        ctx.lineCap = "butt";
                        ctx.fillStyle = color;
                        ctx.fillText(text, x, y);
                        ctx.lineJoin = "miter";
                    }
                );
                
                stackLayer++;
            }
            
            scoreAlert.size += scoreAlert.size_v * deltaTime;
            scoreAlert.size_v += scoreAlert.size_a * deltaTime;
            
            k++;
        }
    }
}

function RoomHelper_displayNPCs(p_shop) {
    
}

function drawRotatedRect(x, y, w, h, r) {
    ctx.translate(x+(w/2), y);
    ctx.rotate((r*Math.PI)/180);
    ctx.translate(-(x+(w/2)), -y);
    ctx.fillRect(x, y, w, h);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawRotatedText(x, y, text, font, r, fn=function(text, x, y) {ctx.fillText(text, x, y)}) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(x, y);
    ctx.rotate(r);
    ctx.font = font;
    
    fn(text, 0, 0);
    
    ctx.restore();
}

function Field(x, y, rows, columns, tileWidth, tileHeight, proportions, centered=true) {
    this.grid = [];
    for (let i = 0; i < rows; i++) {
        this.grid[i] = [];
        for (let j = 0; j < columns; j++) {
            this.grid[i][j] = new Tile(proportions);
        }
    }
    this.x = Math.floor(x);
    this.y = Math.floor(y);
    this.tileWidth = Math.floor(tileWidth);
    this.tileHeight = Math.floor(tileHeight);
    this.width = Math.floor(columns*tileWidth);
    this.height = Math.floor(rows*tileHeight);
    this.centered = centered;
    if (this.centered) {
        this.x -= Math.floor(this.width*0.5);
        this.y -= Math.floor(this.height*0.5);
    }
}

function Tile(proportions) {
    const colors = ["Red", "Blue", "White"];
    let indices = [...Array(proportions.length).keys()];
    let c = 0;
    let cumulativeWeights = proportions.map(function(x) {return c += x;});
    let randVal = Math.random() * cumulativeWeights[proportions.length-1];
    
    for (const [i, cumulativeWeight] of cumulativeWeights.entries()) {
        if (randVal < cumulativeWeight) {
            this.color = colors[Math.floor(i / 3)];
            this.level = i % 3 + 1;
            this.health = 15 * (1 + this.level);
            this.MAX_HEALTH = this.health;
            break;
        }
    }
    
    this.healing = false;
    this.scoreStack = [];
}

function Alert(message, font, duration) {
    this.message = message;
    this.timestamp = g_currentTime + duration;
    this.font = font;
}

function pollenAlert(pollenRed, pollenBlue, pollenWhite, i, j) {
    g_currentRoom.field.grid[i][j].scoreStack.push(new PollenAlert([pollenRed, pollenBlue, pollenWhite], 40, "px Moped", 3000));
}

function PollenAlert(message, fontSize, font, duration) {
    this.critical; // true/false
    this.size_v = 0.003;
    this.size_a = -0.00001;
    this.size = 1;
    this.message = message;
    this.timestamp = g_currentTime + duration;
    this.fontSize = fontSize;
    this.font = font;
}