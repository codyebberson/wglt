import { ArrayList } from '../../core/arraylist';
import { BaseApp } from '../../core/baseapp';
import { Button } from '../../core/gui/button';
import { Message } from '../../core/message';
import { Rect } from '../../core/rect';
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
    } else {
      this.tooltipMessages = undefined;
    }
    // super.updateTooltip(tooltip);
    return this.tooltipMessages;
  }
}
