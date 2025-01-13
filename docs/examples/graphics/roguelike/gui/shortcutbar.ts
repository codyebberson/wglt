import { ArrayList, Container, GUI, GraphicsApp, Key, Rect, Renderer } from 'wglt';
import { Item } from '../item';
import { Talent } from '../talent';
import { ItemShortcutButton } from './itemshortcutbutton';
import { ShortcutButtonSlot } from './shortcutbuttonslot';
import { TalentButton } from './talentbutton';

export class ShortcutBar extends Container {
  spacing: number;

  constructor(rect: Rect, buttonSlotRect: Rect, count: number, spacing = 2) {
    super(rect);
    this.spacing = spacing;

    for (let i = 0; i < count; i++) {
      const key = `Digit${String.fromCharCode('1'.charCodeAt(0) + i)}` as Key;
      const buttonSlot = new ShortcutButtonSlot(
        new Rect(
          i * (buttonSlotRect.width + spacing),
          0,
          buttonSlotRect.width,
          buttonSlotRect.height
        ),
        key
      );
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

export class ShortcutBarRenderer implements Renderer<GraphicsApp, ShortcutBar> {
  render(gui: GUI<GraphicsApp>, component: ShortcutBar): void {
    gui.drawChildren(component);
  }
}
