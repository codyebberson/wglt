import { BaseApp } from '../baseapp';
import { Mouse } from '../mouse';
import { Vec2 } from '../vec2';
import { DialogRenderer } from './dialogrenderer';
import { Panel } from './panel';

export class GUI {
  readonly app: BaseApp;
  readonly renderer: DialogRenderer;
  readonly rootPanel: Panel;
  dragElement?: Panel;
  dragOffset?: Vec2;

  constructor(app: BaseApp, renderer: DialogRenderer) {
    this.app = app;
    this.renderer = renderer;
    this.rootPanel = new Panel(app.size);
    this.rootPanel.gui = this;
  }

  add(panel: Panel): void {
    this.rootPanel.addChild(panel);
  }

  remove(panel: Panel): void {
    this.rootPanel.removeChild(panel);
  }

  getPanelAt(point: Vec2 | Mouse): Panel | undefined {
    return this.rootPanel.getPanelAt(point);
  }

  handleInput(): boolean {
    if (this.dragElement && this.dragOffset) {
      this.updateDragging();
      return true;
    }

    return this.rootPanel.handleInput();
  }

  draw(): void {
    this.rootPanel.drawContents();

    if (this.dragElement) {
      // Draw drag element on top of everything else
      this.dragElement.drawContents();
    }
  }

  startDragging(panel: Panel): void {
    const mouse = this.app.mouse;
    this.dragElement = panel;
    this.dragOffset = new Vec2(mouse.start.x - panel.rect.x, mouse.start.y - panel.rect.y);
  }

  private updateDragging(): void {
    const mouse = this.app.mouse;
    const dragElement = this.dragElement as Panel;
    const dragOffset = this.dragOffset as Vec2;

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
      this.dragElement = undefined;
      this.dragOffset = undefined;
    }
  }
}
