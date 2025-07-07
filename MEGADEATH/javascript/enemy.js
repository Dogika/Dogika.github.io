function EnemyObject(type=null, x=0, y=0, ID=-1) {
    this.type = type;
    this.ID = ID;
    this.x = x;
    this.y = y;
    this.health;
    this.movementType = "timeIntegration";
    this.attackType;
    this.vx = 0;
    this.vy = 0;
    this.isBoss = false;
    this.state = "idle";
    this.attacks = [];
    this.patternIndex = 0;
    this.attackIndex = 0;
    
    this.attack = function() {
        if (this.state !== "idle" || !this.attacks) return;
        
        if (this.attackType === "loop") {
            if (this.attackIndex >= this.attacks.length) {
                this.attackIndex = 0;
                this.patternsFired = 0;
                this.attacked = false;
            }
            
            if (this.attacked && this.patternsFired !== this.attacks[this.attackIndex].length) return;
            
            this.deployPattern(this.attackIndex);
            
            this.attackIndex++;
        } else if (this.attackType === "distanceBased") {
            if (this.attacked && this.patternsFired !== this.attacks[this.attackIndex].length) return;
            
            for (let i = 0; i < this.distances.length; i++) {
                let dx = g_player.x - this.x;
                let dy = g_player.y - this.y;
                
                if (dx * dx + dy * dy > this.distances[i] * this.distances[i]) continue;
                
                this.deployPattern(i);
                
                return;
            }
        } else if (this.attackType === "random") {
            if (this.attacked && this.patternsFired !== this.attacks[this.attackIndex].length) return;
            
            let randomIndex = Math.floor(Math.random() * this.attacks.length);
            
            this.deployPattern(randomIndex);
        }
    }
    
    this.deployPattern = function(attackIndex) {
        this.patternsFired = 0;
        this.attackIndex = attackIndex;
        this.attacked = true;
        for (let i = 0; i < this.attacks[this.attackIndex].length; i++) {
            let behavior = this.attacks[this.attackIndex][i];
            g_timeline.push(new Event(
                g_currentTime + behavior.timestamp + this.type.attackDelays[this.attackIndex], 
                createFirePatternMethod(behavior, this)
            ));
        }
    }
    
    this.updatePosition = function(deltaTime) {
        if (this.movementType == "timeIntegration") {
            this.x += this.vx * deltaTime;
            this.y += this.vy * deltaTime;
        } else if (this.movementType == "positionDifferenceDecay") {
            let dx = this.final_x - this.x;
            let dy = this.final_y - this.y;
            if (dx * dx + dy * dy > 1) {
                this.state = "moving"
                this.x = expDecay(this.x, this.final_x, this.decaySpeed, deltaTime);
                this.y = expDecay(this.y, this.final_y, this.decaySpeed, deltaTime);
            } else {
                this.state = "idle";
            }
        } else if (this.movementType == "followTarget") {
            this.vx += (g_player.x - this.x) * this.acceleration * deltaTime;
            this.vy += (g_player.y - this.y) * this.acceleration * deltaTime;
            let m = Math.hypot(this.vx, this.vy);
            [this.vx, this.vy] = MathHelper.scale2(Math.min(m, this.maxSpeed), MathHelper.normalize([this.vx, this.vy]));
            this.move(this.vx * deltaTime, this.vy * deltaTime);
            this.vx *= 1 - this.friction * deltaTime;
            this.vy *= 1 - this.friction * deltaTime;
        } else if (this.movementType === "sniper") {
            let dx = g_player.x - this.x;
            let dy = g_player.y - this.y;
            if (this.state === "idle") {
                if (dx * dx + dy * dy < this.minDist * this.minDist) {
                    this.state = "runningAway";
                    this.vx = -dx*0.00001;
                    this.vy = -dy*0.00001;
                } else
                if (dx * dx + dy * dy > this.maxDist * this.maxDist) {
                    this.state = "closingDistance";
                    this.vx = dx*0.00001;
                    this.vy = dy*0.00001;
                }
            } else {
                if (this.state === "runningAway") {
                    dx *= -1;
                    dy *= -1;
                }
                if (
                    this.state === "runningAway" 
                    && dx * dx + dy * dy > (this.minDist + this.seperation) * (this.minDist + this.seperation)
                    || this.state === "closingDistance"
                    && dx * dx + dy * dy < (this.maxDist - this.seperation) * (this.maxDist - this.seperation)
                ) {
                    this.state = "idle";
                    this.vx *= 0.1;
                    this.vy *= 0.1;
                    return;
                } 
                this.vx += dx * this.acceleration * deltaTime;
                this.vy += dy * this.acceleration * deltaTime;
                let m = Math.hypot(this.vx, this.vy);
                [this.vx, this.vy] = MathHelper.scale2(Math.min(m, this.maxSpeed), MathHelper.normalize([this.vx, this.vy]));
            }
            this.move(this.vx * deltaTime, this.vy * deltaTime);
            this.vx *= 1 - this.friction * deltaTime;
            this.vy *= 1 - this.friction * deltaTime;
        }
    }
    
    this.move = function(vx, vy) {
        let newPos_x = this.x + vx * G_PREFERED_SCALAR;
        let newPos_y = this.y + vy * G_PREFERED_SCALAR;
        
        let center_x = Math.floor((this.x + g_screenWidth*0.5)/g_screenWidth) * g_screenWidth;
        let center_y = Math.floor((this.y + g_screenHeight*0.5)/g_screenHeight) * g_screenHeight;
        
        if (this.x - this.type.radius <= g_screenBoundLeft + center_x || this.x + this.type.radius >= g_screenBoundRight + center_x) this.x = this.prev_x;
        if (this.y - this.type.radius <= g_screenBoundTop + center_y || this.y + this.type.radius >= g_screenBoundBottom + center_y) this.y = this.prev_y;

        this.prev_x = this.x;
        this.prev_y = this.y;
        if (newPos_x - this.type.radius > g_screenBoundLeft + center_x && newPos_x + this.type.radius < g_screenBoundRight + center_x) 
            this.x = newPos_x;
        if (newPos_y - this.type.radius > g_screenBoundTop + center_y && newPos_y + this.type.radius < g_screenBoundBottom + center_y) 
            this.y = newPos_y;
    }
    
    this.display = function(ctx) {
        
        let show_x = this.x + g_camera.x;
        let show_y = this.y + g_camera.y;
        
        if (this.isBoss) {
            if (show_x < this.type.radius) {
                addTriangleBorder(ctx, this.type.radius, show_y, show_x-g_screenWidth*0.5, show_y-g_screenHeight*0.5, 10);
                ctx.fillStyle = Color.BLACK;
                ctx.fill();
                ctx.strokeStyle = Color.WHITE;
                ctx.lineWidth = 1;
                ctx.stroke();
                addTriangleBorder(ctx, this.type.radius, show_y, show_x-g_screenWidth*0.5, show_y-g_screenHeight*0.5, 6);
                ctx.fillStyle = this.type.color;
                ctx.fill();
            } else
            if (show_x > g_screenWidth + this.type.radius) {
                addTriangleBorder(ctx, g_screenWidth - this.type.radius, show_y, show_x-g_screenWidth*0.5, show_y-g_screenHeight*0.5, 10);
                ctx.fillStyle = Color.BLACK;
                ctx.fill();
                ctx.strokeStyle = Color.WHITE;
                ctx.lineWidth = 1;
                ctx.stroke();
                addTriangleBorder(ctx, g_screenWidth - this.type.radius, show_y, show_x-g_screenWidth*0.5, show_y-g_screenHeight*0.5, 6);
                ctx.fillStyle = this.type.color;
                ctx.fill();
            } else
            if (show_y < this.type.radius) {
                addTriangleBorder(ctx, show_x, this.type.radius, show_x-g_screenWidth*0.5, show_y-g_screenHeight*0.5, 10);
                ctx.fillStyle = Color.BLACK;
                ctx.fill();
                ctx.strokeStyle = Color.WHITE;
                ctx.lineWidth = 1;
                ctx.stroke();
                addTriangleBorder(ctx, show_x, this.type.radius, show_x-g_screenWidth*0.5, show_y-g_screenHeight*0.5, 6);
                ctx.fillStyle = this.type.color;
                ctx.fill();
            } else
            if (show_y > g_screenHeight + this.type.radius) {
                addTriangleBorder(ctx, show_x, g_screenHeight - this.type.radius, show_x-g_screenWidth*0.5, show_y-g_screenHeight*0.5, 10);
                ctx.fillStyle = Color.BLACK;
                ctx.fill();
                ctx.strokeStyle = Color.WHITE;
                ctx.lineWidth = 1;
                ctx.stroke();
                addTriangleBorder(ctx, show_x, g_screenHeight - this.type.radius, show_x-g_screenWidth*0.5, show_y-g_screenHeight*0.5, 6);
                ctx.fillStyle = this.type.color;
                ctx.fill();
            }
        }
        
        if (this.type.name !== G_BOSS_NAME_0)
            castShadow(ctx, this.x, this.y, this.type.radius);
        
        //body
        ctx.beginPath();
        ctx.arc(show_x, show_y, this.type.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.type.color;
        ctx.fill();
        
        let dx, dy;
        if (this.state === "idle") {
            [dx, dy] = MathHelper.normalize([g_player.x - this.x, g_player.y - this.y]);
        } else {
            [dx, dy] = MathHelper.normalize([this.vx, this.vy]);
        }
        dx *= this.type.radius * 0.707;
        dy *= this.type.radius * 0.707;
        
        drawCircle(ctx, show_x + dx-dy, show_y + dx+dy, this.type.radius*0.4, Color.WHITE);
        drawCircle(ctx, show_x + dx+dy, show_y + dy-dx, this.type.radius*0.4, Color.WHITE);
    }
}

function EnemyType(name, behaviors=[], moveBehavior, attackBehavior, maxHealth=100, radius, color, attackDelays=3000) {
    this.name = name;
    this.behaviors = behaviors;
    this.maxHealth = maxHealth;
    this.radius = radius * G_PREFERED_SCALAR;
    this.color = color;
    this.grounded; // if not grounded will allow player to knock them back
    this.moveBehavior = moveBehavior;
    this.attackBehavior = attackBehavior;
    this.attackDelays = attackDelays;
}

function spawnEnemy(typeCopy, x, y, isBoss=false) {
    let enemyInstanceID = g_enemyInstanceIDs++;
    let enemy = new EnemyObject(typeCopy, x, y, enemyInstanceID);
    
    enemy.health = typeCopy.maxHealth;
    if (isBoss) {
        g_bosses.push(enemy);
        enemy.isBoss = true;
    }
    
    g_enemyInstances.push(enemy);
    
    for (let behavior of enemy.type.behaviors) {
        if (!enemy.attacks[behavior.index]) enemy.attacks[behavior.index] = [];
        enemy.attacks[behavior.index] = enemy.attacks[behavior.index].concat(behavior.behaviorList);
    }
    
    
    if (!enemy.type.attackDelays.length) {
        let sameValue = enemy.type.attackDelays;
        enemy.type.attackDelays = [];
        for (let i = 0; i < enemy.attacks.length; i++) {
            enemy.type.attackDelays[i] = sameValue;
        }
    }
    
    createMoveEnemyMethod(enemy.type.moveBehavior, enemy)();
    
    createAttackEnemyMethod(enemy.type.attackBehavior, enemy)();
}
