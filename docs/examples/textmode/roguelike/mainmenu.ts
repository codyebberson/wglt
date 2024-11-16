import { CgaPalette, Console, Rect, SelectDialog, SelectOption, loadImage2x } from 'wglt';
import { App, AppState } from './app';

let menuBg: Console | null = null;

loadImage2x('/menu.png', (result) => {
  menuBg = result;
});

export class MainMenu implements AppState {
  constructor(private readonly app: App) {}

  update(): void {
    const term = this.app.term;
    const gui = this.app.gui;

    if (gui.children.length === 0) {
      // Create the main menu if it doesn't exist
      const options: SelectOption[] = [{ name: 'Play a new game' }, { name: 'Continue last game' }];
      gui.addChild(
        new SelectDialog(new Rect(10, 15, 40, 20), 'MAIN MENU', options, (choice) => {
          if (choice.name === 'Play a new game') {
            this.app.newGame();
          } else if (choice.name === 'Continue last game') {
            this.app.continueGame();
          }
        })
      );
    }

    gui.handleInput();

    term.clear();

    if (menuBg) {
      term.drawConsole(0, 0, menuBg, 0, 0, 80, 50);
    }

    term.drawCenteredString(40, 10, 'TOMBS OF THE ANCIENT KINGS', CgaPalette.YELLOW);
    term.drawCenteredString(40, 12, 'By Jotaf', CgaPalette.YELLOW);
    // term.console.fillRect(10, 15, 20, 20, 0, CgaPalette.LIGHT_GRAY, CgaPalette.DARK_GRAY);
    gui.draw();
  }
}
