import { capitalize, type PointLike, serializable, zzfx } from 'wglt';
import type { Actor } from './actor';
import { BaseComponent } from './base';
import { Colors } from './color';
import type { Item } from './item';
import { hitSound, nextLevelSound, pickupSound, walkSound } from './sounds';
import { removeFromArray } from './utils';

export abstract class Action extends BaseComponent {
  actor: Actor;
  target?: PointLike;

  constructor(actor: Actor) {
    super(actor);
    this.actor = actor;
  }

  abstract perform(): void;
}

export abstract class ActionWithDirection extends Action {
  dx: number;
  dy: number;

  constructor(actor: Actor, dx: number, dy: number) {
    super(actor);
    this.dx = dx;
    this.dy = dy;
  }
}

@serializable
export class MeleeAction extends ActionWithDirection {
  perform(): void {
    const destX = this.actor.x + this.dx;
    const destY = this.actor.y + this.dy;
    const target = this.gameMap.getActor(destX, destY);
    if (!target) {
      return;
    }

    const damage = this.actor.power - target.defense;
    const attackDesc = `${capitalize(this.actor.name)} attacks ${target.name}`;
    const color = this.actor === this.engine.player ? Colors.PLAYER_ATTACK : Colors.ENEMY_ATTACK;

    if (damage > 0) {
      this.engine.log(`${attackDesc} for ${damage} hit points!`, color);
      this.engine.setPath(undefined);
      target.takeDamage(damage);
      zzfx(...hitSound);
    } else {
      this.engine.log(`${attackDesc} but does no damage.`, color);
    }
  }
}

@serializable
export class MovementAction extends ActionWithDirection {
  perform(): void {
    const destX = this.actor.x + this.dx;
    const destY = this.actor.y + this.dy;

    if (this.gameMap.isWall(destX, destY)) {
      // Destination is out of bounds or blocked by a tile
      throw new Error('That way is blocked.');
    }
    if (this.gameMap.getBlockingEntity(destX, destY)) {
      // Destination is blocked by an actor
      throw new Error('That way is blocked.');
    }

    this.actor.move(this.dx, this.dy);

    if (this.actor === this.engine.player) {
      zzfx(...walkSound);
    }
  }
}

@serializable
export class BumpAction extends ActionWithDirection {
  perform(): void {
    if (this.dx === 0 && this.dy === 0) {
      // Wait action
      return;
    }

    const destX = this.actor.x + this.dx;
    const destY = this.actor.y + this.dy;
    const target = this.gameMap.getActor(destX, destY);
    if (target) {
      new MeleeAction(this.actor, this.dx, this.dy).perform();
      return;
    }

    new MovementAction(this.actor, this.dx, this.dy).perform();
  }
}

@serializable
export class PickupAction extends Action {
  perform(): void {
    const item = this.gameMap.getItem(this.actor.x, this.actor.y);
    if (!item) {
      throw new Error('There is nothing here to pick up.');
    }

    this.actor.inventory.push(item);
    removeFromArray(this.gameMap.entities, item);
    this.engine.log(`You picked up the ${item.name}!`);
    zzfx(...pickupSound);
  }
}

@serializable
export class ItemAction extends Action {
  readonly item: Item;
  constructor(actor: Actor, item: Item) {
    super(actor);
    this.item = item;
  }

  perform(): void {
    this.item.activate(this);
  }
}

@serializable
export class TakeStairsAction extends Action {
  perform(): void {
    const stairs = this.gameMap.stairsLocation;
    if (!stairs || stairs.x !== this.actor.x || stairs.y !== this.actor.y) {
      throw new Error('There are no stairs here.');
    }

    this.engine.generateFloor();
    this.engine.log('You descend the staircase.', Colors.DESCEND);
    zzfx(...nextLevelSound);
  }
}
