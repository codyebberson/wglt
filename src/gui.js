
import {DefaultDialogRenderer} from './gui/defaultdialogrenderer.js';

export class GUI {

  constructor(terminal, renderer) {
    this.terminal = terminal;
    this.renderer = renderer || new DefaultDialogRenderer();
    this.dialogs = [];
  }

  add(dialog) {
    this.dialogs.push(this.renderer.getState(this.terminal, dialog));
  }

  handleInput() {
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

  draw() {
    for (let i = 0; i < this.dialogs.length; i++) {
      this.renderer.draw(this.terminal, this.dialogs[i]);
    }
  }
}
