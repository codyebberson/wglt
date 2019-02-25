import {Keys} from '../keys';
import {Rect} from '../rect';

import {ButtonSlot} from './buttonslot';
import {Dialog} from './dialog';

const MARGIN = 4;

export class EntityContainerDialog extends Dialog {
  readonly capacity: number;

  constructor(rect: Rect, title: string, capacity: number) {
    super(rect, title);
    this.capacity = capacity;
    this.modal = false;

    for (let i = 0; i < capacity; i++) {
      this.add(new ButtonSlot(new Rect(i * 24, 0, 24, 24)));
    }
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
      const child = this.children[i];
      child.rect.x = x;
      child.rect.y = y;
      child.rect.width = buttonRect.width;
      child.rect.height = buttonRect.height;

      x += buttonRect.width;
      if (x > containerRect.x2 - buttonRect.width - MARGIN) {
        x = containerRect.x + MARGIN;
        y += buttonRect.height;
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