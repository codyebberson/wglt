
import { Rect } from './rect';
import { Input } from './input';
import { Terminal } from './terminal';

export class Mouse {
  readonly el: HTMLCanvasElement;
  readonly width: number;
  readonly height: number;
  readonly options: any;
  private prevX: number;
  private prevY: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  readonly buttons: Input[];

  constructor(terminal: Terminal, options: any) {
    this.el = terminal.canvas;
    this.width = terminal.width;
    this.height = terminal.height;
    this.options = options;
    this.prevX = 0;
    this.prevY = 0;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.buttons = [new Input(), new Input(), new Input()];

    const el = this.el;
    el.addEventListener('mousedown', e => this.handleEvent(e));
    el.addEventListener('mouseup', e => this.handleEvent(e));
    el.addEventListener('mousemove', e => this.handleEvent(e));
    el.addEventListener('contextmenu', e => this.handleEvent(e));

    const touchEventHandler = this.handleTouchEvent.bind(this);
    el.addEventListener('touchstart', touchEventHandler);
    el.addEventListener('touchend', touchEventHandler);
    el.addEventListener('touchcancel', touchEventHandler);
    el.addEventListener('touchmove', touchEventHandler);
  }

  private handleTouchEvent(e: TouchEvent): void {
    e.stopPropagation();
    e.preventDefault();

    if (e.type === 'touchend' && this.options.requestFullscreen) {
      this.requestFullscreen();
    }

    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.updatePosition(touch.clientX, touch.clientY);
      this.buttons[0].down = true;
    } else {
      this.buttons[0].down = false;
    }
  }

  private handleEvent(e: MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();

    this.updatePosition(e.clientX, e.clientY);

    if (e.type === 'mousedown') {
      this.buttons[e.button].down = true;

      this.el.focus();

      if (this.options.requestFullscreen) {
        this.requestFullscreen();
      }
    }

    if (e.type === 'mouseup') {
      this.buttons[e.button].down = false;
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

    this.x = (this.width * (clientX - rect.left) / rect.width) | 0;
    this.y = (this.height * (clientY - rect.top) / rect.height) | 0;
  }

  private requestFullscreen(): void {
    const canvas = this.el;
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    }
  }

  update() {
    this.dx = this.x - this.prevX;
    this.dy = this.y - this.prevY;
    this.prevX = this.x;
    this.prevY = this.y;

    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].update();
    }
  }
}