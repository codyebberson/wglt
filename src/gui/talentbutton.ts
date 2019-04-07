import {Colors} from '../colors';
import {Rect} from '../rect';
import {Talent} from '../talent';

import {Button} from './button';
import { Serializable } from '../serializable';

@Serializable('TalentButton')
export class TalentButton extends Button {
  readonly talent: Talent;
  readonly shortcut: boolean;

  constructor(rect: Rect, talent: Talent, shortcut?: boolean) {
    super(rect, talent.ability.sprite);
    this.talent = talent;
    this.shortcut = !!shortcut;
    this.tooltipMessages = talent.ability.tooltipMessages;
  }

  click() {
    this.talent.use();
  }

  drawContents() {
    super.drawContents();

    if (this.talent.cooldown > 0) {
      const game = this.talent.actor.game;
      const cooldownSprite = game.cooldownSprite;
      if (cooldownSprite) {
        const percent = 1.0 - this.talent.cooldown / this.talent.ability.cooldown;
        const frame = Math.round(percent * cooldownSprite.frames);
        const u = cooldownSprite.x + frame * cooldownSprite.width;
        const v = cooldownSprite.y;
        const x = this.rect.x + ((this.rect.width - cooldownSprite.width) / 2) | 0;
        const y = this.rect.y + ((this.rect.height - cooldownSprite.height) / 2) | 0;
        game.app.drawImage(x, y, u, v, cooldownSprite.width, cooldownSprite.height);

        const cx = this.rect.x + (this.rect.width / 2) | 0;
        const cy = this.rect.y + (this.rect.height / 2) | 0;
        game.app.drawCenteredString(this.talent.cooldown.toString(), cx + 1, cy - 2, Colors.BLACK);
        game.app.drawCenteredString(this.talent.cooldown.toString(), cx, cy - 3, Colors.WHITE);
      }
    }
  }
}