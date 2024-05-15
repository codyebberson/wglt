import { InputSet } from './input';
import { Rect } from './rect';
import { Vec2 } from './vec2';

const MIN_DRAG_DISTANCE = 4;

export class Mouse {
  readonly buttons = new InputSet<number>();
  readonly prev: Vec2;
  readonly start: Vec2;
  x: number;
  y: number;
  dx: number;
  dy: number;
  dragDistance: number;
  wheelDeltaX: number;
  wheelDeltaY: number;
  lastWheelDeltaX: number;
  lastWheelDeltaY: number;

  constructor(
    readonly el: HTMLCanvasElement,
    readonly width: number,
    readonly height: number
  ) {
    this.prev = new Vec2(0, 0);
    this.start = new Vec2(0, 0);
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.dragDistance = 0;
    this.wheelDeltaX = 0;
    this.wheelDeltaY = 0;
    this.lastWheelDeltaX = 0;
    this.lastWheelDeltaY = 0;

    el.addEventListener('mousedown', (e) => this.handleEvent(e));
    el.addEventListener('mouseup', (e) => this.handleEvent(e));
    el.addEventListener('mousemove', (e) => this.handleEvent(e));
    el.addEventListener('contextmenu', (e) => this.handleEvent(e));
    el.addEventListener('touchstart', (e) => this.handleTouchEvent(e));
    el.addEventListener('touchend', (e) => this.handleTouchEvent(e));
    el.addEventListener('touchcancel', (e) => this.handleTouchEvent(e));
    el.addEventListener('touchmove', (e) => this.handleTouchEvent(e));
    el.addEventListener('wheel', (e) => this.handleWheelEvent(e));
  }

  private handleTouchEvent(e: TouchEvent): void {
    e.stopPropagation();
    e.preventDefault();

    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.updatePosition(touch.clientX, touch.clientY);
      this.buttons.get(0).setDown(true);
    } else {
      this.buttons.get(0).setDown(false);
    }
  }

  private handleEvent(e: MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();

    this.updatePosition(e.clientX, e.clientY);

    if (e.type === 'mousedown') {
      this.dragDistance = 0;
      this.prev.x = this.start.x = this.x;
      this.prev.y = this.start.y = this.y;
      this.buttons.get(e.button).setDown(true);
      this.el.focus();
    }

    if (e.type === 'mouseup') {
      this.buttons.get(e.button).setDown(false);
    }
  }

  private updatePosition(clientX: number, clientY: number): void {
    let rect: Rect | DOMRect = this.el.getBoundingClientRect();

    // If the client rect is not the same aspect ratio as canvas,
    // then we are fullscreen.
    // Need to update client rect accordingly.

    const terminalAspectRatio = this.width / this.height;
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

    this.x = ((this.width * (clientX - rect.left)) / rect.width) | 0;
    this.y = ((this.height * (clientY - rect.top)) / rect.height) | 0;
  }

  private handleWheelEvent(e: WheelEvent): void {
    e.stopPropagation();
    e.preventDefault();
    this.lastWheelDeltaX = e.deltaX;
    this.lastWheelDeltaY = e.deltaY;
  }

  update(time: number): void {
    this.dx = this.x - this.prev.x;
    this.dy = this.y - this.prev.y;
    this.prev.x = this.x;
    this.prev.y = this.y;

    this.wheelDeltaX = this.lastWheelDeltaX;
    this.wheelDeltaY = this.lastWheelDeltaY;
    this.lastWheelDeltaX = 0;
    this.lastWheelDeltaY = 0;

    this.buttons.updateAll(time);
    if (this.buttons.get(0).down) {
      this.dragDistance += Math.abs(this.dx) + Math.abs(this.dy);
    }
  }

  isClicked(): boolean {
    return this.buttons.get(0).upCount === 1 && this.dragDistance < MIN_DRAG_DISTANCE;
  }

  isDragging(): boolean {
    return this.buttons.get(0).down && this.dragDistance > MIN_DRAG_DISTANCE;
  }
}
