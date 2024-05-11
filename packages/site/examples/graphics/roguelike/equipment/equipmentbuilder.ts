import { Sprite } from '@wglt/graphics';
import { ItemQuality } from '@wglt/roguelike';
import { Game } from '../game';
import { Equipment } from './equipment';
import { EquipmentSlot } from './equipmentslot';
import {
  AXE_SPRITE_1,
  BOOK_SPRITE,
  BOOTS_SPRITES,
  BOW_SPRITE_1,
  CLOAK_SPRITES,
  CLOTH_HELM_SPRITES,
  CROSSBOW_SPRITE_1,
  DAGGER_SPRITE_1,
  GLOVES_SPRITES,
  LANTERN_SPRITE,
  LEATHER_HELM_SPRITES,
  MACE_SPRITES,
  NECKLACE_SPRITE_1,
  ORB_SPRITE,
  PANTS_SPRITES,
  PLATE_HELM_SPRITES,
  RING_SPRITES,
  ROBE_SPRITES,
  SHIELD_SPRITES,
  SHIRT_SPRITES,
  STAFF_SPRITES,
  SWORD_SPRITES,
} from './equipmentsprites';
import { EquipmentType } from './equipmenttype';

const DEFAULT_SPRITE = new Sprite(160, 240, 16, 16, 1, false);

export class EquipmentBuilder {
  game: Game;
  name = '';
  sprite: Sprite = DEFAULT_SPRITE;
  itemLevel = 1;
  type: EquipmentType = EquipmentType.NONE;
  slot: EquipmentSlot = EquipmentSlot.HEAD;
  quality: ItemQuality = ItemQuality.POOR;
  armor = 0;
  strength = 0;
  dexterity = 0;
  constitution = 0;
  intelligence = 0;
  minDamage = 1;
  maxDamage = 2;
  ranged = false;
  finesse = false;
  statMultiplier = 1.0;

  constructor(game: Game) {
    this.game = game;
  }

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withSprite(s: Sprite): this {
    this.sprite = new Sprite(s.x, s.y, s.width, s.height, s.frames, s.loop, s.ticksPerFrame);
    return this;
  }

  withItemLevel(itemLevel: number): this {
    this.itemLevel = itemLevel;
    return this;
  }

  withType(type: EquipmentType): this {
    this.type = type;
    return this;
  }

  withSlot(slot: EquipmentSlot): this {
    this.slot = slot;
    return this;
  }

  withQuality(quality: ItemQuality): this {
    this.quality = quality;
    return this;
  }

  withArmor(armor: number): this {
    this.armor = armor;
    return this;
  }

  withStrength(strength: number): this {
    this.strength = strength;
    return this;
  }

  withDexterity(dexterity: number): this {
    this.dexterity = dexterity;
    return this;
  }

  withConstitution(constitution: number): this {
    this.constitution = constitution;
    return this;
  }

  withIntelligence(intelligence: number): this {
    this.intelligence = intelligence;
    return this;
  }

  withDamage(minDamage: number, maxDamage: number, ranged?: boolean, finesse?: boolean): this {
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
    this.ranged = !!ranged;
    this.finesse = !!finesse;
    return this;
  }

  withRandomDrop(itemLevel: number, quality?: ItemQuality): this {
    this.itemLevel = itemLevel;
    if (quality !== undefined) {
      this.quality = quality;
    } else {
      this.chooseQuality();
    }
    this.chooseSlot();
    this.chooseFlair();
    return this;
  }

  private chooseQuality(): void {
    const rng = this.game.rng;
    const quality = rng.nextRange(0, 100);
    if (quality > 99) {
      this.quality = ItemQuality.EPIC;
      this.statMultiplier = 1.15;
    } else if (quality > 90) {
      this.quality = ItemQuality.RARE;
      this.statMultiplier = 1.1;
    } else if (quality > 75) {
      this.quality = ItemQuality.UNCOMMON;
      this.statMultiplier = 1.05;
    } else if (quality > 40) {
      this.quality = ItemQuality.COMMON;
      this.statMultiplier = 1.0;
    } else {
      this.quality = ItemQuality.POOR;
      this.statMultiplier = 0.5;
    }
  }

