import { App } from './app';
import { Color } from './color';
import { Font } from './font';
import { Vec2 } from './vec2';

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
