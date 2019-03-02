import {Keys} from '../keys';
import {Rect} from '../rect';
import {Talent} from '../talent';
import {XArray} from '../xarray';

import {ButtonSlot} from './buttonslot';
import {Dialog} from './dialog';
import {TalentButton} from './talentbutton';

const MARGIN = 4;
const BUTTON_SPACING = 2;

export class TalentsDialog extends Dialog {
  readonly capacity: number;
  readonly talents: XArray<Talent>;

  constructor(rect: Rect, capacity: number, talents: XArray<Talent>) {
    super(rect);
    this.capacity = capacity;
    this.talents = talents;

    talents.addListener({onAdd: (_, talent) => this.addItem(talent), onRemove: (_, talent) => this.removeItem(talent)});

    for (let i = 0; i < capacity; i++) {
      // Slots are repositioned at render time
      this.add(new ButtonSlot(new Rect(0, 0, 24, 24)));
    }
  }

  private addItem(talent: Talent) {
    const freeSlot = this.getNextFreeSlot();
    if (freeSlot) {
      freeSlot.add(new TalentButton(freeSlot.rect.clone(), talent));
    }
  }

  private removeItem(talent: Talent) {
    for (let i = 0; i < this.children.length; i++) {
      const buttonSlot = this.children.get(i) as ButtonSlot;
      const button = buttonSlot.button;
      if (button && button instanceof TalentButton) {
        if (button.talent === talent) {
          buttonSlot.remove(button);
        }
      }
    }
  }

  private getNextFreeSlot() {
    for (let i = 0; i < this.children.length; i++) {
      const buttonSlot = this.children.get(i) as ButtonSlot;
      if (!buttonSlot.button) {
        return buttonSlot;
      }
    }
    return undefined;
  }

  drawContents() {
    super.drawContents();

    if (!this.gui || !this.gui.renderer.buttonSlotRect) {
      return;
    }

    // Update positions of button slots
    const containerRect = this.rect;
    const buttonRect = this.gui.renderer.buttonSlotRect;
    let x = containerRect.x + MARGIN;
    let y = containerRect.y + MARGIN;

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

    this.drawChildren();
  }

  handleInput() {
    if (!this.gui) {
      return false;
    }

    if (this.handleChildrenInput()) {
      return true;
    }

    if (this.gui.app.isKeyPressed(Keys.VK_ESCAPE)) {
      this.visible = false;
      return true;
    }

    return false;
  }
}