import { Colors, Console, Keys, loadImage2x, Terminal } from '../src/';

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, 80, 45);
term.fillRect(0, 0, 80, 45, 0, Colors.YELLOW, Colors.DARK_BLUE);

let x = 10;
let y = 10;

let img = null as Console | null;
loadImage2x('starry2x.png', (result) => (img = result));

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
    term.drawConsole(0, 0, img, 0, 0, 80, 45);
  }

  term.drawString(1, 1, 'Hello world!', Colors.WHITE);
  term.drawString(1, 3, 'Use arrow keys to move', Colors.WHITE);
  term.drawString(x, y, '@', Colors.WHITE);
};
