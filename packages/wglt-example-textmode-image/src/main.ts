import { CgaPalette, Console, loadImage, Terminal } from 'wglt';

const term = Terminal.init(80, 45);
term.fillRect(0, 0, 80, 45, CgaPalette.DARK_BLUE);

let x = 10;
let y = 10;

let img = null as Console | null;
loadImage('/starry.png', (result) => {
  img = result;
});

term.update = (): void => {
  const moveKey = term.keyboard.getMovementKey();
  if (moveKey) {
    x += moveKey.x;
    y += moveKey.y;
  }

  term.clear();

  if (img) {
    term.drawConsole(0, 0, img, 0, 0, 80, 45);
  }

  term.drawString(1, 1, 'Hello world!');
  term.drawString(1, 3, 'Use arrow keys to move');
  term.drawString(x, y, '@');
};
