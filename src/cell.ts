import type { BlendMode } from './blendmode';
import { type Color, fromRgb } from './color';
import { Colors } from './palettes/colors';
import { serializable } from './serialize';

function convertCharCode(charCode: string | number): number {
  if (typeof charCode === 'string' && charCode.length > 0) {
    return charCode.charCodeAt(0);
  }
  return charCode as number;
}

@serializable
export class Cell {
  charCode: number;
  fg: Color;
  bg: Color;
  dirty: boolean;
  blocked: boolean;
  blockedSight: boolean;
  explored: boolean;
  visible: boolean;
  pathId: number;
  g: number;
  h: number;
  prev: Cell | null;

  constructor(
    readonly x: number,
    readonly y: number,
    charCode?: string | number,
    fg: Color = Colors.WHITE,
    bg: Color = Colors.BLACK
  ) {
    if (charCode !== undefined) {
      this.charCode = convertCharCode(charCode);
    } else {
      this.charCode = ' '.charCodeAt(0);
    }

    this.fg = fg;
    this.bg = bg;
    this.dirty = true;
    this.blocked = false;
    this.blockedSight = false;
    this.explored = false;
    this.visible = false;
    this.pathId = -1;
    this.g = 0;
    this.h = 0;
    this.prev = null;
  }

  setCharCode(charCode: number): void {
    if (this.charCode !== charCode) {
      this.charCode = charCode;
      this.dirty = true;
    }
  }

  setForeground(fg: Color): void {
    if (fg !== undefined && fg !== null && fg !== this.fg) {
      this.fg = fg;
      this.dirty = true;
    }
  }

  setBackground(bg: Color): void {
    if (bg !== undefined && bg !== null && bg !== this.bg) {
      this.bg = bg;
      this.dirty = true;
    }
  }

  setValue(value: string | number, fg?: Color, bg?: Color): boolean {
    const charCode = convertCharCode(value);
    if (typeof charCode === 'number') {
      this.setCharCode(charCode);

      if (fg !== undefined) {
        this.setForeground(fg);
      }
      if (bg !== undefined) {
        this.setBackground(bg);
      }
    } else {
      this.drawCell(charCode);
    }
    return this.dirty;
  }

  drawCell(otherCell: Cell, blendMode?: BlendMode): void {
    const alpha = otherCell.bg & 0xff;

    if (!blendMode || otherCell.charCode > 0) {
      this.setCharCode(otherCell.charCode);
      this.setForeground(otherCell.fg);
    } else if (alpha > 0 && alpha < 255) {
      this.setForeground(this.blendColors(this.fg, otherCell.bg, blendMode));
    }

    if (!blendMode || alpha === 255) {
      this.setBackground(otherCell.bg);
    } else if (alpha > 0) {
      this.setBackground(this.blendColors(this.bg, otherCell.bg, blendMode));
    }
  }

  private blendColors(c1: Color, c2: Color, blendMode?: BlendMode): Color {
    const alpha = c2 & 0xff;
    const w1 = (255 - alpha) / 255.0;
    const w2 = 1.0 - w1;
    const r1 = (c1 >> 24) & 0xff;
    const g1 = (c1 >> 16) & 0xff;
    const b1 = (c1 >> 8) & 0xff;
    const r2 = (c2 >> 24) & 0xff;
    const g2 = (c2 >> 16) & 0xff;
    const b2 = (c2 >> 8) & 0xff;

    switch (blendMode) {
      case 'blend':
        return fromRgb((w1 * r1 + w2 * r2) | 0, (w1 * g1 + w2 * g2) | 0, (w1 * b1 + w2 * b2) | 0);

      case 'add':
        return fromRgb(
          this.clamp((r1 + w2 * r2) | 0),
          this.clamp((g1 + w2 * g2) | 0),
          this.clamp((b1 + w2 * b2) | 0)
        );

      default:
        return c2;
    }
  }

  private clamp(x: number): number {
    return Math.min(255, x);
  }
}
