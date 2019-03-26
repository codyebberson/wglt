import {ArrayList} from '../arraylist';
import {Item} from '../item';
import {Rect} from '../rect';

import {Button} from './button';

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

  click() {
    if (this.stackItems.length > 0) {
      const item = this.stackItems.get(0);
      const player = item.game.player;
      if (player) {
        player.use(item);
      }
    }
  }

  removeAll() {
    for (let i = this.stackItems.length - 1; i >= 0; i--) {
      this.containerItems.remove(this.stackItems.get(i));
    }
  }

  drawContents() {
    if (!this.gui) {
      return;
    }

    super.drawContents();

    if (this.stackItems.length > 1) {
      const dst = this.rect;
      this.gui.app.drawRightString(this.stackItems.length.toString(), dst.x2 - 3, dst.y2 - 10);
    }
  }
}