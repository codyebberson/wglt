import { ArrayList } from '../arraylist';
import { Item } from '../item';
import { Rect } from '../rect';
import { Talent } from '../talent';
import { Panel } from './panel';
export declare class ShortcutBar extends Panel {
    spacing: number;
    constructor(rect: Rect, count: number, spacing?: number);
    addTalent(talent: Talent, rightToLeft?: boolean): void;
    containsTalent(talent: Talent): boolean;
    addItem(items: ArrayList<Item>, item: Item, rightToLeft?: boolean): void;
    containsItem(item: Item): boolean;
    drawContents(): void;
    private getFreeSlot;
}
