import { Colors, type Console, loadImage2x, Terminal } from '../src/';

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, 80, 45);
term.fillRect(0, 0, 80, 45, 0, Colors.YELLOW, Colors.DARK_BLUE);

let x = 10;
let y = 10;

let img = null as Console | null;
loadImage2x('../starry2x.png', (result) => {
  img = result;
});

term.update = () => {
  const moveKey = term.getMovementKey();
  if (moveKey) {
    x += moveKey.x;
    y += moveKey.y;
  }

  term.clear();

  if (img) {
    term.drawConsole(0, 0, img, 0, 0, 80, 45);
  }

  term.drawString(1, 1, 'Hello world!', Colors.WHITE);
  term.drawString(1, 3, 'Use arrow keys to move', Colors.WHITE);
  term.drawString(x, y, '@', Colors.WHITE);
};
