import { GUI, Terminal } from 'wglt';
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
    this.term = new Terminal(
      document.querySelector('canvas') as HTMLCanvasElement,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );
    this.gui = new GUI(this.term.size);
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
