const UIFontSize = (18 * G_PREFERED_SCALAR).toString();
const bossBarFontSize = (18 * G_PREFERED_SCALAR).toString();
const titleFontSize = (115 * G_PREFERED_SCALAR).toString();

function start() {
    let font1 = new FontFaceObserver('VCR OSD Mono');
    
    addEventListener("keydown", keyDown);
    addEventListener("keyup", keyUp);
    addEventListener("mousemove", mouseEvent);
    addEventListener("mousedown", mouseEvent);
    addEventListener("mouseup", mouseEvent);
    //addEventListener("contextmenu", (e) => {e.preventDefault();});
    
    
    document.body.style.background = Color.BLACK;
    
    font1.load().then(function(){
        console.log('VCR OSD Mono is available');
        let font2 = new FontFaceObserver('BroshK');
        font2.load().then(function(){
            requestAnimationFrame(setInitialTime);
        }, function(){
            console.log('BroshK is not available');
            requestAnimationFrame(setInitialTime);
        });
    }, function(){
        console.log('Atleast VCR OSD Mono is not available');
        let font2 = new FontFaceObserver('BroshK');
        font2.load().then(function(){
            requestAnimationFrame(setInitialTime);
        }, function(){
            console.log('BroshK is not available');
            requestAnimationFrame(setInitialTime);
        });
    });
}

function setInitialTime(p_currentTime) {
    g_previousTime = p_currentTime - 1000/60;
    g_currentTime = p_currentTime;
    requestAnimationFrame(tick);
}

