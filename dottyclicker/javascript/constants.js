const [g_screenWidth, g_screenHeight, g_screenScale] = findResolution(window.innerWidth, window.innerHeight);

function findResolution(width, height) {
    
    // aspect ratio 16:9
    
    let w_ar = 16;
    let h_ar = 9;
    
    let f = Math.min(width/w_ar, height/h_ar);
    
    return [f * w_ar-10, f * h_ar-10, f];
}


const g_boots = {};
const g_harvester = {};
const g_belt = {};
const g_backpack = {};
const g_armorHead  = {};
const g_armorLeft = {};
const g_armorRight = {};

new createBoots("Basic Boots")
    .addCost(4400)
    .addHarvestInterval()
    .addCollectMove(2)
    .addDescription("Collect pollen as you walk through flowers!")
    .add();

new createBackpack("Default Backpack")
    .addCapacity(200)
    .addInstantConversion(0)
    .addCollectMult(1)
    .addDescription("The default backpack.")
    .add();

new createHarvester("scooper")
    .addCollectPattern(new CollectPattern()
                        .addTile(0,  0, 2)
                        .addTile(+1, 0, 2))
    
    
    

function createBoots(name) {
    this.type = "boots";
    this.name = name;
    
    this.addCost = function(cost) {
        this.cost = cost;
        return this;
    }
    this.addHarvestInterval = function(harvestInterval) {
        this.harvestInterval = harvestInterval;
        return this;
    }
    this.addCollectMove = function(collectMove) {
        this.collectMove = collectMove;
        return this;
    }
    this.addCollectMult = function(collectMult) {
        this.collectMult = collectMult;
        return this;
    }
    this.addDescription = function(description) {
        this.description = description;
        return this;
    }
    this.add = function() {
        g_boots[this.name] = {
            type: this.type,
            name: this.name,
            cost: this.cost, 
            harvestInterval: this.harvestInterval, 
            collectMove: this.collectMove, 
            collectMult: this.collectMult, 
            description: this.description
        }
    }
}

function createHarvester(name) {
    this.type = "harvester";
    this.name = name;
    
    this.addCost = function(cost) {
        this.cost = cost;
        return this;
    }
    this.addCollectPattern = function(collectPattern) {
        g_collectPatterns[this.name] = collectPattern;
        return this;
    }
    this.addHarvestInterval = function(harvestInterval) {
        this.harvestInterval = harvestInterval;
        return this;
    }
    this.addCollectFlat = function(collectFlat) {
        this.collectFlat = collectFlat;
        return this;
    }
    this.addDescription = function(description) {
        this.description = description;
        return this;
    }
    this.add = function() {
        g_harvester[this.name] = {
            type: this.type,
            name: this.name,
            cost: this.cost, 
            harvestInterval: this.harvestInterval, 
            collectFlat: this.collectFlat, 
            description: this.description
        }
    }
}

function createBelt(name) {
    this.type = "belt";
    this.name = name;
    
    this.addCost = function(cost) {
        this.cost = cost;
        return this;
    }
    this.addCapacityFlat = function(capacityFlat) {
        this.capacityFlat = capacityFlat;
        return this;
    }
    this.addCapacityMult = function(capacityMult) {
        this.capacityMult = capacityMult;
        return this;
    }
    this.addConvertAmount = function(convertAmount) {
        this.convertAmount = convertAmount;
        return this;
    }
    this.addDescription = function(description) {
        this.description = description;
        return this;
    }
    this.add = function() {
        g_belt[this.name] = {
            type: this.type,
            name: this.name,
            cost: this.cost,
            capacityFlat: this.capacityFlat, 
            capacityMult: this.capacityMult, 
            convertAmount: this.convertAmount,
            description: this.description
        }
    }
}

function createBackpack(name) {
    this.type = "backpack";
    this.name = name;
    
    this.addCost = function(cost) {
        this.cost = cost;
        return this;
    }
    this.addCapacity = function(capacity) {
        this.capacity = capacity;
        return this;
    }
    this.addInstantConversion = function(instantConversion) {
        this.instantConversion = instantConversion;
        return this;
    }
    this.addCollectMult = function(collectMult) {
        this.collectMult = collectMult;
        return this;
    }
    this.addDescription = function(description) {
        this.description = description;
        return this;
    }
    this.add = function() {
        g_backpack[this.name] = {
            type: this.type,
            name: this.name,
            cost: this.cost, 
            capacity: this.capacity, 
            instantConversion: this.instantConversion, 
            collectMult: this.collectMult, 
            description: this.description
        }
    }
}

Array.prototype.remove = function(index) {
    return this.splice(index, 1)[0];   
};

function mod(n, m) {
  return ((n % m) + m) % m;
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}