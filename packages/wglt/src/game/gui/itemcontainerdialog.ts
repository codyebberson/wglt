import { ArrayList } from '../../core/arraylist';
import { Dialog } from '../../core/gui/dialog';
import { Key } from '../../core/keys';
import { Message } from '../../core/message';
import { Rect } from '../../core/rect';
import { ButtonSlot } from '../../graphics/gui/buttonslot';
import { GraphicsDialogRenderer } from '../../graphics/gui/dialogrenderer';
import { Item } from '../item';
import { ItemButton } from './itembutton';
import { ItemContainerButtonSlot } from './itemcontainerbuttonslot';

const MARGIN = 4;
const BUTTON_SPACING = 2;

export class ItemContainerDialog extends Dialog {
  readonly messages: Message[];
  readonly capacity: number;
  readonly items: ArrayList<Item>;

  constructor(rect: Rect, messages: Message[], capacity: number, items: ArrayList<Item>) {
    super(rect);
    this.messages = messages;
    this.capacity = capacity;
    this.items = items;
    this.modal = true;

    items.addListener({
      onAdd: (_, item) => this.addItem(item),
      onRemove: (_, item) => this.removeItem(item),
    });

    for (let i = 0; i < capacity; i++) {
      // Slots are repositioned at render time
      const key = `Key${String.fromCharCode('A'.charCodeAt(0) + i)}` as Key;
      this.addChild(new ItemContainerButtonSlot(new Rect(0, 0, 24, 24), key));
    }
  }

  private addItem(item: Item): void {
    const existingButton = this.getExistingButton(item);
    if (existingButton) {
      existingButton.stackItems.add(item);
      return;
    }

    const freeSlot = this.getNextFreeSlot();
    if (freeSlot) {
      freeSlot.addChild(new ItemButton(freeSlot.rect.clone(), this.items, item));
    }
  }

  private removeItem(item: Item): void {
    for (let i = 0; i < this.children.length; i++) {
      const buttonSlot = this.children.get(i) as ButtonSlot;
      const button = buttonSlot.button;
      if (button && button instanceof ItemButton) {
        if (button.stackItems.contains(item)) {
          button.stackItems.remove(item);
          if (button.stackItems.length === 0) {
            buttonSlot.removeChild(button);
          }
        }
      }
    }
  }

  private getExistingButton(item: Item): ItemButton | undefined {
    for (let i = 0; i < this.children.length; i++) {
      const buttonSlot = this.children.get(i) as ButtonSlot;
      const button = buttonSlot.button;
      if (button && button instanceof ItemButton) {
        const existing = button.stackItems.get(0);
        if (item.isStackable(existing)) {
          return button;
        }
      }
    }
    return undefined;
  }

  private getNextFreeSlot(): ButtonSlot | undefined {
    for (let i = 0; i < this.children.length; i++) {
      const buttonSlot = this.children.get(i) as ButtonSlot;
      if (!buttonSlot.button) {
        return buttonSlot;
      }
    }
    return undefined;
  }

  drawContents(): void {
    super.drawContents();

    // if (!this.gui || !this.gui.renderer.buttonSlotRect) {
    //   return;
    // }

    if (!this.gui) {
      return;
    }

    const buttonRect = (this.gui.renderer as GraphicsDialogRenderer)?.buttonSlotRect;
    if (!buttonRect) {
      return;
    }

    // Update positions of button slots
    const containerRect = this.rect;
    // const buttonRect = this.gui.renderer.buttonSlotRect;
    let x = containerRect.x + MARGIN;
    let y = containerRect.y + MARGIN;

    for (let i = 0; i < this.messages.length; i++) {
      const msg = this.messages[i];
      this.gui.app.drawString(msg.text, x, y, msg.color);
      y += 10;
    }

    for (let i = 0; i < this.capacity; i++) {
      const child = this.children.get(i);
      child.rect.x = x;
      child.rect.y = y;
      child.rect.width = buttonRect.width;
      child.rect.height = buttonRect.height;

      x += buttonRect.width + BUTTON_SPACING;
      if (x > containerRect.x2 - buttonRect.width - MARGIN) {
        x = containerRect.x + MARGIN;
        y += buttonRect.height + BUTTON_SPACING;
      }
    }

    this.rect.height = y + MARGIN - containerRect.y;
    this.drawChildren();
  }
}
