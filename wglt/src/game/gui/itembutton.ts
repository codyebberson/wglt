import { ArrayList } from '../../core/arraylist';
import { Button } from '../../core/gui/button';
import { Container } from '../../core/gui/container';
import { GUI } from '../../core/gui/gui';
import { Panel } from '../../core/gui/panel';
import { Renderer } from '../../core/gui/renderer';
import { Message } from '../../core/message';
import { Rect } from '../../core/rect';
import { GraphicsApp } from '../../graphics/graphicsapp';
import { Item } from '../item';

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

  decorateTooltip(tooltipPanel: Panel): void {
    let tooltipMessages: Message[] | undefined = undefined;
    if (this.stackItems.length > 0) {
      const item = this.stackItems.get(0);
      item.onUpdateTooltip();
      // this.tooltipMessages = item.tooltipMessages;
      // if (item.tooltipMessages) {
      //   this.tooltip = Container.fromMessages(item.tooltipMessages);
      // }
      tooltipMessages = item.tooltipMessages;
      // } else {
      //   this.tooltipMessages = undefined;
    }

    if (tooltipMessages) {
      tooltipPanel.addChild(Container.fromMessages(tooltipMessages));
      tooltipPanel.visible = true;
    } else {
      tooltipPanel.visible = false;
    }

    //   // super.updateTooltip(tooltip);
    //   return this.tooltipMessages;

    // if (!this.tooltip) {
    //   // this.tooltip = Container.fromMessages(this)
    // }
  }
}

export class GraphicsItemButtonRenderer implements Renderer<GraphicsApp, ItemButton> {
  render(gui: GUI<GraphicsApp>, itemButton: ItemButton): void {
    // itemButton.draw(app);
    // super.draw(app);
    // if (this.stackItems.length > 1) {
    //   const dst = this.rect;
    //   app.drawRightString(dst.x2 - 3, dst.y2 - 10, this.stackItems.length.toString());
    // }
  }
}
