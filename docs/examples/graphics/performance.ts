import { CgaPalette, FONT_04B03, GraphicsApp, Rect } from 'wglt';

const app = new GraphicsApp({
  size: new Rect(0, 0, 640, 360),
  font: FONT_04B03,
});

interface MyObject {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const objects: MyObject[] = [];

const gravity = 0.1;

app.update = () => {
  if (app.mouse.buttons.get(0).down) {
    for (let i = 0; i < 100; i++) {
      objects.push({
        x: app.mouse.x,
        y: app.mouse.y,
        dx: (Math.random() - 0.5) * 10,
        dy: Math.random() * -10,
      });
    }
  }

  for (const obj of objects) {
    obj.x += obj.dx;
    obj.y += obj.dy;
    obj.dy += gravity;

    if (obj.y < 0) {
      obj.y = 0;
      obj.dy = 0;
    }

    if (obj.y > app.size.height) {
      obj.y = app.size.height;
      obj.dy *= -1;
    }

    if (obj.x < 0) {
      obj.x = 0;
      obj.dx *= -1;
    }

    if (obj.x > app.size.width) {
      obj.x = app.size.width;
      obj.dx *= -1;
    }

    app.drawImage(obj.x, obj.y, 0, 272, 16, 16);
  }

  app.drawString(1, 1, 'Hello world!', CgaPalette.YELLOW);
  app.drawString(1, 10, 'Click to add objects', CgaPalette.YELLOW);
  app.drawString(1, 40, `Object count: ${objects.length}`, CgaPalette.YELLOW);
};
