import { Cell, ColodorePalette as Colors, computePath, Console, FovQuadrants, getFovQuadrant, Terminal } from '../src/';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

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

const OFFSET_X = ((SCREEN_WIDTH - MAP_WIDTH) / 2) | 0;
const OFFSET_Y = ((SCREEN_HEIGHT - MAP_HEIGHT) / 2) | 0;

const VIEW_DISTANCE = 15;

function getTile(x: number, y: number): string {
  return MAP[y].charAt(x);
}

function isBlocked(x: number, y: number): boolean {
  return getTile(x, y) !== '.';
}

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, SCREEN_WIDTH, SCREEN_HEIGHT, {
  crt: {
    scale: 3,
    blur: 0.5,
    curvature: 0.05,
    chroma: 0.5,
    vignette: 0.1,
    scanlineWidth: 0.75,
    scanlineIntensity: 0.25,
  },
});

const player = {
  x: Math.floor(MAP_WIDTH / 2),
  y: Math.floor(MAP_HEIGHT / 2),
  direction: FovQuadrants.QUADRANT_NORTH,
  path: null as Cell[] | null,
  pathIndex: 0,
};

const tileMap = new Console(MAP_WIDTH, MAP_HEIGHT, isBlocked);

function computeFov(): void {
  tileMap.computeFov(player.x, player.y, VIEW_DISTANCE, false, player.direction);
  tileMap.updateExplored();
}

function movePlayer(dx: number, dy: number): void {
  const x = player.x + dx;
  const y = player.y + dy;
  if ((dx === 0 && dy === 0) || x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT || isBlocked(x, y)) {
    return;
  }
  player.x = x;
  player.y = y;
  player.direction = getFovQuadrant(dx, dy);
  computeFov();
}

term.update = function () {
  const moveKey = term.getMovementKey();
  if (moveKey) {
    movePlayer(moveKey.x, moveKey.y);
  }

  if (player.path) {
    while (
      player.pathIndex < player.path.length &&
      player.x === player.path[player.pathIndex].x &&
      player.y === player.path[player.pathIndex].y
    ) {
      player.pathIndex++;
    }
    if (player.pathIndex < player.path.length) {
      movePlayer(player.path[player.pathIndex].x - player.x, player.path[player.pathIndex].y - player.y);
    }
  }

  term.clear();
  tileMap.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 0, Colors.WHITE, Colors.BLACK);

  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const c = tileMap.getCell(x, y);
      if (c && c.explored) {
        const color = tileMap.isVisible(x, y) ? Colors.WHITE : Colors.DARK_GRAY;
        tileMap.drawString(x, y, getTile(x, y), color);
      }
    }
  }

  const dest = { x: term.mouse.x - OFFSET_X, y: term.mouse.y - OFFSET_Y };
  const path = computePath(tileMap, player, dest, 1000);
  if (path) {
    for (let i = 1; i < path.length; i++) {
      const step = path[i];
      const cell = tileMap.getCell(step.x, step.y);
      if (cell) {
        cell.setBackground(Colors.RED);
      }
    }

    if (term.mouse.buttons.get(0).isClicked()) {
      player.path = path;
      player.pathIndex = 0;
    }
  }

  term.drawConsole(OFFSET_X, OFFSET_Y, tileMap, 0, 0, MAP_WIDTH, MAP_HEIGHT);
  term.drawString(OFFSET_X + player.x, OFFSET_Y + player.y, '@');
  term.drawString(1, 1, 'Hello world!', Colors.WHITE);
  term.drawString(1, 3, 'Use arrow keys to move', Colors.WHITE);
};

computeFov();
