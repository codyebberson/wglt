import { Key } from '../keys';
import { Rect } from '../rect';
import { ButtonSlot } from './buttonslot';
import { Panel } from './panel';
export declare class ItemContainerButtonSlot extends ButtonSlot {
    constructor(rect: Rect, shortcutKey?: Key);
    onDrop(panel: Panel): boolean;
}
