import { Item } from '../item';
import { Rect } from '../rect';
import { XArray } from '../xarray';
import { ButtonSlot } from './buttonslot';
import { Panel } from './panel';
export declare class ItemContainerButtonSlot extends ButtonSlot {
    readonly items: XArray<Item>;
    constructor(rect: Rect, items: XArray<Item>);
    onDrop(panel: Panel): boolean;
}
