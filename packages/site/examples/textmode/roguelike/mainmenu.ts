import { CgaPalette, Console, Panel, Rect, SelectDialog, SelectOption, loadImage2x } from 'wglt';
import { App, AppState } from './app';

let menuBg: Console | null = null;

loadImage2x('../../menu.png', (result) => {
  menuBg = result;
});

export class MainMenu implements AppState {
  constructor(private readonly app: App) {}

  update(): void {
    const term = this.app.term;
    const gui = this.app.gui;

    if ((gui.rootPanel as Panel).children.length === 0) {
      // const options = ['Play a new game', 'Continue last game'];
      const options: SelectOption[] = [{ name: 'Play a new game' }, { name: 'Continue last game' }];
      gui.add(
        new SelectDialog(new Rect(10, 10, 20, 20), 'MAIN MENU', options, (choice) => {
          if (choice.name === 'Play a new game') {
            this.app.newGame();
          } else if (choice.name === 'Continue last game') {
            this.app.continueGame();
          }
          // switch (choice) {
          //   case 0:
          //     this.app.newGame();
          //     break;
          //   case 1:
          //     this.app.continueGame();
          //     break;
          // }
        })
      );
    }

    gui.handleInput(term);

    term.clear();

    if (menuBg) {
      term.drawConsole(0, 0, menuBg, 0, 0, 80, 50);
    }

    term.drawCenteredString(40, 10, 'TOMBS OF THE ANCIENT KINGS', CgaPalette.YELLOW);
    term.drawCenteredString(40, 12, 'By Jotaf', CgaPalette.YELLOW);
    gui.draw(term);
  }
}
