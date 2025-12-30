import { ArrayList } from '../arraylist';
import type { PointLike } from '../point';
import { Component } from './component';

/**
 * A Container is a Component that can hold and manage child components.
 * Provides automatic layout management, input event delegation, and child lifecycle management.
 *
 * @example
 * ```typescript
 * const container = new Container(new Rect(10, 10, 200, 100));
 * container.addChild(new Label(new Rect(5, 5, 100, 20), 'Hello'));
 * container.addChild(new Button(new Rect(5, 30, 80, 25), sprite));
 * gui.addChild(container);
 * ```
 */
export class Container extends Component {
  /** List of child components managed by this container. */
  readonly children = new ArrayList<Component>();

  /**
   * Adds a child component to this container.
   * The child's layout will be recalculated automatically.
   * @param child - The component to add as a child.
   */
  addChild(child: Component): void {
    child.parent = this;
    child.recalculateLayout();
    this.children.add(child);
  }

  /**
   * Removes a child component from this container.
   * @param child - The component to remove.
   */
  removeChild(child: Component): void {
    this.children.remove(child);
    child.parent = undefined;
  }

  /**
   * Removes all child components from this container.
   */
  removeAllChildren(): void {
    for (const child of this.children) {
      child.parent = undefined;
    }
    this.children.clear();
  }

  /**
   * Moves a child component from its current parent to this container.
   * @param child - The component to move to this container.
   */
  moveChild(child: Component): void {
    child.parent?.removeChild(child);
    this.addChild(child);
  }

  /**
   * Finds the deepest child component at the specified point.
   * Searches children in reverse order (top to bottom in z-order).
   * @param point - The point to check (in screen coordinates).
   * @returns The child component at the point, or this container if no child matches.
   */
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

  /**
   * Recalculates layout for this container and all its children.
   * @override
   */
  recalculateLayout(): void {
    super.recalculateLayout();
    for (let i = 0; i < this.children.length; i++) {
      this.children.get(i).recalculateLayout();
    }
  }

  /**
   * Handles input by delegating to child components.
   * @returns True if any child handled the input.
   * @override
   */
  handleInput(): boolean {
    return this.handleChildrenInput();
  }

  /**
   * Delegates input handling to child components.
   * Processes children in reverse order (top to bottom in z-order).
   * @returns True if any child handled the input.
   */
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
}
