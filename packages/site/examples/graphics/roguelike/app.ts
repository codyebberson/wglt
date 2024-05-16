import { FadeInAnimation, GraphicsApp } from 'wglt';
import { Credits } from './credits';
import { Player } from './entities/player';
import { Game } from './game';
import { HighScores } from './highscores';
import { Gold } from './items/gold';
import { Hearthstone } from './items/hearthstone';
import { MainMenu } from './mainmenu';

export class App extends GraphicsApp {
  readonly mainMenu: MainMenu;
  readonly highScores: HighScores;
  readonly credits: Credits;
  seed: number;
  game?: Game;

  constructor() {
    super();
    this.mainMenu = new MainMenu(this);
    this.highScores = new HighScores(this);
    this.credits = new Credits(this);
    this.seed = 0;
    this.showMainMenu();
    this.renderLoop();
  }

  showMainMenu(): void {
    this.state = this.mainMenu;
  }

  startGame(): void {
    const game = new Game(this, this.seed);
    this.game = game;

    // TODO: Where to put this logic?  Game constructor?
    const player = game.player as Player;
    player.inventory.add(new Hearthstone(game));
    for (let i = 0; i < 20; i++) {
      player.inventory.add(new Gold(game));
    }

    window.location.hash = 'game';

    // playMusic(0).catch(console.log);
  }

  playGame(): void {
    const game = this.game as Game;
    this.state = game;
    game.addAnimation(new FadeInAnimation(30));
  }

  showHighScores(): void {
    this.state = this.highScores;
  }

  showCredits(): void {
    this.state = this.credits;
  }
}
