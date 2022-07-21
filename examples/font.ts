import { Colors, Font, Terminal } from '../src/';

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, 80, 25, {
  font: new Font('../terminal8x14_gs_ro.png', 8, 14),
});

term.fillRect(0, 0, 80, 25, 0, Colors.YELLOW, Colors.DARK_BLUE);

let x = 10;
let y = 10;

term.update = function () {
  const moveKey = term.getMovementKey();
  if (moveKey) {
    x += moveKey.x;
    y += moveKey.y;
  }

  term.clear();
  term.drawString(1, 1, 'Hello world!');
  term.drawString(1, 3, 'Use arrow keys to move');
  term.drawString(x, y, '@');
};
