
import { App } from './app';
import { Input } from './input';
import { Rect } from './rect';
import { Vec2 } from './vec2';

const MIN_DRAG_DISTANCE = 4;
const LONG_PRESS_TICKS = 30;

export class Mouse extends Input {
  private readonly app: App;
  readonly prev: Vec2;
  readonly start: Vec2;
  x: number;
  y: number;
  dx: number;
  dy: number;
  dragDistance: number;
  longPress: boolean;
  wheelDelta: number;
  lastWheelDelta: number;

  constructor(app: App) {
    super();
    this.app = app;
    this.prev = new Vec2(0, 0);
    this.start = new Vec2(0, 0);
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.dragDistance = 0;
    this.longPress = false;
    this.wheelDelta = 0;
    this.lastWheelDelta = 0;

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

    const wheelEventHandler = this.handleMouseWheel.bind(this);
    el.addEventListener('mousewheel', wheelEventHandler);
  }

  private handleTouchEvent(e: TouchEvent) {
    e.stopPropagation();
    e.preventDefault();

    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.updatePosition(touch.clientX, touch.clientY);
    }

    if (e.type === 'touchstart') {
      this.down = true;
      this.prev.x = this.x;
      this.prev.y = this.y;
      this.start.x = this.x;
      this.start.y = this.y;
      this.dx = 0;
      this.dy = 0;
      this.dragDistance = 0;
    }

    if (e.type === 'touchend') {
      this.down = false;
      this.longPress = this.downCount >= LONG_PRESS_TICKS;
    }
  }

  private handleEvent(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    this.updatePosition(e.clientX, e.clientY);

    if (e.type === 'mousedown') {
      this.down = true;
      this.start.x = this.x;
      this.start.y = this.y;
      this.dragDistance = 0;
      this.app.canvas.focus();
    }

    if (e.type === 'mouseup') {
      this.down = false;
      this.longPress = this.downCount >= LONG_PRESS_TICKS;
    }
  }

  private updatePosition(clientX: number, clientY: number) {
    let rect: ClientRect | DOMRect | Rect = this.app.canvas.getBoundingClientRect();

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

  private handleMouseWheel(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    const mwe = e as WheelEvent;
    this.lastWheelDelta = Math.max(-1, Math.min(1, mwe.deltaY));
    return false;
  }

  update() {
    super.update();
    this.dx = this.x - this.prev.x;
    this.dy = this.y - this.prev.y;
    this.prev.x = this.x;
    this.prev.y = this.y;
    this.wheelDelta = this.lastWheelDelta;
    this.lastWheelDelta = 0;

    if (this.down) {
      this.dragDistance += Math.abs(this.dx) + Math.abs(this.dy);
    }
  }

  isClicked() {
    return this.upCount === 1 && this.dragDistance < MIN_DRAG_DISTANCE && !this.longPress;
  }

  isDragging() {
    return this.down && this.dragDistance > MIN_DRAG_DISTANCE;
  }

  isLongPress() {
    return this.downCount === LONG_PRESS_TICKS && !this.isDragging();
  }
}