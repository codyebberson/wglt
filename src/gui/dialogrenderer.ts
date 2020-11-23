
import {Terminal} from '../terminal';
import {DialogState} from './dialogstate';
import {Dialog} from './dialog';

export interface DialogRenderer {

    getState(terminal: Terminal, dialog: Dialog): DialogState;

    draw(term: Terminal, dialogState: DialogState): void;
}
