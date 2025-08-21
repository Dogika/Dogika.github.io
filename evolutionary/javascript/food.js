function Food(hasProperties) {
    this.addLevelWater = function(p_levelWater) {
        this.levelWater = p_levelWater;
        return this;
    }
    this.addVitaminFleshHeal = function(p_vitaminFleshHeal) {
        this.vitaminFleshHeal = p_vitaminFleshHeal;
        if (p_vitaminFleshHeal > 10) hasProperties.hasVitaminFleshHeal = true;
        return this;
    }
    this.addVitaminThink = function(p_vitaminThink) {
        this.vitaminThink = p_vitaminThink;
        if (p_vitaminThink > 10) hasProperties.hasVitaminThink = true;
        return this;
    }
    this.addVitaminSight = function(p_vitaminSight) {
        this.vitaminSight = p_vitaminSight;
        if (p_vitaminSight > 10) hasProperties.hasVitaminSight = true;
        return this;
    }
    this.addVitaminReproduction = function(p_vitaminReproduction) {
        this.vitaminReproduction = p_vitaminReproduction;
        if (p_vitaminReproduction > 10) hasProperties.hasVitaminReproduction = true;
        return this;
    }
    this.addVitaminBoneHeal = function(p_vitaminBoneHeal) {
        this.vitaminBoneHeal = p_vitaminBoneHeal;
        if (p_vitaminBoneHeal > 10) hasProperties.hasVitaminBoneHeal = true;
        return this;
    }

    this.addMineralReproduction = function(p_mineralReproduction) {
        this.mineralReproduction = p_mineralReproduction;
        if (p_mineralReproduction > 10) hasProperties.hasMineralReproduction = true;
        return this;
    }
    this.addMineralBoneHeal = function(p_mineralBoneHeal) {
        this.mineralBoneHeal = p_mineralBoneHeal;
        if (p_mineralBoneHeal > 10) hasProperties.hasMineralBoneHeal = true;
        return this;
    }
    this.addMineralFleshHeal = function(p_mineralFleshHeal) {
        this.mineralFleshHeal = p_mineralFleshHeal;
        if (p_mineralFleshHeal > 10) hasProperties.hasMineralFleshHeal = true;
        return this;
    }
    this.addMineralThink = function(p_mineralThink) {
        this.mineralThink = p_mineralThink;
        if (p_mineralThink > 10) hasProperties.hasMineralThink = true;
        return this;
    }
}

function createFoodtypes(size) {
    if (size < 1) {
        throw new Error("CustomError: `size` in `createFoods` cannot be less than 1!");
    }

    let hasProperties = {
        hasVitaminFleshHeal: false,
        hasVitaminThink: false,
        hasVitaminSight: false,
        hasVitaminReproduction: false,
        hasVitaminBoneHeal: false,
        hasMineralReproduction: false,
        hasMineralBoneHeal: false,
        hasMineralFleshHeal: false,
        hasMineralThink: false
    };

    let foods = [];
    for (let i = 0; i < size; i++) {
        let food = new Food(hasProperties)
        addProperties(food);
        foods.push(food);
    }
    if (!hasProperties.hasVitaminFleshHeal) {
        foods[0].addVitaminFleshHeal(10, 100);//[1,max)
    }
    if (!hasProperties.hasVitaminThink) {
        foods[mod(1, size)].addVitaminThink(10, 100);//[1,max)
    }
    if (!hasProperties.hasVitaminSight) {
        foods[mod(2, size)].addVitaminSight(10, 100);//[1,max)
    }
    if (!hasProperties.hasVitaminReproduction) {
        foods[mod(3, size)].addVitaminReproduction(10, 100);//[1,max)
    }
    if (!hasProperties.hasVitaminBoneHeal) {
        foods[mod(4, size)].addVitaminBoneHeal(10, 100);//[1,max)
    }
    if (!hasProperties.hasMineralReproduction) {
        foods[mod(5, size)].addMineralReproduction(10, 100);//[1,max)
    }
    if (!hasProperties.hasMineralBoneHeal) {
        foods[mod(6, size)].addMineralBoneHeal(10, 100);//[1,max)
    }
    if (!hasProperties.hasMineralFleshHeal) {
        foods[mod(7, size)].addmineralFleshHeal(10, 100);//[1,max)
    }
    if (!hasProperties.hasMineralThink) {
        foods[mod(8, size)].addMineralThink(10, 100);//[1,max)
    }
    return foods;
} 

function addProperties(food) {
    food.addLevelWater(randomCurvedRangeFloat(5, 100));
    let uNB = randomRangeInt(0,512)>>>0;
    if ((uNB&1)==0) food.addMineralBoneHeal(randomCurvedRangeFloat(0, 100));
    if ((uNB&2)==0) food.addMineralThink(randomCurvedRangeFloat(0, 100));
    if ((uNB&4)==0) food.addMineralFleshHeal(randomCurvedRangeFloat(0, 100));
    if ((uNB&8)==0) food.addMineralReproduction(randomCurvedRangeFloat(0, 100));
    if ((uNB&16)==0) food.addVitaminBoneHeal(randomCurvedRangeFloat(0, 100));
    if ((uNB&32)==0) food.addVitaminFleshHeal(randomCurvedRangeFloat(0, 100));
    if ((uNB&64)==0) food.addVitaminReproduction(randomCurvedRangeFloat(0, 100));
    if ((uNB&128)==0) food.addVitaminSight(randomCurvedRangeFloat(0, 100));
    if ((uNB&256)==0) food.addVitaminThink(randomCurvedRangeFloat(0, 100));
}

function createPlants() {
    let plants = [];
    
    return plants;
}