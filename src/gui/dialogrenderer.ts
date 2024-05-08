import type { Terminal } from '../terminal';
import type { Dialog } from './dialog';
import type { DialogState } from './dialogstate';

export interface DialogRenderer {
  getState(terminal: Terminal, dialog: Dialog): DialogState;

  draw(term: Terminal, dialogState: DialogState): void;
}
