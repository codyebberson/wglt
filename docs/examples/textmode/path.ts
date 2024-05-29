import { CgaPalette, Terminal, TileMap, TileMapCell, computePath } from 'wglt';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;
const VIEW_DISTANCE = 15;

const term = new Terminal(
  document.querySelector('canvas') as HTMLCanvasElement,
  SCREEN_WIDTH,
  SCREEN_HEIGHT
);

const player = {
  x: 40,
  y: 20,
  path: null as TileMapCell[] | null,
  pathIndex: 0,
};

function computeFov(): void {
  tileMap.computeFov(player.x, player.y, VIEW_DISTANCE);
  tileMap.updateExplored();
}

const tileMap = new TileMap(SCREEN_WIDTH, SCREEN_HEIGHT);
for (let y = 0; y < SCREEN_HEIGHT; y++) {
  for (let x = 0; x < SCREEN_WIDTH; x++) {
    const blocked = Math.random() < 0.4;
    tileMap.setTile(x, y, 0, blocked ? 1 : 2);
    tileMap.setBlocked(x, y, blocked);
    tileMap.setSeen(x, y, true);
  }
}
computeFov();

function movePlayer(dx: number, dy: number): void {
  const x = player.x + dx;
  const y = player.y + dy;
  if (x < 0 || x >= SCREEN_WIDTH || y < 0 || y >= SCREEN_HEIGHT || tileMap.isBlocked(x, y)) {
    return;
  }
  player.x = x;
  player.y = y;
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
  term.console.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 0, CgaPalette.WHITE, CgaPalette.BLACK);

  for (let y = 0; y < SCREEN_HEIGHT; y++) {
    for (let x = 0; x < SCREEN_WIDTH; x++) {
      const c = tileMap.getTile(x, y, 0);
      const str = c === 1 ? '#' : '.';
      const color = tileMap.isVisible(x, y) ? CgaPalette.WHITE : CgaPalette.DARK_GRAY;
      term.drawString(x, y, str, color);
    }
  }

  const path = computePath(tileMap, player, term.mouse, 1000);
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

  term.drawString(player.x, player.y, '@');
  term.drawString(1, 1, 'Hello world!', CgaPalette.WHITE);
  term.drawString(1, 3, 'Use arrow keys to move', CgaPalette.WHITE);
};
