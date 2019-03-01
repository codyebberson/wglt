import { Rect } from '../rect';
import { XArray } from '../xarray';
import { Dialog } from './dialog';
import { Talent } from '../talent';
export declare class ItemContainerDialog extends Dialog {
    readonly capacity: number;
    readonly talents: XArray<Talent>;
    constructor(rect: Rect, title: string, capacity: number, talents: XArray<Talent>);
    private addItem;
    private removeItem;
    private getNextFreeSlot;
    drawContents(): void;
    handleInput(): boolean;
}
