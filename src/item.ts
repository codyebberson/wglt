import {Actor} from './actor';
import {Entity} from './entity';

export class Item extends Entity {
  onPickup(user: Actor) {}

  onUse(user: Actor): boolean {
    return false;
  }
}