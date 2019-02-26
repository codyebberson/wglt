import {Entity} from '../entity';
import {Keys} from '../keys';
import {Rect} from '../rect';
import {XArray} from '../xarray';

import {ButtonSlot} from './buttonslot';
import {Dialog} from './dialog';
import {EntityButton} from './entitybutton';

const MARGIN = 4;

export class EntityContainerDialog extends Dialog {
  readonly capacity: number;
  readonly entities: XArray<Entity>;

  constructor(rect: Rect, title: string, capacity: number, entities: XArray<Entity>) {
    super(rect, title);
    this.capacity = capacity;
    this.entities = entities;

    entities.addListener(
        {onAdd: (array, item) => this.addItem(item), onRemove: (array, item) => this.removeItem(item)});

    for (let i = 0; i < capacity; i++) {
      this.add(new ButtonSlot(new Rect(i * 24, 0, 24, 24)));
    }
  }

  private addItem(item: Entity) {
    const existingButton = this.getExistingButton(item);
    if (existingButton) {
      existingButton.entities.push(item);
      return;
    }

    const freeSlot = this.getNextFreeSlot();
    if (freeSlot) {
      freeSlot.add(new EntityButton(freeSlot.rect.clone(), item));
    }
  }

  private removeItem(item: Entity) {
    for (let i = 0; i < this.children.length; i++) {
      const buttonSlot = this.children.get(i) as ButtonSlot;
      const button = buttonSlot.button;
      if (button && button instanceof EntityButton) {
        const index = button.entities.indexOf(item);
        if (index >= 0) {
          button.entities.splice(index, 1);
          if (button.entities.length === 0) {
            buttonSlot.remove(button);
          }
        }
      }
    }
  }

  private getExistingButton(item: Entity) {
    for (let i = 0; i < this.children.length; i++) {
      const buttonSlot = this.children.get(i) as ButtonSlot;
      const button = buttonSlot.button;
      if (button && button instanceof EntityButton) {
        const existing = button.entities[0];
        if (existing.name === item.name) {
          return button;
        }
      }
    }
    return undefined;
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