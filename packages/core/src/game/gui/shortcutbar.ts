import { ArrayList } from '@wglt/core';
import { Key } from '@wglt/core';
import { Rect } from '@wglt/core';
import { Panel } from '@wglt/graphics';
import { Item } from '../item';
import { Talent } from '../talent';
import { ItemShortcutButton } from './itemshortcutbutton';
import { ShortcutButtonSlot } from './shortcutbuttonslot';
import { TalentButton } from './talentbutton';

const DEFAULT_SPACING = 2;

export class ShortcutBar extends Panel {
  spacing: number;

  constructor(rect: Rect, count: number, spacing?: number) {
    super(rect);
    this.spacing = spacing !== undefined ? spacing : DEFAULT_SPACING;

    for (let i = 0; i < count; i++) {
      const key = `Digit${String.fromCharCode('1'.charCodeAt(0) + i)}` as Key;
      const buttonSlot = new ShortcutButtonSlot(new Rect(0, 0, 24, 24), key);
      this.addChild(buttonSlot);
    }
  }

  addTalent(talent: Talent, rightToLeft?: boolean): void {
    if (this.containsTalent(talent)) {
      return;
    }
    const slot = this.getFreeSlot(!!rightToLeft);
    if (slot) {
      slot.addChild(new TalentButton(slot.rect.clone(), talent, true));
    }
  }

  containsTalent(talent: Talent): boolean {
    for (let i = 0; i < this.children.length; i++) {
      const slot = this.children.get(i) as ShortcutButtonSlot;
      if (slot.button && slot.button instanceof TalentButton && slot.button.talent === talent) {
        return true;
      }
    }
    return false;
  }

  addItem(items: ArrayList<Item>, item: Item, rightToLeft?: boolean): void {
    if (this.containsItem(item)) {
      return;
    }
    const slot = this.getFreeSlot(!!rightToLeft);
    if (slot) {
      slot.addChild(new ItemShortcutButton(slot.rect.clone(), items, item));
    }
  }

  containsItem(item: Item): boolean {
    for (let i = 0; i < this.children.length; i++) {
      const slot = this.children.get(i) as ShortcutButtonSlot;
      if (
        slot.button &&
        slot.button instanceof ItemShortcutButton &&
        item.isStackable(slot.button.shortcutItem)
      ) {
        return true;
      }
    }
    return false;
  }

  drawContents(): void {
    if (!this.gui) {
      return;
    }

    const buttonRect = this.gui.renderer.buttonSlotRect;
    if (!buttonRect) {
      return;
    }

    for (let i = 0; i < this.children.length; i++) {
      const child = this.children.get(i);
      child.rect.x = this.rect.x + i * (buttonRect.width + DEFAULT_SPACING);
      child.rect.y = this.rect.y;
      child.rect.width = buttonRect.width;
      child.rect.height = buttonRect.height;
    }

    this.drawChildren();
  }

  private getFreeSlot(rightToLeft: boolean): ShortcutButtonSlot | undefined {
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
