import { ArrayList } from '../arraylist';
import { BaseApp } from '../baseapp';
import { PointLike } from '../point';
import { Component } from './component';

export class Container extends Component {
  readonly children = new ArrayList<Component>();

  addChild(child: Component): void {
    child.parent = this;
    this.children.add(child);
  }

  removeChild(child: Component): void {
    this.children.remove(child);
    child.parent = undefined;
  }

  moveChild(child: Component): void {
    child.parent?.removeChild(child);
    this.addChild(child);
  }

  getChildAt(point: PointLike): Component | undefined {
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
      const childResult = child.getChildAt(point);
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
}