  private chooseSlot(): void {
    switch (this.game.rng.nextRange(0, 10)) {
      case 0:
        this.chooseHead();
        break;
      case 1:
        this.chooseNeck();
        break;
      case 2:
        this.chooseBack();
        break;
      case 3:
        this.chooseChest();
        break;
      case 4:
        this.chooseHands();
        break;
      case 5:
        this.chooseLegs();
        break;
      case 6:
        this.chooseFeet();
        break;
      case 7:
        this.chooseRing();
        break;
      case 8:
        this.chooseMainHand();
        break;
      case 9:
        this.chooseOffHand();
        break;
    }
  }

  private chooseHead(): void {
    this.slot = EquipmentSlot.HEAD;
    switch (this.game.rng.nextRange(0, 3)) {
      case 0:
        this.type = EquipmentType.CLOTH;
        this.name = this.chooseValue('Cowl', 'Crown', 'Hood', 'Wizard Hat');
        this.armor = Math.ceil(1.5 * this.itemLevel * this.statMultiplier);
        this.sprite = this.chooseArrayValue(CLOTH_HELM_SPRITES);
        break;
      case 1:
        this.type = EquipmentType.LEATHER;
        this.name = this.chooseValue('Hood', 'Cover', 'Facemask', 'Mask');
        this.armor = Math.ceil(3.0 * this.itemLevel * this.statMultiplier);
        this.sprite = this.chooseArrayValue(LEATHER_HELM_SPRITES);
        break;
      case 2:
        this.type = EquipmentType.PLATE;
        this.name = this.chooseValue('Helm', 'Helmet', 'Headguard', 'Faceguard', 'Greathelm');
        this.armor = Math.ceil(4.5 * this.itemLevel * this.statMultiplier);
        this.sprite = this.chooseArrayValue(PLATE_HELM_SPRITES);
        break;
    }
  }

  private chooseNeck(): void {
    this.slot = EquipmentSlot.NECK;
    this.name = this.chooseValue('Necklace');
    this.sprite = NECKLACE_SPRITE_1;
  }

  private chooseBack(): void {
    this.slot = EquipmentSlot.BACK;
    this.name = this.chooseValue('Cloak');
    this.sprite = this.chooseArrayValue(CLOAK_SPRITES);
    this.armor = Math.ceil(this.itemLevel * this.statMultiplier);
  }

  private chooseChest(): void {
    this.slot = EquipmentSlot.CHEST;
    switch (this.game.rng.nextRange(0, 3)) {
      case 0:
        this.type = EquipmentType.CLOTH;
        this.name = this.chooseValue('Robe', 'Tunic');
        this.armor = Math.ceil(1.5 * this.itemLevel * this.statMultiplier);
        this.sprite = this.chooseArrayValue(ROBE_SPRITES);
        break;
      case 1:
        this.type = EquipmentType.LEATHER;
        this.name = this.chooseValue('Vest', 'Chestpiece', 'Tunic');
        this.armor = Math.ceil(3.0 * this.itemLevel * this.statMultiplier);
        this.sprite = this.chooseArrayValue(SHIRT_SPRITES);
        break;
      case 2:
        this.type = EquipmentType.PLATE;
        this.name = this.chooseValue('Breastplate', 'Chestguard');
        this.armor = Math.ceil(4.5 * this.itemLevel * this.statMultiplier);
        this.sprite = this.chooseArrayValue(SHIRT_SPRITES);
        break;
    }
  }

