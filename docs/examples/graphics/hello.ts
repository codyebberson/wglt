import { CgaPalette, FONT_04B03, GraphicsApp, Rect, Sprite } from 'wglt';

const app = new GraphicsApp({
  size: new Rect(0, 0, 640, 360),
  font: FONT_04B03,
  fillSourceRect: new Rect(1008, 0, 16, 16),
  dialogRect: new Rect(0, 32, 48, 48),
  closeButtonRect: new Rect(0, 0, 80, 45),
  buttonRect: new Rect(0, 32, 48, 48),
  buttonSlotRect: new Rect(0, 32, 48, 48),
});

const sprite = new Sprite(576, 240, 16, 16, 2);

let x = 160;
let y = 160;

app.update = () => {
  const moveKey = app.getMovementKey();
  if (moveKey) {
    x += moveKey.x * 8;
    y += moveKey.y * 8;
  }

  app.fillRect(0, 0, 640, 360, CgaPalette.DARK_BLUE);
  app.drawString(1, 1, 'Hello world!', CgaPalette.YELLOW);
  app.drawString(1, 10, 'Use arrow keys to move', CgaPalette.YELLOW);
  sprite.draw(app, x, y);
};
