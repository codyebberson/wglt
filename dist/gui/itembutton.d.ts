import { ArrayList } from '../arraylist';
import { Item } from '../item';
import { Rect } from '../rect';
import { Button } from './button';
import { TooltipDialog } from './tooltipdialog';
export declare class ItemButton extends Button {
    readonly containerItems: ArrayList<Item>;
    readonly stackItems: ArrayList<Item>;
    constructor(rect: Rect, containerItems: ArrayList<Item>, initialItem: Item);
    click(): void;
    removeAll(): void;
    drawContents(): void;
    updateTooltip(tooltip: TooltipDialog): void;
}
