function PlayerBulletObject(type, x=0, y=0, vx=0, vy=-1) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.vx = vx;
    this.vy = vy;
    this.hasTrail = true;
    if (this.type.lifespan) {
        if (g_magnetInstances.length) {
            this.timestampDeath = g_currentTime + this.type.lifespan + G_MAGNET_LIFE;
        } else {
            this.timestampDeath = g_currentTime + this.type.lifespan;
        }
    }
    
    this.updatePosition = (deltaTime) => {
        if (this.type.magnetic) {
            for (let i = 0; i < g_magnetInstances.length; i++) {
                let magnet = g_magnetInstances[i];
                let [ax, ay, distFactor] = magnet.attract(this.x, this.y);
                this.vx += ax * deltaTime * 10e-8;
                this.vy += ay * deltaTime * 10e-8;
                this.vx *= 1-(distFactor*0.0001);
                this.vy *= 1-(distFactor*0.0001);
            }
            
            for (let i = 0; i < g_playerBulletInstances.length; i++) {
                let other = g_playerBulletInstances[i];
                if (other == this) continue;
                if (!other.type.magnetic) continue;
                let dx = other.x - this.x; 
                let dy = other.y - this.y;
                if (dx * dx + dy * dy > (this.type.radius + other.type.radius) * (this.type.radius + other.type.radius)) continue; 
                let [n_x, n_y] = normalize([dx, dy]);

                let thisScalarNormal = n_x * this.vx + n_y * this.vy;
                let otherScalarNormal = n_x * other.vx + n_y * other.vy;
                
                let thisScalarTangental = -n_y * this.vx + n_x * this.vy;
                let otherScalarTangental = -n_y * other.vx + n_x * other.vy;
                
                this.vx = -n_y * thisScalarTangental + n_x * otherScalarNormal;
                this.vy =  n_x * thisScalarTangental + n_y * otherScalarNormal;
                
                other.vx = -n_y * otherScalarTangental + n_x * thisScalarNormal;
                other.vy =  n_x * otherScalarTangental + n_y * thisScalarNormal;
                
                this.vx *= 1-(0.0001*10);
                this.vy *= 1-(0.0001*10);
                
                other.vx *= 1-(0.0001*10);
                other.vy *= 1-(0.0001*10);
            }
        }
        this.x += this.vx * deltaTime * G_PREFERED_SCALAR;
        this.y += this.vy * deltaTime * G_PREFERED_SCALAR;
    }
    
    this.display = (ctx) => {
        let show_x, show_y;
        if (this.parent) {
            show_x = this.parent.x + this.x + g_camera.x;
            show_y = this.parent.y + this.y + g_camera.y;
        } else {
            show_x = this.x + g_camera.x;
            show_y = this.y + g_camera.y;
        }
        
        if (this.type.center) drawCircle(ctx, show_x, show_y, this.type.radius*0.8, Color.WHITE);
        
        let speedScale = Math.min(1, Math.hypot(this.vx, this.vy));
        
        if (this.type.shape == "circle") {
            addCircleBorder(ctx, show_x, show_y, speedScale+this.type.radius, this.type.width, speedScale);
        } else if (this.type.shape == "diamond") {
            let [dx, dy] = normalize([this.vx, this.vy]);
            addDiamondBorder(ctx, show_x, show_y, dx, dy, speedScale+this.type.radius, this.type.width, speedScale);
        } else if (this.type.shape == "triangle") {
            let [dx, dy] = normalize([this.vx, this.vy]);
            addTriangleBorder(ctx, show_x, show_y, dx, dy, speedScale+this.type.radius, this.type.width, speedScale);
        }
        if (this.type.fill) {
            ctx.fillStyle = this.type.color;
            ctx.fill();
        } else {
            ctx.strokeStyle = this.type.color;
            ctx.stroke();
        }
        
        if (this.type.trailLength && !this.parent) {
            if (!this.points) {
                this.points = [];
                this.lastTracked = 0;
                this.realTrackrate = this.type.trailTrackrate;
                this.type.trailTrackrate = 0;
            }
            if (g_currentTime - this.lastTracked > this.type.trailTrackrate) {
                this.points.push([this.x, this.y]);
                this.lastTracked = g_currentTime;
            }
            if (this.points.length > this.type.trailLength) {
                this.type.trailTrackrate = this.realTrackrate;
                this.points.remove(0);
            }
            
            for (var i = 1; i < this.points.length - 1; i++) {
                ctx.beginPath();
                ctx.lineWidth = 0.6*this.type.radius * (5 - (1 + (this.points.length-i-1) / this.points.length * 4));
                ctx.strokeStyle = this.type.trailColor.concat(1 - (this.points.length-i-1) / this.points.length, ")");
                let [t_x, t_y] = this.points[i];
                t_x += g_camera.x;
                t_y += g_camera.y;
                let [e_x, e_y] = this.points[i - 1];
                e_x += g_camera.x;
                e_y += g_camera.y;
                let [r_x, r_y] = this.points[i + 1];
                r_x += g_camera.x;
                r_y += g_camera.y;
                let n_x = t_x + 0.25 * (e_x - r_x);
                let n_y = t_y + 0.25 * (e_y - r_y);
                ctx.moveTo(e_x, e_y),
                ctx.quadraticCurveTo(n_x, n_y, t_x, t_y),
                ctx.stroke();
                }
            
        }
    }
}

function PlayerBulletType(damage=1, radius=4, shape="circle", width=2, color=Color.WHITE, fill=false, center=true, bounceOffWalls=false, lifespan=undefined, sticks=undefined, magnetic=undefined, trailLength=undefined, trailTrackrate=undefined, trailColor=undefined) {
    this.damage = damage;
    this.radius = radius * G_PREFERED_SCALAR;
    this.shape = shape;
    this.width = width;
    this.color = color;
    this.fill = fill;
    this.center = center;
    this.bounceOffWalls = bounceOffWalls;
    this.lifespan = lifespan;
    this.sticks = sticks;
    this.magnetic = magnetic;
    this.trailLength = trailLength;
    this.trailTrackrate = trailTrackrate;
    this.trailColor = "rgba("+parseInt(trailColor.substring(1, 3), 16)+", "+parseInt(trailColor.substring(3, 5), 16)+", "+parseInt(trailColor.substring(5, 7), 16)+", ";
}