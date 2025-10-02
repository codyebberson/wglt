import { CgaPalette, FONT_04B03, GraphicsApp, Sprite } from 'wglt';

const app = new GraphicsApp('canvas', 640, 360, FONT_04B03);

// This is the hero sprite in graphics.png
// The animation sequence starts at x=0, y=16, width=16, height=16, and has 2 frames
const sprite = new Sprite(0, 16, 16, 16, 2);

let x = 160;
let y = 160;

app.update = (): void => {
  const moveKey = app.keyboard.getMovementKey();
  if (moveKey) {
    x += moveKey.x * 8;
    y += moveKey.y * 8;
  }

  app.drawString(1, 1, 'Hello world!', CgaPalette.YELLOW);
  app.drawString(1, 10, 'Use arrow keys to move', CgaPalette.YELLOW);
  sprite.draw(app, x, y);
};
