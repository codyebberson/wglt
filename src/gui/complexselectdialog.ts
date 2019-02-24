import {GUI} from '../gui';
import {Keys} from '../keys';
import {Rect} from '../rect';
import {Vec2} from '../vec2';

import {DefaultSelectOptionRenderer} from './defaultselectoptionrenderer';
import {Dialog} from './dialog';
import {SelectOption} from './selectoption';
import {SelectOptionRenderer} from './selectoptionrenderer';

const MARGIN = 4;

export class ComplexSelectDialog extends Dialog {
  options: SelectOption[];
  selectedIndex: number;
  renderer: SelectOptionRenderer;
  onSelect?: Function;
  onCancel?: Function;

  constructor(rect: Rect, title: string, options: SelectOption[]) {
    super(rect, title);
    this.options = options;
    this.selectedIndex = 0;
    this.renderer = new DefaultSelectOptionRenderer();
  }

  drawContents() {
    if (!this.gui) {
      return;
    }

    super.drawContents();
    const offset = this.rect;
    const point = new Vec2(offset.x + MARGIN, offset.y + MARGIN);
    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i];
      const selected = i === this.selectedIndex;
      this.renderer.drawOption(this.gui, point, option, selected);
      point.y += this.renderer.getHeight(option, selected);
    }
  }

  handleInput() {
    if (!this.gui) {
      return false;
    }

    const app = this.gui.app;

    for (let i = 0; i < this.options.length; i++) {
      if (app.isKeyPressed(Keys.VK_A + i)) {
        this.selectedIndex = i;
        if (this.onSelect) {
          this.onSelect(this.options[i]);
        }
      }
    }

    if (app.isKeyPressed(Keys.VK_ENTER)) {
      if (this.onSelect) {
        this.onSelect(this.options[this.selectedIndex]);
      }
    }

    if (app.isKeyPressed(Keys.VK_ESCAPE)) {
      if (this.onCancel) {
        this.onCancel();
      }
    }

    if (app.isKeyPressed(Keys.VK_UP)) {
      this.selectedIndex--;
    }

    if (app.isKeyPressed(Keys.VK_DOWN)) {
      this.selectedIndex++;
    }

    if (this.selectedIndex < 0) {
      this.selectedIndex += this.options.length;
    }

    if (this.selectedIndex >= this.options.length) {
      this.selectedIndex -= this.options.length;
    }

    const mouse = app.mouse;
    const offset = this.rect;
    let y = offset.y + MARGIN;
    if (mouse.upCount === 1 && mouse.x >= offset.x1 && mouse.x < offset.x2) {
      for (let i = 0; i < this.options.length; i++) {
        const option = this.options[i];
        const selected = i === this.selectedIndex;
        const lineHeight = this.renderer.getHeight(option, selected);
        const startY = y;
        const endY = y + lineHeight;
        if (mouse.y >= startY && mouse.y < endY) {
          if (selected) {
            if (this.onSelect) {
              this.onSelect(option);
            }
          } else {
            this.selectedIndex = i;
          }
        }
        y += lineHeight;
      }
    }

    return true;
  }
}
