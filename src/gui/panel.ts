import {GUI} from '../gui';
import {Mouse} from '../mouse';
import {Rect} from '../rect';
import {Vec2} from '../vec2';
import {XArray} from '../xarray';

export class Panel {
  gui: GUI|null;
  readonly rect: Rect;
  readonly modal: boolean;
  readonly children: XArray<Panel>;
  parent?: Panel;

  constructor(rect: Rect, modal?: boolean) {
    this.gui = null;
    this.rect = rect;
    this.modal = !!modal;
    this.children = new XArray();
  }

  setGui(gui: GUI) {
    if (this.gui) {
      // Already set
      return;
    }
    this.gui = gui;
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].setGui(gui);
    }
  }

  add(panel: Panel) {
    panel.parent = this;
    panel.setGui(this.gui as GUI);
    this.children.push(panel);
  }

  remove(panel: Panel) {
    this.children.remove(panel);
  }

  move(newParent: Panel) {
    if (this.parent) {
      this.parent.remove(this);
    }
    newParent.add(this);
  }

  getPanelAt(point: Mouse|Vec2): Panel|undefined {
    for (let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children[i];
      if (this.gui && child === this.gui.dragElement) {
        // Ignore dragging element
        continue;
      }
      const childResult = child.getPanelAt(point);
      if (childResult) {
        return childResult;
      }
    }
    if (this.rect.contains(point)) {
      return this;
    }
    return undefined;
  }

  drawContents() {
    this.drawChildren();
  }

  drawChildren() {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].drawContents();
    }
  }

  handleInput(): boolean {
    return this.handleChildrenInput();
  }

  handleChildrenInput() {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (child.handleInput() || child.modal) {
        return true;
      }
    }
    return false;
  }
}
