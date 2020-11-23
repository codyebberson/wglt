
import {fixBoxCells} from '../src/boxutils';
import {Colors} from '../src/colors';
import {Console} from '../src/console';
import {Terminal} from '../src/terminal';
import { Chars } from '../src/chars';
import {Keys} from '../src/keys';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, SCREEN_WIDTH, SCREEN_HEIGHT);

const game = new Console(SCREEN_WIDTH, SCREEN_HEIGHT);

// Starcraft
// game.drawDoubleBox(0, 30, 15, 15, Colors.LIGHT_GREEN, Colors.DARK_GREEN);
// game.drawDoubleBox(15, 35, 45, 10, Colors.LIGHT_GREEN, Colors.DARK_GREEN);
// game.drawDoubleBox(65, 30, 15, 15, Colors.LIGHT_GREEN, Colors.DARK_GREEN);

game.drawDoubleBox(0, 0, 16, 45, Colors.LIGHT_GREEN, Colors.DARK_GREEN);
game.drawDoubleBox(0, 40, 80, 5, Colors.LIGHT_GREEN, Colors.DARK_GREEN);
game.drawDoubleBox(65, 0, 15, 15, Colors.LIGHT_GREEN, Colors.DARK_GREEN);
for (let x = 5; x < SCREEN_WIDTH; x += 5) {
    game.drawVLine(x, 40, 5, Chars.BOX_SINGLE_VERTICAL, Colors.LIGHT_GREEN, Colors.DARK_GREEN);
}

// This will update all box cells in the console such that stems match
fixBoxCells(game);

const player = {
    x: 10,
    y: 10,
    dx: 0,
    dy: 0,
    shootDx: 1,
    shootDy: 0
};

const bullets = [];

let t = 0;
let shootReleased = true;

term.update = function () {
    t++;
    if (t === 5) {
        if (term.isKeyDown(Keys.VK_X)) {
            if (shootReleased) {
                bullets.push({
                    x: player.x,
                    y: player.y,
                    dx: 4 * player.shootDx,
                    dy: 4 * player.shootDy,
                    life: 30
                });
                shootReleased = false;
            }
        } else {
            shootReleased = true;
            if (term.isKeyDown(Keys.VK_UP)) {
                player.y--;
                player.dy = -1;
            } else if (term.isKeyDown(Keys.VK_DOWN)) {
                player.y++;
                player.dy = 1;
            } else {
                player.dy = 0;
            }
            if (term.isKeyDown(Keys.VK_LEFT)) {
                player.x--;
                player.dx = -1;
            } else if (term.isKeyDown(Keys.VK_RIGHT)) {
                player.x++;
                player.dx = 1;
            } else {
                player.dx = 0;
            }
        }
        if (player.dx !== 0 || player.dy !== 0) {
            player.shootDx = player.dx;
            player.shootDy = player.dy;
        }
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            bullet.x += bullet.dx;
            bullet.y += bullet.dy;
            bullet.life--;
            if (bullet.life < 0) {
                bullets.splice(i, 1);
            }
        }

        term.clear();

        for (let y = 0; y < 40; y++) {
            for (let x = 16; x < 80; x++) {
                if (Math.random() < 0.05) {
                    term.drawChar(x, y, '/', Colors.DARK_GRAY);
                }
            }
        }

        term.drawString(player.x, player.y, '@', Colors.WHITE);

        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            term.drawChar(bullet.x, bullet.y, Chars.BULLET, Colors.WHITE);
        }

        term.drawConsole(0, 0, game, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        term.drawString(1, 1, 'Hello world!', Colors.LIGHT_GREEN);
        t = 0;
    }
};
