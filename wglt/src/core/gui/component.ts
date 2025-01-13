import { Point, PointLike } from '../point';
import { Rect } from '../rect';
import { Container } from './container';
import { GUI } from './gui';
import { Panel } from './panel';

export abstract class Component {
  static dragElement?: Component;
  static dragOffset?: Point;
  readonly rect: Rect;
  readonly screenRect: Rect;
  parent?: Container;
  render?(gui: GUI): void;
  visible: boolean;

  constructor(rect: Rect) {
    this.rect = rect;
    this.screenRect = rect.clone();
    this.visible = true;
  }

  get root(): GUI | undefined {
    return this.parent?.root;
  }

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

  getChildAt(_point: PointLike): Component | undefined {
    // By default, components do not have children
    return undefined;
  }

  canDrag(): boolean {
    // By default, components cannot be dragged
    // Child classes can override this method
    return false;
  }

  isDragging(): boolean {
    return Component.dragElement === this;
  }

  onDrop(_dest: Component): boolean {
    // By default, do nothing
    // Child classes can override this method
    return false;
  }

  decorateTooltip(tooltipPanel: Panel): void {
    // By default, no visible tooltips
    // Inheriting classes can override this method with tooltip details
    tooltipPanel.visible = false;
  }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type ComponentConstructor<T extends Component = Component> = new (...args: any[]) => T;
