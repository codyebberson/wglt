
import {Dialog} from './gui/dialog';
import {Terminal} from './terminal';

export class GUI {
  private readonly terminal: Terminal;
  dialogs: Dialog[];

  constructor(terminal: Terminal) {
    this.terminal = terminal;
    this.dialogs = [];
  }

  add(dialog: Dialog) {
    this.dialogs.push(dialog);
  }

  handleInput(): boolean {
    if (this.dialogs.length === 0) {
      return false;
    }

    const active = this.dialogs[this.dialogs.length - 1];
    if (active.handleInput()) {
      this.dialogs.splice(this.dialogs.indexOf(active), 1);
    }

    return true;
  }

  draw() {
    for (let i = 0; i < this.dialogs.length; i++) {
      this.dialogs[i].draw(this.terminal);
    }
  }
}
