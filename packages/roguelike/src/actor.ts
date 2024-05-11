import { ArrayList } from '@wglt/core';
import { Color } from '@wglt/core';
import { Sprite } from '@wglt/graphics';
import { TileMapCell } from '@wglt/tilemap';
import { Ability, TargetType } from './ability';
import { AI } from './ai/ai';
import { BumpAnimation } from './animations/bumpanimation';
import { FloatingTextAnimation } from './animations/floatingtextanimation';
import { SlideAnimation } from './animations/slideanimation';
import { BaseGame } from './basegame';
import { Entity } from './entity';
import { Item } from './item';
import { Talent } from './talent';

export class Actor extends Entity {
  hp: number;
  maxHp: number;
  ap: number;
  maxAp: number;
  gold: number;
  inventory: ArrayList<Item>;
  talents: ArrayList<Talent>;
  visibleDuration: number;
  seen: boolean;
  ai?: AI;

  constructor(game: BaseGame, x: number, y: number, name: string, sprite: Sprite, blocks: boolean) {
    super(game, x, y, name, sprite, blocks);
    this.hp = 100;
    this.maxHp = 100;
    this.ap = 1;
    this.maxAp = 1;
    this.gold = 0;
    this.inventory = new ArrayList<Item>();
    this.talents = new ArrayList<Talent>();
    this.visibleDuration = -1;
    this.seen = false;
  }

  startTurn(): void {
    this.ap = this.maxAp;
    for (let j = 0; j < this.talents.length; j++) {
      const talent = this.talents.get(j);
      if (talent.cooldown > 0) {
        talent.cooldown--;
      }
    }
  }

  turnToward(dx: number): void {
    if (dx < 0) {
      this.flipped = true;
    } else if (dx > 0) {
      this.flipped = false;
    }
  }

  move(dx: number, dy: number, slideCount?: number): boolean {
    const destX = this.x + dx;
    const destY = this.y + dy;

    // TODO: Enforce diagonal vs cardinal movement?

    if (this.blocks) {
      // If this actor blocks (default), then check for walls and entities
      if (this.game.isBlocked(destX, destY)) {
        return false;
      }
    } else {
      // If this actor does *not* block, then only check tile map.
      if (this.game.tileMap.isBlocked(destX, destY)) {
        return false;
      }
    }

    // The actor technically moves instantly.
    // However, we set the offset such that it looks like the actor slides over time.
    this.x = destX;
    this.y = destY;
    this.ap--;
    this.offset.x = -dx * this.game.tileSize.width;
    this.offset.y = -dy * this.game.tileSize.height;

    // Now create the slide animation
    const count = slideCount || 2;
    const xSpeed = this.game.tileSize.width / count;
    const ySpeed = this.game.tileSize.height / count;
    this.game.animations.push(new SlideAnimation(this, dx * xSpeed, dy * ySpeed, count));
    this.game.blocked = true;
    this.turnToward(dx);
    return true;
  }

  moveTo(destX: number, destY: number, slideCount?: number): boolean {
    return this.move(destX - this.x, destY - this.y, slideCount);
  }

  moveToward(targetX: number, targetY: number, slideCount?: number): boolean {
    const dx = targetX - this.x;
    const dy = targetY - this.y;

    if (dx < 0 && dy < 0 && this.move(-1, -1, slideCount)) {
      return true;
    }
    if (dx < 0 && dy > 0 && this.move(-1, 1, slideCount)) {
      return true;
    }
    if (dx > 0 && dy < 0 && this.move(1, -1, slideCount)) {
      return true;
    }
    if (dx > 0 && dy > 0 && this.move(1, 1, slideCount)) {
      return true;
    }

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

  attack(target: Actor, damage: number): void {
    if (target === this) {
      return;
    }

    this.onAttack(target, damage);
    target.takeDamage(this, damage);
    this.ap--;
    this.game.animations.push(new BumpAnimation(this, target));
    this.game.blocked = true;
    this.turnToward(target.x - this.x);
  }

  takeHeal(heal: number): void {
    this.hp = Math.min(this.hp + heal, this.maxHp);
    this.addFloatingText(heal.toString(), this.game.healColor);
  }

  takeDamage(attacker: Actor, damage: number): void {
    if (this.hp <= 0) {
      // Already dead
      return;
    }

    this.hp -= damage;
    this.addFloatingText(damage.toString(), this.game.damageColor);
    this.game.screenShakeCountdown = 10;

    if (this.hp <= 0) {
      this.hp = 0;
      this.blocks = false;
      this.ai = undefined;
      this.onDeath(attacker);
    }
  }

  pickup(item: Item): void {
    item.onPickup(this);
    if (item.gold > 0) {
      this.gold += item.gold;
    } else {
      this.inventory.add(item);
    }
    this.game.entities.remove(item);
  }

  use(item: Item): boolean {
    return item.onUse(this);
  }

  cast(ability: Ability, target?: Entity | TileMapCell, callback?: () => void): void {
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

  addFloatingText(str: string, color: Color): void {
    this.game.animations.push(new FloatingTextAnimation(this, str, color));
  }

  onAttack(_target: Actor, _damage: number): void {
    // Subclasses can override this
  }

  onDeath(_attacker: Actor): void {
    // Subclasses can override this
  }
}
