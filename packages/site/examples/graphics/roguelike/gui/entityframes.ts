import { Pico8Palette, Rect } from 'wglt';
import { GUI, Panel } from 'wglt';
import { App } from '../app';
import { Player } from '../entities/player';
import { Sentiment, StatsActor } from '../entities/statsactor';
import { Game } from '../game';

export class EntityFrames extends Panel {
  readonly game: Game;

  constructor(game: Game) {
    super(new Rect(0, 40, 40, 200));
    this.game = game;
  }

  drawContents(): void {
    if (!this.gui) {
      return;
    }

    const app = this.gui.app;
    const player = this.game.player as Player;
    const entities = this.game.entities;
    const rect = new Rect(4, 4, 80, 40);

    // Draw the player frame
    this.drawEntity(player, rect);

    // Draw enemy frames
    rect.x = app.size.width - 84;
    for (let i = 0; i < entities.length; i++) {
      const entity = entities.get(i);
      if (entity === this.game.player || !(entity instanceof StatsActor)) {
        continue;
      }
      const actor = entity as StatsActor;
      if (actor.hp <= 0 || !actor.showFrame || actor.visibleDuration < 0) {
        continue;
      }

      this.drawEntity(actor, rect);
      rect.y += 44;
    }
  }

  private drawEntity(actor: StatsActor, rect: Rect): void {
    const gui = this.gui as GUI;
    const app = gui.app as App;
    const player = this.game.player as Player;

    // Draw the frame
    gui.renderer.drawFrame(app, rect);

    // Draw the name
    let nameColor = Pico8Palette.YELLOW;
    if (actor.sentiment === Sentiment.FRIENDLY) {
      nameColor = Pico8Palette.GREEN;
    } else if (actor.sentiment === Sentiment.HOSTILE) {
      nameColor = Pico8Palette.RED;
    }
    app.drawString(actor.name, rect.x + 4, rect.y + 4, nameColor);

    // Draw the health
    const healthWidth = Math.round((38.0 * actor.hp) / actor.maxHp);
    app.fillRect(rect.x + 1, rect.y + 16, healthWidth, 7, Pico8Palette.MEDIUM_GREEN);
    app.drawCenteredString(
      `${actor.hp}/${actor.maxHp}`,
      rect.x + 20,
      rect.y + 16,
      Pico8Palette.WHITE
    );

    // Draw the level
    let levelColor = Pico8Palette.YELLOW;
    if (actor.level > player.level + 3) {
      levelColor = Pico8Palette.RED;
    } else if (actor.level > player.level + 1) {
      levelColor = Pico8Palette.ORANGE;
    } else if (actor.level < player.level - 3) {
      levelColor = Pico8Palette.GREEN;
    } else if (actor.level < player.level - 1) {
      levelColor = Pico8Palette.YELLOW;
    }
    app.drawCenteredString(actor.level.toString(), rect.x + 56, rect.y + 5, levelColor);

    app.drawString(`${actor.x}, ${actor.y}`, rect.x + 4, rect.y + 28, Pico8Palette.WHITE);
  }
}
