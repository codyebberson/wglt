
import {Terminal} from '../src/terminal.js';
import {Colors} from '../src/colors.js';
import {Keys} from '../src/keys.js';

const ART = `
   _____          __   .____________              __
  /  _  \\   _____|  | _|__\\______   \\__ __  ____ |  | __
 /  /_\\  \\ /  ___/  |/ /  ||     ___/  |  \\/    \\|  |/ /
/    |    \\\\___ \\|    <|  ||    |   |  |  /   |  \\    <
\\____|__  /____  >__|_ \\__||____|   |____/|___|  /__|_ \\
        \\/     \\/     \\/                       \\/     \\/`;

const term = new Terminal(document.querySelector('canvas'), 80, 50);
term.fillRect(0, 0, 80, 50, 0, Colors.YELLOW, Colors.DARK_BLUE);

let x = 10;
let y = 10;

console.log(ART);

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
    term.drawString(5, 5, ART);
    term.drawString(x, y, '@');
};
