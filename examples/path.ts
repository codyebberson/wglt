
import { Cell } from '../src/cell';
import { Colors } from '../src/colors';
import { Console } from '../src/console';
import { computePath } from '../src/path';
import { Terminal } from '../src/terminal';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

const MAP = new Array(SCREEN_HEIGHT);
for (let y = 0; y < SCREEN_HEIGHT; y++) {
  MAP[y] = new Array(SCREEN_WIDTH);
  for (let x = 0; x < SCREEN_WIDTH; x++) {
    MAP[y][x] = Math.random() < 0.4 ? '#' : '.';
  }
}

const VIEW_DISTANCE = 15;

function getTile(x: number, y: number) {
  return MAP[y][x];
}

function isBlocked(x: number, y: number) {
  return getTile(x, y) !== '.';
}

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, SCREEN_WIDTH, SCREEN_HEIGHT);

const player = {
  x: Math.floor(SCREEN_WIDTH / 2),
  y: Math.floor(SCREEN_HEIGHT / 2),
  path: null as Cell[] | null,
  pathIndex: 0
};

function computeFov() {
  tileMap.computeFov(player.x, player.y, VIEW_DISTANCE);
  tileMap.updateExplored();
}

const tileMap = new Console(SCREEN_WIDTH, SCREEN_HEIGHT, isBlocked);
for (let y = 0; y < SCREEN_HEIGHT; y++) {
  for (let x = 0; x < SCREEN_WIDTH; x++) {
    (tileMap.getCell(x, y) as Cell).explored = true;
  }
}
computeFov();

function movePlayer(dx: number, dy: number) {
  const x = player.x + dx;
  const y = player.y + dy;
  if (x < 0 || x >= SCREEN_WIDTH || y < 0 || y >= SCREEN_HEIGHT || isBlocked(x, y)) {
    return;
  }
  player.x = x;
  player.y = y;
  computeFov();
}

term.update = function () {
  const moveKey = term.getMovementKey();
  if (moveKey) {
    movePlayer(moveKey.x, moveKey.y);
  }

  if (player.path) {
    while (player.pathIndex < player.path.length &&
      player.x === player.path[player.pathIndex].x &&
      player.y === player.path[player.pathIndex].y) {
      player.pathIndex++;
    }
    if (player.pathIndex < player.path.length) {
      movePlayer(
        player.path[player.pathIndex].x - player.x,
        player.path[player.pathIndex].y - player.y);
    }
  }

  term.clear();
  tileMap.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 0, Colors.WHITE, Colors.BLACK);

  for (let y = 0; y < SCREEN_HEIGHT; y++) {
    for (let x = 0; x < SCREEN_WIDTH; x++) {
      const c = getTile(x, y);
      const color = tileMap.isVisible(x, y) ? Colors.WHITE : Colors.DARK_GRAY;
      tileMap.drawString(x, y, c, color);
    }
  }

  const path = computePath(tileMap, player, term.mouse, 1000);
  if (path) {
    for (let i = 1; i < path.length; i++) {
      const step = path[i];
      const cell = tileMap.getCell(step.x, step.y);
      if (cell) {
        cell.setBackground(Colors.DARK_RED);
      }
    }

    if (term.mouse.buttons[0].upCount === 1) {
      player.path = path;
      player.pathIndex = 0;
    }
  }

  term.drawConsole(0, 0, tileMap, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  term.drawString(player.x, player.y, '@');
  term.drawString(1, 1, 'Hello world!', Colors.WHITE);
  term.drawString(1, 3, 'Use arrow keys to move', Colors.WHITE);
};
