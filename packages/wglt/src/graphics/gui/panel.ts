import { ArrayList } from '../../core/arraylist';
import { Mouse } from '../../core/mouse';
import { Rect } from '../../core/rect';
import { Vec2 } from '../../core/vec2';
import { GUI } from './gui';
import { TooltipDialog } from './tooltipdialog';

export class Panel {
  gui: GUI | null;
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

  setGui(gui: GUI): void {
    if (this.gui) {
      // Already set
      return;
    }
    this.gui = gui;
    for (let i = 0; i < this.children.length; i++) {
      this.children.get(i).setGui(gui);
    }
  }

  addChild(panel: Panel): void {
    panel.parent = this;
    panel.setGui(this.gui as GUI);
    this.children.add(panel);
  }

  removeChild(panel: Panel): void {
    this.children.remove(panel);
  }

  moveChild(newParent: Panel): void {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    newParent.addChild(this);
  }

  getPanelAt(point: Mouse | Vec2): Panel | undefined {
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

  drawContents(): void {
    this.drawChildren();
  }

  drawChildren(): void {
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

  handleChildrenInput(): boolean {
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

  isDragging(): boolean {
    return !!(this.gui && this.gui.dragElement === this);
  }

  onDrop(_panel: Panel): boolean {
    return false;
  }

  updateTooltip(tooltip: TooltipDialog): void {
    // By default, no visible tooltips
    // Inheriting classes can override this method with tooltip details
    tooltip.visible = false;
  }
}
