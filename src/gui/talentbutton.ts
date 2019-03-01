import {Rect} from '../rect';
import {Talent} from '../talent';

import {Button} from './button';

export class TalentButton extends Button {
  readonly talent: Talent;

  constructor(rect: Rect, talent: Talent) {
    super(rect, talent.ability.sprite);
    this.talent = talent;
  }

  click() {
    this.talent.actor.cast(this.talent.ability);
  }
}