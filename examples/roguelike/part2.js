
// Size of the map
const MAP_WIDTH = 60;
const MAP_HEIGHT = 40;

const TILE_SIZE = 16;
const TILE_WALL = 1 + 2 * 64 + 0;
const TILE_FLOOR = 1 + 2 * 64 + 1;

function createMap() {
    // Clear the map to all floor
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            map.setTile(0, x, y, TILE_FLOOR, false);
        }
    }

    // Add a couple walls
    map.setTile(0, 25, 22, TILE_WALL, true);
    map.setTile(0, 35, 22, TILE_WALL, true);
}

const app = new wglt.App({
    canvas: document.querySelector('canvas'),
    imageUrl: '../graphics.png',
    width: 400,
    height: 224
});

const game = new wglt.Game(app, {
    tileWidth: 16,
    tileHeight: 16
});

const sprite = new wglt.Sprite(0, 16, 16, 16, 2, true);
const player = new wglt.Actor(game, 30, 20, 'Player', sprite, true);
const map = new wglt.TileMap(app.gl, MAP_WIDTH, MAP_HEIGHT, 1);
game.tileMap = map;
game.player = player;
game.entities.push(player);

const messageLog = new wglt.MessageLog(new wglt.Rect(1, 1, 100, 100));
messageLog.add('Hello world!');
messageLog.add('Use arrow keys to move');
game.gui.add(messageLog);

// Generate the map
createMap();

// Initial FOV
game.tileMap.computeFov(player.x, player.y, 12);

app.state = game;
