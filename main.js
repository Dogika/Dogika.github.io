const UIFontSize = (18 * G_PREFERED_SCALAR).toString();
const bossBarFontSize = (18 * G_PREFERED_SCALAR).toString();
const titleFontSize = (115 * G_PREFERED_SCALAR).toString();

function start() {
    document.body.style.background = Color.BLACK;
    let font1 = new FontFaceObserver('VCR OSD Mono');
    
    addEventListener("keydown", keyDown);
    addEventListener("keyup", keyUp);
    addEventListener("mousemove", mouseEvent);
    addEventListener("mousedown", mouseEvent);
    addEventListener("mouseup", mouseEvent);
    //addEventListener("contextmenu", (e) => {e.preventDefault();});
    
    
    font1.load().then(function () {
        console.log('VCR OSD Mono is available');
        let font2 = new FontFaceObserver('BroshK');
        font2.load().then(function () {
            requestAnimationFrame(setInitialTime);
        }, function() {
            console.log('BroshK is not available');
            requestAnimationFrame(setInitialTime);
        });
    }, function () {
        console.log('Atleast VCR OSD Mono is not available');
        let font2 = new FontFaceObserver('BroshK');
        font2.load().then(function () {
            requestAnimationFrame(setInitialTime);
        }, function () {
            console.log('BroshK is not available');
            requestAnimationFrame(setInitialTime);
        });
    });
}

function setInitialTime(g_currentTime) {
    g_previousTime = g_currentTime - 1000/60;
    g_currentTime = g_currentTime;
    requestAnimationFrame(tick);
}

