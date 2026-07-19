import { BaseApp } from '../baseapp';
import type { Font } from '../font';
import type { Insets } from '../insets';
import type { Message } from '../message';
import { Rect } from '../rect';
import { Vec2 } from '../vec2';
import { Component, type ComponentConstructor } from './component';
import { Container } from './container';
import { Label } from './label';
import { Panel } from './panel';
import { RendererMap } from './renderermap';
import { Theme } from './theme';

export class GUI<TContext extends BaseApp = BaseApp> extends Container {
  readonly context: TContext;
  readonly renderers: RendererMap<TContext>;
  readonly rendererWarnings: Set<string>;
  tooltipPadding?: Insets;
  tooltip?: Panel;
  tooltipElement?: Component;
  dragElement?: Component;
  dragOffset?: Vec2;

  constructor(context: TContext) {
    super(new Rect(0, 0, context.pixelWidth, context.pixelHeight));
    this.context = context;
    this.renderers = new RendererMap<TContext>();
    this.rendererWarnings = new Set();
  }

  get root(): GUI<TContext> {
    return this;
  }

  setTheme(theme: Theme<TContext>): void {
    this.renderers.setAll(theme.renderers);
    this.context.defaultFont = theme.defaultFont;
    this.tooltipPadding = theme.tooltipPadding;
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
    this.drawChildren(this);

    if (this.dragElement) {
      // Draw drag element on top of everything else
      this.drawComponent(this.dragElement);
    }
  }

  drawComponent<T extends Component>(
    component: T,
    overrideComponentClass?: ComponentConstructor<T>
  ): void {
    if (!component.visible) {
      return;
    }

    if (component.constructor === Container) {
      // Special case for containers
      this.drawChildren(component as Container);
      return;
    }

    if (component.render && !overrideComponentClass) {
      component.render(this);
      return;
    }

    let componentClass =
      overrideComponentClass ?? (component.constructor as ComponentConstructor<T>);

    while (componentClass && componentClass !== Component) {
      const renderer = this.renderers.get(componentClass);
      if (renderer) {
        renderer.render(this, component);
        return;
      }

      componentClass = Object.getPrototypeOf(componentClass) as ComponentConstructor<T>;
    }

    // Renderer not found
    if (!this.rendererWarnings.has(componentClass.name)) {
      console.error(`No renderer for component: ${componentClass.name}`);
      this.rendererWarnings.add(componentClass.name);
    }
    if (component instanceof Container) {
      this.drawChildren(component);
    }
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

  /**
   * Creates a container with labels for a list of messages.
   * Useful for displaying message logs or lists.
   * @param messages - Array of messages to display as labels.
   * @param spacing - Vertical spacing between labels. Default is 2.
   * @param font - Font to use for the labels. Defaults to the GUI's default font.
   * @returns A new Container with Label children for each message.
   */
  fromMessages(messages: Message[], spacing: number = 2, font?: Font): Container {
    font = font ?? this.context.defaultFont;
    if (!font) {
      throw new Error('No font specified for GUI.fromMessages');
    }
    const lineHeight = font.lineHeight;
    const container = new Container(new Rect(0, 0, 120, (lineHeight + spacing) * messages.length));
    let maxWidth = 0;
    let y = 0;
    for (const message of messages) {
      const text = message.text ?? '';
      const textWidth = font.getStringWidth(text);
      container.addChild(
        new Label(
          new Rect(0, y, textWidth, lineHeight),
          text,
          message.fg,
          undefined,
          undefined,
          undefined,
          font
        )
      );
      maxWidth = Math.max(maxWidth, textWidth);
      y += lineHeight + spacing;
    }
    container.rect.width = maxWidth;
    return container;
  }

  updateTooltip(): undefined {
    const app = this.context;

    if (this.dragElement) {
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
      const tooltipContent = hoverPanel.decorateTooltip(this);
      if (tooltipContent) {
        this.tooltip.addChild(tooltipContent);
        this.tooltip.rect.width = tooltipContent.rect.width;
        this.tooltip.rect.height = tooltipContent.rect.height;
        if (this.tooltipPadding) {
          this.tooltip.rect.width += this.tooltipPadding.left + this.tooltipPadding.right;
          this.tooltip.rect.height += this.tooltipPadding.top + this.tooltipPadding.bottom;
          tooltipContent.rect.x = this.tooltipPadding.left;
          tooltipContent.rect.y = this.tooltipPadding.top;
        }
        this.tooltip.visible = true;
      } else {
        this.tooltip.visible = false;
      }
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

  startDragging(app: BaseApp, component: Component): void {
    const mouse = app.mouse;
    this.dragElement = component;
    this.dragOffset = new Vec2(mouse.start.x - component.rect.x, mouse.start.y - component.rect.y);
  }

  private updateDragging(): boolean {
    const app = this.context;
    const mouse = app.mouse;
    const dragElement = this.dragElement;
    const dragOffset = this.dragOffset;
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

      this.dragElement = undefined;
      this.dragOffset = undefined;
    }

    return true;
  }
}
