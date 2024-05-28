import { BaseApp } from '../core/baseapp';
import { Color } from '../core/color';
import { Font } from '../core/font';
import { Point } from '../core/point';

export class Message {
  readonly text: string;
  readonly color: Color;

  constructor(text: string, color: Color) {
    this.text = text;
    this.color = color;
  }

  draw(app: BaseApp, pos: Point): void {
    app.drawString(pos.x, pos.y, this.text, this.color, pos);
  }

  getWidth(font: Font): number {
    return font.getStringWidth(this.text);
  }
}
