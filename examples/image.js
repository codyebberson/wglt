
import {Colors} from '../src/colors.js';
import {loadImage} from '../src/image.js';
import {Keys} from '../src/keys.js';
import {Terminal} from '../src/terminal.js';

const term = new Terminal(document.querySelector('canvas'), 80, 50);
term.fillRect(0, 0, 80, 50, 0, Colors.YELLOW, Colors.DARK_BLUE);

let x = 10;
let y = 10;

let img = null;
loadImage('starry.png', (result) => {img = result});

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

    term.clear();

    if (img) {
        term.drawConsole(0, 0, img, 0, 0, 80, 50);
    }

    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(x, y, '@');
};
