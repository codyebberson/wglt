import { Item } from '../item';
import { Rect } from '../rect';
import { XArray } from '../xarray';
import { Dialog } from './dialog';
export declare class ItemContainerDialog extends Dialog {
    readonly capacity: number;
    readonly items: XArray<Item>;
    constructor(rect: Rect, title: string, capacity: number, items: XArray<Item>);
    private addItem;
    private removeItem;
    private getExistingButton;
    private getNextFreeSlot;
    drawContents(): void;
    handleInput(): boolean;
}
