import { Color, serializable } from 'wglt';
import { Action, ItemAction } from './actions';
import { Actor } from './actor';
import { BaseAI, ConfusedEnemy } from './ai';
import { Colors } from './color';
import { Entity, RenderOrder } from './entity';
import { AreaRangedAttackHandler, SingleRangedAttackHandler } from './handlers';
import { healSound } from './sounds';
import { removeFromArray } from './utils';
import { zzfx } from './zzfx/zzfx';

export abstract class Item extends Entity {
  constructor(char: string, color: Color, name: string) {
    super(0, 0, char, color, name, false, RenderOrder.ITEM);
  }

  getAction(consumer: Actor): Action | undefined {
    return new ItemAction(consumer, this);
  }

  abstract activate(action: Action): void;
}

@serializable
export class HealingItem extends Item {
  constructor(char: string, color: Color, name: string, readonly amount: number) {
    super(char, color, name);
  }

  activate(action: Action): void {
    const amountRecovered = action.actor.heal(this.amount);
    if (amountRecovered > 0) {
      consume(action.actor, this);
      this.engine.log(`You consume the ${this.name}, and recover ${amountRecovered} HP!`, Colors.HEALTH_RECOVERED);
      zzfx(...healSound);
    } else {
      throw new Error('Your health is already full.');
    }
  }
}

@serializable
export class LightningDamageItem extends Item {
  constructor(char: string, color: Color, name: string, readonly damage: number, readonly maxRange: number) {
    super(char, color, name);
  }

  activate(action: Action): void {
    const consumer = action.actor;
    let target = undefined;
    let closestDistance = this.maxRange + 1;

    for (const actor of this.gameMap.actors) {
      if (actor !== consumer && this.gameMap.isVisible(actor.x, actor.y)) {
        const distance = consumer.distance(actor.x, actor.y);
        if (distance < closestDistance) {
          target = actor;
          closestDistance = distance;
        }
      }
    }

    if (target) {
      this.engine.log(`A lightning bolt strikes the ${target.name} with a loud thunder, for ${this.damage} damage!`);
      target.takeDamage(this.damage);
      consume(action.actor, this);
    } else {
      throw new Error('No enemy is close enough to strike.');
    }
  }
}

@serializable
export class ConfusionItem extends Item {
  constructor(char: string, color: Color, name: string, readonly numberOfTurns: number) {
    super(char, color, name);
  }

  getAction(consumer: Actor): Action | undefined {
    this.engine.log('Select a target location', Colors.NEEDS_TARGET);
    this.engine.eventHandler = new SingleRangedAttackHandler(new ItemAction(consumer, this));
    return undefined;
  }

  activate(action: Action): void {
    const x = action.target?.x as number;
    const y = action.target?.y as number;
    if (!this.gameMap.isVisible(x, y)) {
      throw new Error('You cannot target an area that you cannot see.');
    }

    const target = this.gameMap.getActor(x, y);
    if (!target) {
      throw new Error('You must select an enemy to target.');
    }

    const consumer = action.actor;
    if (target === consumer) {
      throw new Error('You cannot confuse yourself!');
    }

    this.engine.log(
      `The eyes of the ${target.name} look vacant, as he starts to stumble around!`,
      Colors.STATUS_EFFECT_APPLIED
    );
    target.ai = new ConfusedEnemy(target.ai as BaseAI, this.numberOfTurns);
    consume(consumer, this);
  }
}

@serializable
export class FireballDamageItem extends Item {
  constructor(char: string, color: Color, name: string, readonly damage: number, readonly radius: number) {
    super(char, color, name);
  }

  getAction(consumer: Actor): Action | undefined {
    this.engine.log('Select a target location', Colors.NEEDS_TARGET);
    this.engine.eventHandler = new AreaRangedAttackHandler(this.radius, new ItemAction(consumer, this));
    return undefined;
  }

  activate(action: Action): void {
    const x = action.target?.x as number;
    const y = action.target?.y as number;
    if (!this.gameMap.isVisible(x, y)) {
      throw new Error('You cannot target an area that you cannot see.');
    }

    let hit = false;
    for (const actor of this.gameMap.actors) {
      if (actor.distance(x, y) <= this.radius) {
        this.engine.log(
          `The ${actor.name} is engulfed in a fiery explosion, taking ${this.damage} damage!`,
          Colors.RED
        );
        actor.takeDamage(this.damage);
        hit = true;
      }
    }

    if (!hit) {
      throw new Error('There are no targets in the radius.');
    }

    consume(action.actor, this);
  }
}

function consume(actor: Actor, item: Item): void {
  removeFromArray(actor.inventory, item);
}
