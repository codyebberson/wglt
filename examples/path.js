
import {Colors} from '../src/colors.js';
import {Font} from '../src/font.js';
import {Keys} from '../src/keys.js';
import {Terminal} from '../src/terminal.js';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 50;

const MAP = new Array(SCREEN_HEIGHT);
for (let y = 0; y < SCREEN_HEIGHT; y++) {
    MAP[y] = new Array(SCREEN_WIDTH);
    for (let x = 0; x < SCREEN_WIDTH; x++) {
        MAP[y][x] = Math.random() < 0.4 ? '#' : '.';
    }
}

const VIEW_DISTANCE = 15;

function getTile(x, y) {
    return MAP[y][x];
}

function isBlocked(x, y) {
    return getTile(x, y) !== '.';
}

const term = new Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT);

const game = new Console(SCREEN_WIDTH, SCREEN_HEIGHT);

const player = {
    x: Math.floor(SCREEN_WIDTH / 2),
    y: Math.floor(SCREEN_HEIGHT / 2)
};

const fov = new FovMap(SCREEN_WIDTH, SCREEN_HEIGHT, isBlocked);
fov.computeFov(player.x, player.y, VIEW_DISTANCE);

function movePlayer(dx, dy) {
    const x = player.x + dx;
    const y = player.y + dy;
    if (x < 0 || x >= SCREEN_WIDTH || y < 0 || y >= SCREEN_HEIGHT || isBlocked(x, y)) {
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
    game.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 0, 0, Colors.BLACK);

    for (let y = 0; y < SCREEN_HEIGHT; y++) {
        for (let x = 0; x < SCREEN_WIDTH; x++) {
            const c = getTile(x, y);
            const color = fov.isVisible(x, y) ? Colors.WHITE : Colors.DARK_GRAY;
            game.drawString(x, y, c, color);
        }
    }

    const path = computePath(fov, player, term.mouse, 1000);
    if (path) {
        for (let i = 1; i < path.length; i++) {
            const step = path[i];
            game.getCell(step.x, step.y).setBackground(Colors.DARK_RED);
        }
    }

    game.drawString(player.x, player.y, '@');
    term.drawConsole(0, 0, game, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    term.drawString(1, 1, 'Hello world!', Colors.WHITE);
    term.drawString(1, 3, 'Use arrow keys to move', Colors.WHITE);
};
