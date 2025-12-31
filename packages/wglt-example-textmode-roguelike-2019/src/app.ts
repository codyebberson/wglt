import { createCenteredCanvas, DefaultTerminalTheme, GUI, Terminal } from 'wglt';
import { Game } from './game';
import { MainMenu } from './mainmenu';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

export class App extends Terminal {
  readonly gui: GUI;
  mainMenu: MainMenu;
  game?: Game;

  constructor() {
    super(createCenteredCanvas(SCREEN_WIDTH, SCREEN_HEIGHT), SCREEN_WIDTH, SCREEN_HEIGHT);

    this.gui = new GUI(this);
    this.gui.setTheme(new DefaultTerminalTheme());

    this.mainMenu = new MainMenu(this);
    this.state = this.mainMenu;
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