function tick(p_currentTime) {
    g_currentTime = p_currentTime;
    let deltaTime = (p_currentTime - g_previousTime) * g_timeDialation;
    ctx.clearRect(0, 0, g_screenWidth, g_screenHeight);
    if (g_gameWindow == -1) { // initial state
        g_buttonsList.push(new Button(g_screenWidth*0.5, g_screenHeight*0.5, "PLAY",
            function play() {
                g_buttonsList = [];
                
                resetGame(p_currentTime);
                
                g_gameWindow++;
            },
            1.5
        ));
        
        g_gameWindow++;
    }
    if (g_gameWindow == 0) { // menu
        for(let i = 0; i < g_buttonsList.length; i++){
            drawButton(g_buttonsList[i]);
        }
        
        ctx.font = titleFontSize + "px BroshK";
        ctx.textAlign = "center";
        ctx.lineWidth = 3;
        ctx.shadowColor = Color.RED;
        ctx.shadowBlur = 10;
        ctx.fillStyle = Color.RED;
        ctx.fillText("MEGADeATH", g_screenWidth*0.5, g_screenHeight*0.3);
        ctx.font = UIFontSize + "px VCR OSD Mono";
        ctx.fillStyle = Color.RED;
        ctx.fillText("-!- WARNING: I am testing out music. -!-", g_screenWidth*0.5, g_screenHeight*0.95);
        ctx.textAlign = "start";
        ctx.shadowBlur = 0;
    }
    if (g_gameWindow == 1) { // main game
    
        while (g_nextEvent_ptr != undefined && p_currentTime > g_nextEvent_ptr.timestamp) {
            g_nextEvent_ptr.executableMethod();
            g_timeline.sort(function(a, b){return a.timestamp - b.timestamp});
            g_nextEvent_ptr = g_timeline.remove(0);
        }
        
        if (G_TARGET_MOUSE) {
            g_target = {
                x: g_mouse.x - g_camera.x,
                y: g_mouse.y - g_camera.y
            }
        }
        if (getControl("shoot")) {
            
            let MpreviousTime = g_previousTime - g_mouse.downTimestamp;
            let McurrentTime = p_currentTime - g_mouse.downTimestamp;
            
            let canPistolFire  = (p_currentTime - g_weaponPistol.lastUsed) >= g_weaponPistol.firerate * g_invTimeDialation;
            let canNailgunFire = (p_currentTime - g_weaponNailgun.lastUsed) >= g_weaponNailgun.firerate * g_invTimeDialation;
            let canShotgunFire = (p_currentTime - g_weaponShotgun.lastUsed) >= g_weaponShotgun.firerate * g_invTimeDialation;
            
            if (g_player.selectedWeapon === "nailgun" && g_unlocks["nailgun"] && canNailgunFire) {
                if (soundEffects.nailgunSpin.paused) 
                    soundEffects.nailgunSpin.play();
                soundEffects.nailgunSpin.volume = 0.4*g_volumeSound;
                soundEffects.nailgunSpin.loop = true;
                
                playSound(soundEffects.nailgunFire, 0.6*g_volumeSound);
                
                g_weaponNailgun.lastUsed = p_currentTime;
                
                let [dx, dy] = setMagnitude(g_player.radius, [g_target.x - g_player.x, g_target.y - g_player.y]);
                
                
                let rotation = (Math.random()-0.5) * G_NAILGUN_SPREAD;
                let [rotated_dx1, rotated_dy1] = rotate(dx, dy, Math.cos(rotation), Math.sin(rotation));
                    rotation = (Math.random()-0.5) * G_NAILGUN_SPREAD;
                let [rotated_dx2, rotated_dy2] = rotate(dx, dy, Math.cos(rotation), Math.sin(rotation));
                let speedFactor1 = Math.random()*0.04+0.06;
                let speedFactor2 = Math.random()*0.04+0.06;
                
                g_playerBulletInstances.push(new PlayerBulletObject(G_PLAYER_BULLET_TYPE_1, 
                    g_player.x + dy, g_player.y - dx, 
                    rotated_dx1*speedFactor1, 
                    rotated_dy1*speedFactor1
                ));
                g_playerBulletInstances.push(new PlayerBulletObject(G_PLAYER_BULLET_TYPE_1, 
                    g_player.x - dy, g_player.y + dx, 
                    rotated_dx2*speedFactor2, 
                    rotated_dy2*speedFactor2
                ));
                
            } if (g_player.selectedWeapon === "pistol" && g_unlocks["pistol"] && canPistolFire) {
                playSound(soundEffects.revolverShoot, g_volumeSound)
                
                g_weaponPistol.lastUsed = p_currentTime;
                
                createPlayerHitscan(G_HITSCAN_BULLET, 0, 0);
                
            } else if (g_player.selectedWeapon === "laser" && g_unlocks["laser"]) {
                g_weaponLaser.lastUsed = p_currentTime;
                
                g_player.laser.type.width = G_HITSCAN_LASER.width;
                
                let [dx, dy] = normalize([g_player.vx, g_player.vy]);
                let eyePos_x = dx * 0.809016994375 + dy * 0.587785252292;
                let eyePos_y = dx * -0.587785252292 + dy * 0.809016994375;
                
                eyePos_x *= 5;
                eyePos_y *= 5;
                setPlayerHitscan(g_player.laser, eyePos_x, eyePos_y);
            } else if (g_player.selectedWeapon === "shotgun" && g_unlocks["shotgun"] && canShotgunFire) {
                playSound(soundEffects.shotgunFire, 0.5*g_volumeSound);
                
                g_weaponShotgun.lastUsed = p_currentTime;
                
                let [dx, dy] = setMagnitude(g_player.radius, [g_target.x - g_player.x, g_target.y - g_player.y]);
                
                for (let i = 0; i < 7; i++) {
                    let rotation = (Math.random()-0.5) * G_SHOTGUN_SPREAD;
                    let [rotated_dx, rotated_dy] = rotate(dx, dy, Math.cos(rotation), Math.sin(rotation));
                    g_playerBulletInstances.push(new PlayerBulletObject(G_PLAYER_BULLET_TYPE_2, 
                        g_player.x + dx, 
                        g_player.y + dy, 
                        rotated_dx*0.05, 
                        rotated_dy*0.05
                    ));
                }
            }
        } else {
            soundEffects.nailgunSpin.currentTime = 0;
            soundEffects.nailgunSpin.pause();
        }
        
        if (getControl("alt")) {
            if (!g_weaponNailgun.magnetFiring && g_player.selectedWeapon === "nailgun" && g_unlocks["nailgun"]) {
                g_weaponNailgun.magnetFiring = true;
                if (g_magnetInstances.length == 0) {
                    for (let i = 0; i < g_playerBulletInstances.length; i++) {
                        g_playerBulletInstances[i].timestampDeath += G_MAGNET_LIFE;
                    }
                }
                g_magnetInstances.push(new Magnet(p_currentTime, g_player.x, g_player.y, g_target.x, g_target.y));
            } if (g_player.selectedWeapon === "pistol" && g_unlocks["pistol"]) {
              
            } else if (g_player.selectedWeapon === "laser" && g_unlocks["laser"]) {

            } else if (g_player.selectedWeapon === "shotgun" && g_unlocks["shotgun"]) {
          
            }
        } else {
            g_weaponNailgun.magnetFiring = false;
        }
       
        
        if(getControl("pistol")) {
            g_player.selectedWeapon = "pistol";
            soundEffects.nailgunSpin.currentTime = 0;
            soundEffects.nailgunSpin.pause();
        }
        
        if(getControl("nailgun")) {
            g_player.selectedWeapon = "nailgun";
        }
        
        if(getControl("laser")) {
            g_player.selectedWeapon = "laser";
            soundEffects.nailgunSpin.currentTime = 0;
            soundEffects.nailgunSpin.pause();
        }
        
        if(getControl("shotgun")) {
            g_player.selectedWeapon = "shotgun";
            soundEffects.nailgunSpin.currentTime = 0;
            soundEffects.nailgunSpin.pause();
        }
        
        if (getControl("quit")) {
            bgm.outOfCombat.pause();
            bgm.inCombat.pause();
            g_playerFadinHitscans = [];
            
            g_gameWindow= -1;
        }
        
        if (getControl("menu")) {
            bgm.outOfCombat.pause();
            bgm.inCombat.pause();
            g_playerFadinHitscans = [];
            
            g_gameWindow= -1;
        }
        
        if (g_boss_ptr && g_boss_ptr.type.name === G_BOSS_NAME_0) {
            g_lightSource[G_X] = g_boss_ptr.x;
            g_lightSource[G_Y] = g_boss_ptr.y;
        }
        
        updateObjects(deltaTime);
        
        if (g_boss_ptr) {
            let z_factor = 2*g_lightSource[G_Z]/g_screenHeight;
            drawCircle(ctx, 
                g_lightSource[G_X]*(1+z_factor) + g_camera.x - g_player.x*z_factor, 
                g_lightSource[G_Y]*(1+z_factor) + g_camera.y - g_player.y*z_factor, 
                20, g_lightOn ? Color.WHITE : Color.BLACK
            );
            
            if (g_lightOn) {
                let alpha = 0.8;
                for(let i = 0; i<15; i++){
                    
                    alpha/=1.2;
                    
                    drawCircle(ctx, 
                        g_lightSource[G_X]*(1+z_factor) + g_camera.x - g_player.x*z_factor, 
                        g_lightSource[G_Y]*(1+z_factor) + g_camera.y - g_player.y*z_factor, 
                        20 + i, Color.WHITE, alpha
                    );
                    
                }
                ctx.globalAlpha=1;
            } else {
                drawCircle(ctx, 
                    g_lightSource[G_X]*1.2 + g_camera.x - g_player.x*0.2, 
                    g_lightSource[G_Y]*1.2 + g_camera.y - g_player.y*0.2, 
                    20, Color.BLACK
                );
            }
        }
        
        if (g_gameLost) {
            
            bgm.outOfCombat.pause();
            bgm.inCombat.pause();
            
            g_buttonsList.push(new Button(g_screenWidth*0.5, g_screenHeight*0.44, "AGAIN?", 
                function playAgain() {
                    g_gameLost = false;
                    g_buttonsList = [];
                    
                    resetGame(p_currentTime);
                    g_gameWindow = 1;
                }
            ));
                                                        
            g_buttonsList.push(new Button(g_screenWidth*0.5, g_screenHeight*0.56, "QUIT", 
                function backToMenu() {
                    g_buttonsList = [];
                    g_gameLost = false;
                    
                    g_gameWindow= -1;
                }
            ));
                                                        
            g_gameWindow++;
        }
    }
    if (g_gameWindow == 2) { //game over
        for(let i = 0; i < g_buttonsList.length; i++){
            drawButton(g_buttonsList[i]);
        }
    }
    
    g_previousTime = p_currentTime;
    requestAnimationFrame(tick);
}

