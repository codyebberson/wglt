import { Cell } from '../src/cell';
import { Colors } from '../src/colors';
import { computePath } from '../src/path';
import { Console } from '../src/console';
import { Keys } from '../src/keys';
import { Terminal } from '../src/terminal';
import { getFovQuadrant, FovQuadrants } from '../src/fov';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

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

const OFFSET_X = ((SCREEN_WIDTH - MAP_WIDTH) / 2) | 0;
const OFFSET_Y = ((SCREEN_HEIGHT - MAP_HEIGHT) / 2) | 0;

const VIEW_DISTANCE = 15;

function getTile(x: number, y: number) {
    return MAP[y].charAt(x);
}

function isBlocked(x: number, y: number) {
    return getTile(x, y) !== '.';
}

const term = new Terminal(
    document.querySelector('canvas') as HTMLCanvasElement,
    SCREEN_WIDTH,
    SCREEN_HEIGHT);

const game = new Console(MAP_WIDTH, MAP_HEIGHT);

const player = {
    x: Math.floor(MAP_WIDTH / 2),
    y: Math.floor(MAP_HEIGHT / 2),
    direction: FovQuadrants.QUADRANT_NORTH,
    path: null as Cell[] | null,
    pathIndex: 0
};

const tileMap = new Console(MAP_WIDTH, MAP_HEIGHT, isBlocked);

function computeFov() {
    tileMap.computeFov(player.x, player.y, VIEW_DISTANCE, false, player.direction);
    tileMap.updateExplored();
}

function movePlayer(dx: number, dy: number) {
    const x = player.x + dx;
    const y = player.y + dy;
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT || isBlocked(x, y)) {
        return;
    }
    player.x = x;
    player.y = y;
    player.direction = getFovQuadrant(dx, dy);
    computeFov();
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

    if (player.path) {
        while (player.pathIndex < player.path.length &&
            player.x === player.path[player.pathIndex].x &&
            player.y === player.path[player.pathIndex].y) {
            player.pathIndex++;
        }
        if (player.pathIndex < player.path.length) {
            movePlayer(
                player.path[player.pathIndex].x - player.x,
                player.path[player.pathIndex].y - player.y);
        }
    }

    term.clear();
    game.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT, 0, 0, Colors.BLACK);

    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const c = tileMap.getCell(x, y);
            if (c && c.explored) {
                const color = tileMap.isVisible(x, y) ? Colors.WHITE : Colors.DARK_GRAY;
                game.drawString(x, y, getTile(x, y), color);
            }
        }
    }

    const dest = { x: term.mouse.x - OFFSET_X, y: term.mouse.y - OFFSET_Y };
    const path = computePath(tileMap, player, dest, 1000);
    if (path) {
        for (let i = 1; i < path.length; i++) {
            const step = path[i];
            const cell = game.getCell(step.x, step.y);
            if (cell) {
                cell.setBackground(Colors.DARK_RED);
            }
        }

        if (term.mouse.buttons[0].upCount === 1) {
            player.path = path;
            player.pathIndex = 0;
        }
    }

    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    game.drawString(player.x, player.y, '@');
    term.drawConsole(OFFSET_X, OFFSET_Y, game, 0, 0, MAP_WIDTH, MAP_HEIGHT);
};

computeFov();