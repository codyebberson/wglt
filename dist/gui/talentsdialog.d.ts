import { ArrayList } from '../arraylist';
import { Message } from '../message';
import { Rect } from '../rect';
import { Talent } from '../talent';
import { Dialog } from './dialog';
export declare class TalentsDialog extends Dialog {
    readonly messages: Message[];
    readonly capacity: number;
    readonly talents: ArrayList<Talent>;
    constructor(rect: Rect, messages: Message[], capacity: number, talents: ArrayList<Talent>);
    private addItem;
    private removeItem;
    private getNextFreeSlot;
    drawContents(): void;
}
