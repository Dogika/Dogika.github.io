function WindowAudioCheck() {
    // buffer until player clicks
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, g_screenWidth, g_screenHeight);
    
    ctx.fillStyle = "black";
    ctx.font = "10pt Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Click to run game.", 0.5*g_screenWidth, 0.5*g_screenHeight);
    if (g_mouse.down) {
        g_window = "run";
        g_mouse.disabled = true;
    }
}

function WindowRun(deltatime) {
    let anyMovePressed = getControl("up") || getControl("left") || getControl("down") || getControl("right");
    if (anyMovePressed && !g_triggers.anyMovePressed) {
        g_timeWhenMovePressed = g_currentTime;
        g_triggers.anyMovePressed = true;
    } else if (!anyMovePressed) {
        g_triggers.anyMovePressed = false;
    }
    if (getControl("speedup")) {
        if (!g_triggers.speedupPressed)
            g_timeWhenMovePressed -= G_MOVEMENT_SPEEDUP_DELAY;
        g_triggers.speedupPressed = true;
    } else {
        g_triggers.speedupPressed = false;
    }
    if (g_currentTime - g_timeWhenMovePressed > G_MOVEMENT_SPEEDUP_DELAY*15) {
        g_movespeed = 1.6;     
    } else if (g_currentTime - g_timeWhenMovePressed > G_MOVEMENT_SPEEDUP_DELAY*7) {
        g_movespeed = 0.8;     
    } else if (g_currentTime - g_timeWhenMovePressed > G_MOVEMENT_SPEEDUP_DELAY*3) {
        g_movespeed = 0.4;     
    } else if (g_currentTime - g_timeWhenMovePressed > G_MOVEMENT_SPEEDUP_DELAY) {
        g_movespeed = 0.2;     
    } else {
        g_movespeed = 0.1;
    }
    if (getControl("up")) {
        g_y -= g_movespeed*deltatime;
    }
    if (getControl("left")) {
        g_x -= g_movespeed*deltatime;
    }
    if (getControl("down")) {
        g_y += g_movespeed*deltatime;
    }
    if (getControl("right")) {
        g_x += g_movespeed*deltatime;
    }
    g_camera_x = MathHelper_expDecay(g_camera_x, -g_x, 0.01, deltatime);//-g_screenWidth*(g_zoom*0.5-0.5)
    g_camera_y = MathHelper_expDecay(g_camera_y, -g_y, 0.01, deltatime);//-g_screenHeight*(g_zoom*0.5-0.5)
    updateSeeds(deltatime);
    updateSoil(deltatime);
    updateRain(deltatime);
    //updateCreatures(deltatime);

    // Background
    drawBackground();
    drawSoil();

    // Middleground
    drawPlants();
    drawSeeds();
    //drawCreatures();

    // Foreground
    drawRain();
}

function updateSeeds(deltatime) {
    for (let i = 0; i < g_seeds.length; i++) {
        let seed = g_seeds[i];
        let soil_j = Math.floor(seed.x*0.05);
        let soil_i = Math.floor(seed.y*0.05);
        seedSoilFunctionality(seed, soil_i, soil_j, deltatime);
        if (seed.visualState == "seed" && seed.moisture > 0.6) {
            seed.visualState = "engorgedSeed";
        }
    }
}

function seedSoilFunctionality(seed, i, j, deltatime) {
    if (!g_soil[i] || !g_soil[i][j]) return;
    let soil = g_soil[i][j];
    if (seed.plantedness < 1) {
        seed.plantedness = MathHelper_expDecay(seed.plantedness, 1, (1-soil.hardness)*0.0001, deltatime);
    }
    
    let whatsLeftSeed = 1-seed.moisture;
    let whatsLeftSoil = 1-soil.moisture;
    let seedForceSoil = seed.moisture*whatsLeftSoil*deltatime*0.0005*seed.plantedness;
    let soilForceSeed = soil.moisture*whatsLeftSeed*deltatime*0.0005*seed.plantedness;
    
    seed.moisture+=soilForceSeed-seedForceSoil;
    soil.moisture-=soilForceSeed-seedForceSoil;
}

function updateSoil(deltatime) {
    let mouse_j = Math.floor((g_mouse.x-g_camera_x)*0.05/g_zoom);
    let mouse_i = Math.floor((g_mouse.y-g_camera_y)*0.05/g_zoom);
    for (let i = 0; i < g_soil.length; i++)
    for (let j = 0; j < g_soil[0].length; j++) {
        let soil = g_soil[i][j];

        if (i==mouse_i&&j==mouse_j&&g_mouse.down) {
            soil.moisture = Math.min(soil.moisture+0.005*deltatime, 1);
        }

        if (g_rainLevel > 0 ) {
            let rainChance = 0.1*g_rainLevel/deltatime;

            if (Math.random() < rainChance) {
                soil.moisture = Math.min(soil.moisture+0.01*(1+g_rainLevel)*deltatime, 1);
            }
        }

        if (soil.moisture > 0) {
            let whatsLeftSelf = 1-soil.moisture;

            let soilNorth, soilSouth, soilEast, soilWest;
            if (g_soil[i+1]) soilSouth = g_soil[i+1][j];
            if (g_soil[i-1]) soilNorth = g_soil[i-1][j];
            if (g_soil[i][j+1]) soilEast = g_soil[i][j+1];
            if (g_soil[i][j-1]) soilWest = g_soil[i][j-1];

            if (soilNorth) {
                let whatsLeftNorth = 1-soilNorth.moisture;
                let selfForceNorth = soil.moisture*whatsLeftNorth*deltatime*0.0005;
                let northForceSelf = soilNorth.moisture*whatsLeftSelf*deltatime*0.0005;
                
                soil.moisture+=northForceSelf-selfForceNorth;
                soilNorth.moisture-=northForceSelf-selfForceNorth;
            }
            if (soilSouth) {
                let whatsLeftSouth = 1-soilSouth.moisture;
                let selfForceSouth = soil.moisture*whatsLeftSouth*deltatime*0.0005;
                let southForceSelf = soilSouth.moisture*whatsLeftSelf*deltatime*0.0005;
                
                soil.moisture+=southForceSelf-selfForceSouth;
                soilSouth.moisture-=southForceSelf-selfForceSouth;
            }
            if (soilEast) {
                let whatsLeftEast = 1-soilEast.moisture;
                let selfForceEast = soil.moisture*whatsLeftEast*deltatime*0.0005;
                let eastForceSelf = soilEast.moisture*whatsLeftSelf*deltatime*0.0005;
                
                soil.moisture+=eastForceSelf-selfForceEast;
                soilEast.moisture-=eastForceSelf-selfForceEast;
            }
            if (soilWest) {
                let whatsLeftWest = 1-soilWest.moisture;
                let selfForceWest = soil.moisture*whatsLeftWest*deltatime*0.0005;
                let westForceSelf = soilWest.moisture*whatsLeftSelf*deltatime*0.0005;
                
                soil.moisture+=westForceSelf-selfForceWest;
                soilWest.moisture-=westForceSelf-selfForceWest;
            }
        }
    }
}

