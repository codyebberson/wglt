import {AI} from './ai/ai';
import {Colors} from './colors';
import {BumpEffect} from './effects/bumpeffect';
import {FloatingTextEffect} from './effects/floatingtexteffect';
import {SlideEffect} from './effects/slideeffect';
import {Game} from './game';
import {SelectOption} from './gui/selectoption';
import {Sprite} from './sprite';
import {Vec2} from './vec2';
import {XArray} from './xarray';

export class Entity extends Vec2 implements SelectOption {
  readonly game: Game;
  offsetX: number;
  offsetY: number;
  name: string;
  sprite: Sprite;
  blocks: boolean;
  health: number;
  maxHealth: number;
  actionPoints: number;
  inventory: XArray<Entity>;
  ai?: AI;
  canPickup: boolean;
  canAttack: boolean;
  onBump?: Function;
  onAttack?: Function;
  onDamage?: Function;
  onDeath?: Function;
  onPickup?: Function;
  onUse?: Function;

  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite, blocks: boolean) {
    super(x, y);
    this.game = game;
    this.offsetX = 0;
    this.offsetY = 0;
    this.name = name;
    this.sprite = sprite;
    this.blocks = blocks;
    this.health = 100;
    this.maxHealth = 100;
    this.actionPoints = 1;
    this.inventory = new XArray<Entity>();
    this.canPickup = false;
    this.canAttack = false;
  }

  get pixelX(): number {
    return this.x * this.game.tileSize.width + this.offsetX;
  }

  get pixelY(): number {
    return this.y * this.game.tileSize.height + this.offsetY;
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

  tryMoveOrAttack(dx: number, dy: number) {
    const destX = this.x + dx;
    const destY = this.y + dy;

    for (let i = 0; i < this.game.entities.length; i++) {
      const other = this.game.entities[i];
      if (this !== other && other.x === destX && other.y === destY) {
        if (this.onBump) {
          if (this.onBump(other)) {
            return true;
          }
        }
      }
    }

    return this.move(dx, dy);
  }

  attack(target: Entity) {
    if (target === this) {
      return;
    }

    const damage = 10;

    if (this.onAttack) {
      this.onAttack(this, target, damage);
    }

    target.takeDamage(damage);
    this.actionPoints--;
    this.game.effects.push(new BumpEffect(this, target));
    this.game.blocked = true;
  }

  takeDamage(damage: number) {
    this.health -= damage;

    this.game.effects.push(new FloatingTextEffect(damage.toString(), this.pixelX + 8, this.pixelY - 4, Colors.RED));

    if (this.onDamage) {
      this.onDamage(this);
    }

    if (this.health <= 0) {
      this.health = 0;
      if (this.onDeath) {
        this.onDeath(this);
      }

      const index = this.game.entities.indexOf(this);
      if (index >= 0) {
        this.game.entities.splice(index, 1);
      }
    }
  }

  pickup(item: Entity) {
    if (item.onPickup) {
      item.onPickup(this, item);
    }
    // item.container = this.player.inventory;
    this.inventory.push(item);
    const index = this.game.entities.indexOf(item);
    if (index >= 0) {
      this.game.entities.splice(index, 1);
    }
  }

  use() {
    if (!this.onUse) {
      return false;
    }
    this.onUse(this);
    return true;
  }

  distanceTo(other: Entity) {
    return Math.hypot(other.x - this.x, other.y - this.y);
  }

  distance(x: number, y: number) {
    return Math.hypot(x - this.x, y - this.y);
  }

  draw() {
    this.sprite.draw(this.game.app, this.pixelX - this.game.viewport.x, this.pixelY - this.game.viewport.y);
  }

  sendToBack() {}
}
