import { Console, Terminal } from 'wglt';
import { CgaPalette, RNG, fromHsv } from 'wglt';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

const RADIUS = 30;
const SIZE = 1 + 2 * RADIUS;
const CENTER = RADIUS;
const BRIGHTNESS = 0.35;

function createLightConsole(h: number, s: number, v: number): Console {
  const c = new Console(SIZE, SIZE);

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const distance = Math.hypot(x - CENTER, y - CENTER);
      const inverseDistance = Math.max(0.0, Math.min(1.0, 1.0 - distance / RADIUS));
      const alpha = BRIGHTNESS * inverseDistance * inverseDistance;
      const bg = fromHsv(h, s, v, alpha);
      c.drawChar(x, y, 0, 0, bg);
    }
  }

  c.drawChar(CENTER, CENTER, '*'.charCodeAt(0), fromHsv(h, s, v));
  return c;
}

const term = new Terminal(
  document.querySelector('canvas') as HTMLCanvasElement,
  SCREEN_WIDTH,
  SCREEN_HEIGHT
);

const rng = new RNG();

const lights = [
  {
    x: 10,
    y: 10,
    console: createLightConsole(0.0, 0.0, 1.0),
  },
];

for (let i = 0; i < 6; i++) {
  lights.push({
    x: 15 + i * 10,
    y: 22,
    console: createLightConsole(i / 6.0, 1.0, 1.0),
  });
}

interface Raindrop {
  x: number;
  y: number;
  speed: number;
}

const rain: Raindrop[] = [];

for (let i = 0; i < 500; i++) {
  rain.push({
    x: rng.nextRange(0, SCREEN_WIDTH * 2),
    y: rng.nextRange(-SCREEN_HEIGHT, SCREEN_HEIGHT),
    speed: rng.nextRange(5, 10) / 5.0,
  });
}

term.update = () => {
  const moveKey = term.getMovementKey();
  if (moveKey) {
    lights[0].x += moveKey.x;
    lights[0].y += moveKey.y;
  }
  if (term.mouse.dx !== 0 || term.mouse.dy !== 0) {
    lights[0].x = term.mouse.x;
    lights[0].y = term.mouse.y;
  }

  term.fillRect(0, 0, 80, 45, 0, CgaPalette.BLACK, CgaPalette.BLACK);

  for (let i = 0; i < rain.length; i++) {
    const raindrop = rain[i];
    term.drawString(Math.round(raindrop.x), Math.round(raindrop.y), '/', CgaPalette.DARK_GRAY);
    raindrop.x -= raindrop.speed;
    raindrop.y += raindrop.speed;
    if (raindrop.x < 0 || raindrop.y > SCREEN_HEIGHT) {
      raindrop.x += SCREEN_WIDTH;
      raindrop.y -= SCREEN_WIDTH;
    }
  }

  for (let i = lights.length - 1; i >= 0; i--) {
    const light = lights[i];
    term.drawConsole(light.x - RADIUS, light.y - RADIUS, light.console, 0, 0, SIZE, SIZE, 'add');
  }

  term.drawString(1, 1, 'Hello world!', CgaPalette.YELLOW);
  term.drawString(1, 3, 'Use arrow keys to move', CgaPalette.YELLOW);
};
