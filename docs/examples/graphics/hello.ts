import {
  Button,
  ButtonSlot,
  CgaPalette,
  FONT_04B03,
  GUI,
  GraphicsApp,
  Message,
  Rect,
  Sprite,
} from 'wglt';

const app = new GraphicsApp({
  size: new Rect(0, 0, 640, 360),
  font: FONT_04B03,
  fillSourceRect: new Rect(1008, 0, 16, 16),
  dialogRect: new Rect(0, 32, 48, 48),
  closeButtonRect: new Rect(0, 0, 80, 45),
  buttonRect: new Rect(0, 32, 48, 48),
  buttonSlotRect: new Rect(0, 32, 48, 48),
});

let x = 160;
let y = 160;

const testDialogRect = new Rect(100, 100, 200, 100);

const testGui = new GUI(app.size);

const testButtonSprite = new Sprite(0, 0, 16, 16);

const testButton = new Button(new Rect(10, 40, 24, 24), testButtonSprite);
testButton.tooltipMessages = [new Message('Test button tooltip', CgaPalette.YELLOW)];
// testGui.add(testButton);

const testButtonSlot = new ButtonSlot(new Rect(10, 70, 24, 24));
testButtonSlot.addChild(testButton);
testGui.add(testButtonSlot);

app.update = () => {
  const moveKey = app.getMovementKey();
  if (moveKey) {
    x += moveKey.x * 8;
    y += moveKey.y * 8;
  }

  app.fillRect(0, 0, 640, 360, CgaPalette.DARK_BLUE);

  // testGui.update(app);
  testGui.handleInput(app);
  testGui.draw(app);

  app.drawString(1, 1, 'Hello world!', CgaPalette.YELLOW);
  app.drawString(1, 10, 'Use arrow keys to move', CgaPalette.YELLOW);
  app.drawString(x, y, '@', CgaPalette.LIGHT_GREEN);

  app.drawAutoRect(app.config.dialogRect, testDialogRect);
};
