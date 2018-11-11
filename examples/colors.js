
const WIDTH = 80;
const HEIGHT = 50;

const term = new wglt.Terminal(document.querySelector('canvas'), WIDTH, HEIGHT);
let hue = 0;

term.update = function () {
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const sat = x / WIDTH;
            const val = 1.0 - (y / HEIGHT);
            term.drawChar(x, y, 0, 0, wglt.fromHsv(hue, sat, val));
        }
    }
    hue += 0.001;
};
