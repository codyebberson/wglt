
import {Colors} from '../src/colors.js';
import {computePath} from '../src/path.js';
import {Console} from '../src/console.js';
import {Keys} from '../src/keys.js';
import {Terminal} from '../src/terminal.js';
import {TileMap} from '../src/tilemap.js';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 50;

const MAP = [
    '    ########        #########        ########    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #...#...#        #......#    ',
    '    #....#.#        #.#####.#        #......#    ',
    '    #....#.#        #...#...#        #......#    ',
    '    #..###.#        #.......#        #......#    ',
    '    #......##########.......##########......#    ',
    '#####.......................................#####',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#####.......................................#####',
    '    #......##########.......##########......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......##########.......##########......#    ',
    '#####.......................................#####',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#####.......................................#####',
    '    #......#############.#############......#    ',
    '    #......#        #..#.#..#        #......#    ',
    '    #..#####        #..#.#..#        #......#    ',
    '    #......#        #..#.#..#        #......#    ',
    '    #####..#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    ########        #########        ########    ',
];

const MAP_WIDTH = MAP[0].length;
const MAP_HEIGHT = MAP.length;

const VIEW_DISTANCE = 15;

function getTile(x, y) {
    return MAP[y].charAt(x);
}

function isBlocked(x, y) {
    return getTile(x, y) !== '.';
}

const term = new Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT);

const game = new Console(MAP_WIDTH, MAP_HEIGHT);

const player = {
    x: Math.floor(MAP_WIDTH / 2),
    y: Math.floor(MAP_HEIGHT / 2)
};

const fov = new TileMap(MAP_WIDTH, MAP_HEIGHT, isBlocked);
fov.computeFov(player.x, player.y, VIEW_DISTANCE);

function movePlayer(dx, dy) {
    const x = player.x + dx;
    const y = player.y + dy;
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT || isBlocked(x, y)) {
        return;
    }
    player.x = x;
    player.y = y;
    fov.computeFov(player.x, player.y, VIEW_DISTANCE);
}

term.update = function () {
    if (term.isKeyPressed(Keys.VK_UP)) {
        movePlayer(0, -1);
    }
    if (term.isKeyPressed(Keys.VK_LEFT)) {
        movePlayer(-1, 0);
    }
    if (term.isKeyPressed(Keys.VK_RIGHT)) {
        movePlayer(1, 0);
    }
    if (term.isKeyPressed(Keys.VK_DOWN)) {
        movePlayer(0, 1);
    }

    term.clear();
    game.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT, 0, 0, Colors.BLACK);

    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const c = getTile(x, y);
            const color = fov.isVisible(x, y) ? Colors.WHITE : Colors.DARK_GRAY;
            game.drawString(x, y, c, color);
        }
    }

    const dest = {x: term.mouse.x - 15, y: term.mouse.y - 8};
    const path = computePath(fov, player, dest, 1000);
    if (path) {
        for (let i = 1; i < path.length; i++) {
            const step = path[i];
            game.getCell(step.x, step.y).setBackground(Colors.DARK_RED);
        }
    }

    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    game.drawString(player.x, player.y, '@');
    term.drawConsole(15, 8, game, 0, 0, MAP_WIDTH, MAP_HEIGHT);
};
