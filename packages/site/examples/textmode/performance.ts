import { CgaPalette, Color, RNG, Terminal, fromRgb } from 'wglt';

const WIDTH = 80;
const HEIGHT = 45;

const term = new Terminal('canvas', WIDTH, HEIGHT);
const rng = new RNG();
const randomComp = (): number => rng.nextRange(0, 255);
const randomColor = (): Color => fromRgb(randomComp(), randomComp(), randomComp());

term.update = () => {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      term.drawChar(x, y, randomComp(), randomColor(), randomColor());
    }
  }

  term.drawString(0, 0, `FPS: ${term.fps.toFixed(0)}`, CgaPalette.WHITE);
  term.drawString(0, 1, `Avg: ${term.averageFps.toFixed(0)}`, CgaPalette.WHITE);
};