function updateRain(deltatime) {
    if (getControl("rain")) {
        g_rainLevel = mod(g_rainLevel+0.1, 1.1);
    }
    return; // not being used cuz ugly ig
    //g_rainLevel = (Math.sin(g_currentTime*0.0001)+1)*0.5;

    let spawnRainDropletChance = 0.1*g_rainLevel*deltatime;
    if (spawnRainDropletChance > Math.random()) {
        let t = Math.random();
        g_rainDroplets.push({
            x: g_rainStart_x+(g_rainEnd_x-g_rainStart_x)*t-g_camera_x,
            y: g_rainStart_y+(g_rainEnd_y-g_rainStart_y)*t-g_camera_y,
            vx: g_rainDir_x,
            vy: g_rainDir_y,
            birthtime: g_currentTime
        });
    }

    let i = 0;
    while (i < g_rainDroplets.length) {
        let droplet = g_rainDroplets[i];
        droplet.x += droplet.vx * deltatime;
        droplet.y += droplet.vy * deltatime;
        droplet.vx += 0.001 * g_rainDir_x * deltatime;
        droplet.vy += 0.001 * g_rainDir_y * deltatime;

        if (droplet.birthtime + 5000 < g_currentTime) {
            g_rainDroplets.remove(i);
            continue;
        }
        i++;
    }
}

function updateCreatures(deltatime) {
    let i = 0;
    while (i < g_creatures.length) {
        let creature = g_creatures[i];
        
    }
}

function drawBackground() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, g_screenWidth, g_screenHeight);
    
    ctx.fillStyle = ctx.createPattern(createPatternImage(G_PATTERN_ZOOM_BASE*g_zoom), "repeat");
    ctx.save();
    ctx.translate(g_camera_x, g_camera_y, g_screenHeight*g_zoom);
    ctx.fillRect(0, 0, g_screenWidth*g_zoom, g_screenHeight*g_zoom);
    ctx.restore();
}

function createPatternImage(zoom=1) {
    var ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = ctx.canvas.height = zoom;
    
    /*ctx.moveTo(zoom*0.5, 0);
    ctx.lineTo(zoom*0.5, zoom);
    ctx.moveTo(0,    zoom*0.5);
    ctx.lineTo(zoom, zoom*0.5);
    ctx.strokeStyle = "#AAA";   
    ctx.lineWidth=zoom*0.02;
    ctx.stroke();*/
    ctx.fillStyle = "#999";
    ctx.arc(zoom*0.5, zoom*0.5, zoom*0.1, 0, 2 * Math.PI); 
    ctx.fill();
    return ctx.canvas;
}

function drawSoil() {
    let soilLength = g_zoom*20;
    for (let i = 0; i < g_soil.length; i++)
    for (let j = 0; j < g_soil[0].length; j++) {
        let soil = g_soil[i][j];
        ctx.fillStyle = "rgba("+(101*soil.moisture)+", "+(61*soil.moisture)+", "+(28*soil.moisture)+", 1)";
        ctx.fillRect(g_camera_x+j*soilLength-1, g_camera_y+i*soilLength-1, soilLength+2, soilLength+2);
    }
}

function drawPlants() {}

function drawSeeds() {
    for (let i = 0; i < g_seeds.length; i++) {
        let seed = g_seeds[i];
        if (seed.visualState == "seed") {
            ctx.fillStyle = "rgba(199, 160, 91, 1)";
            ctx.beginPath();
            ctx.arc(seed.x*g_zoom+g_camera_x, seed.y*g_zoom+g_camera_y, g_zoom*2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        } else if (seed.visualState == "engorgedSeed") {
            ctx.fillStyle = "rgba(165, 128, 88, 1)";
            ctx.beginPath();
            ctx.arc(seed.x*g_zoom+g_camera_x, seed.y*g_zoom+g_camera_y, g_zoom*3, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }
    }
}

function drawRain() {
    /*for (let i = 0; i < g_rainDroplets.length; i++) {
        let droplet = g_rainDroplets[i];
        ctx.fillStyle = "rgba(32, 82, 118, 1)";
        ctx.fillRect(droplet.x + g_camera_x, droplet.y + g_camera_y, g_zoom*5, g_zoom*5);
    }*/
    ctx.fillStyle = "rgba(50, 50, 50, "+(0.33*g_rainLevel)+")";
    ctx.fillRect(0, 0, g_screenWidth, g_screenHeight);

}

