import { Terminal } from '../terminal';
import { Dialog } from './dialog';
import { DialogRenderer } from './dialogrenderer';
import { DialogState } from './dialogstate';
export declare class DefaultDialogRenderer implements DialogRenderer {
    getState(terminal: Terminal, dialog: Dialog): DialogState;
    draw(term: Terminal, dialogState: DialogState): void;
}