  private chooseHands(): void {
    this.slot = EquipmentSlot.HANDS;
    switch (this.game.rng.nextRange(0, 3)) {
      case 0:
        this.type = EquipmentType.CLOTH;
        this.name = this.chooseValue('Gloves', 'Wraps');
        this.armor = Math.ceil(1.0 * this.itemLevel * this.statMultiplier);
        this.sprite = this.chooseArrayValue(GLOVES_SPRITES);
        break;
      case 1:
        this.type = EquipmentType.LEATHER;
        this.name = this.chooseValue('Gloves', 'Gauntlets');
        this.armor = Math.ceil(2.0 * this.itemLevel * this.statMultiplier);
        this.sprite = this.chooseArrayValue(GLOVES_SPRITES);
        break;
      case 2:
        this.type = EquipmentType.PLATE;
        this.name = this.chooseValue('Gloves', 'Gauntlets');
        this.armor = Math.ceil(3.0 * this.itemLevel * this.statMultiplier);
        this.sprite = this.chooseArrayValue(GLOVES_SPRITES);
        break;
    }
  }

  private chooseLegs(): void {
    this.slot = EquipmentSlot.LEGS;
    switch (this.game.rng.nextRange(0, 3)) {
      case 0:
        this.type = EquipmentType.CLOTH;
        this.name = this.chooseValue('Leggings', 'Pants');
        this.armor = Math.ceil(1.0 * this.itemLevel * this.statMultiplier);
        this.sprite = this.chooseArrayValue(PANTS_SPRITES);
        break;
      case 1:
        this.type = EquipmentType.LEATHER;
        this.name = this.chooseValue('Legguards', 'Pants');
        this.armor = Math.ceil(2.0 * this.itemLevel * this.statMultiplier);
        this.sprite = this.chooseArrayValue(PANTS_SPRITES);
        break;
      case 2:
        this.type = EquipmentType.PLATE;
        this.name = this.chooseValue('Legplates', 'Legguards');
        this.armor = Math.ceil(3.0 * this.itemLevel * this.statMultiplier);
        this.sprite = this.chooseArrayValue(PANTS_SPRITES);
        break;
    }
  }

  private chooseFeet(): void {
    this.slot = EquipmentSlot.FEET;
    switch (this.game.rng.nextRange(0, 3)) {
      case 0:
        this.type = EquipmentType.CLOTH;
        this.name = this.chooseValue('Boots', 'Sandals', 'Shoes', 'Slippers', 'Footpads');
        this.armor = Math.ceil(1.0 * this.itemLevel * this.statMultiplier);
        this.sprite = this.chooseArrayValue(BOOTS_SPRITES);
        break;
      case 1:
        this.type = EquipmentType.LEATHER;
        this.name = this.chooseValue('Boots', 'Shoes', 'Treads');
        this.armor = Math.ceil(2.0 * this.itemLevel * this.statMultiplier);
        this.sprite = this.chooseArrayValue(BOOTS_SPRITES);
        break;
      case 2:
        this.type = EquipmentType.PLATE;
        this.name = this.chooseValue('Boots', 'Greaves', 'Sabatons');
        this.armor = Math.ceil(3.0 * this.itemLevel * this.statMultiplier);
        this.sprite = this.chooseArrayValue(BOOTS_SPRITES);
        break;
    }
  }

  private chooseRing(): void {
    this.slot = EquipmentSlot.RING;
    this.name = this.chooseValue('Ring', 'Band', 'Signet', 'Circle', 'Loop');
    this.sprite = this.chooseArrayValue(RING_SPRITES);
  }

