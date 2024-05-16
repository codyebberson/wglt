import { Terminal } from 'wglt';
import { CgaPalette } from 'wglt';

const term = new Terminal('canvas', 80, 45);
term.fillRect(0, 0, 80, 45, 0, CgaPalette.YELLOW, CgaPalette.DARK_BLUE);

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
