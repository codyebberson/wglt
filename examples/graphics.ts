import { Font, fromRgb, Terminal } from '../src/';

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, 20, 15, {
  font: new Font('../graphics.png', 16, 16, 2.0, true),
});

const TILE_EMPTY = fromRgb(15, 15, 0);
const TILE_WALL = fromRgb(1, 0, 0);
const TILE_GROUND = fromRgb(2, 0, 0);

const MAP = [
  '    ########        ',
  '  ###......#        ',
  '  #........#        ',
  '  #......#.#        ',
  '  #......#.#        ',
  '  ###..###.#        ',
  '    #......#########',
  '#####..............#',
  '#..................#',
  '#..................#',
  '#..................#',
  '#..................#',
  '#..................#',
  '#####..............#',
  '    ################',
];

let x = 4;
let y = 4;

term.update = function () {
  const moveKey = term.getMovementKey();
  if (moveKey) {
    x += moveKey.x;
    y += moveKey.y;
  }

  term.clear();

  for (let ty = 0; ty < MAP.length; ty++) {
    for (let tx = 0; tx < MAP[ty].length; tx++) {
      const tileChar = MAP[ty].charAt(tx);
      let tile = TILE_EMPTY;

      if (tileChar === '#') {
        tile = TILE_WALL;
      } else if (tileChar === '.') {
        tile = TILE_GROUND;
      }

      term.getCell(tx, ty)?.setBackground(tile);
    }
  }

  term.drawChar(10, 10, 4);
  term.drawChar(12, 10, 5);
  term.drawChar(14, 10, 6);
  term.drawChar(16, 10, 7);
  term.drawChar(x, y, 3);
};
