import { ArrayList } from '../arraylist';
import { BaseApp } from '../baseapp';
import { Message } from '../message';
import { PointLike } from '../point';
import { Rect } from '../rect';
import { Component } from './component';
import { GUI } from './gui';

export class Panel implements Component {
  readonly rect: Rect;
  readonly children: ArrayList<Component>;
  modal: boolean;
  visible: boolean;
  parent: Component | undefined = undefined;

  constructor(rect: Rect) {
    this.rect = rect;
    this.children = new ArrayList();
    this.modal = false;
    this.visible = true;
  }

  addChild(panel: Component): void {
    panel.parent = this;
    this.children.add(panel);
  }

  removeChild(panel: Component): void {
    this.children.remove(panel);
  }

  moveChild(newParent: Component): void {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    newParent.addChild(this);
  }

  getPanelAt(point: PointLike): Component | undefined {
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

  draw(app: BaseApp): void {
    this.drawChildren(app);
  }

  drawChildren(app: BaseApp): void {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children.get(i);
      if (!child.visible) {
        // Ignore hidden elements
        continue;
      }
      child.draw(app);
    }
  }

  handleInput(app: BaseApp): boolean {
    return this.handleChildrenInput(app);
  }

  handleChildrenInput(app: BaseApp): boolean {
    for (let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children.get(i);
      if (!child.visible) {
        // Ignore hidden elements
        continue;
      }
      if (child.handleInput(app)) {
        return true;
      }
    }
    return false;
  }

  isDragging(): boolean {
    return !!(GUI.dragElement === this);
  }

  onDrop(_panel: Panel): boolean {
    return false;
  }

  updateTooltip(): Message[] | undefined {
    // By default, no visible tooltips
    // Inheriting classes can override this method with tooltip details
    return undefined;
  }
}