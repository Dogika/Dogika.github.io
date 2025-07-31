/*
navigators
    side (string): [top, bottom, left, right],
    condition (fn): determines whether it is useable or not
    destination (string): address to specific room
*/
function Navigator(side, destination, useCondition=function() { return true; }) {
    this.imageAddr = "navigator"+capitalizeFirstLetter(side);
    this.side = side;
    this.destination = destination;
    this.useCondition = useCondition;
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
        this.width = Math.floor(g_screenHeight*0.5);
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
    this.display = function() {
        ctx.drawImage(g_image[this.imageAddr], this.x, this.y, this.width, this.height);
    }
    
    this.touching = function(x, y) {
        x -= this.x;
        y -= this.y;
        let notTouching = x < 0 || x > this.width || y < 0 || y > this.height;
        return !notTouching;
    }
}