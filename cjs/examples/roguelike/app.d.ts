import { GUI } from '../../src/gui';
import { Terminal } from '../../src/terminal';
import { Game } from './game';
import { MainMenu } from './mainmenu';
export interface AppState {
    update(): void;
}
export declare class App {
    readonly term: Terminal;
    readonly gui: GUI;
    state: AppState;
    mainMenu: MainMenu;
    game?: Game;
    constructor();
    newGame(): void;
    continueGame(): void;
}
