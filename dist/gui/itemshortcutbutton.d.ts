import { ArrayList } from '../arraylist';
import { Item } from '../item';
import { Rect } from '../rect';
import { Button } from './button';
export declare class ItemShortcutButton extends Button {
    readonly containerItems: ArrayList<Item>;
    readonly shortcutItem: Item;
    constructor(rect: Rect, containerItems: ArrayList<Item>, shortcutItem: Item);
    click(): void;
    drawContents(): void;
    private getItem;
    private countItems;
}
