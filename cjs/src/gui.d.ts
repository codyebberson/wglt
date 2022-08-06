import { Dialog } from './gui/dialog';
import { DialogRenderer } from './gui/dialogrenderer';
import { DialogState } from './gui/dialogstate';
import { Terminal } from './terminal';
export declare class GUI {
    readonly terminal: Terminal;
    readonly renderer: DialogRenderer;
    readonly dialogs: DialogState[];
    constructor(terminal: Terminal, renderer?: DialogRenderer);
    add(dialog: Dialog): void;
    /**
     * Handles input for currently active dialog.
     * Returns true if the input was handled.
     * Returns false otherwise.
     */
    handleInput(): boolean;
    draw(): void;
}
