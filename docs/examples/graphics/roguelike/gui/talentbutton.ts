import { Button, Container, GUI, GraphicsButtonRenderer, Rect } from 'wglt';
import { App } from '../app';
import { Palette } from '../palette';
import { Talent } from '../talent';

export class TalentButton extends Button {
  readonly talent: Talent;
  readonly shortcut: boolean;

  constructor(rect: Rect, talent: Talent, shortcut?: boolean) {
    super(rect, talent.ability.sprite);
    this.talent = talent;
    this.shortcut = !!shortcut;
    this.tooltip = Container.fromMessages(talent.ability.tooltipMessages);
    this.draggable = true;
  }

  click(): void {
    this.talent.use();
  }
}

export class TalentButtonRenderer extends GraphicsButtonRenderer {
  render(gui: GUI<App>, component: TalentButton): void {
    super.render(gui, component);

    const app = gui.context;
    const talent = component.talent;
    const rect = component.screenRect;
    const game = talent.actor.game;
    const cooldownSprite = game.cooldownSprite;

    if (talent.cooldown > 0 && cooldownSprite) {
      const percent = 1.0 - talent.cooldown / talent.ability.cooldown;
      const frame = Math.round(percent * cooldownSprite.frames);
      const u = cooldownSprite.x + frame * cooldownSprite.width;
      const v = cooldownSprite.y;
      const x = (rect.x + (rect.width - cooldownSprite.width) / 2) | 0;
      const y = (rect.y + (rect.height - cooldownSprite.height) / 2) | 0;
      app.drawImage(x, y, u, v, cooldownSprite.width, cooldownSprite.height);

      const cx = (rect.x + rect.width / 2) | 0;
      const cy = (rect.y + rect.height / 2) | 0;
      app.drawCenteredString(cx + 1, cy - 2, talent.cooldown.toString(), Palette.BLACK);
      app.drawCenteredString(cx, cy - 3, talent.cooldown.toString(), Palette.WHITE);
    }
  }
}
