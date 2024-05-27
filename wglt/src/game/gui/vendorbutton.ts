import { ArrayList } from '../../core/arraylist';
import { BaseApp } from '../../core/baseapp';
import { Button } from '../../core/gui/button';
import { Message } from '../../core/message';
import { SimplePalette } from '../../core/palettes/simple';
import { Rect } from '../../core/rect';
import { Actor } from '../actor';
import { Item } from '../item';

export class VendorButton extends Button {
  readonly vendor: Actor;
  readonly stackItems: ArrayList<Item>;

  constructor(rect: Rect, vendor: Actor, initialItem: Item) {
    super(rect, initialItem.sprite);
    this.vendor = vendor;
    this.stackItems = new ArrayList<Item>();
    this.stackItems.add(initialItem);
    this.tooltipMessages = initialItem.tooltipMessages;
  }

  getFirstItem(): Item | undefined {
    return this.stackItems.length > 0 ? this.stackItems.get(0) : undefined;
  }

  click(): void {
    const item = this.getFirstItem();
    if (!item || !(item instanceof Item)) {
      return;
    }

    const game = item.game;
    const player = game.player as Actor;
    if (player.gold < item.sellPrice) {
      game.log('Insufficient funds', SimplePalette.RED);
      return;
    }

    this.vendor.inventory.remove(item);
    player.inventory.add(item);
    player.gold -= item.sellPrice;
    this.vendor.gold += item.sellPrice;
    game.log(`Purchased ${item.name}`);
  }

  draw(app: BaseApp): void {
    super.draw(app);

    if (this.stackItems.length > 1) {
      const dst = this.rect;
      app.drawRightString(dst.x2 - 3, dst.y2 - 10, this.stackItems.length.toString());
    }
  }

  updateTooltip(): Message[] | undefined {
    if (this.stackItems.length > 0) {
      const item = this.stackItems.get(0);
      item.onUpdateTooltip();
      this.tooltipMessages = item.tooltipMessages;
    }
    // super.updateTooltip(tooltip);
    return this.tooltipMessages;
  }
}
