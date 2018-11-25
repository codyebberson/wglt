import { Dialog } from './gui/dialog';
import { Terminal } from './terminal';
export declare class GUI {
    private readonly terminal;
    dialogs: Dialog[];
    constructor(terminal: Terminal);
    add(dialog: Dialog): void;
    handleInput(): boolean;
    draw(): void;
}
