import { BaseApp } from '../core/baseapp';
import { Color } from '../core/color';
import { Font } from '../core/font';
import { Vec2 } from '../core/vec2';

export class Message {
  readonly text: string;
  readonly color: Color;

  constructor(text: string, color: Color) {
    this.text = text;
    this.color = color;
  }

  draw(app: BaseApp, pos: Vec2): void {
    app.drawString(this.text, pos.x, pos.y, this.color, pos);
  }

  getWidth(font: Font): number {
    return font.getStringWidth(this.text);
  }
}