  private chooseMainHand(): void {
    this.slot = EquipmentSlot.MAINHAND;
    this.minDamage = Math.floor(1.0 * this.itemLevel * this.statMultiplier);
    this.maxDamage = Math.ceil(1.2 * this.itemLevel * this.statMultiplier);
    switch (this.game.rng.nextRange(0, 7)) {
      case 0:
        this.type = EquipmentType.SWORD;
        this.name = this.chooseValue('Sword', 'Blade', 'Slicer', 'Sabre');
        this.sprite = this.chooseArrayValue(SWORD_SPRITES);
        break;
      case 1:
        this.type = EquipmentType.AXE;
        this.name = this.chooseValue('Axe', 'Ripper', 'Slicer');
        this.sprite = AXE_SPRITE_1;
        break;
      case 2:
        this.type = EquipmentType.MACE;
        this.name = this.chooseValue('Mace', 'Hammer', 'Gavel', 'Club');
        this.sprite = this.chooseArrayValue(MACE_SPRITES);
        break;
      case 3:
        this.type = EquipmentType.DAGGER;
        this.name = this.chooseValue('Dagger', 'Knife', 'Edge');
        this.sprite = DAGGER_SPRITE_1;
        this.finesse = true;
        break;
      case 4:
        this.type = EquipmentType.BOW;
        this.name = this.chooseValue('Bow', 'Shortbow', 'Longbow', 'Recurve', 'Greatbow');
        this.sprite = BOW_SPRITE_1;
        this.finesse = true;
        this.ranged = true;
        break;
      case 5:
        this.type = EquipmentType.CROSSBOW;
        this.name = this.chooseValue('Crossbow', 'Bolt-Thrower', 'Speargun', 'Repeater');
        this.sprite = CROSSBOW_SPRITE_1;
        this.finesse = true;
        this.ranged = true;
        break;
      case 6:
        this.type = EquipmentType.STAFF;
        this.name = this.chooseValue('Staff', 'Spellstaff');
        this.sprite = this.chooseArrayValue(STAFF_SPRITES);
        break;
    }
  }

  private chooseOffHand(): void {
    this.slot = EquipmentSlot.OFFHAND;
    const dice = this.game.rng.nextRange(0, 10);
    if (dice === 9) {
      this.name = 'Lantern';
      this.sprite = LANTERN_SPRITE;
      this.intelligence = Math.ceil(1.0 * this.itemLevel * this.statMultiplier);
    } else if (dice === 8) {
      this.name = 'Orb';
      this.sprite = ORB_SPRITE;
      this.intelligence = Math.ceil(1.0 * this.itemLevel * this.statMultiplier);
    } else if (dice >= 5) {
      this.name = this.chooseValue('Spellbook', 'Tome');
      this.sprite = BOOK_SPRITE;
      this.intelligence = Math.ceil(1.0 * this.itemLevel * this.statMultiplier);
    } else {
      this.name = this.chooseValue('Shield', 'Shield Wall', 'Bulwark', 'Barrier');
      this.type = EquipmentType.SHIELD;
      this.sprite = this.chooseArrayValue(SHIELD_SPRITES);
      this.armor = Math.ceil(2.0 * this.itemLevel * this.statMultiplier);
      this.constitution = Math.ceil(1.0 * this.itemLevel * this.statMultiplier);
    }
  }

  private chooseFlair(): void {
    switch (this.quality) {
      case ItemQuality.POOR:
        this.choosePoorFlair();
        break;
      case ItemQuality.COMMON:
        this.chooseCommonFlair();
        break;
      case ItemQuality.UNCOMMON:
        this.chooseUncommonFlair();
        break;
      case ItemQuality.RARE:
        this.chooseRareFlair();
        break;
      case ItemQuality.EPIC:
        this.chooseEpicFlair();
        break;
      case ItemQuality.LEGENDARY:
        this.chooseLegendaryFlair();
        break;
    }
  }

  private choosePoorFlair(): void {
    this.name = `${this.chooseValue('Patched', 'Ragged', 'Chewed', 'Worn', 'Loose')} ${this.name}`;
  }

  private chooseCommonFlair(): void {
    this.name = `${this.chooseValue('Hunting', 'Cadet', 'Veteran', 'Simple', 'Pioneer')} ${
      this.name
    }`;
  }

