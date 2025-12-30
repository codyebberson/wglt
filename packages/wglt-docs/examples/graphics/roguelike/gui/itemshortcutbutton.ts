import { ArrayList, Button, Component, GraphicsApp, GUI, Rect } from 'wglt';
import { Item } from '../item';

export class ItemShortcutButton extends Button {
  readonly containerItems: ArrayList<Item>;
  readonly shortcutItem: Item;

  constructor(rect: Rect, containerItems: ArrayList<Item>, shortcutItem: Item) {
    super(rect, shortcutItem.sprite);
    this.containerItems = containerItems;
    this.shortcutItem = shortcutItem;
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

  getItem(): Item | undefined {
    for (let i = 0; i < this.containerItems.length; i++) {
      const item = this.containerItems.get(i);
      if (this.shortcutItem.isStackable(item)) {
        return item;
      }
    }
    return undefined;
  }

  countItems(): number {
    let count = 0;
    for (let i = 0; i < this.containerItems.length; i++) {
      if (this.shortcutItem.isStackable(this.containerItems.get(i))) {
        count++;
      }
    }
    return count;
  }

  decorateTooltip(gui: GUI): Component | undefined {
    if (!this.tooltip) {
      this.tooltip = this.shortcutItem.tooltipMessages
        ? gui.fromMessages(this.shortcutItem.tooltipMessages)
        : undefined;
    }
    return this.tooltip;
  }

  render(gui: GUI<GraphicsApp>): void {
    gui.drawComponent(this, Button);

    const app = gui.context;
    const dst = this.screenRect;
    const count = this.countItems();
    app.drawRightString(dst.x2 - 3, dst.y2 - 10, count.toString());
  }
}
