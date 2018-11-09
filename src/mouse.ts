
// import {FONT_CHAR_HEIGHT, FONT_CHAR_WIDTH} from './font';
import {Font} from './font';

export class Mouse {
  font: Font;
  x: number;
  y: number;
  buttons: boolean[];

  constructor(el: Element, font: Font) {
    this.font = font;
    this.x = 0;
    this.y = 0;
    this.buttons = [false, false, false];

    el.addEventListener('mousedown', e => this.update(e as MouseEvent));
    el.addEventListener('mouseup', e => this.update(e as MouseEvent));
    el.addEventListener('mousemove', e => this.update(e as MouseEvent));
  }

  update(e: MouseEvent) {
    this.x = (e.offsetX / this.font.charWidth) | 0;
    this.y = (e.offsetY / this.font.charHeight) | 0;

    if (e.type === 'mousedown') {
      this.buttons[e.button] = true;
    }

    if (e.type === 'mouseup') {
      this.buttons[e.button] = false;
    }
  }
}