function tick(p_currentTime) {
    g_currentTime = p_currentTime + g_pauseDifference;
    let deltaTime = (g_currentTime - g_previousTime) * g_timeDialation;
    ctx.clearRect(0, 0, g_screenWidth, g_screenHeight);
    if (g_gameWindow == -1) { // initial state
        ctx.font = UIFontSize + "px VCR OSD Mono";
        ctx.fillStyle = Color.BLACK;
        ctx.textAlign = "center";
        ctx.fillText("Click to run game.", g_screenWidth*0.5, g_screenHeight*0.5);
        ctx.textAlign = "start";
        if (!g_mouse.down && !g_gameLoaded) {
            g_mouse.disabled = true;
            g_previousTime = g_currentTime;
            requestAnimationFrame(tick);
            return;
        }
        g_mouse.down = false;
        g_gameLoaded = true;
        
        if (g_paused) {
            g_buttonsList.push(new Button(g_screenWidth*0.5, g_screenHeight*0.5, "RESUME",
                function resume(p_currentTime) {
                    g_buttonsList = [];
                    g_bgm.title.pause();
                    g_pauseDifference = g_currentTime - g_pauseStart;
                    g_paused = false;
                    g_gameWindow++; // g_gameWindow = "levelSelect";
                },
                1, true
            ));
        } else {
            g_buttonsList.push(new Button(g_screenWidth*0.5, g_screenHeight*0.5, "PLAY",
                function play() {
                    g_buttonsList = [];
                    g_bgm.title.pause();
                    resetGame(g_currentTime);
                    
                    g_gameWindow++; // g_gameWindow = "levelSelect";
                },
                1, true
            ));
        }
        
        g_buttonsList.push(new Button(g_screenWidth*0.5, g_screenHeight*0.6, "OPTIONS",
            function settings() {
                g_buttonsList = [];
                
                g_buttonsList.push(new Button(g_screenWidth*0.5, g_screenHeight*0.6, "BACK",
                    function back() {
                        g_buttonsList = [];
                        g_gameWindow = -1;
                        requestAnimationFrame(tick);
                        return;
                    },
                    1
                ));
                
                // timer 
                
                g_gameWindow = "mainMenuOptions";
            },
            1
        ));
        
        g_buttonsList.push(new Button(g_screenWidth*0.5, g_screenHeight*0.7, "QUIT",
            function quit() {
                g_gameWindow = "quit";
            },
            1
        ));
        
        g_buttonsList.push(new Button(g_screenWidth*0.5, g_screenHeight*0.1, "UPDATE BTW",
            function hehe() {
                playSound(soundEffects.explosion, g_volumeSound);
            },
            0.7
        ));
        
        g_gameWindow++;
    }
    if (g_gameWindow == 0) { // menu
        if (!g_bgm.title.playing()) {
            g_bgm.title.volume(0.25);
            g_bgm.title.play();
        }
        ctx.fillStyle = Color.BLACK;
        ctx.fillRect(0, 0, g_screenWidth, g_screenHeight);
        
        ButtonHelper.drawButtons(p_currentTime);
        
        ctx.font = titleFontSize + "px BroshK";
        ctx.textAlign = "center";
        ctx.shadowColor = Color.RED;
        ctx.shadowBlur = 10;
        ctx.fillText("MEGADeATH", g_screenWidth*0.5, g_screenHeight*0.3);
        ctx.shadowBlur = 0;
        ctx.fillStyle = Color.YELLOW;
        ctx.fillText("MEGADeATH", g_screenWidth*0.5+1, g_screenHeight*0.3-1);
        ctx.fillStyle = Color.BLACK;
        ctx.fillText("MEGADeATH", g_screenWidth*0.5-1, g_screenHeight*0.3+1);
        ctx.fillStyle = Color.RED;
        ctx.fillText("MEGADeATH", g_screenWidth*0.5, g_screenHeight*0.3);
        
        ctx.font = UIFontSize + "px VCR OSD Mono";
        ctx.fillStyle = Color.RED;
        ctx.shadowBlur = 10;
        ctx.fillText("-!- WARNING: I am testing out music. -!-", g_screenWidth*0.5, g_screenHeight*0.95);
        ctx.textAlign = "start";
        ctx.shadowBlur = 0;
    }
    if (g_gameWindow == "levelSelect") {
        // tutorial
        
        // level 1
    }
    if (g_gameWindow == "mainMenuOptions") {
        ctx.fillStyle = Color.BLACK;
        ctx.fillRect(0, 0, g_screenWidth, g_screenHeight);
        ButtonHelper.drawButtons(p_currentTime);
    }
    if (g_gameWindow == "quit") {
        console.log("We are sad to see you go...");
        g_bgm.title.pause();
        return;
    }
    if (g_gameWindow == 1) { // main game
        
        if (!g_nextEvent_ptr) {
            g_nextEvent_ptr = g_timeline.remove(0);
        }
        while (g_nextEvent_ptr != undefined && g_currentTime > g_nextEvent_ptr.timestamp) {
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
            WeaponHelper.shootSelectedWeapon();
        } else {
            soundEffects.nailgunSpin.currentTime = 0;
            soundEffects.nailgunSpin.pause();
            g_player.tryingToShoot = false;
        }
        
        if (getControl("alt")) {
            if (!g_weaponNailgun.magnetFiring && g_magnetInstances.length < 3 && g_player.selectedWeapon === "nailgun") {
                g_weaponNailgun.magnetFiring = true;
                if (g_magnetInstances.length == 0) {
                    for (let i = 0; i < g_playerBulletInstances.length; i++) {
                        g_playerBulletInstances[i].timestampDeath += G_MAGNET_LIFE;
                    }
                }
                g_magnetInstances.push(new Magnet(g_currentTime, g_player.x, g_player.y, g_target.x, g_target.y));
            } if (!g_player.coinFiring && g_player.selectedWeapon === "pistol") {
                //g_player.coinFiring = true;
                //g_coinInstances.push(new Coin(g_currentTime, g_player.x, g_player.y, g_player.vx, g_player.vy, g_target.x, g_target.y));
            } else if (g_player.selectedWeapon === "laser") {

            } else if (g_player.selectedWeapon === "shotgun") {
          
            }
        } else {
            g_weaponNailgun.magnetFiring = false;
            if (g_weaponPistol.altCharge > 1) {
                //fire alt
            }
        }
       
        
        if (getControl("pistol") && g_unlocks["pistol"]) {
            g_player.selectedWeapon = "pistol";
            soundEffects.nailgunSpin.currentTime = 0;
            soundEffects.nailgunSpin.pause();
        }
        
        if (getControl("nailgun") && g_unlocks["nailgun"]) {
            g_player.selectedWeapon = "nailgun";
        }
        
        if (getControl("laser") && g_unlocks["laser"]) {
            g_player.selectedWeapon = "laser";
            soundEffects.nailgunSpin.currentTime = 0;
            soundEffects.nailgunSpin.pause();
        }
        
        if (getControl("shotgun") && g_unlocks["shotgun"]) {
            g_player.selectedWeapon = "shotgun";
            soundEffects.nailgunSpin.currentTime = 0;
            soundEffects.nailgunSpin.pause();
        }
        
        if (getControl("punch") && !g_player.punching) {
            g_player.punching = true;
            soundEffects.nailgunSpin.currentTime = 0;
            soundEffects.nailgunSpin.pause();
        }
        
        if (getControl("quit")) {
            g_bgm.outOfCombat.pause();
            g_bgm.inCombat.pause();
            g_playerFadinHitscans = [];
            
            g_gameWindow= -1;
        }
        
        if (getControl("pause")) {
            g_paused = true;
            g_pauseStart = p_currentTime;
            g_bgm.outOfCombat.pause();
            g_bgm.inCombat.pause();
            g_playerFadinHitscans = [];
            
            g_gameWindow= -1;
            requestAnimationFrame(tick);
            return;
        }
        
        let hasLightBoss = false;
        
        for (let i = 0; i < g_bosses.length; i++) {
            let boss = g_bosses[i];
            if (
                boss.type.name === G_BOSS_NAME_0
                || boss.type.name === "HELLFIRE"
            ) {
                g_lightSource[G_X] = boss.x;
                g_lightSource[G_Y] = boss.y;
                hasLightBoss = true;
            }
        }
        
        
        updateObjects(deltaTime);
        
        if (hasLightBoss) {
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
            
            if (g_mouse.down) {
                g_mouse.disabled = true;
                g_mouse.down = false;
            }
            
            g_bgm.outOfCombat.pause();
            g_bgm.inCombat.pause();
            
            g_buttonsList.push(new Button(g_screenWidth*0.5, g_screenHeight*0.44, "AGAIN?", 
                function playAgain() {
                    g_gameLost = false;
                    g_buttonsList = [];
                    
                    resetGame(g_currentTime);
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
        ctx.fillStyle = Color.BLACK;
        ctx.fillRect(0, 0, g_screenWidth, g_screenHeight);
        
        ButtonHelper.drawButtons(p_currentTime);
    }
    if (g_gameWindow === "levelResultsSetup") {
        g_paragraph.textObjects = [];
        g_timeline = [];
        g_nextEvent_ptr = null;
        g_paragraph.align = "left";
        g_paragraph.x = g_screenWidth*0.1;
        g_paragraph.y = g_screenHeight*0.25;
        
        g_timeline.push(new Event(g_currentTime, function() {
            g_paragraph.textObjects.push(new TypedText("Damage Dealt: "+Math.floor(g_stats.damageDealt).toString().padStart(14, ' '), 0, 30));
        }));
        g_timeline.push(new Event(g_currentTime+1500, function() {
            g_paragraph.textObjects.push(new TypedText("Dodge Frames: "+Math.floor(g_stats.iTimeUsed).toString().padStart(14, ' '), 0, 30));
        }));
        g_timeline.push(new Event(g_currentTime+3000, function() {
            g_paragraph.textObjects.push(new TypedText("Enemies Killed: "+Math.floor(g_stats.enemiesKilled).toString().padStart(12, ' '), 0, 30));
        }));
        g_timeline.push(new Event(g_currentTime+4500, function() {
            g_paragraph.textObjects.push(new TypedText("Final Score: "+"S".padStart(15, ' '), 0, 30));
        }));
        
        g_timeline.push(new Event(g_currentTime+4500+840, function() {
            g_buttonsList.push(new Button(g_screenWidth*0.5, g_screenHeight*0.6, "NEXT LEVEL", 
                function nextLevel() {
                    return; // not now
                    g_buttonsList = [];
                    
                    resetGame(g_currentTime);
                    g_gameWindow = 1;
                }
            ));
            
            g_buttonsList.push(new Button(g_screenWidth*0.5, g_screenHeight*0.7, "BACK TO MAIN MENU", 
                function menu() {
                }
            ));
        }));
        
        g_gameWindow = "levelResults";
    }
    if (g_gameWindow === "levelResults") {
        if (!g_nextEvent_ptr) {
            g_nextEvent_ptr = g_timeline.remove(0);
        }
        while (g_nextEvent_ptr != undefined && g_currentTime > g_nextEvent_ptr.timestamp) {
            g_nextEvent_ptr.executableMethod();
            g_timeline.sort(function(a, b){return a.timestamp - b.timestamp});
            g_nextEvent_ptr = g_timeline.remove(0);
        }
        ctx.fillStyle = Color.BLACK;
        ctx.fillRect(0, 0, g_screenWidth, g_screenHeight);
        g_paragraph.update(p_currentTime);
        g_paragraph.display();
        ButtonHelper.drawButtons(p_currentTime);
    }
    
    g_previousTime = g_currentTime;
    requestAnimationFrame(tick);
}

function updateObjects(deltaTime) {
    g_camera.x = MathHelper.expDecay(
        g_camera.x, 
        g_screenWidth 
            * 0.5 - g_player.x 
            * G_CAMERA_CENTER_PERCENT - g_screenCenterFocus_x 
            * (1-G_CAMERA_CENTER_PERCENT), 
        G_CAMERA_DECAY_SPEED, 
    deltaTime);
    g_camera.y = MathHelper.expDecay(
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
    
    if (g_player.punching = true && g_player.lastPunched + G_PUNCH_DURATION < g_currentTime) {
        // for enemy
        // for enemyBullet
        // for playerBullet
        // for door(?)
        g_player.lastPunched = g_currentTime;
    } else {
        g_player.punching = false;
    }
    
    g_player.updatePosition(deltaTime);
    g_player.display(ctx);
    g_player.stamina = Math.min(G_MAX_STAMINA, g_player.stamina += deltaTime*G_STAMINA_REGEN);
    if (g_player.health <= 0) {
        g_gameLost = true;
        playSound(soundEffects.explosion, g_volumeSound);
        return;
    }
    if (g_currentRoom.collisionDamage && g_currentRoom.collisionDamage(g_player.x, g_player.y)) {
        let newHealth = Math.max(0, g_player.health - G_COLLISION_DAMAGE);
        g_stats.damageTaken += g_player.health - newHealth;
        playSound(soundEffects.hurt, 1.5*g_volumeSound);
        g_player.health = newHealth;
    }
    
    if (g_currentRoom.play && !g_currentRoom.played) {
        g_currentRoom.play();
        g_currentRoom.played = true;
    }
    
    if (g_currentRoom.started && !g_currentRoom.finished) {
        g_currentRoom.nextWave();
    }
    
    if (g_player.laser.type.width > 0) {
        if (g_player.laser.type.width == G_HITSCAN_LASER.width) 
        for (let j = 0; j < g_player.laser.hitEnemies.length; j++) {
            let enemy = g_player.laser.hitEnemies[j];
            let newHealth = Math.max(0, enemy.health - g_player.laser.type.damage * deltaTime);
            g_stats.damageDealt += enemy.health - newHealth;
            enemy.health = newHealth
            enemy.vx += g_player.laser.dx * deltaTime * 0.0001;
            enemy.vy += g_player.laser.dy * deltaTime * 0.0001;
            playSound(soundEffects.hit, 0.5*g_volumeSound);
            g_bloodSplatters.push(new Blood(g_currentTime, g_player.laser.origin_x + g_player.laser.dx, g_player.laser.origin_y + g_player.laser.dy, g_player.selectedWeapon));
        }
        g_player.laser.hitEnemies = [];
        ctx.shadowColor = g_player.laser.type.color;
        ctx.shadowBlur = g_player.laser.type.width*2;
        g_player.laser.display(ctx);
        ctx.shadowBlur = 0;
        g_player.laser.type.width -= 0.01 * deltaTime;
    }
    
    for (let i = 0; i < g_playerHitscanInstances.length; i++) {
        let hitscan = g_playerHitscanInstances[i];
        
        for (let j = 0; j < hitscan.hitEnemies.length; j++) {
            let enemy = hitscan.hitEnemies[j];
            let newHealth = Math.max(0, enemy.health - hitscan.type.damage);
            g_stats.damageDealt += enemy.health - newHealth;
            enemy.health = newHealth
            let [n_x, n_y] = MathHelper.setMagnitude(0.03, [hitscan.dx, hitscan.dy]);
            enemy.vx += n_x;
            enemy.vy += n_y;
            playSound(soundEffects.hit, 0.5*g_volumeSound);
            g_bloodSplatters.push(new Blood(g_currentTime, hitscan.origin_x + hitscan.dx, hitscan.origin_y + hitscan.dy, g_player.selectedWeapon));
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
    while (i < g_coinInstances.length) {
        let coin = g_coinInstances[i];
        if (g_currentTime - magnet.timeCreated > 1500) {
            g_magnetInstances.remove(i);
            continue;
        }
        magnet.update(deltaTime);
        magnet.display(ctx);
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
    while (i < g_bloodSplatters.length) {
        let blood = g_bloodSplatters[i];
        
        if (
            blood.spawnTime + G_BLOOD_DURATION < g_currentTime
            || blood.heal(deltaTime)
        ) {
            g_bloodSplatters.remove(i);
            continue;
        }
        
        blood.display();
        
        i++;
    }
    
    i = 0;
    while(i < g_consumableInstances.length) {
        let consumable = g_consumableInstances[i];
        
        if(consumable.radius + g_player.radius > Math.sqrt((g_player.x - consumable.x) * (g_player.x - consumable.x) + (g_player.y - consumable.y) * (g_player.y - consumable.y))){
            consumable.fn();
            g_consumableInstances.remove(i);
            continue;
        }
        else {
            consumable.display(ctx);
        }
        
        i++; //forgot
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
                playerBullet.vx = MathHelper.expDecay(playerBullet.vx, 0, G_BULLET_FRICTION, deltaTime);
                playerBullet.vy = MathHelper.expDecay(playerBullet.vy, 0, G_BULLET_FRICTION, deltaTime);
            }
            
            if (playerBullet.type.sticks) {
                for (let enemy of g_enemyInstances) {
                    if (Math.hypot(enemy.x - playerBullet.x, enemy.y - playerBullet.y) < enemy.type.radius + playerBullet.type.radius) {
                        if (!playerBullet.hit || g_magnetInstances.length > 0) {
                            let newHealth = Math.max(0, enemy.health - playerBullet.type.damage);
                            g_stats.damageDealt += enemy.health - newHealth;
                            enemy.health = newHealth
                            playSound(soundEffects.hit, 0.5*g_volumeSound);
                            g_bloodSplatters.push(new Blood(g_currentTime, playerBullet.x, playerBullet.y, g_player.selectedWeapon));
                        }
                        enemy.vx += playerBullet.vx * 0.0001;
                        enemy.vy += playerBullet.vy * 0.0001;
                        playerBullet.vx = 0;
                        playerBullet.vy = 0;
                        playerBullet.x -= enemy.x;
                        playerBullet.y -= enemy.y;
                        playerBullet.parent = enemy;
                        playerBullet.timestampDeath += 3000;
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
                        enemy.vx += playerBullet.vx * 0.004;
                        enemy.vy += playerBullet.vy * 0.004;
                        hitEnemy = true;
                        playSound(soundEffects.hit, 0.5*g_volumeSound);
                        g_bloodSplatters.push(new Blood(g_currentTime, playerBullet.x, playerBullet.y, g_player.selectedWeapon));
                        g_bloodSplatters.push(new Blood(g_currentTime, playerBullet.x, playerBullet.y, g_player.selectedWeapon));
                    }
                }
                if (hitEnemy) {
                    g_playerBulletInstances.remove(i);
                    continue;
                }
            }
            
        } else if (g_player.laser.type.width > 0 && g_player.laser.distanceSquared(playerBullet.parent.x + playerBullet.x, playerBullet.parent.y + playerBullet.y) < 5 * 5) {
            let newHealth = Math.max(0, playerBullet.parent.health - playerBullet.type.damage*0.6);
            g_stats.damageDealt += playerBullet.parent.health - newHealth;
            playerBullet.parent.health = newHealth;
            playerBullet.parent.vx -= playerBullet.x / playerBullet.parent.type.radius * 0.002;
            playerBullet.parent.vy -= playerBullet.y / playerBullet.parent.type.radius * 0.002;
            g_bloodSplatters.push(new Blood(g_currentTime, playerBullet.x, playerBullet.y, g_player.selectedWeapon));
            g_playerBulletInstances.remove(i);
            continue;
        }
        
        playerBullet.display(ctx);
        i++
    }
    
    i = 0;
    while (i < g_enemyInstances.length) {
        
        var enemy = g_enemyInstances[i];
        
        enemy.updatePosition(deltaTime);
        enemy.attack();
        enemy.display(ctx);
        
        if (enemy.health <= 0) {
            if (enemy.isBoss) {
                enemy.x = 10000;
                enemy.y = 10000;
                for (let j = 0; j < g_bosses.length; j++) {
                    if (g_bosses[j].ID == enemy.ID) {
                        g_bosses.remove(j);
                        break;
                    }
                }
            }
            playSound(soundEffects.explosion, g_volumeSound);
            g_enemyInstances.remove(i);
            g_stats.enemiesKilled++;
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
    
    if (g_enemyInstances.length > 0) {
        if (g_bgm.inCombat.volume() === 0) {
            g_bgm.inCombat.volume(g_volumeMusic);
            g_bgm.outOfCombat.volume(0);
        }
    } else if (g_bgm.outOfCombat.volume() === 0) {
        g_bgm.inCombat.volume(0);
        g_bgm.outOfCombat.volume(g_volumeMusic);
    }
    
    i = 0;
    while (i < g_spawnPortals.length) {
        let portal = g_spawnPortals[i];
        let width = 100*portal.size;
        let height = 100*portal.size;
        ctx.globalAlpha = Math.max(0, 1-(Math.max(0.5, portal.size)+0.5));
        ctx.drawImage(PORTAL_SPRITE, portal.x+g_camera.x-width*0.5, portal.y+g_camera.y-height*0.5, width, height);
        portal.size += 0.004 * deltaTime;
        i++;
    }
    ctx.globalAlpha = 1;
    
    let currentPlayerSpeed = Math.hypot(g_player.vx, g_player.vy);
    let tooFastForCollisions = currentPlayerSpeed > G_PLAYER_BASE_SPEED+0.00001;
    
    for (let patternInstance of g_patternInstances) {
        let i = 0;
        while (i < patternInstance.length) {
            let bullet = patternInstance[i];
            
            let dx = bullet.x - g_player.x;
            let dy = bullet.y - g_player.y;
            if (bullet.visible && g_collide && dx * dx + dy * dy < bullet.type.radius * bullet.type.radius) {
                if (!tooFastForCollisions) {
                    let newHealth = Math.max(0, g_player.health - bullet.type.damage);
                    g_stats.damageTaken += g_player.health - newHealth;
                    g_player.health = newHealth;
                    playSound(soundEffects.hurt, 1.5*g_volumeSound);
                    patternInstance.remove(i);
                    continue;
                } else {
                    g_stats.iTimeUsed += deltaTime;
                }
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
    
    if (g_currentRoom.display) g_currentRoom.display();
    
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

    
    for (let i = 0; i < g_bosses.length; i++) {
        let boss = g_bosses[i];
        
        ctx.beginPath();
        
        ctx.lineWidth = 23 * G_PREFERED_SCALAR;
        
        ctx.strokeStyle = Color.BLACK;
        ctx.moveTo(0, ctx.lineWidth*0.5+i*(ctx.lineWidth+5));
        ctx.lineTo(g_screenWidth, ctx.lineWidth*0.5+i*(ctx.lineWidth+5));
        ctx.stroke();
        
        ctx.beginPath();
        ctx.strokeStyle = Color.RED;
        ctx.moveTo(0, ctx.lineWidth*0.5+i*(ctx.lineWidth+5));
        ctx.lineTo(g_screenWidth * boss.health/boss.type.maxHealth, ctx.lineWidth*0.5+i*(ctx.lineWidth+5));
        ctx.stroke();
        
        ctx.fillStyle = Color.WHITE;
        ctx.font = bossBarFontSize + "px VCR OSD Mono";
        ctx.textAlign = "center";
        ctx.fillText(boss.type.name, g_screenWidth*0.5, 19 * G_PREFERED_SCALAR+i*(ctx.lineWidth+5));
        ctx.textAlign = "start";
    }
    
    //lowk fire
    //draw hotbar
    
    const HOTBAR_SIDE = 30;
    const HOTBAR_SIDE_SELECT = 35;
    const SIZE_DIFF = HOTBAR_SIDE_SELECT-HOTBAR_SIDE;
    
    let len = 0;
    
    i = 0;
    if (g_unlocks["pistol"])  len++;
    if (g_unlocks["shotgun"]) len++;
    if (g_unlocks["nailgun"]) len++;
    if (g_unlocks["laser"])   len++;
    
    let starting_x = -(0.5 * len - 0.5);
    
    if (g_unlocks["pistol"]) {
        if (g_player.selectedWeapon == "pistol") {
            ctx.fillStyle = Color.YELLOW;
            ctx.fillRect(g_screenWidth*0.5 + (starting_x+i)*HOTBAR_SIDE_SELECT - HOTBAR_SIDE_SELECT*0.5, g_screenHeight*0.9 - HOTBAR_SIDE_SELECT*0.5, HOTBAR_SIDE_SELECT, HOTBAR_SIDE_SELECT);
        } else {
            ctx.fillStyle = Color.WHITE;
            ctx.fillRect(g_screenWidth*0.5 + (starting_x+i)*HOTBAR_SIDE_SELECT - HOTBAR_SIDE*0.5, g_screenHeight*0.9 - HOTBAR_SIDE*0.5, HOTBAR_SIDE, HOTBAR_SIDE);
        }
        ctx.fillStyle = Color.BLACK;
        ctx.fillText("1", g_screenWidth*0.5 + (starting_x+i)*HOTBAR_SIDE_SELECT - HOTBAR_SIDE*0.5, g_screenHeight*0.9 - HOTBAR_SIDE*0.5+20);
        i++;
    }
    
    if (g_unlocks["shotgun"]) {
        if (g_player.selectedWeapon == "shotgun") {
            ctx.fillStyle = Color.ORANGE;
            ctx.fillRect(g_screenWidth*0.5 + (starting_x+i)*HOTBAR_SIDE_SELECT - HOTBAR_SIDE_SELECT*0.5, g_screenHeight*0.9 - HOTBAR_SIDE_SELECT*0.5, HOTBAR_SIDE_SELECT, HOTBAR_SIDE_SELECT);
        } else {
            ctx.fillStyle = Color.WHITE;
            ctx.fillRect(g_screenWidth*0.5 + (starting_x+i)*HOTBAR_SIDE_SELECT - HOTBAR_SIDE*0.5, g_screenHeight*0.9 - HOTBAR_SIDE*0.5, HOTBAR_SIDE, HOTBAR_SIDE);
        }
        ctx.fillStyle = Color.BLACK;
        ctx.fillText("2", g_screenWidth*0.5 + (starting_x+i)*HOTBAR_SIDE_SELECT - HOTBAR_SIDE*0.5, g_screenHeight*0.9 - HOTBAR_SIDE*0.5+20);
        i++;
    }
    
    if (g_unlocks["nailgun"]) {
        if (g_player.selectedWeapon == "nailgun") {
            ctx.fillStyle = Color.CYAN;
            ctx.fillRect(g_screenWidth*0.5 + (starting_x+i)*HOTBAR_SIDE_SELECT - HOTBAR_SIDE_SELECT*0.5, g_screenHeight*0.9 - HOTBAR_SIDE_SELECT*0.5, HOTBAR_SIDE_SELECT, HOTBAR_SIDE_SELECT);
        } else {
            ctx.fillStyle = Color.WHITE;
            ctx.fillRect(g_screenWidth*0.5 + (starting_x+i)*HOTBAR_SIDE_SELECT - HOTBAR_SIDE*0.5, g_screenHeight*0.9 - HOTBAR_SIDE*0.5, HOTBAR_SIDE, HOTBAR_SIDE);
        }
        ctx.fillStyle = Color.BLACK;
        ctx.fillText("3", g_screenWidth*0.5 + (starting_x+i)*HOTBAR_SIDE_SELECT - HOTBAR_SIDE*0.5, g_screenHeight*0.9 - HOTBAR_SIDE*0.5+20);
        i++;
    }
    
    if (g_unlocks["laser"]) {
        if (g_player.selectedWeapon == "laser") {
            ctx.fillStyle = Color.RED;
            ctx.fillRect(g_screenWidth*0.5 + (starting_x+i)*HOTBAR_SIDE_SELECT - HOTBAR_SIDE_SELECT*0.5, g_screenHeight*0.9 - HOTBAR_SIDE_SELECT*0.5, HOTBAR_SIDE_SELECT, HOTBAR_SIDE_SELECT);
        } else {
            ctx.fillStyle = Color.WHITE;
            ctx.fillRect(g_screenWidth*0.5 + (starting_x+i)*HOTBAR_SIDE_SELECT - HOTBAR_SIDE*0.5, g_screenHeight*0.9 - HOTBAR_SIDE*0.5, HOTBAR_SIDE, HOTBAR_SIDE);
        }
        ctx.fillStyle = Color.BLACK;
        ctx.fillText("4", g_screenWidth*0.5 + (starting_x+i)*HOTBAR_SIDE_SELECT - HOTBAR_SIDE*0.5, g_screenHeight*0.9 - HOTBAR_SIDE*0.5+20);
    }
    
    if (g_paragraph) {
        g_paragraph.update(g_currentTime);
        g_paragraph.display();
    }
    
    //draw healthbar
    ctx.fillStyle = Color.WHITE;
    ctx.fillRect(g_screenWidth/2-75, g_screenHeight-40, 150, 15);
    ctx.fillStyle = Color.RED;
    ctx.fillRect(g_screenWidth/2-75, g_screenHeight-40, 150*(g_player.health/G_PLAYER_MAX_HEALTH), 15);
}
