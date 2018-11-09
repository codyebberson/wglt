
import {Color} from './color';
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

  setValue(charCode: number, fg?: Color, bg?: Color, meta?: object) {
    this.setCharCode(charCode);
    this.setForeground(fg);
    this.setBackground(bg);
    this.setMeta(meta);
    return this.dirty;
  }

  copy(otherCell: Cell) {
    return this.setValue(
        otherCell.charCode, otherCell.fg, otherCell.bg, otherCell.meta);
  }
}
