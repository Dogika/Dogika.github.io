function Shop(imageAddr, x, y, side, items) {
    this.image = g_image[imageAddr];
    this.x = Math.floor(x);
    this.y = Math.floor(y);
    this.side = side;
    if (this.side === "left") {
        this.width = Math.floor(g_screenWidth*0.05);
        this.height = Math.floor(g_screenHeight*0.5);
        this.x = 0;
        this.y = Math.floor(g_screenHeight*0.5-this.height*0.5);
    } else if (this.side === "right") {
        this.width = Math.floor(g_screenWidth*0.05);
        this.height = Math.floor(g_screenHeight*0.5);
        this.x = Math.floor(g_screenWidth - this.width);
        this.y = Math.floor(g_screenHeight*0.5-this.height*0.5);
    } else if (this.side === "up") {
        this.width = Math.floorg_screenHeight*0.5;
        this.height = Math.floor(g_screenWidth*0.05);
        this.x = Math.floor(g_screenWidth*0.5-this.width*0.5);
        this.y = 0;
    } else if (this.side === "down") {
        this.width = Math.floor(g_screenHeight*0.5);
        this.height = Math.floor(g_screenWidth*0.05);
        this.x = Math.floor(g_screenWidth*0.5 - this.width*0.5);
        this.y = Math.floor(g_screenHeight - this.height);
    } else {
        console.log("ERROR: This is wrong navigator side!!!");
    }
    this.items = items;
    for (let i = 0; i < items.length; i++) {
        this.items[i] = structuredClone(items[i]);
    }
    this.selector = 0;
}

function ShopHelper_proceed(p_shop) {
    p_shop.selector = mod(p_shop.selector + 1, p_shop.items.length);
}

function ShopHelper_recede(p_shop) {
    p_shop.selector = mod(p_shop.selector - 1, p_shop.items.length);
}
    
function ShopHelper_order(p_shop) {
    let item = p_shop.items[p_shop.selector];
    
    if (g_unlocks[item.type]) return;
    
    if (g_honey >= item.cost)
        g_unlocks[item.type] = true;
}

function ShopHelper_touchingShop(p_shop) {
    if (!p_shop.width || !p_shop.height) return;
    
    let r_x = g_mouse.x - p_shop.x;
    let r_y = g_mouse.y - p_shop.y;
    let notTouching = r_x < 0 || r_x > p_shop.width || r_y < 0 || r_y > p_shop.height;
    return !notTouching;
}

const MAX_ITEM_SIZE = 300;

function ShopHelper_updateItems(p_shop, deltaTime) {
    for (let i = 0; i < p_shop.items.length; i++) {
        let item = p_shop.items[i];
        
        if (!item.x || !item.size) {
            item.size = MAX_ITEM_SIZE / (Math.abs(i - p_shop.selector) + 1);
            item.x = (i - p_shop.selector) * 600 + g_screenWidth*0.5;
        }
        
        item.x = MathHelper_expDecay(
            item.x, 
            (i - p_shop.selector) * 600 + g_screenWidth*0.5, 
            0.013,
        deltaTime);
        
        let sizeTarget = MAX_ITEM_SIZE / (Math.abs(i - p_shop.selector) + 1);
        
        if (i === p_shop.selector) {
            let dx = (item.x - g_mouse.x);
            let dy = (g_screenHeight*0.5 - g_mouse.y);
            
            if (dx * dx + dy * dy < MAX_ITEM_SIZE*MAX_ITEM_SIZE*0.5) {
                sizeTarget = 1.5 * MAX_ITEM_SIZE / (Math.abs(i - p_shop.selector) + 1)
                
                if (g_mouse.down) {//&& p_shop.items[i].cost <= g_honey) {
                    //g_honey -= p_shop.items[i].cost;
                    
                    console.log(p_shop.items[i]);
                }
            } else {
                sizeTarget = MAX_ITEM_SIZE / (Math.abs(i - p_shop.selector) + 1)
            }
        }
        
        item.size = MathHelper_expDecay(
            item.size, 
            sizeTarget,
            0.025,
        deltaTime);
    }
}

function ShopHelper_displayItems(p_shop) {
    RoomHelper_displayShop(g_currentRoom.shop);
    
    for (let i = 0; i < p_shop.items.length; i++) {
        let item = p_shop.items[i];
        
        ctx.globalAlpha = 1-Math.abs(item.x-g_screenWidth*0.5)/g_screenWidth;
        
        ctx.drawImage(g_image["navigatorLeft"], item.x - item.size*0.5, g_screenHeight*0.5 - item.size*0.5, item.size, item.size);
    }
    
    ctx.globalAlpha = 1;
}