import { AppState, GUI } from 'wglt';
import { App } from './app';
import { Palette } from './palette';

const OPTIONS = [
  { display: 'NEW GAME', hash: 'startgame', enabled: true },
  { display: 'CONTINUE', hash: 'game', enabled: false },
  { display: 'TUTORIAL', hash: 'tutorial', enabled: true },
  { display: 'HIGH SCORES', hash: 'highscores', enabled: true },
  { display: 'CREDITS', hash: 'credits', enabled: true },
];

export class MainMenu extends AppState<App> {
  private selectedIndex = 0;

  constructor(
    app: App,
    readonly gui: GUI<App>,
    readonly onNewGame: () => void
  ) {
    super(app);
  }

  update(): void {
    const app = this.app;

    // Draw the title text
    app.drawCenteredString(this.app.center.x + 1, 33, 'WGLT ROGUELIKE DEMO', Palette.BLUE);
    app.drawCenteredString(this.app.center.x, 32, 'WGLT ROGUELIKE DEMO');

    // Draw the menu options
    const mouse = this.app.mouse;
    for (let i = 0; i < OPTIONS.length; i++) {
      const option = OPTIONS[i];
      const x = this.app.center.x;
      const y = 90 + 15 * i;
      let color = Palette.WHITE;
      if (!option.enabled) {
        color = Palette.LIGHT_GRAY;
      } else if (i === this.selectedIndex) {
        color = Palette.YELLOW;
      }
      app.drawCenteredString(x + 1, y + 1, option.display, Palette.BLACK);
      app.drawCenteredString(x, y, option.display, color);

      if (mouse.y >= y && mouse.y < y + 14 && mouse.isClicked()) {
        this.onNewGame();
      }

      if (i === this.selectedIndex && this.app.keyboard.isEnterKeyPressed()) {
        this.onNewGame();
      }
    }

    if (this.app.keyboard.isUpKeyPressed()) {
      this.selectedIndex--;
    }

    if (this.app.keyboard.isDownKeyPressed()) {
      this.selectedIndex++;
    }

    if (this.selectedIndex < 0) {
      this.selectedIndex += OPTIONS.length;
    }

    if (this.selectedIndex >= OPTIONS.length) {
      this.selectedIndex -= OPTIONS.length;
    }
  }
}
