import {Color} from './color';
import { App } from './app';
import { Vec2 } from './vec2';
import { Font } from './font';

export class Message {
  readonly text: string;
  readonly color: Color;

  constructor(text: string, color: Color) {
    this.text = text;
    this.color = color;
  }

  draw(app: App, pos: Vec2) {
    app.drawString(this.text, pos.x, pos.y, this.color, pos);
  }

  getWidth(font: Font) {
    return font.getStringWidth(this.text);
  }
}
