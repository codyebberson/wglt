import { Color, Vec2 } from '@wglt/core';
import { BaseApp } from './baseapp';
import { Font } from './font';

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
