import { AppState, Key, Pico8Palette } from 'wglt';
import { App } from './app';

const OPTIONS = [
  { display: 'NEW GAME', hash: 'startgame', enabled: true },
  { display: 'CONTINUE', hash: 'game', enabled: false },
  { display: 'TUTORIAL', hash: 'tutorial', enabled: true },
  { display: 'HIGH SCORES', hash: 'highscores', enabled: true },
  { display: 'CREDITS', hash: 'credits', enabled: true },
];

export class MainMenu extends AppState {
  private selectedIndex = 0;

  update(): void {
    // "Continue" is only enabled if there is an active game
    const app = this.app as App;
    OPTIONS[1].enabled = !!app.game;

    // Draw the title text
    this.app.drawCenteredString(
      this.app.center.x + 1,
      33,
      'KOPI LUWAK DUNGEON',
      Pico8Palette.BLACK
    );
    this.app.drawCenteredString(this.app.center.x, 32, 'KOPI LUWAK DUNGEON');

    // Draw the menu options
    const mouse = this.app.mouse;
    for (let i = 0; i < OPTIONS.length; i++) {
      const option = OPTIONS[i];
      const x = this.app.center.x;
      const y = 90 + 15 * i;
      let color = Pico8Palette.WHITE;
      if (!option.enabled) {
        color = Pico8Palette.LIGHT_GRAY;
      } else if (i === this.selectedIndex) {
        color = Pico8Palette.YELLOW;
      }
      this.app.drawCenteredString(x + 1, y + 1, option.display, Pico8Palette.BLACK);
      this.app.drawCenteredString(x, y, option.display, color);

      if (mouse.y >= y && mouse.y < y + 14 && mouse.isClicked()) {
        window.location.hash = option.hash;
      }

      if (i === this.selectedIndex && this.app.isKeyPressed(Key.VK_ENTER)) {
        window.location.hash = option.hash;
      }
    }

    if (this.app.isKeyPressed(Key.VK_UP)) {
      this.selectedIndex--;
    }

    if (this.app.isKeyPressed(Key.VK_DOWN)) {
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
