import { Item } from '../item';
import { Rect } from '../rect';
import { XArray } from '../xarray';
import { Button } from './button';
export declare class ItemButton extends Button {
    readonly containerItems: XArray<Item>;
    readonly stackItems: XArray<Item>;
    constructor(rect: Rect, containerItems: XArray<Item>, initialItem: Item);
    click(): void;
    drawContents(): void;
}
