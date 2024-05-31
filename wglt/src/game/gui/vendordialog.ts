import { ArrayList } from '../../core/arraylist';
import { BaseApp } from '../../core/baseapp';
import { ButtonSlot } from '../../core/gui/buttonslot';
import { Dialog } from '../../core/gui/dialog';
import { Key } from '../../core/keys';
import { Message } from '../../core/message';
import { SimplePalette } from '../../core/palettes/simple';
import { Rect } from '../../core/rect';
import { Actor } from '../actor';
import { Item } from '../item';
import { VendorButton } from './vendorbutton';

const MARGIN = 4;
const BUTTON_SPACING = 2;
const PAGE_SIZE = 5;

export class VendorDialog extends Dialog {
  readonly vendor: Actor;
  readonly items: ArrayList<Item>;
  readonly messages: Message[];

  constructor(rect: Rect, vendor: Actor) {
    super(rect);
    this.vendor = vendor;
    this.items = vendor.inventory;

    for (let i = 0; i < PAGE_SIZE; i++) {
      // Slots are repositioned at render time
      const key = `Key${String.fromCharCode('A'.charCodeAt(0) + i)}` as Key;
      this.addChild(new ButtonSlot(new Rect(0, 0, 24, 24), key));
    }

    // Add initial items
    for (let i = 0; i < vendor.inventory.length; i++) {
      this.addItem(vendor.inventory.get(i));
    }

    this.items.addListener({
      onAdd: (_, item) => this.addItem(item),
      onRemove: (_, item) => this.removeItem(item),
    });

    this.messages = [new Message('How are ya?', SimplePalette.WHITE)];
  }

  private addItem(item: Item): void {
    const existingButton = this.getExistingButton(item);
    if (existingButton) {
      existingButton.stackItems.add(item);
      return;
    }

    const freeSlot = this.getNextFreeSlot();
    if (freeSlot) {
      freeSlot.addChild(new VendorButton(freeSlot.rect.clone(), this.vendor, item));
    }
  }

  private removeItem(item: Item): void {
    for (let i = 0; i < this.children.length; i++) {
      const buttonSlot = this.children.get(i) as ButtonSlot;
      const button = buttonSlot.button;
      if (button && button instanceof VendorButton) {
        if (button.stackItems.contains(item)) {
          button.stackItems.remove(item);
          if (button.stackItems.length === 0) {
            buttonSlot.removeChild(button);
          }
        }
      }
    }
  }

  private getExistingButton(item: Item): VendorButton | undefined {
    for (let i = 0; i < this.children.length; i++) {
      const buttonSlot = this.children.get(i) as ButtonSlot;
      const button = buttonSlot.button;
      if (button && button instanceof VendorButton) {
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

  draw(app: BaseApp): void {
    super.draw(app);

    // const buttonRect = (this.gui.renderer as GraphicsDialogRenderer)?.buttonSlotRect;
    // if (!buttonRect) {
    //   return;
    // }

    // TODO
    const buttonRect = new Rect(0, 32, 48, 48);

    // Update positions of button slots
    const containerRect = this.rect;
    const x = containerRect.x + MARGIN;
    let y = containerRect.y + MARGIN;

    for (let i = 0; i < this.messages.length; i++) {
      const msg = this.messages[i];
      app.drawString(x, y, msg.text, msg.color);
      y += 10;
    }

    for (let i = 0; i < PAGE_SIZE; i++) {
      const buttonSlot = this.children.get(i) as ButtonSlot;
      buttonSlot.rect.x = x;
      buttonSlot.rect.y = y;
      buttonSlot.rect.width = buttonRect.width;
      buttonSlot.rect.height = buttonRect.height;

      const button = buttonSlot.button as VendorButton | undefined;
      if (button) {
        const item = button.getFirstItem();
        if (item && item instanceof Item) {
          app.drawString(x + 25, y + 3, item.name, SimplePalette.YELLOW);
          app.drawString(x + 25, y + 11, `${item.sellPrice} gold`, SimplePalette.WHITE);
        }
      }

      y += buttonRect.height + BUTTON_SPACING;
    }

    this.rect.height = y + MARGIN - containerRect.y;
    this.drawChildren(app);
  }
}
