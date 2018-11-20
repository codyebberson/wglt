
const term = new wglt.Terminal(document.querySelector('canvas'), 20, 15,
    {font: new wglt.Font('graphics.png', 16, 16, 2.0, true)});

let x = 4;
let y = 4;

term.update = function () {
    if (term.isKeyPressed(wglt.Keys.VK_UP)) {
        y--;
    }
    if (term.isKeyPressed(wglt.Keys.VK_LEFT)) {
        x--;
    }
    if (term.isKeyPressed(wglt.Keys.VK_RIGHT)) {
        x++;
    }
    if (term.isKeyPressed(wglt.Keys.VK_DOWN)) {
        y++;
    }

    term.clear();
    term.drawChar(10, 10, 4);
    term.drawChar(12, 10, 5);
    term.drawChar(14, 10, 6);
    term.drawChar(16, 10, 7);
    term.drawChar(x, y, 3);
};
