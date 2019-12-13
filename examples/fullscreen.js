import {Terminal} from '../src/terminal.js';
import {Colors} from '../src/colors.js';
import {Keys} from '../src/keys.js';

const term = new Terminal(
    document.querySelector('canvas'),
    80, 50,
    {requestFullscreen: true});

term.fillRect(0, 0, 80, 50, 0, Colors.LIGHT_GREEN, Colors.BLACK);

let x = 10;
let y = 10;

term.update = function () {
    if (term.isKeyDown(Keys.VK_UP)) {
        y--;
    }
    if (term.isKeyDown(Keys.VK_LEFT)) {
        x--;
    }
    if (term.isKeyDown(Keys.VK_RIGHT)) {
        x++;
    }
    if (term.isKeyDown(Keys.VK_DOWN)) {
        y++;
    }
    if (term.mouse.dx !== 0 || term.mouse.dy !== 0) {
        x = term.mouse.x;
        y = term.mouse.y;
    }

    term.clear();
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(x, y, '@');
};
