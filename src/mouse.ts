
import {DEFAULT_FONT, Font} from './font';
import {Fullscreenable} from './fullscreenable';
import {TerminalOptions} from './terminaloptions';

export class Mouse {
  private readonly el: Element;
  private readonly options: TerminalOptions;
  private readonly font: Font;
  readonly buttons: boolean[];
  private prevX: number;
  private prevY: number;
  x: number;
  y: number;
  dx: number;
  dy: number;

  constructor(el: Element, options: TerminalOptions) {
    this.el = el;
    this.options = options;
    this.font = options.font || DEFAULT_FONT;
    this.prevX = 0;
    this.prevY = 0;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.buttons = [false, false, false];

    el.addEventListener('mousedown', e => this.handleEvent(e as MouseEvent));
    el.addEventListener('mouseup', e => this.handleEvent(e as MouseEvent));
    el.addEventListener('mousemove', e => this.handleEvent(e as MouseEvent));
  }

  private handleEvent(e: MouseEvent) {
    this.x = (e.offsetX / this.font.charWidth) | 0;
    this.y = (e.offsetY / this.font.charHeight) | 0;

    if (e.type === 'mousedown') {
      this.buttons[e.button] = true;
      if (this.options.requestFullscreen) {
        this.requestFullscreen();
      }
    }

    if (e.type === 'mouseup') {
      this.buttons[e.button] = false;
    }
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

  public update() {
    this.dx = this.x - this.prevX;
    this.dy = this.y - this.prevY;
    this.prevX = this.x;
    this.prevY = this.y;
  }
}