  private chooseUncommonFlair(): void {
    switch (this.game.rng.nextRange(0, 10)) {
      case 0:
        this.name += ' of the Tiger';
        this.strength += Math.ceil(this.itemLevel * this.statMultiplier);
        this.dexterity += Math.ceil(this.itemLevel * this.statMultiplier);
        break;
      case 1:
        this.name += ' of the Bear';
        this.strength += Math.ceil(this.itemLevel * this.statMultiplier);
        this.constitution += Math.ceil(this.itemLevel * this.statMultiplier);
        break;
      case 2:
        this.name += ' of the Gorilla';
        this.strength += Math.ceil(this.itemLevel * this.statMultiplier);
        this.intelligence += Math.ceil(this.itemLevel * this.statMultiplier);
        break;
      case 3:
        this.name += ' of the Monkey';
        this.dexterity += Math.ceil(this.itemLevel * this.statMultiplier);
        this.constitution += Math.ceil(this.itemLevel * this.statMultiplier);
        break;
      case 4:
        this.name += ' of the Falcon';
        this.dexterity += Math.ceil(this.itemLevel * this.statMultiplier);
        this.intelligence += Math.ceil(this.itemLevel * this.statMultiplier);
        break;
      case 5:
        this.name += ' of the Eagle';
        this.constitution += Math.ceil(this.itemLevel * this.statMultiplier);
        this.intelligence += Math.ceil(this.itemLevel * this.statMultiplier);
        break;
      case 6:
        this.name += ' of Constitution';
        this.constitution += Math.ceil(2.0 * this.itemLevel * this.statMultiplier);
        break;
      case 7:
        this.name += ' of Strength';
        this.strength += Math.ceil(2.0 * this.itemLevel * this.statMultiplier);
        break;
      case 8:
        this.name += ' of Dexterity';
        this.dexterity += Math.ceil(2.0 * this.itemLevel * this.statMultiplier);
        break;
      case 9:
        this.name += ' of Intelligence';
        this.intelligence += Math.ceil(2.0 * this.itemLevel * this.statMultiplier);
        break;
    }
  }

  private chooseRareFlair(): void {
    switch (this.game.rng.nextRange(0, 4)) {
      case 0:
        this.name = `Elven ${this.name}`;
        this.dexterity += Math.ceil(this.itemLevel * this.statMultiplier);
        this.constitution += Math.ceil(this.itemLevel * this.statMultiplier);
        this.intelligence += Math.ceil(this.itemLevel * this.statMultiplier);
        break;
      case 1:
        this.name = `Obsidian ${this.name}`;
        this.strength += Math.ceil(1.5 * this.itemLevel * this.statMultiplier);
        this.constitution += Math.ceil(1.5 * this.itemLevel * this.statMultiplier);
        break;
      case 2:
        this.name = `Saphiron ${this.name}`;
        this.dexterity += Math.ceil(1.5 * this.itemLevel * this.statMultiplier);
        this.constitution += Math.ceil(1.5 * this.itemLevel * this.statMultiplier);
        break;
      case 3:
        this.name = `Scarlet ${this.name}`;
        this.intelligence += Math.ceil(1.5 * this.itemLevel * this.statMultiplier);
        this.constitution += Math.ceil(1.5 * this.itemLevel * this.statMultiplier);
        break;
    }
  }

  private chooseEpicFlair(): void {
    this.name = `Cody's ${this.name}`;
    this.dexterity += Math.ceil(2.0 * this.itemLevel * this.statMultiplier);
    this.strength += Math.ceil(2.0 * this.itemLevel * this.statMultiplier);
    this.intelligence += Math.ceil(2.0 * this.itemLevel * this.statMultiplier);
    this.constitution += Math.ceil(2.0 * this.itemLevel * this.statMultiplier);
  }

  private chooseLegendaryFlair(): void {
    this.name = `Cody's ${this.name}`;
    this.dexterity += Math.ceil(2.5 * this.itemLevel * this.statMultiplier);
    this.strength += Math.ceil(2.5 * this.itemLevel * this.statMultiplier);
    this.intelligence += Math.ceil(2.5 * this.itemLevel * this.statMultiplier);
    this.constitution += Math.ceil(2.5 * this.itemLevel * this.statMultiplier);
  }

  private chooseValue<T>(...values: T[]): T {
    return values[this.game.rng.nextRange(0, values.length)];
  }

  private chooseArrayValue<T>(values: T[]): T {
    return values[this.game.rng.nextRange(0, values.length)];
  }

  build(): Equipment {
    return new Equipment(this);
  }
}
