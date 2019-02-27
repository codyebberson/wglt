import {Entity} from './entity';

export class Item extends Entity {
  onPickup(user: Entity) {}

  onUse(user: Entity): boolean {
    return false;
  }
}