import { Dialog } from './dialog';
import { Terminal } from './terminal';
export declare class SelectDialog extends Dialog {
    options: string[];
    callback: Function;
    constructor(terminal: Terminal, title: string, options: string[], callback: Function);
    drawContents(): void;
    handleInput(): boolean;
}
