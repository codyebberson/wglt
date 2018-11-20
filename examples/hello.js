
const term = new wglt.Terminal(document.querySelector('canvas'), 80, 50);
term.fillRect(0, 0, 80, 50, 0, wglt.Colors.YELLOW, wglt.Colors.DARK_BLUE);

let x = 10;
let y = 10;

term.update = function () {
    if (term.isKeyDown(wglt.VK_UP)) {
        y--;
    }
    if (term.isKeyDown(wglt.VK_LEFT)) {
        x--;
    }
    if (term.isKeyDown(wglt.VK_RIGHT)) {
        x++;
    }
    if (term.isKeyDown(wglt.VK_DOWN)) {
        y++;
    }

    term.clear();
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(x, y, '@');
};