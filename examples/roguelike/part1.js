
const app = new wglt.App({
    canvas: document.querySelector('canvas'),
    imageUrl: '../graphics.png',
    width: 400,
    height: 224
});

const game = new wglt.Game(app, {
    tileWidth: 16,
    tileHeight: 16
});

const sprite = new wglt.Sprite(0, 16, 16, 16, 2, true);
const player = new wglt.Entity(game, 30, 20, 'Player', sprite, true);
game.player = player;
game.entities.push(player);

const messageLog = new wglt.MessageLog(game.gui, new wglt.Rect(1, 1, 100, 100));
messageLog.add('Hello world!');
messageLog.add('Use arrow keys to move');
game.gui.add(messageLog);

app.state = game;
