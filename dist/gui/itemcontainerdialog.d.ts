import { ArrayList } from '../arraylist';
import { Item } from '../item';
import { Message } from '../message';
import { Rect } from '../rect';
import { Dialog } from './dialog';
export declare class ItemContainerDialog extends Dialog {
    readonly messages: Message[];
    readonly capacity: number;
    readonly items: ArrayList<Item>;
    constructor(rect: Rect, messages: Message[], capacity: number, items: ArrayList<Item>);
    private addItem;
    private removeItem;
    private getExistingButton;
    private getNextFreeSlot;
    drawContents(): void;
}
