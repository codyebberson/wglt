import { capitalize, Color, serializable } from 'wglt';
import { BaseAI } from './ai';
import { Colors } from './color';
import { Entity, RenderOrder } from './entity';
import { Equipment, EquipmentType } from './equipment';
import { Item } from './item';
import { openLevelUpMenu } from './main';

@serializable
export class Actor extends Entity {
  readonly inventory: Item[] = [];
  weapon?: Equipment;
  armor?: Equipment;
  level = 1;

  constructor(
    char: string,
    color: Color,
    name: string,
    blocks: boolean,
    public maxHp: number,
    private hp_: number,
    public baseDefense: number,
    public basePower: number,
    public xp = 0,
    public ai?: BaseAI
  ) {
    super(0, 0, char, color, name, blocks);
    this.renderOrder = RenderOrder.ACTOR;
  }

  get hp(): number {
    return this.hp_;
  }

  get experienceToNextLevel(): number {
    return this.level * 50;
  }

  get defense(): number {
    return this.baseDefense + this.defenseBonus;
  }

  get power(): number {
    return this.basePower + this.powerBonus;
  }

  get defenseBonus(): number {
    let bonus = 0;
    if (this.weapon) {
      bonus += this.weapon.defenseBonus;
    }
    if (this.armor) {
      bonus += this.armor.defenseBonus;
    }
    return bonus;
  }

  get powerBonus(): number {
    let bonus = 0;
    if (this.weapon) {
      bonus += this.weapon.powerBonus;
    }
    if (this.armor) {
      bonus += this.armor.powerBonus;
    }
    return bonus;
  }

  isEquipped(item: Item): boolean {
    return item === this.weapon || item === this.armor;
  }

  equip(item: Equipment, logMessage = true): void {
    switch (item.equipmentType) {
      case EquipmentType.ARMOR:
        this.unequip(this.armor);
        this.armor = item;
        break;
      case EquipmentType.WEAPON:
        this.unequip(this.weapon);
        this.weapon = item;
        break;
    }

    if (logMessage) {
      this.engine.log('You equip the ' + item.name);
    }
  }

  unequip(item: Equipment | undefined): void {
    if (this.weapon && this.weapon === item) {
      this.weapon = undefined;
      this.engine.log('You remove the ' + item.name);
    }
    if (this.armor && this.armor === item) {
      this.armor = undefined;
      this.engine.log('You remove the ' + item.name);
    }
  }

  toggleEquip(item: Equipment): void {
    if (this.isEquipped(item)) {
      this.unequip(item);
    } else {
      this.equip(item);
    }
  }

  addXp(amount: number): void {
    this.xp += amount;
    this.engine.log(`You gain ${amount} experience points.`);

    if (this.xp >= this.experienceToNextLevel) {
      openLevelUpMenu(this);
    }
  }

  levelUp(): void {
    this.xp -= this.experienceToNextLevel;
    this.level++;
  }

  increaseMaxHp(amount = 20): void {
    this.maxHp += amount;
    this.hp_ += amount;
    this.engine.log('Your health improves!');
    this.levelUp();
  }

  increasePower(amount = 1): void {
    this.basePower += amount;
    this.engine.log('You feel stronger!');
    this.levelUp();
  }

  increaseDefense(amount = 1): void {
    this.baseDefense += amount;
    this.engine.log('Your movements are swifter!');
    this.levelUp();
  }

  heal(amount: number): number {
    const actualHealAmount = Math.min(amount, this.maxHp - this.hp);
    this.hp_ += actualHealAmount;
    return actualHealAmount;
  }

  takeDamage(amount: number): void {
    this.hp_ = Math.max(0, Math.min(this.hp_ - amount, this.maxHp));
    if (this.hp_ === 0) {
      this.die();
    }
  }

  die(): void {
    if (this === this.engine.player) {
      this.engine.log('You died!', Colors.PLAYER_DIE);
    } else {
      this.engine.log(`${capitalize(this.name)} is dead!`, Colors.ENEMY_DIE);
      this.engine.player.addXp(this.xp);
    }

    this.char = '%';
    this.color = Colors.CORPSE;
    this.blocks = false;
    this.ai = undefined;
    this.name = 'remains of ' + this.name;
    this.renderOrder = RenderOrder.CORPSE;
  }
}
