import {
  AutoRectRenderer,
  Button,
  ButtonSlot,
  CgaPalette,
  Dialog,
  FONT_04B03,
  GUI,
  GraphicsApp,
  GraphicsButtonRenderer,
  GraphicsLabelRenderer,
  Label,
  Panel,
  Rect,
  Sprite,
} from 'wglt';

const app = new GraphicsApp({
  size: new Rect(0, 0, 640, 360),
  font: FONT_04B03,
});

let x = 160;
let y = 160;

const gui = new GUI(app);

// Many UI elements require a "source rect", which defines where in the source image the sprite is located.
// This is the source rect for the dialog box in graphics.png
// It is an "auto rect", which means it will intelligently scale the image while preserving the corners
const dialogSourceRect = new Rect(0, 64, 24, 24);

// Now we can register the renderer for the Dialog class
gui.renderers.set(Dialog, new AutoRectRenderer(dialogSourceRect));
gui.renderers.set(Panel, new AutoRectRenderer(dialogSourceRect));
gui.renderers.set(ButtonSlot, new AutoRectRenderer(dialogSourceRect));
gui.renderers.set(Label, new GraphicsLabelRenderer());
gui.renderers.set(Button, new GraphicsButtonRenderer());

const testButtonSprite = new Sprite(128, 32, 16, 16);

const testButton = new Button(new Rect(0, 0, 24, 24), testButtonSprite, undefined, () => {
  const dialog = new Dialog(new Rect(100, 100, 200, 100), 'Test Dialog');
  dialog.addChild(new Label(new Rect(10, 10, 180, 20), 'Hello world!', CgaPalette.YELLOW));
  gui.addChild(dialog);
});

testButton.tooltip = new Label(new Rect(0, 0, 100, 20), 'Test button tooltip', CgaPalette.YELLOW);

const testButtonSlot = new ButtonSlot(new Rect(10, 70, 24, 24));
testButtonSlot.addChild(testButton);
gui.addChild(testButtonSlot);

app.update = (): void => {
  if (!gui.handleInput()) {
    const moveKey = app.keyboard.getMovementKey();
    if (moveKey) {
      x += moveKey.x * 8;
      y += moveKey.y * 8;
    }
  }

  app.drawString(1, 1, 'Hello world!', CgaPalette.YELLOW);
  app.drawString(1, 10, 'Use arrow keys to move', CgaPalette.YELLOW);
  app.drawString(x, y, '@', CgaPalette.LIGHT_GREEN);

  gui.draw();
};
