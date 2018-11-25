import { Dialog } from './gui/dialog';
import { DialogRenderer } from './gui/dialogrenderer';
import { DialogState } from './gui/dialogstate';
import { Terminal } from './terminal';
export declare class GUI {
    private readonly terminal;
    private readonly renderer;
    dialogs: DialogState[];
    constructor(terminal: Terminal, renderer?: DialogRenderer);
    add(dialog: Dialog): void;
    handleInput(): boolean;
    draw(): void;
}
