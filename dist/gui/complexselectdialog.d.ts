import { Rect } from '../rect';
import { Dialog } from './dialog';
import { SelectOption } from './selectoption';
import { SelectOptionRenderer } from './selectoptionrenderer';
export declare class ComplexSelectDialog extends Dialog {
    options: SelectOption[];
    selectedIndex: number;
    renderer: SelectOptionRenderer;
    onSelect?: Function;
    onCancel?: Function;
    constructor(rect: Rect, title: string, options: SelectOption[]);
    drawContents(): void;
    handleInput(): boolean;
}
