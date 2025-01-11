import { BaseApp } from '../baseapp';
import { Point } from '../point';
import { Rect } from '../rect';
import { Component, ComponentConstructor } from './component';
import { Container } from './container';
import { Panel } from './panel';
import { RendererMap } from './renderermap';

export class GUI<TContext extends BaseApp = BaseApp> extends Container {
  readonly context: TContext;
  readonly renderers: RendererMap<TContext>;
  tooltip?: Panel;
  tooltipElement?: Component;

  constructor(context: TContext) {
    super(context.size);
    this.context = context;
    this.renderers = new RendererMap<TContext>();
  }

  get root(): GUI<TContext> {
    return this;
  }

  handleInput(): boolean {
    this.recalculateLayout();
    this.updateTooltip();

    if (this.updateDragging()) {
      return true;
    }

    return super.handleInput();
  }

  draw(): void {
    // this.root.draw(app);
    // this.drawComponent(this);
    this.drawChildren(this);

    if (Component.dragElement) {
      // Draw drag element on top of everything else
      // Component.dragElement.draw(app);
      this.drawComponent(Component.dragElement);
    }
  }

  drawComponent<T extends Component>(component: T): void {
    if (!component.visible) {
      return;
    }

    if (component.constructor === Container) {
      // Special case for containers
      this.drawChildren(component as Container);
      return;
    }

    const componentClass = component.constructor as ComponentConstructor<T>;
    const renderer = this.renderers.get(componentClass);
    if (!renderer) {
      console.error(`No renderer for component: ${componentClass.name}`);
      return;
    }

    renderer.render(this, component);
  }

  drawChildren(container: Container): void {
    for (let i = 0; i < container.children.length; i++) {
      const child = container.children.get(i);
      if (!child.visible) {
        // Ignore hidden elements
        continue;
      }
      // child.draw(app);
      this.drawComponent(child);
    }
  }

  updateTooltip(): undefined {
    const app = this.context;

    if (Component.dragElement) {
      // No tooltips while drag/drop
      this.hideTooltip();
      return;
    }

    const mouse = app.mouse;
    if (mouse.buttons.get(0).down) {
      // Hide tooltip when mouse is down
      this.hideTooltip();
      return;
    }

    if (mouse.dx === 0 && mouse.dy === 0) {
      // No updates when mouse is stationary
      return;
    }

    const hoverPanel = this.getChildAt(mouse);
    if (!hoverPanel || hoverPanel === this) {
      // If the mouse is over the GUI itself, hide the tooltip
      this.hideTooltip();
      return;
    }

    if (this.tooltipElement !== hoverPanel) {
      // Hover element has changed
      this.tooltipElement = hoverPanel;
      if (!this.tooltip) {
        // Create for first time
        this.tooltip = new Panel(new Rect(0, 0, 1, 1));
        this.addChild(this.tooltip);
      } else {
        // Move to front
        this.moveChild(this.tooltip);
        this.tooltip.removeAllChildren();
      }
      hoverPanel.decorateTooltip(this.tooltip);
    }

    if (this.tooltip?.visible) {
      // Update the tooltip to be on the mouse
      // This is similar to WoW style tooltips.
      this.tooltip.showAt(app, mouse.x, mouse.y);
    }
  }

  hideTooltip(): void {
    this.tooltipElement = undefined;
    if (this.tooltip) {
      this.tooltip.visible = false;
    }
  }

  static startDragging(app: BaseApp, component: Component): void {
    const mouse = app.mouse;
    Component.dragElement = component;
    Component.dragOffset = new Point(
      mouse.start.x - component.rect.x,
      mouse.start.y - component.rect.y
    );
  }

  private updateDragging(): boolean {
    const app = this.context;
    const mouse = app.mouse;
    const dragElement = Component.dragElement;
    const dragOffset = Component.dragOffset;
    if (!dragElement || !dragOffset) {
      return false;
    }

    if (mouse.buttons.get(0).down) {
      // Move the element to the mouse
      dragElement.rect.x = mouse.x - dragOffset.x;
      dragElement.rect.y = mouse.y - dragOffset.y;
    } else {
      // End the drag
      // TODO: How to represent dropping on the "root"?
      // Should that just be implemented in custom "root" panel?
      const target = this.getChildAt(mouse);
      if (!target?.onDrop(dragElement)) {
        // If the target doesn't accept the drop, move back to the original location
        dragElement.rect.x = mouse.start.x - dragOffset.x;
        dragElement.rect.y = mouse.start.y - dragOffset.y;
      }

      Component.dragElement = undefined;
      Component.dragOffset = undefined;
    }

    return true;
  }
}
