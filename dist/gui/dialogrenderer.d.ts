import { Terminal } from '../terminal';
import { Dialog } from './dialog';
import { DialogState } from './dialogstate';
export interface DialogRenderer {
    getState(terminal: Terminal, dialog: Dialog): DialogState;
    draw(terminal: Terminal, dialogState: DialogState): void;
}
