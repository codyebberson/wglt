import { Rect } from '../rect';
import { Talent } from '../talent';
import { XArray } from '../xarray';
import { Dialog } from './dialog';
export declare class TalentsDialog extends Dialog {
    readonly capacity: number;
    readonly talents: XArray<Talent>;
    constructor(rect: Rect, title: string, capacity: number, talents: XArray<Talent>);
    private addItem;
    private removeItem;
    private getNextFreeSlot;
    drawContents(): void;
    handleInput(): boolean;
}
