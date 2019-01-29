import {App} from './app';
import {GUI} from './gui';

export class AppState {
  readonly app: App;
  readonly gui: GUI;

  constructor(app: App) {
    this.app = app;
    this.gui = new GUI(app);
  }

  update() {
    this.gui.handleInput();
    this.gui.draw();
  }
}