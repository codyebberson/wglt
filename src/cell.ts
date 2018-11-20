
import {BlendMode} from './blendmode';
import {Color, fromRgb} from './color';
import {Colors} from './colors';

function convertCharCode(charCode: number|string): number {
  if ((typeof charCode === 'string') && charCode.length > 0) {
    return charCode.charCodeAt(0);
  } else {
    return charCode as number;
  }
}

export class Cell {
  charCode: number;
  fg: Color;
  bg: Color;
  meta?: object;
  dirty: boolean;

  constructor(charCode?: number|string, fg?: Color, bg?: Color, meta?: object) {
    if (charCode !== undefined) {
      this.charCode = convertCharCode(charCode) as number;
    } else {
      this.charCode = ' '.charCodeAt(0);
    }

    if (fg !== undefined) {
      this.fg = fg;
    } else {
      this.fg = Colors.WHITE;
    }

    if (bg !== undefined) {
      this.bg = bg;
    } else {
      this.bg = Colors.BLACK;
    }

    if (meta !== undefined) {
      this.meta = meta;
    }

    this.dirty = true;
  }

  setCharCode(charCode: number) {
    if (this.charCode !== charCode) {
      this.charCode = charCode;
      this.dirty = true;
    }
  }

  setForeground(fg?: Color) {
    if (fg !== undefined && fg !== null && fg !== this.fg) {
      this.fg = fg;
      this.dirty = true;
    }
  }

  setBackground(bg?: Color) {
    if (bg !== undefined && bg !== null && bg !== this.bg) {
      this.bg = bg;
      this.dirty = true;
    }
  }

  setMeta(meta?: object) {
    if (meta !== undefined) {
      this.meta = meta;
      this.dirty = true;
    }
  }

  setValue(charCode: number | string | Cell, fg?: Color, bg?: Color, meta?: object) {
    if (typeof charCode === 'string') {
      charCode = charCode.charCodeAt(0);
    }
    if (typeof charCode === 'number') {
      this.setCharCode(charCode);
      this.setForeground(fg);
      this.setBackground(bg);
      this.setMeta(meta);
    } else {
      this.drawCell(charCode, BlendMode.None);
    }
    return this.dirty;
  }

  drawCell(otherCell: Cell, blendMode: BlendMode) {
    const alpha = otherCell.bg & 0xFF;

    if (blendMode === BlendMode.None || otherCell.charCode > 0) {
      this.setCharCode(otherCell.charCode);
      this.setForeground(otherCell.fg);
    } else if (alpha > 0 && alpha < 255) {
      this.setForeground(this.blendColors(this.fg, otherCell.bg, blendMode));
    }

    if (blendMode === BlendMode.None || alpha === 255) {
      this.setBackground(otherCell.bg);
    } else if (alpha > 0) {
      this.setBackground(this.blendColors(this.bg, otherCell.bg, blendMode));
    }

    this.setMeta(otherCell.meta);
  }

  private blendColors(c1: Color, c2: Color, blendMode: BlendMode): Color {
    const alpha = c2 & 0xFF;
    const w1 = (255 - alpha) / 255.0;
    const w2 = 1.0 - w1;
    const r1 = (c1 >> 24) & 0xFF;
    const g1 = (c1 >> 16) & 0xFF;
    const b1 = (c1 >> 8) & 0xFF;
    const r2 = (c2 >> 24) & 0xFF;
    const g2 = (c2 >> 16) & 0xFF;
    const b2 = (c2 >> 8) & 0xFF;

    switch (blendMode) {
      case BlendMode.Blend:
        return fromRgb(
            (w1 * r1 + w2 * r2) | 0, (w1 * g1 + w2 * g2) | 0,
            (w1 * b1 + w2 * b2) | 0);

      case BlendMode.Add:
        return fromRgb(
            this.clamp((r1 + w2 * r2) | 0), this.clamp((g1 + w2 * g2) | 0),
            this.clamp((b1 + w2 * b2) | 0));

      default:
        return c2;
    }
  }

  private clamp(x: number): number {
    return Math.min(255, x);
  }
}
