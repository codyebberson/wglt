
import {App} from './app';
import {DialogRenderer} from './gui/dialogrenderer';
import {Panel} from './gui/panel';
import {Rect} from './rect';
import {Vec2} from './vec2';

export class GUI {
  readonly app: App;
  readonly renderer: DialogRenderer;
  readonly rootPanel: Panel;
  dragElement?: Panel;
  dragOffset?: Vec2;
  onDrop?: Function;

  constructor(app: App) {
    this.app = app;
    this.renderer = new DialogRenderer(new Rect(0, 0, 1, 1));
    this.rootPanel = new Panel(app.size);
    this.rootPanel.gui = this;
  }

  add(panel: Panel) {
    this.rootPanel.add(panel);
  }

  remove(panel: Panel) {
    this.rootPanel.remove(panel);
  }

  handleInput(): boolean {
    if (this.dragElement && this.dragOffset) {
      this.updateDragging();
      return true;
    }

    return this.rootPanel.handleInput();
  }

  draw() {
    this.rootPanel.drawContents();

    if (this.dragElement) {
      // Draw drag element on top of everything else
      this.dragElement.drawContents();
    }
  }

  startDragging(panel: Panel) {
    const mouse = this.app.mouse;
    this.dragElement = panel;
    this.dragOffset = new Vec2(mouse.start.x - panel.rect.x, mouse.start.y - panel.rect.y);
  }

  private updateDragging() {
    const mouse = this.app.mouse;
    const dragElement = this.dragElement as Panel;
    const dragOffset = this.dragOffset as Vec2;
    if (mouse.down) {
      // Move the element to the mouse
      dragElement.rect.x = mouse.x - dragOffset.x;
      dragElement.rect.y = mouse.y - dragOffset.y;
    } else {
      // End the drag
      const target = this.rootPanel.getPanelAt(mouse);
      if (target && this.tryDrop(dragElement, target)) {
        // Found a valid drop target
        dragElement.rect.x = target.rect.x;
        dragElement.rect.y = target.rect.y;
        dragElement.move(target);
      } else {
        // Otherwise move back to the original location
        dragElement.rect.x = mouse.start.x - dragOffset.x;
        dragElement.rect.y = mouse.start.y - dragOffset.y;
      }
      this.dragElement = undefined;
      this.dragOffset = undefined;
    }
  }

  private tryDrop(dragElement: Panel, dropTarget: Panel) {
    if (dropTarget === this.rootPanel) {
      // Cannot drop on root panel
      return false;
    }

    if (this.onDrop) {
      return this.onDrop(dragElement, dropTarget);
    }

    // Block drag and drop by default
    return false;
  }
}
