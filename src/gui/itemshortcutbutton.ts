import {Item} from '../item';
import {Rect} from '../rect';
import {XArray} from '../xarray';

import {Button} from './button';

export class ItemShortcutButton extends Button {
  // readonly originalButton: Button;

  readonly containerItems: XArray<Item>;
  readonly shortcutItem: Item;

  constructor(rect: Rect, containerItems: XArray<Item>, shortcutItem: Item) {
    super(rect, shortcutItem.sprite);
    // this.originalButton = originalButton;
    this.containerItems = containerItems;
    this.shortcutItem = shortcutItem;
  }

  // drawContents() {
  //   const tempX = this.originalButton.rect.x;
  //   const tempY = this.originalButton.rect.y;

  //   this.originalButton.rect.x = this.rect.x;
  //   this.originalButton.rect.y = this.rect.y;
  //   this.originalButton.drawContents();
  //   this.originalButton.rect.x = tempX;
  //   this.originalButton.rect.y = tempY;
  // }

  // click() {
  //   this.originalButton.click();
  // }

  click() {
    // if (this.stackItems.length > 0) {
    //   const item = this.stackItems.get(0);
    //   const player = item.game.player;
    //   if (player) {
    //     player.use(item);
    //   }
    // }
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

    // if (this.stackItems.length > 1) {
    const dst = this.rect;
    const count = this.countItems();
    this.gui.app.drawString(count.toString(), dst.x2 - 7, dst.y2 - 10);
    // }
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