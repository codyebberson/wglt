
import {Terminal} from '../src/terminal.js';
import {RNG} from '../src/rng.js';
import {fromRgb} from '../src/color.js';

const WIDTH = 80;
const HEIGHT = 50;

const term = new Terminal(document.querySelector('canvas'), WIDTH, HEIGHT);
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
