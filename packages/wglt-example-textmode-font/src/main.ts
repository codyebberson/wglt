import { CgaPalette, Rect, Terminal } from 'wglt';

const term = Terminal.init(80, 25, {
  fontUrl: './terminal8x14_gs_ro.png',
  fontGlyphSize: new Rect(0, 0, 8, 14),
});

term.fillRect(0, 0, 80, 25, CgaPalette.DARK_BLUE);

let x = 10;
let y = 10;

term.update = (): void => {
  const moveKey = term.keyboard.getMovementKey();
  if (moveKey) {
    x += moveKey.x;
    y += moveKey.y;
  }

  term.clear();
  term.drawString(1, 1, 'Hello world!');
  term.drawString(1, 3, 'Use arrow keys to move');
  term.drawString(x, y, '@');
};
