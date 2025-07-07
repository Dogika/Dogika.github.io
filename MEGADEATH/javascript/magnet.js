function Magnet(timeCreated, x, y, x2, y2) {
    this.x = x;
    this.y = y;
    this.x2 = x2;
    this.y2 = y2;
    this.timeCreated = timeCreated;
    
    this.update = (deltaTime) => {
        let dx = this.x2 - this.x;
        let dy = this.y2 - this.y;
        if (dx * dx + dy * dy > 1) {
            this.x = MathHelper.expDecay(this.x, this.x2, 0.01, deltaTime);
            this.y = MathHelper.expDecay(this.y, this.y2, 0.01, deltaTime);
        }
    }
    
    this.display = (ctx) => {
        let show_x = this.x + g_camera.x;
        let show_y = this.y + g_camera.y;
        
        ctx.fillStyle = Color.YELLOW;
        ctx.fillRect(show_x-2.5, show_y-2.5, 5, 5);
    }
    
    this.attract = function(x, y) {
        let dx = this.x - x;
        let dy = this.y - y;
        let m = Math.sqrt(dx * dx + dy * dy);
        let ax = dx * m;
        let ay = dy * m;
        return [ax, ay, m];
    }
}
