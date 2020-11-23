
import { Terminal } from '../src/terminal';
import { Colors } from '../src/colors';
import { Keys } from '../src/keys';

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, 80, 45);
term.fillRect(0, 0, 80, 45, 0, Colors.YELLOW, Colors.DARK_BLUE);

let x = 10;
let y = 10;

term.update = function () {
    if (term.isKeyPressed(Keys.VK_UP)) {
        y--;
    }
    if (term.isKeyPressed(Keys.VK_LEFT)) {
        x--;
    }
    if (term.isKeyPressed(Keys.VK_RIGHT)) {
        x++;
    }
    if (term.isKeyPressed(Keys.VK_DOWN)) {
        y++;
    }

    term.clear();
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(x, y, '@');
};
