import { AppState, FONT_04B03, Pico8Palette } from 'wglt';
import type { App } from './app';

const OPTIONS = [
  { display: 'NEW GAME', hash: 'startgame', enabled: true },
  { display: 'CONTINUE', hash: 'game', enabled: false },
  { display: 'TUTORIAL', hash: 'tutorial', enabled: true },
  { display: 'HIGH SCORES', hash: 'highscores', enabled: true },
  { display: 'CREDITS', hash: 'credits', enabled: true },
];

export class MainMenu extends AppState<App> {
  private selectedIndex = 0;

  update(): void {
    // "Continue" is only enabled if there is an active game
    const app = this.app;
    const font = FONT_04B03;

    OPTIONS[1].enabled = !!app.game;

    // Draw the title text
    app.drawCenteredString(
      font,
      this.app.center.x + 1,
      33,
      'WGLT ROGUELIKE DEMO',
      Pico8Palette.BLACK
    );
    app.drawCenteredString(font, this.app.center.x, 32, 'WGLT ROGUELIKE DEMO');

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
      app.drawCenteredString(font, x + 1, y + 1, option.display, Pico8Palette.BLACK);
      app.drawCenteredString(font, x, y, option.display, color);

      if (mouse.y >= y && mouse.y < y + 14 && mouse.isClicked()) {
        window.location.hash = option.hash;
      }

      if (i === this.selectedIndex && this.app.keyboard.isEnterKeyPressed()) {
        window.location.hash = option.hash;
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
