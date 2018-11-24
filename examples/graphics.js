
const term = new wglt.Terminal(document.querySelector('canvas'), 20, 15,
    { font: new wglt.Font('graphics.png', 16, 16, 2.0, true) });

const TILE_EMPTY = wglt.fromRgb(15, 15, 0);
const TILE_WALL = wglt.fromRgb(1, 0, 0);
const TILE_GROUND = wglt.fromRgb(2, 0, 0);

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

    for (let ty = 0; ty < MAP.length; ty++) {
        for (let tx = 0; tx < MAP[ty].length; tx++) {
            let tileChar = MAP[ty].charAt(tx);
            let tile = TILE_EMPTY;

            if (tileChar === '#') {
                tile = TILE_WALL;
            } else if (tileChar === '.') {
                tile = TILE_GROUND;
            }

            term.getCell(tx, ty).setBackground(tile);
        }
    }

    term.drawChar(10, 10, 4);
    term.drawChar(12, 10, 5);
    term.drawChar(14, 10, 6);
    term.drawChar(16, 10, 7);
    term.drawChar(x, y, 3);
};
