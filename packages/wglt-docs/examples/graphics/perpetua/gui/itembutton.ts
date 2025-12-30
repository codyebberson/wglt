import { ArrayList, Button, Component, GraphicsApp, GUI, Message, Rect, type Renderer } from 'wglt';
import type { Item } from '../item';

export class ItemButton extends Button {
  readonly containerItems: ArrayList<Item>;
  readonly stackItems: ArrayList<Item>;

  constructor(rect: Rect, containerItems: ArrayList<Item>, initialItem: Item) {
    super(rect, initialItem.sprite);
    this.containerItems = containerItems;
    this.stackItems = new ArrayList<Item>();
    this.stackItems.add(initialItem);
    // this.tooltipMessages = initialItem.tooltipMessages;
    // this.tooltip = initialItem.too
    // this.tool
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

  // draw(app: BaseApp): void {
  //   super.draw(app);

  //   if (this.stackItems.length > 1) {
  //     const dst = this.rect;
  //     app.drawRightString(dst.x2 - 3, dst.y2 - 10, this.stackItems.length.toString());
  //   }
  // }

  decorateTooltip(gui: GUI): Component | undefined {
    let tooltipMessages: Message[] | undefined;
    if (this.stackItems.length > 0) {
      const item = this.stackItems.get(0);
      item.onUpdateTooltip();
      // this.tooltipMessages = item.tooltipMessages;
      // if (item.tooltipMessages) {
      //   this.tooltip = this.gui.fromMessages(item.tooltipMessages);
      // }
      tooltipMessages = item.tooltipMessages;
      // } else {
      //   this.tooltipMessages = undefined;
    }

    if (tooltipMessages) {
      // tooltipPanel.addChild(this.gui.fromMessages(tooltipMessages));
      // tooltipPanel.visible = true;
      return gui.fromMessages(tooltipMessages);
    } else {
      // tooltipPanel.visible = false;
      return undefined;
    }

    //   // super.updateTooltip(tooltip);
    //   return this.tooltipMessages;

    // if (!this.tooltip) {
    //   // this.tooltip = this.gui.fromMessages(this)
    // }
  }
}

export class GraphicsItemButtonRenderer implements Renderer<GraphicsApp, ItemButton> {
  render(_gui: GUI<GraphicsApp>, _itemButton: ItemButton): void {
    // itemButton.draw(app);
    // super.draw(app);
    // if (this.stackItems.length > 1) {
    //   const dst = this.rect;
    //   app.drawRightString(dst.x2 - 3, dst.y2 - 10, this.stackItems.length.toString());
    // }
  }
}
