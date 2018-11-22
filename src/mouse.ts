import {Fullscreenable} from './fullscreenable';
import {Rect} from './rect';
import {Terminal} from './terminal';
import {TerminalOptions} from './terminaloptions';

export class Mouse {
  private readonly el: HTMLElement;
  private readonly width: number;
  private readonly height: number;
  private readonly options: TerminalOptions;
  readonly buttons: boolean[];
  private prevX: number;
  private prevY: number;
  x: number;
  y: number;
  dx: number;
  dy: number;

  constructor(terminal: Terminal, options: TerminalOptions) {
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
    this.buttons = [false, false, false];

    const el = this.el;
    el.addEventListener('mousedown', e => this.handleEvent(e as MouseEvent));
    el.addEventListener('mouseup', e => this.handleEvent(e as MouseEvent));
    el.addEventListener('mousemove', e => this.handleEvent(e as MouseEvent));
    el.addEventListener('contextmenu', e => this.handleEvent(e as MouseEvent));

    const touchEventHandler = this.handleTouchEvent.bind(this);
    el.addEventListener('touchstart', touchEventHandler);
    el.addEventListener('touchend', touchEventHandler);
    el.addEventListener('touchcancel', touchEventHandler);
    el.addEventListener('touchmove', touchEventHandler);
  }

  private handleTouchEvent(e: TouchEvent) {
    e.stopPropagation();
    e.preventDefault();

    if (e.type === 'touchend' && this.options.requestFullscreen) {
      this.requestFullscreen();
    }

    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.updatePosition(touch.clientX, touch.clientY);
      this.buttons[0] = true;
    } else {
      this.buttons[0] = false;
    }
  }

  private handleEvent(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    this.updatePosition(e.clientX, e.clientY);

    if (e.type === 'mousedown') {
      this.buttons[e.button] = true;

      this.el.focus();

      if (this.options.requestFullscreen) {
        this.requestFullscreen();
      }
    }

    if (e.type === 'mouseup') {
      this.buttons[e.button] = false;
    }
  }

  private updatePosition(clientX: number, clientY: number) {
    let rect: ClientRect|DOMRect|Rect = this.el.getBoundingClientRect();

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

  private requestFullscreen() {
    const canvas = this.el as Fullscreenable;
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    } else if (canvas.mozRequestFullScreen) {
      canvas.mozRequestFullScreen();
    }
  }

  update() {
    this.dx = this.x - this.prevX;
    this.dy = this.y - this.prevY;
    this.prevX = this.x;
    this.prevY = this.y;
  }
}