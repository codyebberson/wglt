import { Item } from '../item';
import { Message } from '../message';
import { Rect } from '../rect';
import { XArray } from '../xarray';
import { Dialog } from './dialog';
export declare class ItemContainerDialog extends Dialog {
    readonly messages: Message[];
    readonly capacity: number;
    readonly items: XArray<Item>;
    constructor(rect: Rect, messages: Message[], capacity: number, items: XArray<Item>);
    private addItem;
    private removeItem;
    private getExistingButton;
    private getNextFreeSlot;
    drawContents(): void;
}
