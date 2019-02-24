
import {App} from './app';
import {DialogRenderer} from './gui/dialogrenderer';
import {Panel} from './gui/panel';
import {Rect} from './rect';
import {XArray} from './xarray';

export class GUI {
  readonly app: App;
  readonly panels: XArray<Panel>;
  readonly renderer: DialogRenderer;

  constructor(app: App) {
    this.app = app;
    this.panels = new XArray();
    this.renderer = new DialogRenderer(new Rect(0, 0, 1, 1));
  }

  add(panel: Panel) {
    panel.gui = this;
    this.panels.push(panel);
  }

  remove(panel: Panel) {
    this.panels.remove(panel);
    panel.gui = null;
  }

  handleInput(): boolean {
    for (let i = this.panels.length - 1; i >= 0; i--) {
      const panel = this.panels[i];
      if (panel.handleInput && panel.handleInput()) {
        return true;
      }
      if (panel.modal) {
        return true;
      }
    }

    return false;
  }

  draw() {
    for (let i = 0; i < this.panels.length; i++) {
      this.panels[i].drawContents();
    }
  }
}
