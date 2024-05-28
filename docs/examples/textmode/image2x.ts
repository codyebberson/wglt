import { Console, Terminal, loadImage2x } from 'wglt';
import { CgaPalette } from 'wglt';

const term = new Terminal('canvas', 80, 45);
term.fillRect(0, 0, 80, 45, CgaPalette.DARK_BLUE);

let x = 10;
let y = 10;

let img = null as Console | null;
loadImage2x('/starry2x.png', (result) => {
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

  term.drawString(1, 1, 'Hello world!', CgaPalette.WHITE);
  term.drawString(1, 3, 'Use arrow keys to move', CgaPalette.WHITE);
  term.drawString(x, y, '@', CgaPalette.WHITE);
};
