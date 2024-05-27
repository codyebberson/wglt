import { CgaPalette, Terminal, fromHsv } from 'wglt';

const WIDTH = 80;
const HEIGHT = 45;

const term = new Terminal('canvas', WIDTH, HEIGHT);
let hue = 0;

term.update = () => {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const sat = x / WIDTH;
      const val = 1.0 - y / HEIGHT;
      term.drawChar(x, y, 0, 0, fromHsv(hue, sat, val));
    }
  }
  hue += 0.001;

  term.drawString(0, 0, `FPS: ${term.fps.toFixed(0)}`, CgaPalette.WHITE);
  term.drawString(0, 1, `Avg: ${term.averageFps.toFixed(0)}`, CgaPalette.WHITE);
};
