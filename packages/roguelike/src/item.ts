import { Color, SimplePalette, fromRgb } from '@wglt/core';
import { Sprite } from '@wglt/graphics';
import { CompoundMessage, Message } from '@wglt/graphics';
import { Actor } from './actor';
import { BaseGame } from './basegame';
import { Entity } from './entity';
import { ItemQuality } from './itemquality';

const COLOR_POOR = fromRgb(0x9d, 0x9d, 0x9d);
const COLOR_COMMON = fromRgb(0xff, 0xff, 0xff);
const COLOR_UNCOMMON = fromRgb(0x1e, 0xff, 0x00);
const COLOR_RARE = fromRgb(0x00, 0x70, 0xdd);
const COLOR_EPIC = fromRgb(0xa3, 0x35, 0xee);
const COLOR_LEGENDARY = fromRgb(0xff, 0x80, 0x00);

export abstract class Item extends Entity {
  tooltipMessages?: Message[];
  readonly quality: ItemQuality;
  readonly itemLevel: number;
  readonly maxStack: number;
  readonly sellPrice: number;
  readonly gold: number;

  constructor(
    game: BaseGame,
    name: string,
    sprite: Sprite,
    quality?: ItemQuality,
    itemLevel?: number,
    maxStack?: number,
    sellPrice?: number,
    gold?: number
  ) {
    super(game, 0, 0, name, sprite, false);
    this.quality = quality || ItemQuality.COMMON;
    this.itemLevel = itemLevel || 0;
    this.maxStack = maxStack || 0;
    this.sellPrice = sellPrice || 0;
    this.gold = gold || 0;
    this.onUpdateTooltip();
  }

  /**
   * Returns true if this item can be stacked with the other item
   * in containers such as chests and bags.
   *
   * By default, items are stackable if they have the same name.
   * Overriding classes can change this logic.
   *
   * @param other Other item to stack with.
   */
  isStackable(other: Item): boolean {
    return this.name === other.name;
  }

  onBump(player: Actor): boolean {
    player.pickup(this);
    player.moveToward(this.x, this.y);
    return true;
  }

  onUse(_user: Actor): boolean {
    return false;
  }

  onPickup(entity: Actor): void {
    this.game.log(
      new CompoundMessage(
        new Message(`${entity.name} picked up `, SimplePalette.WHITE),
        new Message(`[${this.name}]`, this.getColor(this.quality))
      )
    );

    // TODO: How to expose this to library users?
    // const start = new Vec2(this.pixelX - this.game.viewport.x, this.pixelY - this.game.viewport.y);
    // const end = new Vec2(this.game.app.size.width - 16, this.game.app.size.height - 24);
    // this.game.animations.push(new GuiSlideAnimation(this.sprite, start, end, 15));
  }

  getColor(quality: ItemQuality): Color {
    switch (quality) {
      case ItemQuality.COMMON:
        return COLOR_COMMON;
      case ItemQuality.UNCOMMON:
        return COLOR_UNCOMMON;
      case ItemQuality.RARE:
        return COLOR_RARE;
      case ItemQuality.EPIC:
        return COLOR_EPIC;
      case ItemQuality.LEGENDARY:
        return COLOR_LEGENDARY;
      default:
        return COLOR_POOR;
    }
  }

  onUpdateTooltip(): void {
    this.tooltipMessages = [];
    this.tooltipMessages.push(new Message(this.name, this.getColor(this.quality)));
    this.tooltipMessages.push(new Message(`Item Level ${this.itemLevel}`, SimplePalette.YELLOW));

    this.addTooltipDescription(this.tooltipMessages);

    if (this.maxStack > 1) {
      this.tooltipMessages.push(new Message(`Max Stack: ${this.maxStack}`, SimplePalette.WHITE));
    }

    if (this.sellPrice > 0) {
      this.tooltipMessages.push(new Message(`Sell Price: ${this.sellPrice}`, SimplePalette.WHITE));
    }
  }

  addTooltipDescription(_tooltipMessages: Message[]): void {
    // Override this method to add a description to the tooltip.
  }
}
