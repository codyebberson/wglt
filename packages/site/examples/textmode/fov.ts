import {
  CgaPalette,
  FovQuadrants,
  Terminal,
  TileMap,
  TileMapCell,
  computePath,
  getFovQuadrant,
} from 'wglt';

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

// function isBlocked(x: number, y: number): boolean {
//   return getTile(x, y) !== '.';
// }

const term = new Terminal(
  document.querySelector('canvas') as HTMLCanvasElement,
  SCREEN_WIDTH,
  SCREEN_HEIGHT
);

const player = {
  x: Math.floor(MAP_WIDTH / 2),
  y: Math.floor(MAP_HEIGHT / 2),
  direction: FovQuadrants.QUADRANT_NORTH,
  path: null as TileMapCell[] | null,
  pathIndex: 0,
};

const tileMap = new TileMap(MAP_WIDTH, MAP_HEIGHT);

function computeFov(): void {
  tileMap.computeFov(player.x, player.y, VIEW_DISTANCE, false, player.direction);
  tileMap.updateExplored();
}

function movePlayer(dx: number, dy: number): void {
  const x = player.x + dx;
  const y = player.y + dy;
  if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT || tileMap.isBlocked(x, y)) {
    return;
  }
  player.x = x;
  player.y = y;
  player.direction = getFovQuadrant(dx, dy);
  computeFov();
}

term.update = () => {
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
      movePlayer(
        player.path[player.pathIndex].x - player.x,
        player.path[player.pathIndex].y - player.y
      );
    }
  }

  term.clear();
  // tileMap.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 0, CgaPalette.WHITE, CgaPalette.BLACK);

  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const c = tileMap.getCell(x, y);
      if (c?.explored) {
        const color = tileMap.isVisible(x, y) ? CgaPalette.WHITE : CgaPalette.DARK_GRAY;
        term.drawString(x, y, getTile(x, y), color);
      }
    }
  }

  const dest = { x: term.mouse.x - OFFSET_X, y: term.mouse.y - OFFSET_Y };
  const path = computePath(tileMap, player, dest, 1000);
  if (path) {
    for (let i = 1; i < path.length; i++) {
      const step = path[i];
      const cell = term.getCell(step.x, step.y);
      if (cell) {
        cell.setBackground(CgaPalette.DARK_RED);
      }
    }

    if (term.mouse.buttons.get(0).isClicked()) {
      player.path = path;
      player.pathIndex = 0;
    }
  }

  term.drawString(OFFSET_X + player.x, OFFSET_Y + player.y, '@');
  term.drawString(1, 1, 'Hello world!', CgaPalette.WHITE);
  term.drawString(1, 3, 'Use arrow keys to move', CgaPalette.WHITE);
};

computeFov();
