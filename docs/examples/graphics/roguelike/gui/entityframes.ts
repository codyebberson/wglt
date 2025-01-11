import { Container, GUI, GraphicsApp, Pico8Palette, Rect, Renderer } from 'wglt';
import { App } from '../app';
import { Player } from '../entities/player';
import { Sentiment, StatsActor } from '../entities/statsactor';
import { Game } from '../game';

export class EntityFrames extends Container {
  readonly game: Game;

  constructor(game: Game) {
    super(new Rect(0, 40, 40, 200));
    this.game = game;
  }
}

export class EntityFramesRenderer implements Renderer<App, EntityFrames> {
  render(gui: GUI<App>, _component: EntityFrames): void {
    const app = gui.context;
    const game = app.game;
    if (!game) {
      return;
    }

    // const game = component.game;
    const player = game.player as Player;
    const entities = game.entities;
    const rect = new Rect(4, 4, 80, 40);

    // Draw the player frame
    this.drawEntity(app, game, player, rect);

    // Draw enemy frames
    rect.x = app.size.width - 84;
    for (let i = 0; i < entities.length; i++) {
      const entity = entities.get(i);
      if (entity === game.player || !(entity instanceof StatsActor)) {
        continue;
      }
      const actor = entity as StatsActor;
      if (actor.hp <= 0 || !actor.showFrame || actor.visibleDuration < 0) {
        continue;
      }

      this.drawEntity(app, game, actor, rect);
      rect.y += 44;
    }
  }

  private drawEntity(app: App, game: Game, actor: StatsActor, rect: Rect): void {
    // const gui = this.gui as GUI;
    // const app = gui.app as App;
    const player = game.player as Player;

    // Draw the frame
    // gui.renderer.drawFrame(app, rect);
    // app.drawDialogFrame(this);

    const graphicsApp = app as GraphicsApp;
    const dialogSourceRect = new Rect(0, 32, 48, 48);
    graphicsApp.drawAutoRect(dialogSourceRect, rect);

    // Draw the name
    let nameColor = Pico8Palette.YELLOW;
    if (actor.sentiment === Sentiment.FRIENDLY) {
      nameColor = Pico8Palette.GREEN;
    } else if (actor.sentiment === Sentiment.HOSTILE) {
      nameColor = Pico8Palette.RED;
    }
    app.drawString(rect.x + 4, rect.y + 4, actor.name, nameColor);

    // Draw the health
    const healthWidth = Math.round((38.0 * actor.hp) / actor.maxHp);
    // const fillSourceRect = new Rect(1008, 0, 16, 16);
    // app.fillRect(rect.x + 1, rect.y + 16, healthWidth, 7, Pico8Palette.MEDIUM_GREEN);
    app.drawImage(
      rect.x + 2,
      rect.y + 16,
      1008,
      0,
      16,
      16,
      Pico8Palette.MEDIUM_GREEN,
      healthWidth,
      7
    );
    app.drawCenteredString(
      rect.x + 20,
      rect.y + 16,
      `${actor.hp}/${actor.maxHp}`,
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
    app.drawCenteredString(rect.x + 56, rect.y + 5, actor.level.toString(), levelColor);

    app.drawString(rect.x + 4, rect.y + 28, `${actor.x}, ${actor.y}`, Pico8Palette.WHITE);
  }
}
