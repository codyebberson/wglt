
const app = new wglt.App({
    canvas: document.querySelector('canvas'),
    imageUrl: 'graphics.png',
    width: 400,
    height: 224
});

const game = new wglt.Game(app, {});

let x = 20;
let y = 20;

game.onUpdate = function () {
    if (app.isKeyDown(wglt.Keys.VK_UP)) {
        y--;
    }
    if (app.isKeyDown(wglt.Keys.VK_LEFT)) {
        x--;
    }
    if (app.isKeyDown(wglt.Keys.VK_RIGHT)) {
        x++;
    }
    if (app.isKeyDown(wglt.Keys.VK_DOWN)) {
        y++;
    }

    app.drawString('Hello world!', 1, 1);
    app.drawString('Use arrow keys to move', 1, 11);
    app.drawString('@', x, y);
};

app.state = game;
