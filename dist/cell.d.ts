import { Color } from './color';
export declare class Cell {
    charCode: number;
    fg: Color;
    bg: Color;
    meta?: object;
    dirty: boolean;
    constructor(charCode?: number | string, fg?: Color, bg?: Color, meta?: object);
    setCharCode(charCode: number): void;
    setForeground(fg?: Color): void;
    setBackground(bg?: Color): void;
    setMeta(meta?: object): void;
    setValue(charCode: number, fg?: Color, bg?: Color, meta?: object): boolean;
    copy(otherCell: Cell): boolean;
}
