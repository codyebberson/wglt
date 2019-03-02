import { Rect } from '../rect';
import { Dialog } from './dialog';
import { SelectOption } from './selectoption';
export declare class SelectDialog extends Dialog {
    options: SelectOption[];
    callback: Function;
    constructor(rect: Rect, options: SelectOption[], callback: Function);
    drawContents(): void;
    handleInput(): boolean;
}
