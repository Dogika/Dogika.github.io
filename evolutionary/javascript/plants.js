function Plant() {

}

function Seed() {
    this.x;
    this.y;
    this.plantedness = 0;
    this.moisture = 0;
    this.visualState = "seed";
    this.energy = 0.4;
}

function createSeeds(size) {
    let seeds = [];
    for (let i = 0; i < size; i++) {
        let seed = new Seed();
        seed.x = randomRangeInt(0, g_screenWidth);
        seed.y = randomRangeInt(0, g_screenHeight);
        seeds.push(seed);
    }
    return seeds;
}