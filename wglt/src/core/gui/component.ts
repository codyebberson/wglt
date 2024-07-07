import { ArrayList } from '../arraylist';
import { BaseApp } from '../baseapp';
import { Message } from '../message';
import { Point, PointLike } from '../point';
import { Rect } from '../rect';
import { Container } from './container';

export abstract class Component {
  static dragElement?: Component;
  static dragOffset?: Point;
  readonly rect: Rect;
  readonly children: ArrayList<Component>;
  visible: boolean;
  parent: Container | undefined = undefined;

  constructor(rect: Rect) {
    this.rect = rect;
    this.children = new ArrayList();
    this.visible = true;
  }

  abstract handleInput(app: BaseApp): boolean;

  abstract draw(app: BaseApp): void;

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
