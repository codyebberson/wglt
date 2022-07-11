import { Colors, Font, Keys, Terminal } from '../src/';

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, 80, 25, {
  font: new Font('../terminal8x14_gs_ro.png', 8, 14),
});

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
