
import {Colors} from '../src/colors.js';
import {Font} from '../src/font.js';
import {Keys} from '../src/keys.js';
import {Terminal} from '../src/terminal.js';

const term = new Terminal(document.querySelector('canvas'), 80, 25,
    {font: new Font('terminal8x14_gs_ro.png', 8, 14)});

term.fillRect(0, 0, 80, 25, 0, Colors.YELLOW, Colors.DARK_BLUE);

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

    term.clear();
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(x, y, '@');
};
