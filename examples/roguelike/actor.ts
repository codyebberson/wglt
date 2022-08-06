import { Color } from '../../src/color';
import { Colors } from '../../src/palettes/colors';
import { AI } from './ai';
import { Entity } from './entity';
import { Game } from './game';
import { Item } from './item';

export class Actor extends Entity {
  level: number;
  inventory: Item[];
  hp: number;
  xp: number;
  baseMaxHp: number;
  baseDefense: number;
  basePower: number;
  ai?: AI;

  constructor(game: Game, x: number, y: number, char: string, name: string, color: Color) {
    super(game, x, y, char, name, color, true);
    this.level = 1;
    this.inventory = [];
    this.hp = 0;
    this.xp = 0;
    this.baseMaxHp = 0;
    this.baseDefense = 0;
    this.basePower = 0;
  }

  move(dx: number, dy: number): void {
    if (this.game.isBlocked(this.x + dx, this.y + dy)) {
      return;
    }
    this.x += dx;
    this.y += dy;
  }

  moveToward(targetX: number, targetY: number): void {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.hypot(dx, dy);
    this.move(Math.round(dx / distance), Math.round(dy / distance));
  }

  getEquippedInSlot(slot: string): Item | undefined {
    return this.inventory.find((item) => item.slot === slot && item.equipped);
  }

  getAllEquipped(): Item[] {
    return this.inventory.filter((item) => item.equipped);
  }

  equip(item: Item): void {
    const old = this.getEquippedInSlot(item.slot);
    if (old) {
      this.dequip(old);
    }

    item.equipped = true;
    this.game.addMessage('Equipped ' + item.name + ' on ' + item.slot + '.', Colors.LIGHT_GREEN);
  }

  dequip(item: Item): void {
    if (!item.equipped) {
      return;
    }
    item.equipped = false;
    this.game.addMessage('Dequipped ' + item.name + ' on ' + item.slot + '.', Colors.YELLOW);
  }

  get maxHp(): number {
    return this.baseMaxHp + this.getAllEquipped().reduce((acc, item) => acc + item.maxHpBonus, 0);
  }

  get defense(): number {
    return this.baseDefense + this.getAllEquipped().reduce((acc, item) => acc + item.defenseBonus, 0);
  }

  get power(): number {
    return this.basePower + this.getAllEquipped().reduce((acc, item) => acc + item.powerBonus, 0);
  }

  attack(target: Actor): void {
    const damage = this.power - target.defense;

    if (damage > 0) {
      this.game.addMessage(this.name + ' attacks ' + target.name + ' for ' + damage + ' hit points.');
      target.takeDamage(damage);
      if (target.hp === 0) {
        this.takeXp(target.xp);
      }
    } else {
      this.game.addMessage(this.name + ' attacks ' + target.name + ' but it has no effect!');
    }
  }

  takeXp(xp: number): void {
    this.xp += xp;
    this.game.checkLevelUp();
  }

  takeDamage(damage: number): void {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.death();
    }
  }

  heal(amount: number): void {
    this.hp = Math.min(this.hp + amount, this.maxHp);
  }

  death(): void {
    if (this === this.game.player) {
      this.game.addMessage('You died!', Colors.DARK_RED);
    } else {
      this.game.addMessage(this.name + ' is dead!', Colors.ORANGE);
    }
    this.char = '%';
    this.color = Colors.DARK_RED;
    this.blocks = false;
    this.ai = undefined;
    this.name = 'Remains of ' + this.name;
    this.sendToBack();
  }

  pickUp(item: Item): void {
    if (this.inventory.length >= 26) {
      this.game.addMessage('Your inventory is full, cannot pick up ' + item.name + '.', Colors.LIGHT_RED);
    } else {
      this.inventory.push(item);
      item.remove();
      this.game.addMessage('You picked up a ' + item.name + '!', Colors.LIGHT_GREEN);
    }
  }

  useItem(item: Item): void {
    if (item.useFunction) {
      item.useFunction(item);
    } else {
      this.game.addMessage('The ' + item.name + ' cannot be used.');
    }
  }

  removeItem(item: Item): void {
    this.inventory.splice(this.inventory.indexOf(item), 1);
  }

  setAi(ai: AI): void {
    this.ai = ai;
    ai.owner = this;
  }
}