function updateObjects(deltaTime) {
    g_camera.x = expDecay(
        g_camera.x, 
        g_screenWidth 
            * 0.5 - g_player.x 
            * G_CAMERA_CENTER_PERCENT - g_screenCenterFocus_x 
            * (1-G_CAMERA_CENTER_PERCENT), 
        G_CAMERA_DECAY_SPEED, 
    deltaTime);
    g_camera.y = expDecay(
        g_camera.y, 
        g_screenHeight 
            * 0.5 - g_player.y 
            * G_CAMERA_CENTER_PERCENT - g_screenCenterFocus_y 
            * (1-G_CAMERA_CENTER_PERCENT), 
        G_CAMERA_DECAY_SPEED, 
    deltaTime);
    
    // draw floor color
    ctx.beginPath();
    ctx.fillStyle = G_COLOR_FLOOR;
    ctx.fillRect(
        g_camera.x - g_screenWidth * 0.5 + g_screenCenterFocus_x, 
        g_camera.y - g_screenHeight * 0.5 + g_screenCenterFocus_y, 
    g_screenWidth, g_screenHeight);
    
    // draw FPS
    ctx.textAlign = "right";
    ctx.font = UIFontSize + "px VCR OSD Mono";
    ctx.fillStyle = Color.GREEN;
    let text = Math.round(1000/deltaTime*g_timeDialation).toString();
    ctx.fillText(text, g_screenWidth, g_screenHeight-10*G_PREFERED_SCALAR);
    
    // draw total score
    let totalScore =   2 * g_stats.iTimeUsed
                     + 1 * g_stats.damageDealt
    text = Math.round(totalScore).toString();
    ctx.fillText(text, g_screenWidth, g_screenHeight-23*G_PREFERED_SCALAR);
    ctx.textAlign = "start";
    // draw x, y
    text = Math.round(g_player.x).toString() + ", " + Math.round(g_player.y).toString();
    ctx.fillText(text, 0, g_screenHeight-3);
    
    g_player.updatePosition(deltaTime);
    g_player.display(ctx);
    g_player.stamina = Math.min(G_MAX_STAMINA, g_player.stamina += deltaTime*G_STAMINA_REGEN);

    if (g_player.laser.type.width > 0) {
        if (g_player.laser.type.width == G_HITSCAN_LASER.width) 
        for (let j = 0; j < g_player.laser.hitEnemies.length; j++) {
            let enemy = g_player.laser.hitEnemies[j];
            let newHealth = Math.max(0, enemy.health - g_player.laser.type.damage * deltaTime);
            g_stats.damageDealt += enemy.health - newHealth;
            enemy.health = newHealth
            enemy.vx += g_player.laser.dx * deltaTime * 0.0001;
            enemy.vy += g_player.laser.dy * deltaTime * 0.0001;
        }
        g_player.laser.hitEnemies = [];
        g_player.laser.display(ctx);
        g_player.laser.type.width -= 0.01 * deltaTime;
    }
    
    for (let i = 0; i < g_playerHitscanInstances.length; i++) {
        let hitscan = g_playerHitscanInstances[i];
        
        for (let j = 0; j < hitscan.hitEnemies.length; j++) {
            let enemy = hitscan.hitEnemies[j];
            let newHealth = Math.max(0, enemy.health - hitscan.type.damage);
            g_stats.damageDealt += enemy.health - newHealth;
            enemy.health = newHealth
            enemy.vx += hitscan.dx * 0.03;
            enemy.vy += hitscan.dy * 0.03;
        }
        if (hitscan.type.fade) {
            g_playerFadinHitscans.push(hitscan);
            continue;
        }
        hitscan.display(ctx);
        
    }
    g_playerHitscanInstances = [];
    
    let i = 0;
    while(i < g_playerFadinHitscans.length) {
        let fadinHitscan = g_playerFadinHitscans[i];
        
        if (fadinHitscan.type.width <= 0) {
            g_playerFadinHitscans.remove(i);
            continue;
        }
        
        fadinHitscan.display(ctx)
        fadinHitscan.type.width -= 0.005 * deltaTime;
        
        i++;
    }
    
    i = 0;
    while (i < g_magnetInstances.length) {
        let magnet = g_magnetInstances[i];
        if (g_currentTime - magnet.timeCreated > 5000) {
            g_magnetInstances.remove(i);
            continue;
        }
        magnet.update(deltaTime);
        magnet.display(ctx);
        i++;
    }
    
    i = 0;
    while (i < g_playerBulletInstances.length) {
        let playerBullet = g_playerBulletInstances[i]
        if (playerBullet.timestampDeath < g_currentTime) {
            g_playerBulletInstances.remove(i);
            continue;
        }
        if (!playerBullet.parent) {
            playerBullet.updatePosition(deltaTime);
            
            if (playerBullet.type.bounceOffWalls) {
                if (
                    playerBullet.x + playerBullet.vx*30 < g_screenCenterFocus_x - g_screenWidth*0.5
                    || playerBullet.x + playerBullet.vx*30 > g_screenCenterFocus_x + g_screenWidth*0.5
                ) {
                    playerBullet.vx = -playerBullet.vx;
                    playerBullet.hit = true;
                } else if (
                    playerBullet.y + playerBullet.vy*30 < g_screenCenterFocus_y - g_screenHeight*0.5
                    || playerBullet.y + playerBullet.vy*30 > g_screenCenterFocus_y + g_screenHeight*0.5
                ) {
                    playerBullet.vy = -playerBullet.vy;
                    playerBullet.hit = true;
                }
            } else if (
                playerBullet.x < g_screenCenterFocus_x - g_screenWidth*0.5
                || playerBullet.x > g_screenCenterFocus_x + g_screenWidth*0.5
                || playerBullet.y < g_screenCenterFocus_y - g_screenHeight*0.5
                || playerBullet.y > g_screenCenterFocus_y + g_screenHeight*0.5
            ) {
                g_playerBulletInstances.remove(i);
                continue;
            }
            
            if (playerBullet.hit && g_magnetInstances.length == 0) {
                playerBullet.vx = expDecay(playerBullet.vx, 0, G_BULLET_FRICTION, deltaTime);
                playerBullet.vy = expDecay(playerBullet.vy, 0, G_BULLET_FRICTION, deltaTime);
            }
            
            if (playerBullet.type.sticks) {
                for (let enemy of g_enemyInstances) {
                    if (Math.hypot(enemy.x - playerBullet.x, enemy.y - playerBullet.y) < enemy.type.radius + playerBullet.type.radius) {
                        if (!playerBullet.hit || g_magnetInstances.length > 0) {
                            let newHealth = Math.max(0, enemy.health - playerBullet.type.damage);
                            g_stats.damageDealt += enemy.health - newHealth;
                            enemy.health = newHealth
                        }
                        enemy.vx += playerBullet.vx * 0.0001;
                        enemy.vy += playerBullet.vy * 0.0001;
                        playerBullet.vx = 0;
                        playerBullet.vy = 0;
                        playerBullet.x -= enemy.x;
                        playerBullet.y -= enemy.y;
                        playerBullet.parent = enemy;
                        playerBullet.timestampDeath += 5000;
                        break;
                    }
                }
            } else {
                let hitEnemy = false;
                for (let enemy of g_enemyInstances) {
                    if (Math.hypot(enemy.x - playerBullet.x, enemy.y - playerBullet.y) < enemy.type.radius + playerBullet.type.radius) {
                        let newHealth = Math.max(0, enemy.health - playerBullet.type.damage);
                        g_stats.damageDealt += enemy.health - newHealth;
                        enemy.health = newHealth
                        enemy.vx += playerBullet.vx * 0.04;
                        enemy.vy += playerBullet.vy * 0.04;
                        hitEnemy = true;
                    }
                }
                if (hitEnemy) {
                    g_playerBulletInstances.remove(i);
                    continue;
                }
            }
            
        }
        
        playerBullet.display(ctx);
        i++
    }
    
    i = 0;
    while (i < g_enemyInstances.length) {
        
        var enemy = g_enemyInstances[i];
        enemy.updatePosition(deltaTime);
        enemy.display(ctx);
        
        bgm.outOfCombat.volume = 0;
        bgm.inCombat.volume = g_volumeMusic;
        
        if (enemy.health <= 0) {
            if (enemy.isBoss) {
                g_timeline = [];
                g_nextEvent_ptr = null;
                g_boss_ptr = null;
                g_patternInstanceIDs = 0;
                g_patternInstances = [];
                bgm.outOfCombat.volume = g_volumeMusic;
                bgm.inCombat.volume = 0;
                enemy.x = 10000;
                enemy.y = 10000;
            }
            g_enemyInstances.remove(i);
            continue;
            }
        i++;
        
        if (g_target === enemy) continue;
        let m1 = Math.hypot(g_target.x - g_player.x, g_target.y - g_player.y);
        let m2 = Math.hypot(enemy.x - g_player.x, enemy.y - g_player.y);
        if (m2 < m1) {
            g_target = enemy;
        }
    }
    
    let currentPlayerSpeed = Math.hypot(g_player.vx, g_player.vy);
    let tooFastForCollisions = currentPlayerSpeed > G_PLAYER_BASE_SPEED;
    
    for (let patternInstance of g_patternInstances) {
        let i = 0;
        while (i < patternInstance.length) {
            let bullet = patternInstance[i];
            
            if (bullet.visible && g_collide && Math.hypot(bullet.x - g_player.x, bullet.y - g_player.y) < bullet.bulletType.radius) {
                if (!tooFastForCollisions) {
                    g_gameLost = true; //stops game on return
                    return;
                }
                g_stats.iTimeUsed += deltaTime;
            }
            
            bullet.updatePosition(deltaTime);
            
            if (
                bullet.x < g_screenCenterFocus_x - (g_screenWidth*0.5 + G_BULLET_BARRIER_X)
                || bullet.y < g_screenCenterFocus_y - (g_screenHeight*0.5 + G_BULLET_BARRIER_Y)
                || bullet.x > g_screenCenterFocus_x + g_screenWidth*0.5 + G_BULLET_BARRIER_X
                || bullet.y > g_screenCenterFocus_y + g_screenHeight*0.5 + G_BULLET_BARRIER_Y
            ) {
                patternInstance.remove(i);
                continue;
            }
            
            bullet.display(ctx);
            
            if (!bullet.visible && bullet.showTimestamp < g_currentTime) bullet.visible = true;
            
            i++;
        }
    }
    
    if (g_boss_ptr) {
        ctx.beginPath();
        
        ctx.lineWidth = 45 * G_PREFERED_SCALAR;
        
        ctx.strokeStyle = Color.BLACK;
        ctx.moveTo(0, 0);
        ctx.lineTo(g_screenWidth, 0);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.strokeStyle = Color.RED;
        ctx.moveTo(0, 0);
        ctx.lineTo(g_screenWidth * g_boss_ptr.health/g_boss_ptr.type.maxHealth, 0);
        ctx.stroke();
        
        ctx.fillStyle = Color.WHITE;
        ctx.font = bossBarFontSize + "px VCR OSD Mono";
        ctx.textAlign = "center";
        ctx.fillText(g_boss_ptr.type.name, g_screenWidth*0.5, 19 * G_PREFERED_SCALAR);
        ctx.textAlign = "start";
    }
    
    //lowk fire
    //draw hotbar
    
    if (g_player.selectedWeapon == "pistol") {
        ctx.fillStyle = Color.YELLOW;
        ctx.fillRect(g_screenWidth*0.5-60-2, g_screenHeight-100-2, 35, 35);
    } else {
        ctx.fillStyle = Color.WHITE;
        ctx.fillRect(g_screenWidth*0.5-60, g_screenHeight-100, 30, 30);
    }
    
    if (g_player.selectedWeapon == "shotgun") {
        ctx.fillStyle = Color.ORANGE;
        ctx.fillRect(g_screenWidth*0.5-20-2, g_screenHeight-100-2, 35, 35);
    } else {
        ctx.fillStyle = Color.WHITE;
        ctx.fillRect(g_screenWidth*0.5-20, g_screenHeight-100, 30, 30);
    }
    
    if (g_player.selectedWeapon == "nailgun") {
        ctx.fillStyle = Color.CYAN;
        ctx.fillRect(g_screenWidth*0.5+20-2, g_screenHeight-100-2, 35, 35);
    } else {
        ctx.fillStyle = Color.WHITE;
        ctx.fillRect(g_screenWidth*0.5+20, g_screenHeight-100, 30, 30);
    }
    
    if (g_player.selectedWeapon == "laser") {
        ctx.fillStyle = Color.RED;
        ctx.fillRect(g_screenWidth*0.5+60-2, g_screenHeight-100-2, 35, 35);
    } else {
        ctx.fillStyle = Color.WHITE;
        ctx.fillRect(g_screenWidth*0.5+60, g_screenHeight-100, 30, 30);
    }

}