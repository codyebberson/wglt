
import {Rect} from './rect.js';

export class Mouse {

  constructor(terminal, options) {
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

  handleTouchEvent(e) {
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

  handleEvent(e) {
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

  updatePosition(clientX, clientY) {
    let rect = this.el.getBoundingClientRect();

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

  requestFullscreen() {
    const canvas = this.el;
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