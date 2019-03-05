import {Item} from '../item';
import {Keys} from '../keys';
import {Rect} from '../rect';
import {Talent} from '../talent';
import {XArray} from '../xarray';

import {ItemShortcutButton} from './itemshortcutbutton';
import {Panel} from './panel';
import {ShortcutButtonSlot} from './shortcutbuttonslot';
import {TalentButton} from './talentbutton';

export class ShortcutButtonBar extends Panel {
  constructor(rect: Rect, count: number) {
    super(rect);

    for (let i = 0; i < count; i++) {
      const buttonSlot = new ShortcutButtonSlot(new Rect(0, 0, 24, 24), Keys.VK_1 + i);
      this.add(buttonSlot);
    }
  }

  addTalent(talent: Talent, rightToLeft?: boolean) {
    if (this.containsTalent(talent)) {
      return;
    }
    const slot = this.getFreeSlot(!!rightToLeft);
    if (slot) {
      slot.add(new TalentButton(slot.rect.clone(), talent, true));
    }
  }

  containsTalent(talent: Talent) {
    for (let i = 0; i < this.children.length; i++) {
      const slot = this.children.get(i) as ShortcutButtonSlot;
      if (slot.button && slot.button instanceof TalentButton && slot.button.talent === talent) {
        return true;
      }
    }
    return false;
  }

  addItem(items: XArray<Item>, item: Item, rightToLeft?: boolean) {
    if (this.containsItem(item)) {
      return;
    }
    const slot = this.getFreeSlot(!!rightToLeft);
    if (slot) {
      slot.add(new ItemShortcutButton(slot.rect.clone(), items, item));
    }
  }

  containsItem(item: Item) {
    for (let i = 0; i < this.children.length; i++) {
      const slot = this.children.get(i) as ShortcutButtonSlot;
      if (slot.button && slot.button instanceof ItemShortcutButton && slot.button.shortcutItem.name === item.name) {
        return true;
      }
    }
    return false;
  }

  drawContents() {
    if (!this.gui) {
      return;
    }

    const buttonRect = this.gui.renderer.buttonSlotRect;
    if (!buttonRect) {
      return;
    }

    for (let i = 0; i < this.children.length; i++) {
      const child = this.children.get(i);
      child.rect.x = this.rect.x + 1 + i * (buttonRect.width + 2);
      child.rect.y = this.rect.y + 1;
      child.rect.width = buttonRect.width;
      child.rect.height = buttonRect.height;
    }

    this.drawChildren();
  }

  private getFreeSlot(rightToLeft: boolean) {
    if (rightToLeft) {
      // Right to left
      for (let i = this.children.length - 1; i >= 0; i--) {
        const slot = this.children.get(i) as ShortcutButtonSlot;
        if (!slot.button) {
          return slot;
        }
      }
    } else {
      // Left to right
      for (let i = 0; i < this.children.length; i++) {
        const slot = this.children.get(i) as ShortcutButtonSlot;
        if (!slot.button) {
          return slot;
        }
      }
    }
    return undefined;
  }
}