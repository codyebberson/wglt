
import {App} from './app';
import {DialogRenderer} from './gui/dialogrenderer';
import {ItemShortcutButton} from './gui/itemshortcutbutton';
import {Panel} from './gui/panel';
import {TalentButton} from './gui/talentbutton';
import {Mouse} from './mouse';
import {Rect} from './rect';
import {Vec2} from './vec2';
import { ItemButton } from './gui/itembutton';
import { Serializable } from './serializable';

@Serializable('GUI')
export class GUI {
  readonly app: App;
  readonly renderer: DialogRenderer;
  readonly rootPanel: Panel;
  dragElement?: Panel;
  dragOffset?: Vec2;

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

  getPanelAt(point: Vec2|Mouse) {
    return this.rootPanel.getPanelAt(point);
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
      if (target && target.onDrop(dragElement)) {
        // Found a valid drop target
        dragElement.rect.x = target.rect.x;
        dragElement.rect.y = target.rect.y;
        dragElement.move(target);
      } else if (dragElement instanceof ItemButton && target === this.rootPanel) {
        // Drop item(s)
        dragElement.removeAll();
      } else if (dragElement instanceof ItemShortcutButton && target === this.rootPanel) {
        // Destroy the shortcut
        if (dragElement.parent) {
          dragElement.parent.remove(dragElement);
        }
      } else if (dragElement instanceof TalentButton && dragElement.shortcut && target === this.rootPanel) {
        // Destroy the shortcut
        if (dragElement.parent) {
          dragElement.parent.remove(dragElement);
        }
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
