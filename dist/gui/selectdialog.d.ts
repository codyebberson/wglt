import { GUI } from '../gui';
import { Rect } from '../rect';
import { Dialog } from './dialog';
import { SelectOption } from './selectoption';
export declare class SelectDialog extends Dialog {
    options: SelectOption[];
    callback: Function;
    constructor(gui: GUI, rect: Rect, title: string, options: SelectOption[], callback: Function);
    drawContents(): void;
    handleInput(): boolean;
}
