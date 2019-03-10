import {ArrayList} from '../arraylist';
import {Item} from '../item';
import {Rect} from '../rect';

import {Button} from './button';

export class ItemShortcutButton extends Button {
  readonly containerItems: ArrayList<Item>;
  readonly shortcutItem: Item;

  constructor(rect: Rect, containerItems: ArrayList<Item>, shortcutItem: Item) {
    super(rect, shortcutItem.sprite);
    this.containerItems = containerItems;
    this.shortcutItem = shortcutItem;
    this.tooltipMessages = shortcutItem.tooltipMessages;
  }

  click() {
    const item = this.getItem();
    if (item) {
      const player = item.game.player;
      if (player) {
        player.use(item);
      }
    }
  }

  drawContents() {
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

  private getItem() {
    for (let i = 0; i < this.containerItems.length; i++) {
      const item = this.containerItems.get(i);
      if (item.name === this.shortcutItem.name) {
        return item;
      }
    }
    return undefined;
  }

  private countItems() {
    let count = 0;
    for (let i = 0; i < this.containerItems.length; i++) {
      if (this.containerItems.get(i).name === this.shortcutItem.name) {
        count++;
      }
    }
    return count;
  }
}