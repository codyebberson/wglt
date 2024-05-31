import { BaseApp } from '../baseapp';
import { PointLike } from '../point';
import { Point } from '../point';
import { Rect } from '../rect';
import { Component } from './component';
import { Panel } from './panel';
import { TooltipDialog } from './tooltipdialog';

export class GUI {
  static dragElement?: Component;
  static dragOffset?: Point;
  readonly rootPanel: Component;
  tooltip?: TooltipDialog;
  tooltipElement?: Component;

  constructor(rect: Rect) {
    this.rootPanel = new Panel(rect);
  }

  add(panel: Component): void {
    this.rootPanel.addChild(panel);
  }

  remove(panel: Component): void {
    this.rootPanel.removeChild(panel);
  }

  getPanelAt(point: PointLike): Component | undefined {
    return this.rootPanel.getPanelAt(point);
  }

  handleInput(app: BaseApp): boolean {
    this.updateTooltip(app);

    if (GUI.dragElement && GUI.dragOffset) {
      this.updateDragging(app);
      return true;
    }

    return this.rootPanel.handleInput(app);
  }

  draw(app: BaseApp): void {
    this.rootPanel.draw(app);

    if (GUI.dragElement) {
      // Draw drag element on top of everything else
      GUI.dragElement.draw(app);
    }
  }

  private updateTooltip(app: BaseApp): void {
    if (GUI.dragElement && this.tooltip) {
      // No tooltips while drag/drop
      this.tooltip.visible = false;
      return;
    }
    if (!this.tooltip?.visible) {
      this.tooltipElement = undefined;
    }
    const mouse = app.mouse;
    if (!mouse.buttons.get(0).down && (mouse.dx !== 0 || mouse.dy !== 0)) {
      const hoverPanel = this.getPanelAt(mouse);
      if (this.tooltipElement !== hoverPanel) {
        // Hover element has changed
        this.tooltipElement = hoverPanel;
        if (!this.tooltip) {
          this.tooltip = new TooltipDialog();
          this.add(this.tooltip);
        }
        // if (hoverPanel) {
        //   hoverPanel.updateTooltip(this.tooltip);
        // }
        const hoverPanelMessages = hoverPanel?.updateTooltip();
        if (hoverPanelMessages) {
          this.tooltip.messages = hoverPanelMessages;
          this.tooltip.visible = true;
        } else {
          this.tooltip.visible = false;
        }
      }
      if (this.tooltip?.visible) {
        // if (!this.tooltip.gui) {
        //   // If this is the first time we're showing the tooltip,
        //   // make sure it is in the GUI system.
        //   this.gui.add(this.tooltip);
        // }
        // Update the tooltip to be on the mouse
        // This is similar to WoW style tooltips.
        this.tooltip.showAt(app, mouse.x, mouse.y);
      }
    }
  }

  static startDragging(app: BaseApp, panel: Panel): void {
    const mouse = app.mouse;
    GUI.dragElement = panel;
    GUI.dragOffset = new Point(mouse.start.x - panel.rect.x, mouse.start.y - panel.rect.y);
  }

  private updateDragging(app: BaseApp): void {
    const mouse = app.mouse;
    const dragElement = GUI.dragElement as Panel;
    const dragOffset = GUI.dragOffset as Point;

    // TODO: Refactor all of this into callbacks

    if (mouse.buttons.get(0).down) {
      // Move the element to the mouse
      dragElement.rect.x = mouse.x - dragOffset.x;
      dragElement.rect.y = mouse.y - dragOffset.y;
    } else {
      // End the drag
      const target = this.rootPanel.getPanelAt(mouse);
      if (target?.onDrop(dragElement)) {
        // Found a valid drop target
        dragElement.rect.x = target.rect.x;
        dragElement.rect.y = target.rect.y;
        dragElement.moveChild(target);
        // } else if (dragElement instanceof ItemButton && target === this.rootPanel) {
        //   // Drop item(s)
        //   dragElement.removeAll();
        // } else if (dragElement instanceof ItemShortcutButton && target === this.rootPanel) {
        //   // Destroy the shortcut
        //   if (dragElement.parent) {
        //     dragElement.parent.removeChild(dragElement);
        //   }
        // } else if (
        //   dragElement instanceof TalentButton &&
        //   dragElement.shortcut &&
        //   target === this.rootPanel
        // ) {
        //   // Destroy the shortcut
        //   if (dragElement.parent) {
        //     dragElement.parent.removeChild(dragElement);
        //   }
      } else {
        // Otherwise move back to the original location
        dragElement.rect.x = mouse.start.x - dragOffset.x;
        dragElement.rect.y = mouse.start.y - dragOffset.y;
      }
      GUI.dragElement = undefined;
      GUI.dragOffset = undefined;
    }
  }
}
