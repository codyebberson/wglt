
import {AI} from './ai/ai';
import {Colors} from './colors';
import {BumpEffect} from './effects/bumpeffect';
import {FloatingTextEffect} from './effects/floatingtexteffect';
import {SlideEffect} from './effects/slideeffect';
import {Entity} from './entity';
import {Game} from './game';
import {Item} from './item';
import {Sprite} from './sprite';
import {XArray} from './xarray';

export class Actor extends Entity {
  health: number;
  maxHealth: number;
  actionPoints: number;
  inventory: XArray<Item>;
  ai?: AI;

  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite, blocks: boolean) {
    super(game, x, y, name, sprite, blocks);
    this.health = 100;
    this.maxHealth = 100;
    this.actionPoints = 1;
    this.inventory = new XArray<Item>();
    this.canPickup = false;
    this.canAttack = false;
  }

  move(dx: number, dy: number) {
    const destX = this.x + dx;
    const destY = this.y + dy;

    if (this.game.isBlocked(destX, destY)) {
      return false;
    }

    const count = 4;
    const xSpeed = this.game.tileSize.width / count;
    const ySpeed = this.game.tileSize.height / count;
    this.game.effects.push(new SlideEffect(this, dx * xSpeed, dy * ySpeed, count));
    this.game.blocked = true;
    this.actionPoints--;
    return true;
  }

  moveToward(targetX: number, targetY: number) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.hypot(dx, dy);
    this.move(Math.round(dx / distance), Math.round(dy / distance));
  }

  attack(target: Actor) {
    if (target === this) {
      return;
    }

    const damage = 10;

    if (this.onAttack) {
      this.onAttack(target, damage);
    }

    target.takeDamage(damage);
    this.actionPoints--;
    this.game.effects.push(new BumpEffect(this, target));
    this.game.blocked = true;
  }

  takeDamage(damage: number) {
    this.health -= damage;

    this.game.effects.push(new FloatingTextEffect(damage.toString(), this.pixelX + 8, this.pixelY - 4, Colors.RED));

    if (this.health <= 0) {
      this.health = 0;
      if (this.onDeath) {
        this.onDeath();
      }

      const index = this.game.entities.indexOf(this);
      if (index >= 0) {
        this.game.entities.splice(index, 1);
      }
    }
  }

  pickup(item: Item) {
    item.onPickup(this);
    this.inventory.add(item);
    const index = this.game.entities.indexOf(item);
    if (index >= 0) {
      this.game.entities.splice(index, 1);
    }
  }

  use(item: Item) {
    return item.onUse(this);
  }


  onAttack(attacker: Actor, damage: number) {}
  onDeath() {}
}