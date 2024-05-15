import { ArrayList } from '@wglt/core';
import { Rect } from '@wglt/core';
import { Button } from '@wglt/graphics';
import { Item } from '../item';

export class ItemShortcutButton extends Button {
  readonly containerItems: ArrayList<Item>;
  readonly shortcutItem: Item;

  constructor(rect: Rect, containerItems: ArrayList<Item>, shortcutItem: Item) {
    super(rect, shortcutItem.sprite);
    this.containerItems = containerItems;
    this.shortcutItem = shortcutItem;
    this.tooltipMessages = shortcutItem.tooltipMessages;
  }

  click(): void {
    const item = this.getItem();
    if (item) {
      const player = item.game.player;
      if (player) {
        player.use(item);
      }
    }
  }

  drawContents(): void {
    if (!this.gui) {
      return;
    }

    super.drawContents();

    if (!this.isDragging()) {
      const dst = this.rect;
      const count = this.countItems();
      this.gui.app.drawRightString(count.toString(), dst.x2 - 3, dst.y2 - 10);
    }
  }

  private getItem(): Item | undefined {
    for (let i = 0; i < this.containerItems.length; i++) {
      const item = this.containerItems.get(i);
      if (this.shortcutItem.isStackable(item)) {
        return item;
      }
    }
    return undefined;
  }

  private countItems(): number {
    let count = 0;
    for (let i = 0; i < this.containerItems.length; i++) {
      if (this.shortcutItem.isStackable(this.containerItems.get(i))) {
        count++;
      }
    }
    return count;
  }
}
