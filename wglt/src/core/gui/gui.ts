import { BaseApp } from '../baseapp';
import { Point, PointLike } from '../point';
import { Rect } from '../rect';
import { Component } from './component';
import { Container } from './container';
import { TooltipDialog } from './tooltipdialog';

export class GUI {
  readonly root: Container;
  tooltip?: TooltipDialog;
  tooltipElement?: Component;

  constructor(rect: Rect) {
    this.root = new Container(rect);
  }

  add(panel: Component): void {
    this.root.addChild(panel);
  }

  remove(panel: Component): void {
    this.root.removeChild(panel);
  }

  getChildAt(point: PointLike): Component | undefined {
    return this.root.getChildAt(point);
  }

  handleInput(app: BaseApp): boolean {
    this.updateTooltip(app);

    if (this.updateDragging(app)) {
      return true;
    }

    return this.root.handleInput(app);
  }

  draw(app: BaseApp): void {
    this.root.draw(app);

    if (Component.dragElement) {
      // Draw drag element on top of everything else
      Component.dragElement.draw(app);
    }
  }

  private updateTooltip(app: BaseApp): void {
    if (Component.dragElement && this.tooltip) {
      // No tooltips while drag/drop
      this.tooltip.visible = false;
      return;
    }
    if (!this.tooltip?.visible) {
      this.tooltipElement = undefined;
    }
    const mouse = app.mouse;
    if (!mouse.buttons.get(0).down && (mouse.dx !== 0 || mouse.dy !== 0)) {
      const hoverPanel = this.getChildAt(mouse);
      if (this.tooltipElement !== hoverPanel) {
        // Hover element has changed
        this.tooltipElement = hoverPanel;
        if (!this.tooltip) {
          this.tooltip = new TooltipDialog();
          this.add(this.tooltip);
        }
        const hoverPanelMessages = hoverPanel?.updateTooltip();
        if (hoverPanelMessages) {
          this.tooltip.messages = hoverPanelMessages;
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
  }

  static startDragging(app: BaseApp, component: Component): void {
    const mouse = app.mouse;
    Component.dragElement = component;
    Component.dragOffset = new Point(
      mouse.start.x - component.rect.x,
      mouse.start.y - component.rect.y
    );
  }

  private updateDragging(app: BaseApp): boolean {
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
      const target = this.root.getChildAt(mouse);
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
