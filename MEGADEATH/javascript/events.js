function Event(p_timestamp=0, p_executableMethod) {
    this.timestamp = p_timestamp;
    this.executableMethod = p_executableMethod;
    /**
     * spawnEnemy
     * spawnConsumable
     * firePattern
     * changePatternBulletsBehavior
     * moveEnemy
     */
}

/*
for behaviors with a delay insert an event right 
before this that stops bullet from moving.
*/

function SpawnEnemyMethod(enemyType, x, y, isBoss=false) {
    this.instanceEnemy = structuredClone(enemyType)
    this.x = x;
    this.y = y;
    this.isBoss = isBoss;
    
    this.create = (add_x, add_y) => {
        return function() {
            spawnEnemy(
                structuredClone(enemyType), 
                x + add_x, 
                y + add_y, 
                isBoss
            );
        }
    }
}

function createChangePatternBulletsBehaviorMethod(behavior, patternInstanceID) {
    let bulletList = g_patternInstances[patternInstanceID];
    let forwardSpeed = behavior.forwardSpeed;
    let rx = Math.cos(behavior.rotationSpeed);
    let ry = Math.sin(behavior.rotationSpeed)
    let cos = Math.cos(behavior.rotationOffset);
    let sin = Math.sin(behavior.rotationOffset);
    let forwardAccel = behavior.forwardAccel;
    
    if (behavior.targetPlayer)
    return function executeChangePatternBulletsBehaviorEvent() {
            for (let bullet of bulletList) {
                let [dx, dy] = MathHelper.normalize([g_player.x - bullet.x, g_player.y - bullet.y]);
                bullet.dx = dx;
                bullet.dy = dy;
                bullet.vx = dx * forwardSpeed;
                bullet.vy = dy * forwardSpeed;
                bullet.forwardSpeed = forwardSpeed;
                bullet.forwardAccel = forwardAccel;   
                bullet.rx = rx;
                bullet.ry = ry;
            }
        }
    return function executeChangePatternBulletsBehaviorEvent() {
            for (let bullet of bulletList) {
                let dx_1 = bullet.dx * cos + bullet.dy * sin;
                let dy_1 = bullet.dy * cos - bullet.dx * sin;
                bullet.dx = dx_1;
                bullet.dy = dy_1;
                bullet.vx = dx_1 * forwardSpeed;
                bullet.vy = dy_1 * forwardSpeed;
                bullet.forwardSpeed = forwardSpeed;
                bullet.forwardAccel = forwardAccel;
                bullet.rx = rx;
                bullet.ry = ry;
            }
        }
}

function createFirePatternMethod(behavior, enemy) {
    let instancePattern = structuredClone(behavior.pattern);
    instancePattern.loopColorID = behavior.loopColorID;
    instancePattern.hueShift = behavior.hueShift;
    return function executeFirePatternEvent() {
        firePattern(instancePattern, enemy.x, enemy.y);
        enemy.patternsFired++;
    }
}

function createMoveEnemyMethod(behavior, enemy) {
    return function executeMoveEnemyEvent() {
        if (behavior.type == "moveNowhere") {
            enemy.movementType = "";
        } else if (behavior.type == "moveIntegration") {
            enemy.movementType = "timeIntegration";
            let invDeltaTime = 1 / (behavior.final_time - behavior.timestamp);
            enemy.vx = (behavior.final_x - enemy.x) * invDeltaTime;
            enemy.vy = (behavior.final_y - enemy.y) * invDeltaTime;
        } else if (behavior.type == "moveDecay") {
            enemy.movementType = "positionDifferenceDecay";
            enemy.decaySpeed = behavior.decaySpeed;
            if (behavior.lockPlayer) {
                enemy.final_x = behavior.final_x + g_player.x + g_player.vx;
                enemy.final_y = behavior.final_y + g_player.y + g_player.vy;
            } else {
                enemy.final_x = behavior.final_x;
                enemy.final_y = behavior.final_y;
            }
        } else if (behavior.type == "moveToward") {
            enemy.movementType = "followTarget";
            enemy.acceleration = behavior.acceleration;
            enemy.maxSpeed = behavior.maxSpeed;
            enemy.friction = behavior.friction;
        } else if (behavior.type == "sniper") {
            enemy.movementType = "sniper";
            enemy.acceleration = behavior.acceleration;
            enemy.maxSpeed = behavior.maxSpeed;
            enemy.friction = behavior.friction;
            enemy.minDist = behavior.minDist;
            enemy.maxDist = behavior.maxDist;
            enemy.seperation = behavior.seperationFactor;
        }
    }
}

function createAttackEnemyMethod(behavior, enemy) {
    return function executeAttackEnemyEvent() {
        if (behavior.type == "loop") {
            enemy.attackType = "loop";
        } else if (behavior.type == "random") {
            enemy.attackType = "random";
        } else if (behavior.type == "distance") {
            enemy.attackType = "distanceBased";
            enemy.distances = behavior.distances;
        } 
    }
}
