import { ArrayList, Button, Container, FONT_04B03, GraphicsApp, GUI, Rect } from 'wglt';
import { Item } from '../item';

export class ItemShortcutButton extends Button {
  readonly containerItems: ArrayList<Item>;
  readonly shortcutItem: Item;

  constructor(rect: Rect, containerItems: ArrayList<Item>, shortcutItem: Item) {
    super(rect, shortcutItem.sprite);
    this.containerItems = containerItems;
    this.shortcutItem = shortcutItem;
    this.tooltip = shortcutItem.tooltipMessages
      ? Container.fromMessages(shortcutItem.tooltipMessages)
      : undefined;
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

  render(gui: GUI<GraphicsApp>): void {
    gui.drawComponent(this, Button);

    const app = gui.context;
    const font = FONT_04B03;
    const dst = this.screenRect;
    const count = this.countItems();
    app.drawRightString(font, dst.x2 - 3, dst.y2 - 10, count.toString());
  }
}
