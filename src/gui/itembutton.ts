import {Item} from '../item';
import {Rect} from '../rect';
import {XArray} from '../xarray';

import {Button} from './button';

export class ItemButton extends Button {
  readonly containerItems: XArray<Item>;
  readonly stackItems: XArray<Item>;

  constructor(rect: Rect, containerItems: XArray<Item>, initialItem: Item) {
    super(rect, initialItem.sprite);
    this.containerItems = containerItems;
    this.stackItems = new XArray<Item>();
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