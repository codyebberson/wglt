import {ArrayList} from '../arraylist';
import {GUI} from '../gui';
import {Mouse} from '../mouse';
import {Rect} from '../rect';
import {Vec2} from '../vec2';

import {TooltipDialog} from './tooltipdialog';

export class Panel {
  gui: GUI|null;
  readonly rect: Rect;
  readonly children: ArrayList<Panel>;
  modal: boolean;
  visible: boolean;
  parent?: Panel;

  constructor(rect: Rect) {
    this.gui = null;
    this.rect = rect;
    this.children = new ArrayList();
    this.modal = false;
    this.visible = true;
  }

  setGui(gui: GUI) {
    if (this.gui) {
      // Already set
      return;
    }
    this.gui = gui;
    for (let i = 0; i < this.children.length; i++) {
      this.children.get(i).setGui(gui);
    }
  }

  add(panel: Panel) {
    panel.parent = this;
    panel.setGui(this.gui as GUI);
    this.children.add(panel);
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
      const child = this.children.get(i);
      if (!child.visible) {
        // Ignore hidden elements
        continue;
      }
      if (child.isDragging()) {
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
      const child = this.children.get(i);
      if (!child.visible) {
        // Ignore hidden elements
        continue;
      }
      child.drawContents();
    }
  }

  handleInput(): boolean {
    return this.handleChildrenInput();
  }

  handleChildrenInput() {
    // for (let i = 0; i < this.children.length; i++) {
    for (let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children.get(i);
      if (!child.visible) {
        // Ignore hidden elements
        continue;
      }
      if (child.handleInput() || child.modal) {
        return true;
      }
    }
    return false;
  }

  isDragging() {
    return this.gui && this.gui.dragElement === this;
  }

  onDrop(panel: Panel) {
    return false;
  }

  updateTooltip(tooltip: TooltipDialog) {
    tooltip.visible = false;
  }
}
