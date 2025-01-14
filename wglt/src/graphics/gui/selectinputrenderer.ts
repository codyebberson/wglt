import { GUI } from '../../core/gui/gui';
import { Renderer } from '../../core/gui/renderer';
import { SelectInput } from '../../core/gui/selectinput';
import { GraphicsApp } from '../graphicsapp';

const MARGIN = 4;
const LINE_HEIGHT = 10;

export class GraphicsSelectInputRenderer implements Renderer<GraphicsApp, SelectInput> {
  render(gui: GUI<GraphicsApp>, component: SelectInput): void {
    const app = gui.context;
    const options = component.options;
    const offset = component.screenRect;
    for (let i = 0; i < options.length; i++) {
      const str = `${String.fromCharCode(65 + i)} - ${options[i].name}`;
      app.drawString(offset.x + MARGIN, offset.y + MARGIN + i * LINE_HEIGHT, str);
    }
  }
}
