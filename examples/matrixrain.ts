import { Cell, Colors, fromRgb, RNG, Terminal } from '../src/';

const w = 80;
const h = 45;

const rain = [...Array(h)].map(_ => Array(w).fill(0));

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, w, h);

const rng = new RNG();

term.update = function () {
  // Update bottom rows
  for (let y = h - 1; y >= 1; y--) {
    for (let x = 0; x < w; x++) {
      // Move rain down
      rain[y][x] = rain[y - 1][x];
      if (rain[y][x] === 255) {
        // Head of streak, new character
        term.drawChar(x, y, rng.nextRange(0, 255));
      }
    }
  }

  // Update the top row
  for (let x = 0; x < w; x++) {
    if (rng.nextFloat() > 0.99) {
      // 1% chance to start a new row
      rain[0][x] = 255;
      term.drawChar(x, 0, rng.nextRange(0, 255));
    } else {
      // Otherwise cooldown
      rain[0][x] = Math.max(0, rain[0][x] - 8);
    }
  }

  // Draw the rain to the screen
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const color = rain[y][x] === 255 ? Colors.WHITE : fromRgb(0, rain[y][x], 0);
      (term.getCell(x, y) as Cell).setForeground(color);
    }
  }
};
