import { ArrayList } from '../../core/arraylist';
import { BaseApp } from '../../core/baseapp';
import { Button } from '../../core/gui/button';
import { Rect } from '../../core/rect';
import { Item } from '../item';

export class ItemShortcutButton extends Button {
  readonly containerItems: ArrayList<Item>;
  readonly shortcutItem: Item;

  constructor(rect: Rect, containerItems: ArrayList<Item>, shortcutItem: Item) {
    super(rect, shortcutItem.sprite);
    this.containerItems = containerItems;
    this.shortcutItem = shortcutItem;
    this.tooltipMessages = shortcutItem.tooltipMessages;
    this.draggable = true;
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

  draw(app: BaseApp): void {
    super.draw(app);

    if (!this.isDragging()) {
      const dst = this.rect;
      const count = this.countItems();
      app.drawRightString(dst.x2 - 3, dst.y2 - 10, count.toString());
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
