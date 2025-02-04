import {
  ArrayList,
  Button,
  Container,
  GUI,
  GraphicsApp,
  GraphicsButtonRenderer,
  Message,
  Panel,
  Rect,
} from 'wglt';
import { Item } from '../item';

export class ItemButton extends Button {
  readonly containerItems: ArrayList<Item>;
  readonly stackItems: ArrayList<Item>;

  constructor(rect: Rect, containerItems: ArrayList<Item>, initialItem: Item) {
    super(rect, initialItem.sprite);
    this.containerItems = containerItems;
    this.stackItems = new ArrayList<Item>();
    this.stackItems.add(initialItem);
    this.tooltip = initialItem.tooltipMessages
      ? Container.fromMessages(initialItem.tooltipMessages)
      : undefined;
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

  decorateTooltip(tooltipPanel: Panel): void {
    let tooltipMessages: Message[] | undefined = undefined;
    if (this.stackItems.length > 0) {
      const item = this.stackItems.get(0);
      tooltipMessages = item.tooltipMessages;
    }

    if (tooltipMessages) {
      tooltipPanel.addChild(Container.fromMessages(tooltipMessages));
      tooltipPanel.visible = true;
    } else {
      tooltipPanel.visible = false;
    }
  }
}

export class ItemButtonRenderer extends GraphicsButtonRenderer {
  render(gui: GUI<GraphicsApp>, component: ItemButton): void {
    super.render(gui, component);

    const app = gui.context;
    const stackItems = component.stackItems;

    if (stackItems.length > -1) {
      const dst = component.screenRect;
      app.drawRightString(dst.x2 - 3, dst.y2 - 10, stackItems.length.toString());
    }
  }
}
