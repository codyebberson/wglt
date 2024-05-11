import { ArrayList } from '@wglt/core';
import { Rect } from '@wglt/core';
import { Button } from '@wglt/graphics';
import { TooltipDialog } from '@wglt/graphics';
import { Item } from '../item';

export class ItemButton extends Button {
  readonly containerItems: ArrayList<Item>;
  readonly stackItems: ArrayList<Item>;

  constructor(rect: Rect, containerItems: ArrayList<Item>, initialItem: Item) {
    super(rect, initialItem.sprite);
    this.containerItems = containerItems;
    this.stackItems = new ArrayList<Item>();
    this.stackItems.add(initialItem);
    this.tooltipMessages = initialItem.tooltipMessages;
  }

  click(): void {
    if (this.stackItems.length > 0) {
      const item = this.stackItems.get(0);
      const player = item.game.player;
      if (player) {
        player.use(item);
      }
    }
  }

  removeAll(): void {
    for (let i = this.stackItems.length - 1; i >= 0; i--) {
      this.containerItems.remove(this.stackItems.get(i));
    }
  }

  drawContents(): void {
    if (!this.gui) {
      return;
    }

    super.drawContents();

    if (this.stackItems.length > 1) {
      const dst = this.rect;
      this.gui.app.drawRightString(this.stackItems.length.toString(), dst.x2 - 3, dst.y2 - 10);
    }
  }

  updateTooltip(tooltip: TooltipDialog): void {
    if (this.stackItems.length > 0) {
      const item = this.stackItems.get(0);
      item.onUpdateTooltip();
      this.tooltipMessages = item.tooltipMessages;
    }
    super.updateTooltip(tooltip);
  }
}
