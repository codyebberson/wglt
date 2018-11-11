
// Actual size of the window
const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 50;

function handleKeys() {
    if (term.isKeyPressed(wglt.VK_UP)) {
        y--;
    }
    if (term.isKeyPressed(wglt.VK_LEFT)) {
        x--;
    }
    if (term.isKeyPressed(wglt.VK_RIGHT)) {
        x++;
    }
    if (term.isKeyPressed(wglt.VK_DOWN)) {
        y++;
    }
}

function renderAll() {
    term.clear();
    term.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 0, wglt.Colors.YELLOW, wglt.Colors.DARK_BLUE)
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(x, y, '@');
}

const term = new wglt.Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT);

let x = 10;
let y = 10;

term.update = function () {
    handleKeys();
    renderAll();
};
