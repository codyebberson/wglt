import {
  Dialog,
  GUI,
  Label,
  MessageDialog,
  SelectInput,
  Terminal,
  TerminalDialogRenderer,
  TerminalLabelRenderer,
  TerminalSelectInputRenderer,
} from 'wglt';
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
    this.term = new Terminal('canvas', SCREEN_WIDTH, SCREEN_HEIGHT);
    this.gui = new GUI(this.term);

    this.gui.renderers.set(Dialog, new TerminalDialogRenderer());
    this.gui.renderers.set(MessageDialog, new TerminalDialogRenderer());
    this.gui.renderers.set(Label, new TerminalLabelRenderer());
    this.gui.renderers.set(SelectInput, new TerminalSelectInputRenderer());

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
