import { Colors } from '../../src/colors';
import { Console } from '../../src/console';
import { SelectDialog } from '../../src/gui/selectdialog';
import { loadImage2x } from '../../src/image';
import { App, AppState } from './app';

let menuBg: Console | null = null;

loadImage2x('menu.png', (result) => { menuBg = result });

export class MainMenu implements AppState {
  private readonly app: App;

  constructor(app: App) {
    this.app = app;
  }

  update(): void {
    const term = this.app.term;
    const gui = this.app.gui;

    if (gui.dialogs.length === 0) {
      const options = ['Play a new game', 'Continue last game'];
      gui.add(new SelectDialog('MAIN MENU', options, (choice) => {
        if (choice === 0) {
          this.app.newGame();
        } else if (choice === 1) {
          this.app.continueGame();
        }
        switch (choice) {
          case 0:
            this.app.newGame();
            break;
          case 1:
            this.app.continueGame();
            break;
        }
      }));
    }

    gui.handleInput();

    term.clear();

    if (menuBg) {
      term.drawConsole(0, 0, menuBg, 0, 0, 80, 50);
    }

    term.drawCenteredString(40, 10, 'TOMBS OF THE ANCIENT KINGS', Colors.YELLOW);
    term.drawCenteredString(40, 12, 'By Jotaf', Colors.YELLOW);
    gui.draw();
  }
}

// function mainMenu() {
//   if (gui.dialogs.length === 0) {
//     const options = ['Play a new game', 'Continue last game'];
//     gui.add(new SelectDialog('MAIN MENU', options, (choice) => {
//       if (choice === 0) {
//         //newGame();
//         game = new Game(term, gui);
//         appState = 'game';
//       } else if (choice === 1) {
//         // loadGame();
//       }
//     }));
//   }

//   gui.handleInput();

//   term.clear();

//   if (menuBg) {
//     term.drawConsole(0, 0, menuBg, 0, 0, 80, 50);
//   }

//   term.drawCenteredString(40, 10, 'TOMBS OF THE ANCIENT KINGS', Colors.YELLOW);
//   term.drawCenteredString(40, 12, 'By Jotaf', Colors.YELLOW);
//   gui.draw();
// }

// const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, SCREEN_WIDTH, SCREEN_HEIGHT, { frameDelay: 5 });
// const gui = new GUI(term);
// // let rng = null;
// // let player = null;
// // let stairs = null;
// // let entities = null;
// // let messages = null;
// // let dungeonLevel = 0;
// // let map = null;
// // let fovRecompute = true;
// // let inventory = null;
// // let targetFunction = undefined as undefined | ((x: number, y: number) => void);
// // const targetCursor = { x: 0, y: 0 };
// let game: Game | null = null;
// let appState = 'menu';
// let menuBg: Console | null = null;

// loadImage2x('menu.png', (result) => { menuBg = result });

// term.update = function () {
//     switch (appState) {
//         case 'menu':
//             mainMenu();
//             break;

//         case 'game':
//             //playGame();
//             game?.playGame();
//             break;
//     }
// };
