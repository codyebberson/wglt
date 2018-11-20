import { Dialog } from './dialog';
import { Terminal } from './terminal';
export declare class MessageDialog extends Dialog {
    readonly message: string;
    constructor(terminal: Terminal, title: string, message: string);
    drawContents(): void;
    handleInput(): boolean;
}
