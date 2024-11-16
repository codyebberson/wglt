import { Message } from '../message';
import { Point, PointLike } from '../point';
import { Rect } from '../rect';
import { Container } from './container';
import { GUI } from './gui';

export abstract class Component {
  static dragElement?: Component;
  static dragOffset?: Point;
  readonly rect: Rect;
  root?: GUI;
  parent?: Container;
  visible: boolean;

  constructor(rect: Rect) {
    this.rect = rect;
    this.visible = true;
  }

  handleInput(): boolean {
    // By default, components do not handle input
    // Child classes can override this method
    return false;
  }

  // abstract draw(app: BaseApp): void;

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

  updateTooltip(): Message[] | undefined {
    // By default, no visible tooltips
    // Inheriting classes can override this method with tooltip details
    return undefined;
  }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type ComponentConstructor<T extends Component = Component> = new (...args: any[]) => T;
