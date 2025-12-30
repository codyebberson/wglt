import type { PointLike } from '../point';
import { Rect } from '../rect';
import type { GUI } from './gui';

/**
 * Abstract base class for all GUI components in WGLT.
 * Provides the fundamental structure for UI elements including positioning,
 * visibility, input handling, drag-and-drop, and parent-child relationships.
 *
 * @example
 * ```typescript
 * // Custom component implementation
 * class MyButton extends Component {
 *   constructor(rect: Rect) {
 *     super(rect);
 *   }
 *
 *   handleInput(): boolean {
 *     // Handle mouse clicks, keyboard input, etc.
 *     return true; // if handled
 *   }
 * }
 * ```
 */
export abstract class Component {
  /** Local position and size relative to parent. */
  readonly rect: Rect;
  /** Absolute screen position and size (calculated during layout). */
  readonly screenRect: Rect;
  /** Parent container, if this component is a child. */
  parent?: Component;
  /** Optional custom render function. */
  render?(gui: GUI): void;
  /** Whether this component is visible and should be rendered. */
  visible: boolean;

  /**
   * Creates a new Component with the specified rectangle.
   * @param rect - The local position and size of the component.
   */
  constructor(rect: Rect) {
    this.rect = rect;
    this.screenRect = rect.clone();
    this.visible = true;
  }

  /**
   * Gets the root GUI instance that contains this component.
   * @returns The root GUI, or undefined if not attached to a GUI tree.
   */
  get root(): GUI | undefined {
    return this.parent?.root;
  }

  /**
   * Recalculates the absolute screen position based on parent layout.
   * Called automatically during the layout process.
   * @internal
   */
  recalculateLayout(): void {
    if (this.parent) {
      // We can assume that the parent's screenRect is already up-to-date
      this.screenRect.x = this.parent.screenRect.x + this.rect.x;
      this.screenRect.y = this.parent.screenRect.y + this.rect.y;
      this.screenRect.width = this.rect.width;
      this.screenRect.height = this.rect.height;
    }
  }

  /**
   * Handle input for this component.
   * If the component handles the input, it should return true.
   * If the component does not handle the input, it should return false.
   * @returns true if the component handled the input, false otherwise.
   */
  handleInput(): boolean {
    // By default, components do not handle input
    // Child classes can override this method
    return false;
  }

  /**
   * Finds the deepest child component at the specified point.
   * @param _point - The point to check (in screen coordinates).
   * @returns The child component at the point, or undefined.
   */
  getChildAt(_point: PointLike): Component | undefined {
    // By default, components do not have children
    return undefined;
  }

  /**
   * Removes a child component from this container.
   * @param _child - The component to remove.
   */
  removeChild(_child: Component): void {
    // By default, components do not have children
  }

  /**
   * Determines whether this component can be dragged.
   * @returns True if the component supports drag operations.
   */
  canDrag(): boolean {
    // By default, components cannot be dragged
    // Child classes can override this method
    return false;
  }

  /**
   * Checks if this component is currently being dragged.
   * @returns True if this component is the active drag element.
   */
  isDragging(): boolean {
    return this.root?.dragElement === this;
  }

  /**
   * Called when this component is dropped onto another component.
   * @param _dest - The component this was dropped onto.
   * @returns True if the drop was handled, false otherwise.
   */
  onDrop(_dest: Component): boolean {
    // By default, do nothing
    // Child classes can override this method
    return false;
  }

  /**
   * Customizes the tooltip panel for this component.
   * Override this method to provide tooltip content.
   * @param _gui - The GUI instance.
   * @returns A component to display as a tooltip, or undefined for no tooltip.
   */
  decorateTooltip(_gui: GUI): Component | undefined {
    // By default, no visible tooltips
    // Inheriting classes can override this method with tooltip details
    return undefined;
  }
}

/**
 * Type alias for component constructor functions.
 * Used internally for creating components dynamically.
 * @template T - The component type to construct.
 */
// biome-ignore lint/suspicious/noExplicitAny: Constructor parameters vary by component type
export type ComponentConstructor<T extends Component = Component> = new (...args: any[]) => T;
