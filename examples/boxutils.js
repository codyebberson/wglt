
const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 50;

const term = new wglt.Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT);

const game = new wglt.Console(SCREEN_WIDTH, SCREEN_HEIGHT);
for (let y = 0; y < SCREEN_HEIGHT; y++) {
    for (let x = 0; x < SCREEN_WIDTH; x++) {
        if (Math.random() < 0.5) {
            game.getCell(x, y).setValue(0xB3, wglt.Colors.WHITE, wglt.Colors.DARK_BLUE);
        }
    }
}

// This will update all box cells in the console such that stems match
wglt.fixBoxCells(game);

term.update = function () {
    term.clear();
    term.drawConsole(0, 0, game, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    term.drawString(1, 1, 'Hello world!', wglt.Colors.WHITE);
};
