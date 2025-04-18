function Player(p_initial_x, p_initial_y, p_initial_vx=0, p_initial_vy=0) {
    this.x = p_initial_x;
    this.y = p_initial_y;
    this.prev_x = 0;
    this.prev_y = 0;
    this.vx = p_initial_vx;
    this.vy = p_initial_vy;
    this.radius = 8 * G_PREFERED_SCALAR;
    this.canDash = true;
    this.stamina = G_MAX_STAMINA;
    this.selectedWeapon = "";
    this.health = G_PLAYER_MAX_HEALTH;
    this.laser = new Hitscan(G_HITSCAN_LASER, p_initial_x, p_initial_y, p_initial_vx, p_initial_vy);
    this.laser.type.width = 0;
    this.room_i;
    this.room_j;
    
    this.updatePosition = (deltaTime) => {
        if (!g_keyboard[" "] && !this.canDash) {
            this.canDash = true;
        }
        
        let [colliding_x, colliding_y] = g_currentRoom.collisionWall(this.x, this.y, this.x, this.y, this.radius);
        
        if (colliding_x) this.x = this.prev_x;
        if (colliding_y) this.y = this.prev_y;
        
        let staminaDrain = this.calculateVelocity(deltaTime);
        
        if (staminaDrain > 0) {
            this.stamina -= staminaDrain;
            this.canDash = false;
        }
        
        this.prev_x = this.x;
        this.prev_y = this.y;
        
        [colliding_x, colliding_y] = g_currentRoom.collisionWall(this.x, this.y, this.x + this.vx * deltaTime, this.y + this.vy * deltaTime, this.radius);
        
        if (!colliding_x) 
            this.x += this.vx * G_PREFERED_SCALAR * deltaTime;
        if (!colliding_y) 
            this.y += this.vy * G_PREFERED_SCALAR * deltaTime;
        
        let newRoom_i = Math.floor((this.x + g_screenWidth*0.5)/g_screenWidth);
        let newRoom_j = Math.floor((this.y + g_screenHeight*0.5)/g_screenHeight);
        if (newRoom_i !== this.room_i || newRoom_j !== this.room_j) {
            this.room_i = newRoom_i;
            this.room_j = newRoom_j;
            g_screenCenterFocus_x = this.room_i * g_screenWidth;
            g_screenCenterFocus_y = this.room_j * g_screenHeight;
            //g_paragraphs.tutorial
            g_currentRoom = g_currentLevel[this.room_j][this.room_i];
        }
    }
    
    this.calculateVelocity = (deltaTime) => {
        let target_vx = getControl("moveRight") - getControl("moveLeft");
        let target_vy = getControl("moveDown") - getControl("moveUp");
        let tv_magnitude = Math.hypot(target_vx, target_vy);
        target_vx *= G_PLAYER_BASE_SPEED;
        target_vy *= G_PLAYER_BASE_SPEED;
        if (tv_magnitude > 0) {
            if (soundEffects.step.currentTime == soundEffects.step.duration && !this.dashing)
                playSound(soundEffects.step, 0.2);
            target_vx /= tv_magnitude;
            target_vy /= tv_magnitude;
            this.vx = MathHelper.expDecay(this.vx, target_vx, 0.01, deltaTime);
            this.vy = MathHelper.expDecay(this.vy, target_vy, 0.01, deltaTime);
        } else {
            if (this.vx < -0.0001 || this.vx > 0.0001 || this.vy < -0.0001 || this.vy > 0.0001) {
                this.vx = MathHelper.expDecay(this.vx, target_vx, 0.01, deltaTime);
                this.vy = MathHelper.expDecay(this.vy, target_vy, 0.01, deltaTime);
            }
        }
        
        
        let staminaDrain = Math.hypot(this.vx, this.vy) / G_PLAYER_BASE_SPEED;
        if (this.dashing && staminaDrain * G_PLAYER_BASE_SPEED <= G_PLAYER_BASE_SPEED+0.05) {
            this.dashing = false;
        }
        if (getControl("dash") && this.canDash && this.stamina >= staminaDrain && tv_magnitude > 0) {
            this.dashing = true;
            playSound(soundEffects.dash, 0.3);
            this.vx *= G_PLAYER_DASH_MULTIPLIER;
            this.vy *= G_PLAYER_DASH_MULTIPLIER;
            return staminaDrain;
        }
    }
    
    this.display = (ctx) => {
        let mt = function(x) {
            return Math.max(4 * x - 3, -2 * x);
        }
        
        let m = Math.hypot(this.vx, this.vy);
        let adjust_x = this.vx * mt(m/G_PLAYER_BASE_SPEED) * G_PLAYER_SMEAR_PERCENT;
        let adjust_y = this.vy * mt(m/G_PLAYER_BASE_SPEED) * G_PLAYER_SMEAR_PERCENT;
        
        let player_show_x = this.x + g_camera.x + adjust_x;
        let player_show_y = this.y + g_camera.y + adjust_y;
        
        castShadow(ctx, this.x, this.y, this.radius);
        
        if (this.stamina < G_PLAYER_MAX_STAMINA) {
            displayStaminaMeter(ctx, player_show_x, player_show_y);
        }
        
        let stretchAngle = Math.atan2(this.vy, this.vx);
        let stretchFactor = Math.max(1, m / G_PLAYER_BASE_SPEED * G_PLAYER_SMEAR_PERCENT);
        
        //draw arms
        let d_mouse_x = g_mouse.x-player_show_x;
        let d_mouse_y = g_mouse.y-player_show_y;
        let pointing = Math.atan2(d_mouse_y, d_mouse_x);
        //let [dx, dy] = normalize([this.vx, this.vy]);
        //let pos_x = dx * 0.809016994375 + dy * 0.587785252292;
        //let pos_y = dx * -0.587785252292 + dy * 0.809016994375;
        
        ctx.fillStyle= "#c68642"
        drawRotatedRect(ctx, player_show_x-15, player_show_y-7.5, 30, 15, pointing*(180/Math.PI)+90);
        //drawRotatedRect(ctx, player_show_x-30, player_show_y, 30, 15, 45);
        
        //castShadow(ctx, this.x + dx-dy, this.y + dx+dy, this.radius*0.4);
        //castShadow(ctx, this.x + dx+dy, this.y + dy-dx, this.radius*0.4);
        
        //draw metal head
        drawStretchedCircle(ctx, player_show_x, player_show_y, this.radius, Color.GRAY, stretchFactor, stretchAngle);
        
        //draw brain
        drawStretchedArc(ctx, player_show_x, player_show_y, this.radius, "#fd50db", stretchFactor, stretchAngle, 0.25, 0.5);
        
        //draw glass casing
        drawStretchedArc(ctx, player_show_x, player_show_y, this.radius, Color.BLUE, stretchFactor, stretchAngle, 0, 0.25, 0.25);
        
        //draw red dot
        ctx.beginPath();
        //please use rotation matrices please please theyre on wikipedia or i can teach you
        //let xpos = 5*Math.cos(Math.atan2(this.vy, this.vx)-.2*Math.PI);
        //let ypos = 5*Math.sin(Math.atan2(this.vy, this.vx)-.2*Math.PI);
        let [dx, dy] = MathHelper.normalize([this.vx, this.vy]);
        let pos_x = dx * 0.809016994375 + dy * 0.587785252292;
        let pos_y = dx * -0.587785252292 + dy * 0.809016994375;
        pos_x *= 5;
        pos_y *= 5;
        ctx.ellipse(player_show_x + pos_x, player_show_y + pos_y, 2 * Math.max(1, m / G_PLAYER_BASE_SPEED * G_PLAYER_SMEAR_PERCENT), 2, Math.atan2(this.vy, this.vx), 0, 2 * Math.PI);
        ctx.fillStyle = Color.RED;
        ctx.fill();
    
        
        //ctx.drawImage(PLAYER_SPRITE, player_show_x-8, player_show_y-8, 64, 64);
        
        
        //ctx.beginPath();
        //ctx.lineWidth=2;
        //ctx.arc(100, 100, 20, 0, 1.5*Math.PI);
        //ctx.lineTo(100, 100);
        //ctx.lineTo(120, 100);
        //ctx.moveTo(player_show_x + adjust_x, player_show_y + adjust_y);
        //ctx.fillStyle = Color.BLUE;
        //ctx.stroke();
        //ctx.fill();
        
        /*
        ctx.beginPath();
        ctx.ellipse(player_show_x + adjust_x, player_show_y + adjust_y, this.radius * Math.max(1, m / G_PLAYER_BASE_SPEED * G_PLAYER_SMEAR_PERCENT), this.radius, Math.atan2(this.vy, this.vx), 0, 2 * Math.PI);
        ctx.fillStyle = Color.RED;
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = Color.BLACK;
        ctx.fillRect(player_show_x + adjust_x-1, player_show_y + adjust_y-1, 2, 2);
        
        let [dx, dy] = normalize([this.vx, this.vy]);
        dx *= this.radius * 0.707;
        dy *= this.radius * 0.707;
        
        drawCircle(ctx, player_show_x + dx-dy, player_show_y + dx+dy, this.radius*0.4, Color.WHITE);
        drawCircle(ctx, player_show_x + dx+dy, player_show_y + dy-dx, this.radius*0.4, Color.WHITE);
        */
    }
}
