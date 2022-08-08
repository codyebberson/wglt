import { GUI } from '../../src/gui';
import { Terminal } from '../../src/terminal';
import { Game } from './game';
import { MainMenu } from './mainmenu';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

export interface AppState {
  update(): void;
}

export class App {
  readonly term: Terminal;
  readonly gui: GUI;
  state: AppState;
  mainMenu: MainMenu;
  game?: Game;

  constructor() {
    this.term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, SCREEN_WIDTH, SCREEN_HEIGHT, {
      maxFps: 15,
      crt: {
        scale: 6,
        blur: 0.5,
        curvature: 0.1,
        chroma: 0.5,
        vignette: 0.15,
        scanlineWidth: 0.75,
        scanlineIntensity: 0.25,
      },
    });
    this.gui = new GUI(this.term);
    this.mainMenu = new MainMenu(this);
    this.state = this.mainMenu;

    this.term.update = () => this.state.update();
  }

  newGame(): void {
    this.game = new Game(this);
    this.state = this.game;
  }

  continueGame(): void {
    if (this.game) {
      this.state = this.game;
    }
  }
}
