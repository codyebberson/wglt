import {
  AppState,
  CgaPalette,
  Console,
  Dialog,
  loadImage2x,
  Rect,
  SelectInput,
  type SelectOption,
} from 'wglt';
import type { App } from './app';

let menuBg: Console | null = null;

loadImage2x('/menu.png', (result) => {
  menuBg = result;
});

export class MainMenu extends AppState<App> {
  update(): void {
    const term = this.app;
    const gui = this.app.gui;

    if (gui.children.length === 0) {
      // Create the main menu if it doesn't exist
      const dialog = new Dialog(new Rect(25, 20, 30, 10));
      const options: SelectOption[] = [{ name: 'Play a new game' }, { name: 'Continue last game' }];
      dialog.addChild(
        new SelectInput(new Rect(2, 2, 40, 20), options, (choice) => {
          dialog.close();
          if (choice.name === 'Play a new game') {
            this.app.newGame();
          } else if (choice.name === 'Continue last game') {
            this.app.continueGame();
          }
        })
      );
      gui.addChild(dialog);
    }

    gui.handleInput();

    term.clear();

    if (menuBg) {
      term.drawConsole(0, 0, menuBg, 0, 0, 80, 50);
    }

    term.drawCenteredString(40, 10, 'TOMBS OF THE ANCIENT KINGS', CgaPalette.YELLOW);
    term.drawCenteredString(40, 12, 'By Jotaf', CgaPalette.YELLOW);
    gui.draw();
  }
}
