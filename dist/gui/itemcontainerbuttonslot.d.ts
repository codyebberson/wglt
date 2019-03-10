import { ArrayList } from '../arraylist';
import { Item } from '../item';
import { Key } from '../keys';
import { Rect } from '../rect';
import { ButtonSlot } from './buttonslot';
import { Panel } from './panel';
export declare class ItemContainerButtonSlot extends ButtonSlot {
    readonly items: ArrayList<Item>;
    constructor(rect: Rect, items: ArrayList<Item>, shortcutKey?: Key);
    onDrop(panel: Panel): boolean;
}
