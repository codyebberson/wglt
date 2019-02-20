
import {App} from './app';
import {Input} from './input';
import {Rect} from './rect';

export class Mouse extends Input {
  private readonly app: App;
  private prevX: number;
  private prevY: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  dx: number;
  dy: number;

  constructor(app: App) {
    super();
    this.app = app;
    this.prevX = 0;
    this.prevY = 0;
    this.startX = 0;
    this.startY = 0;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;

    const el = app.canvas;

    const mouseEventHandler = this.handleEvent.bind(this);
    el.addEventListener('mousedown', mouseEventHandler);
    el.addEventListener('mouseup', mouseEventHandler);
    el.addEventListener('mousemove', mouseEventHandler);
    el.addEventListener('contextmenu', mouseEventHandler);

    const touchEventHandler = this.handleTouchEvent.bind(this);
    el.addEventListener('touchstart', touchEventHandler);
    el.addEventListener('touchend', touchEventHandler);
    el.addEventListener('touchcancel', touchEventHandler);
    el.addEventListener('touchmove', touchEventHandler);
  }

  private handleTouchEvent(e: TouchEvent) {
    e.stopPropagation();
    e.preventDefault();

    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.updatePosition(touch.clientX, touch.clientY);
      this.down = true;
    } else {
      this.down = false;
    }
  }

  private handleEvent(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    this.updatePosition(e.clientX, e.clientY);

    if (e.type === 'mousedown') {
      this.down = true;
      this.startX = this.x;
      this.startY = this.y;
      this.app.canvas.focus();
    }

    if (e.type === 'mouseup') {
      this.down = false;
    }
  }

  private updatePosition(clientX: number, clientY: number) {
    let rect: ClientRect|DOMRect|Rect = this.app.canvas.getBoundingClientRect();

    // If the client rect is not the same aspect ratio as canvas,
    // then we are fullscreen.
    // Need to update client rect accordingly.

    const terminalAspectRatio = this.app.size.width / this.app.size.height;
    const rectAspectRatio = rect.width / rect.height;

    if (rectAspectRatio - terminalAspectRatio > 0.01) {
      const actualWidth = terminalAspectRatio * rect.height;
      const excess = rect.width - actualWidth;
      rect = new Rect(Math.floor(excess / 2), 0, actualWidth, rect.height);
    }

    if (rectAspectRatio - terminalAspectRatio < -0.01) {
      const actualHeight = rect.width / terminalAspectRatio;
      const excess = rect.height - actualHeight;
      rect = new Rect(0, Math.floor(excess / 2), rect.width, actualHeight);
    }

    this.x = (this.app.size.width * (clientX - rect.left) / rect.width) | 0;
    this.y = (this.app.size.height * (clientY - rect.top) / rect.height) | 0;
  }

  update() {
    super.update();
    this.dx = this.x - this.prevX;
    this.dy = this.y - this.prevY;
    this.prevX = this.x;
    this.prevY = this.y;
  }

  isClicked() {
    return this.upCount === 1 && Math.hypot(this.x - this.startX, this.y - this.startY) < 16;
  }
}