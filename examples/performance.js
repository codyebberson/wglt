
const WIDTH = 80;
const HEIGHT = 50;

const term = new wglt.Terminal(document.querySelector('canvas'), WIDTH, HEIGHT);
const rng = new wglt.RNG();
const randomComp = () => rng.nextRange(0, 255);
const randomColor = () => wglt.fromRgb(randomComp(), randomComp(), randomComp());

term.update = function () {
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            term.drawChar(x, y, randomComp(), randomColor(), randomColor());
        }
    }
};
