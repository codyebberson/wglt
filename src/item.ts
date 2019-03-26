import {Actor} from './actor';
import {Entity} from './entity';
import {Message} from './message';

export class Item extends Entity {
  tooltipMessages?: Message[];

  onBump(player: Actor) {
    player.pickup(this);
    player.moveToward(this.x, this.y);
    return true;
  }

  onPickup(user: Actor) {}

  onUse(user: Actor): boolean {
    return false;
  }

  onUpdateTooltip() { }
}