import { InputSet } from './input';
import { Rect } from './rect';
import type { Terminal } from './terminal';

export class Mouse {
  readonly el: HTMLCanvasElement;
  readonly width: number;
  readonly height: number;
  readonly buttons = new InputSet<number>();
  private prevX: number;
  private prevY: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  wheelDeltaX: number;
  wheelDeltaY: number;

  constructor(terminal: Terminal) {
    this.el = terminal.canvas;
    this.width = terminal.width;
    this.height = terminal.height;
    this.prevX = 0;
    this.prevY = 0;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.wheelDeltaX = 0;
    this.wheelDeltaY = 0;

    const el = this.el;
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
      this.buttons.get(e.button).setDown(true);
      this.el.focus();
    }

    if (e.type === 'mouseup') {
      this.buttons.get(e.button).setDown(false);
    }
  }

  private handleWheelEvent(e: WheelEvent): void {
    e.stopPropagation();
    e.preventDefault();
    this.wheelDeltaX = e.deltaX;
    this.wheelDeltaY = e.deltaY;
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

  update(time: number): void {
    this.dx = this.x - this.prevX;
    this.dy = this.y - this.prevY;
    this.prevX = this.x;
    this.prevY = this.y;
    this.buttons.updateAll(time);
  }
}
