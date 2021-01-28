import { Dialog } from './gui/dialog';
import { DialogState } from './gui/dialogstate';
import { DialogRenderer } from './gui/dialogrenderer';
import { DefaultDialogRenderer } from './gui/defaultdialogrenderer';
import { Terminal } from './terminal';

export class GUI {
  readonly terminal: Terminal;
  readonly renderer: DialogRenderer;
  readonly dialogs: DialogState[];

  constructor(terminal: Terminal, renderer?: DialogRenderer) {
    this.terminal = terminal;
    this.renderer = renderer || new DefaultDialogRenderer();
    this.dialogs = [];
  }

  add(dialog: Dialog): void {
    this.dialogs.push(this.renderer.getState(this.terminal, dialog));
  }

  /**
   * Handles input for currently active dialog.
   * Returns true if the input was handled.
   * Returns false otherwise.
   */
  handleInput(): boolean {
    if (this.dialogs.length === 0) {
      return false;
    }

    const activeIndex = this.dialogs.length - 1;
    const activeState = this.dialogs[this.dialogs.length - 1];
    const activeDialog = activeState.dialog;
    if (activeDialog.handleInput(this.terminal, activeState.contentsOffset)) {
      this.dialogs.splice(activeIndex, 1);
    }

    return true;
  }

  draw(): void {
    for (let i = 0; i < this.dialogs.length; i++) {
      this.renderer.draw(this.terminal, this.dialogs[i]);
    }
  }
}
