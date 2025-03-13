function EnemyObject(type=null, x=0, y=0) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.health;
    this.movementType = "timeIntegration";
    this.vx = 0;
    this.vy = 0;
    this.isBoss = false;
    this.state = "idle";
    
    this.updatePosition = (deltaTime) => {
        
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
            [this.vx, this.vy] = scale2(Math.min(m, this.maxSpeed), normalize([this.vx, this.vy]));
            this.move(this.vx * deltaTime, this.vy * deltaTime);
            this.vx *= 1 - this.friction * deltaTime;
            this.vy *= 1 - this.friction * deltaTime;
        } else if (this.movementType === "sniper") {
            let dx = g_player.x - this.x;
            let dy = g_player.y - this.y;
            if (this.state === "idle") {
                if (dx * dx + dy * dy < this.minDist * this.minDist) {
                    this.state = "runningAway";
                    this.vx *= 0.1;
                    this.vy *= 0.1;
                } else
                if (dx * dx + dy * dy > this.maxDist * this.maxDist) {
                    this.state = "closingDistance";
                    this.vx *= 0.1;
                    this.vy *= 0.1;
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
                    && dx * dx + dy * dy < (this.minDist + this.seperation) * (this.minDist + this.seperation)
                ) {
                    this.state = "idle";
                    this.vx *= 0.1;
                    this.vy *= 0.1;
                    return;
                } 
                this.vx += dx * this.acceleration * deltaTime;
                this.vy += dy * this.acceleration * deltaTime;
                let m = Math.hypot(this.vx, this.vy);
                [this.vx, this.vy] = scale2(Math.min(m, this.maxSpeed), normalize([this.vx, this.vy]));
            }
            this.move(this.vx * deltaTime, this.vy * deltaTime);
            this.vx *= 1 - this.friction * deltaTime;
            this.vy *= 1 - this.friction * deltaTime;
        }
    }
    
    this.move = (vx, vy) => {
        let newPos_x = this.x + vx * G_PREFERED_SCALAR;
        let newPos_y = this.y + vy * G_PREFERED_SCALAR;
        
        if (this.x - this.type.radius <= g_screenBoundLeft || this.x + this.type.radius >= g_screenBoundRight) this.x = this.prev_x;
        if (this.y - this.type.radius <= g_screenBoundTop || this.y + this.type.radius >= g_screenBoundBottom) this.y = this.prev_y;

        this.prev_x = this.x;
        this.prev_y = this.y;
        if (newPos_x - this.type.radius > g_screenBoundLeft && newPos_x + this.type.radius < g_screenBoundRight) 
            this.x = newPos_x;
        if (newPos_y - this.type.radius > g_screenBoundTop && newPos_y + this.type.radius < g_screenBoundBottom) 
            this.y = newPos_y;
    }
    
    this.display = (ctx) => {
        
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
            [dx, dy] = normalize([g_player.x - this.x, g_player.y - this.y]);
        } else {
            [dx, dy] = normalize([this.vx, this.vy]);
        }
        dx *= this.type.radius * 0.707;
        dy *= this.type.radius * 0.707;
        
        drawCircle(ctx, show_x + dx-dy, show_y + dx+dy, this.type.radius*0.4, Color.WHITE);
        drawCircle(ctx, show_x + dx+dy, show_y + dy-dx, this.type.radius*0.4, Color.WHITE);
    }
}

function EnemyType(name, behaviors=[], maxHealth=100, radius, color) {
    this.name = name;
    this.behaviors = behaviors;
    this.maxHealth = maxHealth;
    this.radius = radius * G_PREFERED_SCALAR;
    this.color = color;
    this.grounded; // if not grounded will allow player to knock them back
}

function spawnEnemy(typeCopy, x, y, isBoss=false) {
    let enemyInstanceID = g_enemyInstanceIDs++;
    let enemy = new EnemyObject(typeCopy, x, y);
    enemy.health = typeCopy.maxHealth;
    if (isBoss) {
        g_boss_ptr = enemy;
        enemy.isBoss = true;
    }
    g_enemyInstances[enemyInstanceID] = enemy;
    for (let behavior of enemy.type.behaviors) {
        let executableMethod = behavior.type == "firePattern" ? createFirePatternMethod(behavior, enemy) : createMoveEnemyMethod(behavior, enemy);
        g_timeline.push(new Event(g_currentTime + behavior.timestamp * g_invTimeDialation, executableMethod));
    }
}