// Based on: https://lodev.org/cgtutor/fire.html

import { fromHsv, RNG, Terminal } from '../src/';

const w = 80;
const h = 45;

const fire = new Array(h);
for (let y = 0; y < h; y++) {
  fire[y] = new Array(w);
  for (let x = 0; x < w; x++) {
    fire[y][x] = 0;
  }
}

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, w, h);

const rng = new RNG();

term.update = () => {
  // Randomize the bottom row
  for (let x = 0; x < w; x++) {
    fire[h - 1][x] = rng.nextRange(64, 255);
  }

  // Do the fire calculations for every cell except bottom row
  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w; x++) {
      fire[y][x] = Math.floor(
        (fire[(y + 1) % h][(x - 1 + w) % w] +
          fire[(y + 1) % h][x % w] +
          fire[(y + 1) % h][(x + 1) % w] +
          fire[(y + 2) % h][x % w]) *
          0.24
      );
    }
  }

  // Draw the fire to the screen
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const t = fire[y][x] / 256.0;
      const c = fromHsv(t / 6.0, 1.0, Math.min(1.0, t * 2));
      term.drawChar(x, y, 0, 0, c);
    }
  }
};
