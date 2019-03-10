import { Message } from '../message';
import { Rect } from '../rect';
import { Talent } from '../talent';
import { XArray } from '../xarray';
import { Dialog } from './dialog';
export declare class TalentsDialog extends Dialog {
    readonly messages: Message[];
    readonly capacity: number;
    readonly talents: XArray<Talent>;
    constructor(rect: Rect, messages: Message[], capacity: number, talents: XArray<Talent>);
    private addItem;
    private removeItem;
    private getNextFreeSlot;
    drawContents(): void;
}
