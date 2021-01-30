
import { Terminal } from '../src/terminal';
import { RNG } from '../src/rng';
import { fromRgb } from '../src/color';

const WIDTH = 80;
const HEIGHT = 45;

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, WIDTH, HEIGHT, { frameRate: 60 });
const rng = new RNG();
const randomComp = () => rng.nextRange(0, 255);
const randomColor = () => fromRgb(randomComp(), randomComp(), randomComp());

term.update = function () {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      term.drawChar(x, y, randomComp(), randomColor(), randomColor());
    }
  }
};
