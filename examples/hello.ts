import { Colors, Terminal } from '../src/';

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, 80, 45);
term.fillRect(0, 0, 80, 45, 0, Colors.YELLOW, Colors.DARK_BLUE);

let x = 10;
let y = 10;

term.update = () => {
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
