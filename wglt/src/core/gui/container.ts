import { ArrayList } from '../arraylist';
import { Message } from '../message';
import { PointLike } from '../point';
import { Rect } from '../rect';
import { Component } from './component';
import { Label } from './label';

export class Container extends Component {
  readonly children = new ArrayList<Component>();

  addChild(child: Component): void {
    child.parent = this;
    child.recalculateLayout();
    this.children.add(child);
  }

  removeChild(child: Component): void {
    this.children.remove(child);
    child.parent = undefined;
  }

  removeAllChildren(): void {
    for (const child of this.children) {
      child.parent = undefined;
    }
    this.children.clear();
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
    if (this.screenRect.contains(point)) {
      return this;
    }
    return undefined;
  }

  recalculateLayout(): void {
    super.recalculateLayout();
    for (let i = 0; i < this.children.length; i++) {
      this.children.get(i).recalculateLayout();
    }
  }

  handleInput(): boolean {
    return this.handleChildrenInput();
  }

  handleChildrenInput(): boolean {
    for (let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children.get(i);
      if (!child.visible) {
        // Ignore hidden elements
        continue;
      }
      if (child.handleInput()) {
        return true;
      }
    }
    return false;
  }

  static fromMessages(messages: Message[]): Container {
    const container = new Container(new Rect(0, 0, 120, 10 * messages.length));
    let y = 0;
    for (const message of messages) {
      container.addChild(new Label(new Rect(0, y, 100, 10), message.text ?? '', message.fg));
      y += 10;
    }
    return container;
  }
}
