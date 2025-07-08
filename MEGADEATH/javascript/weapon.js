function Weapon(name, firerate, healing, useFunction, defaultWeapon=false) {
    this.name = name;
    this.firerate = firerate;
    this.lastUsed = -1; //timestamp
    this.healing = healing;
    this.radius = G_BLOOD_MAX_RADIUS;
    
    g_unlocks[name] = defaultWeapon;
    
    this.use = useFunction;
    
    this.canUse = function() {
        return g_player.selectedWeapon === this.name && !g_player.isPunching && (!this.firerate || (g_currentTime - this.lastUsed) >= this.firerate * g_invTimeDialation);
    }
}

class WeaponHelper {
    
    static fireShots(p_bulletType, p_pos_x, p_pos_y, p_direction_x, p_direction_y, p_amount, p_spreadAngle, p_minSpeed, p_maxSpeed) {
        for (let i = 0; i < p_amount; i++) {
            
            let rotationAngle = (Math.random()-0.5) * p_spreadAngle;
            
            let [rotated_dx, rotated_dy] = MathHelper.rotate(p_direction_x, p_direction_y, Math.cos(rotationAngle), Math.sin(rotationAngle));
            
            let speed;
            if (p_maxSpeed)
                speed = Math.random() * (p_maxSpeed - p_minSpeed) + p_minSpeed;
            else
                speed = p_minSpeed;
            
            let velocity_x = speed * rotated_dx;
            let velocity_y = speed * rotated_dy;
            
            g_playerBulletInstances.push(new PlayerBulletObject(p_bulletType, 
                p_pos_x, 
                p_pos_y, 
                velocity_x,
                velocity_y
            ));
        }
    }
    
    static shootSelectedWeapon() {
        if (g_weaponNailgun.canUse()) {
            g_weaponNailgun.use();
            return;
        }
        
        if (g_weaponPistol.canUse()) {
            g_weaponPistol.use();
            return;
        }
        
        if (g_weaponLaser.canUse()) {
            g_weaponLaser.use();
            return;
        }
        
        if (g_weaponShotgun.canUse()) {
            g_weaponShotgun.use();
            return;
        }
        
        if (g_player.selectedWeapon === "" && !g_player.tryingToShoot) {
            ParagraphHelper.sendAlert("No gun, no shoot.");
            g_player.tryingToShoot = true;
            return;
        }
    }
}
