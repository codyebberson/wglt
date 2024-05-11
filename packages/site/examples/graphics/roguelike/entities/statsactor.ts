import { ArrayList, Pico8Palette } from '@wglt/core';
import { CompoundMessage, Message, Sprite } from '@wglt/graphics';
import { Actor } from '@wglt/roguelike';
import { Buff } from '../buffs/buff';
import { Equipment } from '../equipment/equipment';
import { EquipmentSlot } from '../equipment/equipmentslot';
import { EquipmentType } from '../equipment/equipmenttype';
import { Game } from '../game';
import { Player } from './player';

// const START_BLOOD = 1367;
// const END_BLOOD = 1370;

export enum Sentiment {
  HOSTILE = -1,
  NEUTRAL = 0,
  FRIENDLY = 1,
}

export abstract class StatsActor extends Actor {
  level: number;
  mp: number;
  maxMp: number;
  armor: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  showFrame: boolean;
  sentiment: Sentiment;
  readonly equipment: ArrayList<Equipment>;
  readonly proficiencies: EquipmentType[];
  readonly buffs: Buff[];

  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite) {
    super(game, x, y, name, sprite, true);
    this.level = 1;
    this.mp = 1;
    this.maxMp = 1;
    this.armor = 0;
    this.strength = 10;
    this.dexterity = 10;
    this.constitution = 10;
    this.intelligence = 10;
    this.recalculateMaxHp();
    this.hp = this.maxHp;
    this.showFrame = true;
    this.sentiment = Sentiment.NEUTRAL;
    this.equipment = new ArrayList<Equipment>();
    this.proficiencies = [];
    this.buffs = [];

    this.equipment.addListener({
      onAdd: (_, item) => this.addEquipment(item),
      onRemove: (_, item) => this.removeEquipment(item),
    });
  }

  get strengthModifier(): number {
    return this.calculateModifier(this.strength);
  }

  get dexterityModifier(): number {
    return this.calculateModifier(this.dexterity);
  }

  get constitutionModifier(): number {
    return this.calculateModifier(this.constitution);
  }

  get intelligenceModifier(): number {
    return this.calculateModifier(this.intelligence);
  }

  private calculateModifier(abilityScore: number): number {
    return Math.floor((abilityScore - 10) / 2);
  }

  getEquipment(slot: EquipmentSlot): Equipment | undefined {
    for (let i = 0; i < this.equipment.length; i++) {
      const item = this.equipment.get(i);
      if (item.slot === slot) {
        return item;
      }
    }
    return undefined;
  }

  get mainHandWeapon(): Equipment | undefined {
    return this.getEquipment(EquipmentSlot.MAINHAND);
  }

  getDamage(): number {
    const weapon = this.mainHandWeapon;
    const rng = this.game.rng;
    let baseDamage = 1;
    let modifier = this.strengthModifier;

    if (weapon) {
      baseDamage = rng.nextRange(weapon.minDamage, weapon.maxDamage + 1);
      modifier = weapon.finesse ? this.dexterityModifier : this.strengthModifier;
    }

    return this.buffDamage(baseDamage + modifier);
  }

  buffDamage(damage: number): number {
    let result = damage;
    for (let i = 0; i < this.buffs.length; i++) {
      result = this.buffs[i].modifyDamageDealt(result);
    }
    return result;
  }

  takeDamage(attacker: StatsActor, damage: number): void {
    if (attacker === this.game.player) {
      // If player is attacking, then the actor is now hostile
      this.sentiment = Sentiment.HOSTILE;
    }

    // Start by subtracting armor modifier
    let result = Math.max(0, damage - Math.round(0.1 * this.armor));

    // Apply any buffs from the target
    for (let i = 0; i < this.buffs.length; i++) {
      result = this.buffs[i].modifyDamageTaken(result);
    }

    // Finally apply the damage
    super.takeDamage(attacker, result);
  }

  onBump(player: Player): boolean {
    if (this.sentiment === Sentiment.FRIENDLY) {
      this.onTalk(player);
    } else {
      player.attack(this, player.getDamage());
    }
    return true;
  }

  onTalk(_player: Player): void {
    // Subclasses can override this
  }

  onAttack(target: Actor, damage: number): void {
    if (damage > 0) {
      this.game.log(
        `${this.name} attacks ${target.name} for ${damage} hit points.`,
        Pico8Palette.LIGHT_GRAY
      );
    } else {
      this.game.log(
        `${this.name} attacks ${target.name} but it has no effect!`,
        Pico8Palette.LIGHT_GRAY
      );
    }
  }

  onDeath(attacker: StatsActor): void {
    const game = this.game as Game;
    game.log(`${this.name} is dead`, Pico8Palette.LIGHT_GRAY);
    // game.entities.remove(this);

    if (attacker === this.game.player) {
      // Based on DnD xp rules
      const player = game.player as Player;
      const xpGain = Math.round(10 * player.level * 2.0 ** ((this.level - player.level) * 0.5));
      player.addXp(xpGain);
    }

    // Add blood to the map
    // const map = game.tileMap;
    // map.setTile(this.x, this.y, 3, game.rng.nextRange(START_BLOOD, END_BLOOD));

    // Drop loot
    for (let i = 0; i < this.inventory.length; i++) {
      const location = game.findFreeTile(this.x, this.y, 5);
      if (!location) {
        break;
      }
      const loot = this.inventory.get(i);
      loot.x = location.x;
      loot.y = location.y;
      game.entities.add(loot);
    }
  }

  startTurn(): void {
    super.startTurn();
    for (let i = this.buffs.length - 1; i >= 0; i--) {
      const buff = this.buffs[i];
      buff.update();
      if (buff.isDone()) {
        this.buffs.splice(i, 1);
      }
    }
  }

  canEquip(item: Equipment): boolean {
    return item.type === EquipmentType.NONE || this.proficiencies.indexOf(item.type) >= 0;
  }

  equipItem(item: Equipment): boolean {
    if (!this.canEquip(item)) {
      if (this === this.game.player) {
        this.game.log(
          new CompoundMessage(
            new Message('You do not have ', Pico8Palette.LIGHT_GRAY),
            new Message(`[${item.type}]`, Pico8Palette.WHITE),
            new Message(' proficiency', Pico8Palette.LIGHT_GRAY)
          )
        );
      }
      return false;
    }

    const equipped = this.getEquipment(item.slot);
    const oldHp = this.hp;

    if (equipped) {
      this.equipment.remove(equipped);
    }

    this.inventory.remove(item);
    this.equipment.add(item);

    if (equipped) {
      this.inventory.add(equipped);
    }

    // Have to manually restore HP
    // When removing equipment, constitution can drop, which can drop max HP
    // Make sure the player keeps their HP
    this.hp = Math.min(oldHp, this.maxHp);
    return true;
  }

  private addEquipment(item: Equipment): void {
    this.armor += item.armor;
    this.constitution += item.constitution;
    this.dexterity += item.dexterity;
    this.strength += item.strength;
    this.intelligence += item.intelligence;
    this.recalculateMaxHp();
  }

  private removeEquipment(item: Equipment): void {
    this.armor -= item.armor;
    this.constitution -= item.constitution;
    this.dexterity -= item.dexterity;
    this.strength -= item.strength;
    this.intelligence -= item.intelligence;
    this.recalculateMaxHp();
  }

  recalculateMaxHp(): void {
    this.maxHp = 8 + 2 * this.level + this.constitutionModifier;
    this.hp = Math.min(this.hp, this.maxHp);
  }

  draw(): void {
    super.draw();

    for (let i = 0; i < this.buffs.length; i++) {
      this.buffs[i].draw();
    }
  }
}
