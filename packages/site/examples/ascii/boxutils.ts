import { Cell, Chars, Console, Terminal, fixBoxCells } from '@wglt/ascii';
import { CgaPalette } from '@wglt/core';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

const term = new Terminal(
  document.querySelector('canvas') as HTMLCanvasElement,
  SCREEN_WIDTH,
  SCREEN_HEIGHT
);

const game = new Console(SCREEN_WIDTH, SCREEN_HEIGHT);
for (let y = 0; y < SCREEN_HEIGHT; y++) {
  for (let x = 0; x < SCREEN_WIDTH; x++) {
    if (Math.random() < 0.5) {
      const c =
        Math.random() < 0.5
          ? Chars.BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL
          : Chars.BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL;
      (game.getCell(x, y) as Cell).setValue(c, CgaPalette.WHITE, CgaPalette.DARK_BLUE);
    }
  }
}

// This will update all box cells in the console such that stems match
fixBoxCells(game);

term.update = () => {
  term.clear();
  term.drawConsole(0, 0, game, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  term.drawString(1, 1, 'Hello world!', CgaPalette.WHITE);
};
