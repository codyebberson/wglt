import {Actor} from './actor';
import {Entity} from './entity';
import {Message} from './message';

export class Item extends Entity {
  tooltipMessages?: Message[];

  onPickup(user: Actor) {}

  onUse(user: Actor): boolean {
    return false;
  }
}