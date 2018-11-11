
const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 50;

const MAP = [
    '    ########        #########        ########    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #...#...#        #......#    ',
    '    #....#.#        #.#####.#        #......#    ',
    '    #....#.#        #...#...#        #......#    ',
    '    #..###.#        #.......#        #......#    ',
    '    #......##########.......##########......#    ',
    '#####.......................................#####',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#####.......................................#####',
    '    #......##########.......##########......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......##########.......##########......#    ',
    '#####.......................................#####',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#####.......................................#####',
    '    #......#############.#############......#    ',
    '    #......#        #..#.#..#        #......#    ',
    '    #..#####        #..#.#..#        #......#    ',
    '    #......#        #..#.#..#        #......#    ',
    '    #####..#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    ########        #########        ########    ',
];

const MAP_WIDTH = MAP[0].length;
const MAP_HEIGHT = MAP.length;

const VIEW_DISTANCE = 15;

function getTile(x, y) {
    return MAP[y].charAt(x);
}

function isBlocked(x, y) {
    return getTile(x, y) !== '.';
}

const term = new wglt.Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT);

const game = new wglt.Console(MAP_WIDTH, MAP_HEIGHT);

const player = {
    x: Math.floor(MAP_WIDTH / 2),
    y: Math.floor(MAP_HEIGHT / 2)
};

const fov = new wglt.FovMap(MAP_WIDTH, MAP_HEIGHT, isBlocked);
fov.computeFov(player.x, player.y, VIEW_DISTANCE);

function movePlayer(dx, dy) {
    const x = player.x + dx;
    const y = player.y + dy;
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT || isBlocked(x, y)) {
        return;
    }
    player.x = x;
    player.y = y;
    fov.computeFov(player.x, player.y, VIEW_DISTANCE);
}

term.update = function () {
    if (term.isKeyPressed(wglt.VK_UP)) {
        movePlayer(0, -1);
    }
    if (term.isKeyPressed(wglt.VK_LEFT)) {
        movePlayer(-1, 0);
    }
    if (term.isKeyPressed(wglt.VK_RIGHT)) {
        movePlayer(1, 0);
    }
    if (term.isKeyPressed(wglt.VK_DOWN)) {
        movePlayer(0, 1);
    }

    term.clear();

    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const c = getTile(x, y);
            const color = fov.isVisible(x, y) ? wglt.Colors.WHITE : wglt.Colors.DARK_GRAY;
            game.drawString(x, y, c, color);
        }
    }

    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    game.drawString(player.x, player.y, '@');
    term.drawConsole(15, 8, game, 0, 0, MAP_WIDTH, MAP_HEIGHT);
};
