import { Item } from '../item';
import { Rect } from '../rect';
import { Talent } from '../talent';
import { XArray } from '../xarray';
import { Panel } from './panel';
export declare class ShortcutButtonBar extends Panel {
    constructor(rect: Rect, count: number);
    addTalent(talent: Talent, rightToLeft?: boolean): void;
    containsTalent(talent: Talent): boolean;
    addItem(items: XArray<Item>, item: Item, rightToLeft?: boolean): void;
    containsItem(item: Item): boolean;
    drawContents(): void;
    private getFreeSlot;
}
