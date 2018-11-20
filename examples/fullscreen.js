
const term = new wglt.Terminal(
    document.querySelector('canvas'),
    80, 50,
    {requestFullscreen: true});

term.fillRect(0, 0, 80, 50, 0, wglt.Colors.LIGHT_GREEN, wglt.Colors.BLACK);

let x = 10;
let y = 10;

term.update = function () {
    if (term.isKeyDown(wglt.Keys.VK_UP)) {
        y--;
    }
    if (term.isKeyDown(wglt.Keys.VK_LEFT)) {
        x--;
    }
    if (term.isKeyDown(wglt.Keys.VK_RIGHT)) {
        x++;
    }
    if (term.isKeyDown(wglt.Keys.VK_DOWN)) {
        y++;
    }
    if (term.mouse.dx !== 0 || term.mouse.dy !== 0) {
        x = term.mouse.x;
        y = term.mouse.y;
    }

    term.clear();
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(x, y, '@');
};
