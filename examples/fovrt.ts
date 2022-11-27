import { Cell, ColodorePalette as Colors, computePath, Console, Key, Point, Terminal } from '../src/';

const MAP = [
  '#############',
  '#...........#',
  '#...........#',
  '#...........#',
  '#...........#',
  '#...........#',
  '#...........#',
  '#...........#',
  '#...........#',
  '#....###....#',
  '#...........#',  // Notice the unexplored tiles behind this wall since it was part of the map
  '#...........#',  // at its creation, in opposite to the dynamic walls added just after, whereas
  '#############',  // the area behind was already seem/explored!
];

const SCREEN_WIDTH = 60;
const SCREEN_HEIGHT = 30;
const MAP_WIDTH = MAP[0].length;
const MAP_HEIGHT = MAP.length;
const OFFSET_X = ((SCREEN_WIDTH - MAP_WIDTH) / 2) | 0;
const OFFSET_Y = ((SCREEN_HEIGHT - MAP_HEIGHT) / 2) | 0;
const VIEW_DISTANCE = 6;

const getTile = (x: number, y: number): string => MAP[y].charAt(x);
const isBlocked = (x: number, y: number): boolean => getTile(x, y) !== '.';

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, SCREEN_WIDTH, SCREEN_HEIGHT);
const tileMap = new Console(MAP_WIDTH, MAP_HEIGHT, isBlocked);
const player = {
  x: Math.floor(MAP_WIDTH / 2),
  y: Math.floor(MAP_HEIGHT / 2),
  path: null as Cell[] | null,
  pathIndex: 0,
};

function computeFov(): void {
  tileMap.updateBlocked();
  tileMap.updateExplored();
  tileMap.computeFov(player.x, player.y, VIEW_DISTANCE); // Call compute only AFTER all update methods!
}

function movePlayer(dx: number, dy: number): void {
  const x = player.x + dx;
  const y = player.y + dy;
  if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT || isBlocked(x, y)) {
    return;
  }
  player.x = x;
  player.y = y;
  computeFov();
}

let frame = 0;

term.update = function () {
  const moveKey = term.getMovementKey({
    [Key.VK_W]: new Point(0, -1),
    [Key.VK_A]: new Point(-1, 0),
    [Key.VK_S]: new Point(0, 1),
    [Key.VK_D]: new Point(1, 0),
  });

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

  frame++;
  if (frame % 20 === 0) {
    MAP[3] = '#....###....#';
    MAP[6] = '#........#..#';
    computeFov()
  }
  if (frame % 40 === 0) {
    MAP[3] = '#...###.....#';
    MAP[6] = '#...........#';
    computeFov()
  }

  term.drawConsole(OFFSET_X, OFFSET_Y, tileMap, 0, 0, MAP_WIDTH, MAP_HEIGHT);
  term.drawString(OFFSET_X + player.x, OFFSET_Y + player.y, '@');
  term.drawString(1, 0, 'Use WASD keys to move');
  term.drawString(1, 1, 'Hover mouse behind walls to see pathfinding');
};

computeFov()
