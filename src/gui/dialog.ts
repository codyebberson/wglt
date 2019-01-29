import {GUI} from '../gui';
import {Rect} from '../rect';

import {Panel} from './panel';

export class Dialog extends Panel {
  readonly title: string;

  constructor(gui: GUI, rect: Rect, title: string) {
    super(gui, rect, true);
    this.title = title;
  }

  drawContents() {
    this.gui.renderer.draw(this.gui.app, this);
  }

  handleInput() {
    return false;
  }

  close() {
    const panels = this.gui.panels;
    const index = panels.indexOf(this);
    if (index >= 0) {
      panels.splice(index, 1);
    }
  }
}
