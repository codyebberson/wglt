import { Item } from '../item';
import { Rect } from '../rect';
import { XArray } from '../xarray';
import { Button } from './button';
export declare class ItemShortcutButton extends Button {
    readonly containerItems: XArray<Item>;
    readonly shortcutItem: Item;
    constructor(rect: Rect, containerItems: XArray<Item>, shortcutItem: Item);
    click(): void;
    drawContents(): void;
    private getItem;
    private countItems;
}
