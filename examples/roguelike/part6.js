
// Size of the map
const MAP_WIDTH = 60;
const MAP_HEIGHT = 40;

const TILE_SIZE = 16;
const TILE_WALL = 1 + 2 * 64 + 0;
const TILE_FLOOR = 1 + 2 * 64 + 1;

// Parameters for dungeon generator
const ROOM_MAX_SIZE = 10;
const ROOM_MIN_SIZE = 6;
const MAX_ROOMS = 30;
const MAX_ROOM_MONSTERS = 3;
const TORCH_RADIUS = 10;

function createRoom(map, room) {
    for (let y = room.y1 + 1; y < room.y2; y++) {
        for (let x = room.x1 + 1; x < room.x2; x++) {
            map.setTile(0, x, y, TILE_FLOOR, false);
        }
    }
}

function createHTunnel(map, x1, x2, y) {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        map.setTile(0, x, y, TILE_FLOOR, false);
    }
}

function createVTunnel(map, y1, y2, x) {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        map.setTile(0, x, y, TILE_FLOOR, false);
    }
}

function createMap() {
    // Clear the map to all walls
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            map.setTile(0, x, y, TILE_WALL, true);
        }
    }

    const rooms = [];

    for (let r = 0; r < MAX_ROOMS; r++) {
        // Random width and height
        const w = rng.nextRange(ROOM_MIN_SIZE, ROOM_MAX_SIZE);
        const h = rng.nextRange(ROOM_MIN_SIZE, ROOM_MAX_SIZE);

        // Random position without going out of the boundaries of the map
        const x = rng.nextRange(1, MAP_WIDTH - w - 2);
        const y = rng.nextRange(1, MAP_HEIGHT - h - 2);

        // "Rect" class makes rectangles easier to work with
        const newRoom = new wglt.Rect(x, y, w, h);

        // Run through the other rooms and see if they intersect with this one
        let failed = false;
        for (let j = 0; j < rooms.length; j++) {
            if (newRoom.intersects(rooms[j])) {
                failed = true;
                break;
            }
        }

        if (!failed) {
            // This means there are no intersections, so this room is valid

            // "paint" it to the map's tiles
            createRoom(map, newRoom);

            // Center coordinates of new room, will be useful later
            const center = newRoom.getCenter();

            if (rooms.length === 0) {
                // This is the first room, where the player starts at
                player.x = center.x;
                player.y = center.y;
            } else {
                // All rooms after the first:
                // Connect it to the previous room with a tunnel

                // Center coordinates of previous room
                const prev = rooms[rooms.length - 1].getCenter();

                // Draw a coin (random number that is either 0 or 1)
                if (rng.nextRange(0, 1) === 1) {
                    // First move horizontally, then vertically
                    createHTunnel(map, prev.x, center.x, prev.y);
                    createVTunnel(map, prev.y, center.y, center.x);
                } else {
                    // First move vertically, then horizontally
                    createVTunnel(map, prev.y, center.y, prev.x);
                    createHTunnel(map, prev.x, center.x, center.y);
                }
            }

            // Add some contents to this room, such as monsters
            placeObjects(newRoom);

            // Finally, append the new room to the list
            rooms.push(newRoom);
        }
    }
}

function placeObjects(room) {
    // Choose random number of monsters
    const numMonsters = rng.nextRange(0, MAX_ROOM_MONSTERS);

    for (let i = 0; i < numMonsters; i++) {
        // Choose random spot for this monster
        const x = rng.nextRange(room.x1 + 1, room.x2 - 1);
        const y = rng.nextRange(room.y1 + 1, room.y2 - 1);
        let monster = null;

        // Only place it if the tile is not blocked
        // 80% chance of getting an orc
        if (rng.nextRange(0, 100) < 80) {
            // Create an orc
            monster = new wglt.Actor(game, x, y, 'Orc', new wglt.Sprite(32, 16, 16, 16, 2, true), true);
        } else {
            // Create a troll
            monster = new wglt.Actor(game, x, y, 'Troll', new wglt.Sprite(64, 16, 16, 16, 2, true), true);
        }

        monster.health = 20;
        monster.ai = new wglt.BasicMonster(monster);
        monster.onDeath = monsterDeath;
        game.entities.push(monster);
    }
}

function playerDeath(player) {
    console.log('You died!');
}

function monsterDeath(monster) {
    console.log(monster.name + ' is dead');
    monster.char = '%';
    monster.color = wglt.Colors.DARK_RED;
    monster.blocks = false;
    monster.fighter = null;
    monster.ai = null;
    monster.name = 'remains of ' + monster.name;
    monster.sendToBack();
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

const rng = new wglt.RNG(1);
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
