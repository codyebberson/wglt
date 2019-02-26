import { Entity } from '../entity';
import { Rect } from '../rect';
import { XArray } from '../xarray';
import { Dialog } from './dialog';
export declare class EntityContainerDialog extends Dialog {
    readonly capacity: number;
    readonly entities: XArray<Entity>;
    constructor(rect: Rect, title: string, capacity: number, entities: XArray<Entity>);
    private addItem;
    private removeItem;
    private getExistingButton;
    private getNextFreeSlot;
    drawContents(): void;
    handleInput(): boolean;
}
