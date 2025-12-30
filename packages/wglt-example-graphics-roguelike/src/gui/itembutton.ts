import { ArrayList, Button, Component, GraphicsApp, GUI, Message, Rect } from 'wglt';
import { Item } from '../item';

export class ItemButton extends Button {
  readonly containerItems: ArrayList<Item>;
  readonly stackItems: ArrayList<Item>;

  constructor(rect: Rect, containerItems: ArrayList<Item>, initialItem: Item) {
    super(rect, initialItem.sprite);
    this.containerItems = containerItems;
    this.stackItems = new ArrayList<Item>();
    this.stackItems.add(initialItem);
    this.draggable = true;
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

  decorateTooltip(gui: GUI): Component | undefined {
    let tooltipMessages: Message[] | undefined;
    if (this.stackItems.length > 0) {
      const item = this.stackItems.get(0);
      tooltipMessages = item.tooltipMessages;
    }

    if (tooltipMessages) {
      return gui.fromMessages(tooltipMessages);
    } else {
      return undefined;
    }
  }

  render(gui: GUI<GraphicsApp>): void {
    gui.drawComponent(this, Button);

    const app = gui.context;
    const stackItems = this.stackItems;

    if (stackItems.length > -1) {
      const dst = this.screenRect;
      app.drawRightString(dst.x2 - 3, dst.y2 - 10, stackItems.length.toString());
    }
  }
}
