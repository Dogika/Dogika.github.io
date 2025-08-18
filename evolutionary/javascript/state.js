//contains default states

let canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = g_screenWidth;
    canvas.height = g_screenHeight;
    canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }
let ctx = canvas.getContext("2d");

let g_mouse = {};

let g_buttonInstances = [];

let g_currentTime;
let g_previousTime;
let g_timeline = [];
let g_nextEvent_ptr;

let g_beeInstances = [];

let g_gameWindow = "audioCheck";

let g_currentRoom;

let g_shop;

let g_ball;

let g_pollen = 0;
let g_honey = 0;

let g_unlocks = {};
let g_progress = {};

let g_clickableObjects

let g_currentEquipment = {};

let g_currentBoots = "";
let g_currentHarvester = "";
let g_currentBelt = "";
let g_currentBackpack = "Default Backpack";
let g_currentArmorHead = "";
let g_currentArmorLeft = "";
let g_currentArmorRight = "";

let g_keyboard = {};

let g_image = {
    flowerRed1: new Image(),
    flowerRed2: new Image(),
    flowerRed3: new Image(),
    flowerRed4: new Image(),
    flowerRed5: new Image(),
    flowerBlue1: new Image(),
    flowerBlue2: new Image(),
    flowerBlue3: new Image(),
    flowerBlue4: new Image(),
    flowerBlue5: new Image(),
    flowerWhite1: new Image(),
    flowerWhite2: new Image(),
    flowerWhite3: new Image(),
    flowerWhite4: new Image(),
    flowerWhite5: new Image(),
    navigatorLeft: new Image(),
    navigatorRight: new Image(),
    navigatorUp: new Image(),
    navigatorDown: new Image()
}

function calculateStats() {
    
}

const g_rooms = {
    firstRoom: new Room(
        [new Navigator("up", "strawberryFields"), new Navigator("right", "storeRoom"), new Navigator("left", "shippingRoom")], 
        undefined, 
        new Field(g_screenWidth*0.5, g_screenHeight*0.54, 9, 14, g_screenScale*0.8, g_screenScale*0.8, [1, 0, 0, 1, 0, 0, 6, 2, 0], true)),
    strawberryFields: new Room(
        [new Navigator("down", "firstRoom")], 
        undefined, 
        new Field(g_screenWidth*0.5, g_screenHeight*0.54, 5, 16, g_screenScale*0.8, g_screenScale*0.8, [6, 2, 0, 1, 0 ,0, 1, 0, 0], true)),
    storeRoom: new Room(
        [new Navigator("left", "firstRoom")], 
        new Shop("navigatorLeft", g_screenScale*1.5, g_screenScale*1, "down", [g_boots["Basic Boots"], g_boots["Basic Boots"], g_boots["Basic Boots"], g_boots["Basic Boots"]]), 
        new Field(g_screenWidth*0.5, g_screenHeight*0.5, 9, 14, g_screenScale*0.8, g_screenScale*0.8, [1, 0, 0, 6, 2, 0, 1, 0, 0], true)),
    shippingRoom: new Room(
        [new Navigator("right", "firstRoom")], 
        undefined, 
        undefined,
        undefined,
        undefined,
        [new NPC()])
};

g_collectPatterns = {};

function initializeGameState() {
    g_image["flowerBlue1"].src = "https://codehs.com/uploads/d03248d119f4e02ee6683575a849d805";
    g_image["flowerBlue2"].src = "https://codehs.com/uploads/463c73775036984b9f7a679c49a80367";
    g_image["flowerBlue3"].src = "https://codehs.com/uploads/c39ba644a533aaa4ee2f0627c9202061";
    g_image["flowerBlue4"].src = "";
    g_image["flowerBlue5"].src = "";
    g_image["flowerRed1"].src = "https://codehs.com/uploads/283ad8753972268436e85bbc607a85a4";
    g_image["flowerRed2"].src = "https://codehs.com/uploads/1479c8b47b825375d58a267578f4e3ab";
    g_image["flowerRed3"].src = "https://codehs.com/uploads/e5fdd452a9f48e230a9a5c1482d9c56c";
    g_image["flowerRed4"].src = "";
    g_image["flowerRed5"].src = "";
    g_image["flowerWhite1"].src = "https://codehs.com/uploads/466c2a9113b888d56317a774bb569226";
    g_image["flowerWhite2"].src = "https://codehs.com/uploads/1f0763115ea4e23630153c1ee748634f";
    g_image["flowerWhite3"].src = "https://codehs.com/uploads/70a43003be13fc8d54db1057f0d1fb21";
    g_image["flowerWhite4"].src = "";
    g_image["flowerWhite5"].src = "";
    
    g_image["navigatorLeft"].src = "https://codehs.com/uploads/cbee1d855602ad4d4a2b4225781174cb";
    g_image["navigatorRight"].src = "https://codehs.com/uploads/cbee1d855602ad4d4a2b4225781174cb";
    g_image["navigatorUp"].src = "https://codehs.com/uploads/cbee1d855602ad4d4a2b4225781174cb";
    g_image["navigatorDown"].src = "https://codehs.com/uploads/cbee1d855602ad4d4a2b4225781174cb";
    
    g_currentEquipment["backpack"] = g_backpacks["Basic Backpack"];
    
    g_currentRoom = g_rooms.firstRoom;
    g_ball = {x: 0, y: 0, canClick: true};
    g_ball.x = Math.random() * (g_currentRoom.field.tileWidth * g_currentRoom.field.grid[0].length - 2 * 32) + 32 + g_currentRoom.field.x;
    g_ball.y = Math.random() * (g_currentRoom.field.tileHeight * g_currentRoom.field.grid.length - 2 * 32) + 32 + g_currentRoom.field.y;
}