function Blood(spawnTime, x, y, weaponName) {
    this.x = x;
    this.y = y;
    this.weapon = g_weaponList[weaponName];
    this.spawnTime = spawnTime;
    this.sizeFactor = (Math.random() - 0.5) * 20;
    
    this.heal = function(deltaTime) {
        let dx = g_player.x - this.x;
        let dy = g_player.y - this.y;
        
        if (dx * dx + dy * dy > this.weapon.radius * this.weapon.radius) 
            return;
        
        g_player.health = Math.min(
            G_PLAYER_MAX_HEALTH, 
            g_player.health + this.weapon.healing * deltaTime * 0.4
        );
    }
    
    this.display = function() {
        drawCircle(ctx, this.x + g_camera.x, this.y + g_camera.y,  Math.max(0, this.sizeFactor + G_BLOOD_MAX_RADIUS * (1 - (g_currentTime-this.spawnTime)/G_BLOOD_DURATION)), Color.RED, 0.4);
    }
}
