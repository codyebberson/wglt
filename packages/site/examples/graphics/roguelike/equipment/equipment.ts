import { Pico8Palette } from '@wglt/core';
import { CompoundMessage, Message } from '@wglt/graphics';
import { Item } from '@wglt/roguelike';
import { Player } from '../entities/player';
import { Game } from '../game';
import { EquipmentBuilder } from './equipmentbuilder';
import { EquipmentSlot } from './equipmentslot';
import { EquipmentType } from './equipmenttype';

export class Equipment extends Item {
  readonly type: EquipmentType;
  readonly slot: EquipmentSlot;
  readonly armor: number;
  readonly strength: number;
  readonly dexterity: number;
  readonly constitution: number;
  readonly intelligence: number;
  readonly minDamage: number;
  readonly maxDamage: number;
  readonly ranged: boolean;
  readonly finesse: boolean;

  constructor(builder: EquipmentBuilder) {
    const sellPrice = 10 * builder.itemLevel;
    super(
      builder.game,
      builder.name,
      builder.sprite,
      builder.quality,
      builder.itemLevel,
      0,
      sellPrice
    );
    this.type = builder.type;
    this.slot = builder.slot;
    this.armor = builder.armor;
    this.strength = builder.strength;
    this.dexterity = builder.dexterity;
    this.constitution = builder.constitution;
    this.intelligence = builder.intelligence;
    this.minDamage = builder.minDamage;
    this.maxDamage = builder.maxDamage;
    this.ranged = builder.ranged;
    this.finesse = builder.finesse;
    this.onUpdateTooltip();
  }

  isStackable(): boolean {
    return false;
  }

  onUse(player: Player): boolean {
    return player.equipItem(this);
  }

  onUpdateTooltip(): void {
    const game = this.game as Game;
    const player = game.player as Player;
    const equipped = player.getEquipment(this.slot);
    if (equipped && equipped !== this) {
      this.buildComparisonTooltip(equipped);
    } else {
      this.buildNormalTooltip();
    }
  }

  private buildComparisonTooltip(equipped: Equipment): void {
    this.tooltipMessages = [];
    this.tooltipMessages.push(new Message(this.name, this.getColor(this.quality)));
    this.tooltipMessages.push(
      new CompoundMessage(
        new Message(`Item Level ${this.itemLevel}`, Pico8Palette.YELLOW),
        compMessage(this.itemLevel, equipped.itemLevel)
      )
    );

    if (this.type === EquipmentType.NONE) {
      this.tooltipMessages.push(new Message(this.slot, Pico8Palette.WHITE));
    } else {
      this.tooltipMessages.push(new Message(`${this.slot}, ${this.type}`, Pico8Palette.WHITE));
    }

    if (this.slot === EquipmentSlot.MAINHAND) {
      this.tooltipMessages.push(
        new CompoundMessage(
          new Message(`${this.minDamage}-${this.maxDamage} Damage`, Pico8Palette.YELLOW),
          compMessage(this.minDamage, equipped.minDamage)
        )
      );
    }

    if (this.armor > 0 || equipped.armor > 0) {
      this.tooltipMessages.push(
        new CompoundMessage(
          new Message(`${this.armor} Armor`, Pico8Palette.YELLOW),
          compMessage(this.armor, equipped.armor)
        )
      );
    }

    if (this.strength > 0 || equipped.strength > 0) {
      this.tooltipMessages.push(
        new CompoundMessage(
          new Message(`${this.strength} Strength`, Pico8Palette.GREEN),
          compMessage(this.strength, equipped.strength)
        )
      );
    }

    if (this.dexterity > 0 || equipped.dexterity > 0) {
      this.tooltipMessages.push(
        new CompoundMessage(
          new Message(`${this.dexterity} Dexterity`, Pico8Palette.GREEN),
          compMessage(this.dexterity, equipped.dexterity)
        )
      );
    }

    if (this.constitution > 0 || equipped.constitution > 0) {
      this.tooltipMessages.push(
        new CompoundMessage(
          new Message(`${this.constitution} Constitution`, Pico8Palette.GREEN),
          compMessage(this.constitution, equipped.constitution)
        )
      );
    }

    if (this.intelligence > 0 || equipped.intelligence > 0) {
      this.tooltipMessages.push(
        new CompoundMessage(
          new Message(`${this.intelligence} Intelligence`, Pico8Palette.GREEN),
          compMessage(this.intelligence, equipped.intelligence)
        )
      );
    }

    if (this.sellPrice > 0 || equipped.sellPrice > 0) {
      this.tooltipMessages.push(
        new CompoundMessage(
          new Message(`Sell Price: ${this.sellPrice}`, Pico8Palette.WHITE),
          compMessage(this.sellPrice, equipped.sellPrice)
        )
      );
    }
  }

  private buildNormalTooltip(): void {
    this.tooltipMessages = [];
    this.tooltipMessages.push(new Message(this.name, this.getColor(this.quality)));
    this.tooltipMessages.push(new Message(`Item Level ${this.itemLevel}`, Pico8Palette.YELLOW));

    if (this.type === EquipmentType.NONE) {
      this.tooltipMessages.push(new Message(this.slot, Pico8Palette.WHITE));
    } else {
      this.tooltipMessages.push(new Message(`${this.slot}, ${this.type}`, Pico8Palette.WHITE));
    }

    if (this.slot === EquipmentSlot.MAINHAND) {
      this.tooltipMessages.push(
        new Message(`${this.minDamage}-` + `${this.maxDamage} Damage`, Pico8Palette.YELLOW)
      );
    }

    if (this.armor > 0) {
      this.tooltipMessages.push(new Message(`${this.armor} Armor`, Pico8Palette.YELLOW));
    }

    if (this.strength > 0) {
      this.tooltipMessages.push(new Message(`+${this.strength} Strength`, Pico8Palette.GREEN));
    }

    if (this.dexterity > 0) {
      this.tooltipMessages.push(new Message(`+${this.dexterity} Dexterity`, Pico8Palette.GREEN));
    }

    if (this.constitution > 0) {
      this.tooltipMessages.push(
        new Message(`+${this.constitution} Constitution`, Pico8Palette.GREEN)
      );
    }

    if (this.intelligence > 0) {
      this.tooltipMessages.push(
        new Message(`+${this.intelligence} Intelligence`, Pico8Palette.GREEN)
      );
    }

    if (this.sellPrice > 0) {
      this.tooltipMessages.push(new Message(`Sell Price: ${this.sellPrice}`, Pico8Palette.WHITE));
    }
  }
}

function compMessage(current: number, equipped: number): Message {
  if (current === equipped) {
    return new Message('', Pico8Palette.WHITE);
  }
  if (current < equipped) {
    return new Message(` (-${equipped - current})`, Pico8Palette.RED);
  }
  return new Message(` (+${current - equipped})`, Pico8Palette.GREEN);
}
