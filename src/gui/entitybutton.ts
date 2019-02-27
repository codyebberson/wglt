import {Entity} from '../entity';
import {Rect} from '../rect';

import {Button} from './button';

export class EntityButton extends Button {
  readonly entities: Entity[];

  constructor(destRect: Rect, entity: Entity) {
    super(destRect, entity.sprite);
    this.entities = [entity];
  }

  click() {
    if (this.entities.length > 0) {
      const item = this.entities[0];
      const player = item.game.player;
      if (player) {
        player.use(item);
      }
    }
  }

  drawContents() {
    if (!this.gui) {
      return;
    }

    super.drawContents();

    if (this.entities.length > 1) {
      const dst = this.rect;
      this.gui.app.drawString(this.entities.length.toString(), dst.x2 - 7, dst.y2 - 10);
    }
  }
}