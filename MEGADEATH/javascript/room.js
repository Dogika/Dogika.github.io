function RoomType(waves) {
    this.waves = waves;
}

function RoomInstance(i, j, type, wallFunction, damageFunction, displayFunction, playFunction, winFunction, doors) {
    this.type = type;
    this.i = i;
    this.j = j;
    this.waves = type.waves;
    this.currentWave = 0;
    this.started = false;
    this.enemiesKilledPreviously = 0;
    this.allEnemiesKilled = true;
    this.finished = false;
    this.doors = doors;
    
    this.collisionWall = wallFunction;
    this.collisionDamage = damageFunction;
    this.display = displayFunction;
    this.play = playFunction;
    this.win = winFunction;
    
    this.reset = function() {
        this.currentWave = 0;
        this.started = false;
        this.finished = false;
        this.enemiesKilledPreviously = 0;
        this.allEnemiesKilled = true;
        this.played = false;
        RoomHelper.resetDoors(this, "all");
    }
    
    this.baseCollisions = function(prev_x, prev_y, new_x, new_y, r=0) {
        const WALL_BORDER = g_screenWidth * 0.5;
        
        let c_x = false, c_y = false;
        
        new_x -= g_screenCenterFocus_x;
        new_y -= g_screenCenterFocus_y;
        prev_x -= g_screenCenterFocus_x;
        prev_y -= g_screenCenterFocus_y;
        
        let top = new_y - r < -WALL_BORDER;
        let bottom = new_y + r > WALL_BORDER;
        let left = new_x - r < -WALL_BORDER;
        let right = new_x + r > WALL_BORDER;
        
        let topDoor = false, bottomDoor = false, leftDoor = false, rightDoor = false;
        
        for (let i = 0; i < this.doors.length; i++) {
            let door = this.doors[i];
            
            if (door.state == "closed") continue;
            
            let inDoor, outDoor;
            
            switch(door.side) {
                case "top":
                    inDoor = new_x - r >= door.start && new_x + r <= door.end;
                    outDoor = prev_x - r >= door.start && prev_x + r <= door.end;
                    if (top && !inDoor) c_y = true;
                    if (top && outDoor) topDoor = true;
                    break;
                case "bottom":
                    inDoor = new_x - r >= door.start && new_x + r <= door.end;
                    outDoor = prev_x - r >= door.start && prev_x + r <= door.end;
                    if (bottom && !inDoor) c_y = true;
                    if (bottom && outDoor) bottomDoor = true;
                    break;
                case "left":
                    inDoor = new_y - r >= door.start && new_y + r <= door.end;
                    outDoor = prev_y - r >= door.start && prev_y + r <= door.end;
                    if (left && !inDoor) c_x = true;
                    if (left && outDoor) leftDoor = true;
                    break;
                case "right":
                    inDoor = new_y - r >= door.start && new_y + r <= door.end;
                    outDoor = prev_y - r >= door.start && prev_y + r <= door.end;
                    if (right && !inDoor) c_x = true;
                    if (right && outDoor) rightDoor = true;
                    break;
            }
        }
        
        if (!topDoor && top) c_y = true;
        if (!bottomDoor && bottom) c_y = true;
        if (!leftDoor && left) c_x = true;
        if (!rightDoor && right) c_x = true;
        
        return [c_x, c_y];
    }
    
    this.spawnWave = function() {
        this.enemiesKilledPreviously = g_stats.enemiesKilled;
        this.allEnemiesKilled = false;
        
        let wave = this.waves[this.currentWave];
        
        for (let i = 0; i < wave.length; i++) {
            let spawnEnemyMethod = wave[i].executableMethod;
            
            let spawnPortal = new Event(
                g_currentTime + wave[i].timestamp * g_invTimeDialation - 200,
                function() {
                    g_spawnPortals.push({
                        x: spawnEnemyMethod.x + this.i * g_screenHeight,
                        y: spawnEnemyMethod.y + this.j * g_screenWidth,
                        size: 0.5
                    });
                    g_screenShakeMagnitude += spawnEnemyMethod.instanceEnemy.maxHealth*0.01;
                }
            );
            
            let spawnEnemy = new Event(
                g_currentTime + wave[i].timestamp * g_invTimeDialation, 
                spawnEnemyMethod.create(this.j * g_screenWidth, this.i * g_screenHeight)
            );
            
            g_timeline.push(spawnPortal);
            g_timeline.push(spawnEnemy);
        }
    }
    
    this.nextWave = function() {
        if (this.currentWave == this.waves.length && this.allEnemiesKilled) {
            this.finished = true;
            if (this.win) this.win();
            return;
        }
        
        if (!this.finished && this.allEnemiesKilled) {
            this.spawnWave();
        }
        
        if (g_stats.enemiesKilled - this.waves[this.currentWave].length >= this.enemiesKilledPreviously) {
            this.allEnemiesKilled = true;
            g_timeline = [];
            g_nextEvent_ptr = null;
            g_patternInstanceIDs = 0;
            g_patternInstances = [];
            this.currentWave++;
        }
    }
}

class RoomHelper {
    static reset() {
        
    }
    
    static openDoors(room, which) {
        if (which === "all") {
            for (let i = 0; i < room.doors.length; i++) {
                room.doors[i].state = "open";
            }
            return;
        }
        
        for (let i = 0; i < which.length; i++) {
            room.doors[which[i]].state = "open";
        }
    }
    
    static closeDoors(room, which) {
        if (which === "all") {
            for (let i = 0; i < room.doors.length; i++) {
                room.doors[i].state = "closed";
            }
            return;
        }
        
        for (let i = 0; i < which.length; i++) {
            room.doors[which[i]].state = "closed";
        }
    }
    
    static resetDoors(room, which) {
        if (which === "all") {
            for (let i = 0; i < room.doors.length; i++) {
                room.doors[i].state = room.doors[i].defaultState;
            }
            return;
        }
        
        for (let i = 0; i < which.length; i++) {
            room.doors[which[i]].state = room.doors[which[i]].defaultState;
        }
    }
}
