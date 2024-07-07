import { FONT_04B03, FadeInAnimation, GraphicsApp, Rect } from 'wglt';
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
    super({
      size: new Rect(0, 0, 640, 360),
      font: FONT_04B03,
      fillSourceRect: new Rect(1008, 0, 16, 16),
      dialogRect: new Rect(0, 32, 48, 48),
      closeButtonRect: new Rect(0, 0, 80, 45),
      buttonRect: new Rect(0, 32, 48, 48),
      buttonSlotRect: new Rect(0, 32, 48, 48),
    });
    this.mainMenu = new MainMenu(this);
    this.highScores = new HighScores(this);
    this.credits = new Credits(this);
    this.seed = 0;
    this.showMainMenu();
  }

  showMainMenu(): void {
    this.state = this.mainMenu;
  }

  startGame(): void {
    const game = new Game(this, this.seed);
    this.game = game;

    const player = game.player as Player;
    player.inventory.add(new Hearthstone(game));
    for (let i = 0; i < 20; i++) {
      player.inventory.add(new Gold(game));
    }

    window.location.hash = 'game';
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
