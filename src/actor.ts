import {Ability, TargetType} from './ability';
import {AI} from './ai/ai';
import {BumpAnimation} from './animations/bumpanimation';
import {FloatingTextAnimation} from './animations/floatingtextanimation';
import {SlideAnimation} from './animations/slideanimation';
import {ArrayList} from './arraylist';
import {Color} from './color';
import {Colors} from './colors';
import {Entity} from './entity';
import {Game} from './game';
import {Item} from './item';
import {Sprite} from './sprite';
import {Talent} from './talent';
import {TileMapCell} from './tilemap';

export class Actor extends Entity {
  hp: number;
  maxHp: number;
  ap: number;
  maxAp: number;
  inventory: ArrayList<Item>;
  talents: ArrayList<Talent>;
  visibleDuration: number;
  seen: boolean;
  ai?: AI;

  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite, blocks: boolean) {
    super(game, x, y, name, sprite, blocks);
    this.hp = 100;
    this.maxHp = 100;
    this.ap = 1;
    this.maxAp = 1;
    this.inventory = new ArrayList<Item>();
    this.talents = new ArrayList<Talent>();
    this.visibleDuration = -1;
    this.seen = false;
  }

  startTurn() {
    this.ap = this.maxAp;
    for (let j = 0; j < this.talents.length; j++) {
      const talent = this.talents.get(j);
      if (talent.cooldown > 0) {
        talent.cooldown--;
      }
    }
  }

  move(dx: number, dy: number, slideCount?: number) {
    const destX = this.x + dx;
    const destY = this.y + dy;

    // TODO: Enforce diagonal vs cardinal movement?

    if (this.game.isBlocked(destX, destY)) {
      return false;
    }

    // The actor technically moves instantly.
    // However, we set the offset such that it looks like the actor slides over time.
    this.x = destX;
    this.y = destY;
    this.ap--;
    this.offset.x = -dx * this.game.tileSize.width;
    this.offset.y = -dy * this.game.tileSize.height;

    // Now create the slide animation
    const count = slideCount || 4;
    const xSpeed = this.game.tileSize.width / count;
    const ySpeed = this.game.tileSize.height / count;
    this.game.animations.push(new SlideAnimation(this, dx * xSpeed, dy * ySpeed, count));
    this.game.blocked = true;
    return true;
  }

  moveTo(destX: number, destY: number, slideCount?: number) {
    return this.move(destX - this.x, destY - this.y, slideCount);
  }

  moveToward(targetX: number, targetY: number, slideCount?: number) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0 && this.move(-1, 0, slideCount)) {
        return true;
      }
      if (dx > 0 && this.move(1, 0, slideCount)) {
        return true;
      }
      if (dy < 0 && this.move(0, -1, slideCount)) {
        return true;
      }
      if (dy > 0 && this.move(0, 1, slideCount)) {
        return true;
      }
    } else {
      if (dy < 0 && this.move(0, -1, slideCount)) {
        return true;
      }
      if (dy > 0 && this.move(0, 1, slideCount)) {
        return true;
      }
      if (dx < 0 && this.move(-1, 0, slideCount)) {
        return true;
      }
      if (dx > 0 && this.move(1, 0, slideCount)) {
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
    this.game.animations.push(new BumpAnimation(this, target));
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

  cast(ability: Ability, target?: Entity|TileMapCell, callback?: Function) {
    if (ability.targetType === TargetType.SELF || target) {
      if (ability.cast(this, target)) {
        if (callback) {
          callback();
        }
      }
    } else {
      this.game.startTargeting(ability, callback);
    }
  }

  addFloatingText(str: string, color: Color) {
    this.game.animations.push(new FloatingTextAnimation(this, str, color));
  }

  onAttack(target: Actor, damage: number) {}
  onDeath() {}
}