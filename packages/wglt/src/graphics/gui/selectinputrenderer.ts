import type { Font } from '../../core/font';
import { GUI } from '../../core/gui/gui';
import type { Renderer } from '../../core/gui/renderer';
import { SelectInput } from '../../core/gui/selectinput';
import { GraphicsApp } from '../graphicsapp';

export class GraphicsSelectInputRenderer implements Renderer<GraphicsApp, SelectInput> {
  readonly font: Font | undefined;

  constructor(font?: Font) {
    this.font = font;
  }

  render(gui: GUI<GraphicsApp>, component: SelectInput): void {
    const app = gui.context;
    const options = component.options;
    const offset = component.screenRect;
    const margin = component.margin;
    const lineHeight = component.lineHeight;
    for (let i = 0; i < options.length; i++) {
      const str = `${String.fromCharCode(65 + i)} - ${options[i].name}`;
      app.drawString(
        offset.x + margin,
        offset.y + margin + i * lineHeight,
        str,
        undefined,
        undefined,
        this.font
      );
    }
  }
}
