import {Ability, TargetType} from './ability';
import {AI} from './ai/ai';
import {Color} from './color';
import {Colors} from './colors';
import {BumpEffect} from './effects/bumpeffect';
import {FloatingTextEffect} from './effects/floatingtexteffect';
import {SlideEffect} from './effects/slideeffect';
import {Entity} from './entity';
import {Game} from './game';
import {Item} from './item';
import {Sprite} from './sprite';
import {Talent} from './talent';
import {XArray} from './xarray';

export class Actor extends Entity {
  hp: number;
  maxHp: number;
  ap: number;
  maxAp: number;
  inventory: XArray<Item>;
  talents: XArray<Talent>;
  activatedCount: number;
  seen: boolean;
  ai?: AI;

  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite, blocks: boolean) {
    super(game, x, y, name, sprite, blocks);
    this.hp = 100;
    this.maxHp = 100;
    this.ap = 1;
    this.maxAp = 1;
    this.inventory = new XArray<Item>();
    this.talents = new XArray<Talent>();
    this.activatedCount = -1;
    this.seen = false;
  }

  move(dx: number, dy: number) {
    const destX = this.x + dx;
    const destY = this.y + dy;

    // TODO: Enforce diagonal vs cardinal movement?

    if (this.game.isBlocked(destX, destY)) {
      return false;
    }

    const count = 4;
    const xSpeed = this.game.tileSize.width / count;
    const ySpeed = this.game.tileSize.height / count;
    this.game.effects.push(new SlideEffect(this, dx * xSpeed, dy * ySpeed, count));
    this.game.blocked = true;
    this.ap--;
    return true;
  }

  moveToward(targetX: number, targetY: number) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0 && this.move(-1, 0)) {
        return true;
      }
      if (dx > 0 && this.move(1, 0)) {
        return true;
      }
      if (dy < 0 && this.move(0, -1)) {
        return true;
      }
      if (dy > 0 && this.move(0, 1)) {
        return true;
      }
    } else {
      if (dy < 0 && this.move(0, -1)) {
        return true;
      }
      if (dy > 0 && this.move(0, 1)) {
        return true;
      }
      if (dx < 0 && this.move(-1, 0)) {
        return true;
      }
      if (dx > 0 && this.move(1, 0)) {
        return true;
      }
    }
    return false;
  }

  attack(target: Actor, damage: number) {
    if (target === this) {
      return;
    }

    // TODO: Enforce distance check?

    this.onAttack(target, damage);
    target.takeDamage(damage);
    this.ap--;
    this.game.effects.push(new BumpEffect(this, target));
    this.game.blocked = true;
  }

  takeHeal(heal: number) {
    this.hp = Math.min(this.hp + heal, this.maxHp);
    this.addFloatingText(heal.toString(), Colors.LIGHT_GREEN);
  }

  takeDamage(damage: number) {
    this.hp -= damage;
    this.addFloatingText(damage.toString(), Colors.RED);

    if (this.hp <= 0) {
      this.hp = 0;
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

  cast(ability: Ability, callback?: Function) {
    if (ability.targetType === TargetType.SELF) {
      if (ability.cast(this)) {
        if (callback) {
          callback();
        }
      }
    } else {
      this.game.startTargeting(ability, callback);
    }
  }

  addFloatingText(str: string, color: Color) {
    this.game.effects.push(new FloatingTextEffect(this, str, color));
  }

  onAttack(target: Actor, damage: number) {}
  onDeath() {}
}