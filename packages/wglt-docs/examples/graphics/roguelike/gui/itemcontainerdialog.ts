import { ArrayList, ButtonSlot, Dialog, getKeyForLetterByIndex, Message, Rect } from 'wglt';
import { Item } from '../item';
import { ItemButton } from './itembutton';
import { ItemContainerButtonSlot } from './itemcontainerbuttonslot';

export class ItemContainerDialog extends Dialog {
  readonly messages: Message[];
  readonly capacity: number;
  readonly items: ArrayList<Item>;

  constructor(rect: Rect, messages: Message[], capacity: number, items: ArrayList<Item>) {
    super(rect);
    this.messages = messages;
    this.capacity = capacity;
    this.items = items;

    items.addListener({
      onAdd: (_, item): void => this.addItem(item),
      onRemove: (_, item): void => this.removeItem(item),
    });

    let i = 0;
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const key = getKeyForLetterByIndex(i);
        this.addChild(new ItemContainerButtonSlot(new Rect(4 + x * 26, 4 + y * 26, 24, 24), key));
        i++;
      }
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
      freeSlot.addChild(new ItemButton(new Rect(0, 0, 24, 24), this.items, item));
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
}
