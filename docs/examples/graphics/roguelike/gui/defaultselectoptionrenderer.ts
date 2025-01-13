import { GUI } from '../gui';
import { StandardColors } from '../palettes/standardcolors';
import { Vec2 } from '../vec2';
import { SelectOption } from './selectoption';
import { SelectOptionRenderer } from './selectoptionrenderer';

export class DefaultSelectOptionRenderer implements SelectOptionRenderer {
  getHeight(_option: SelectOption, _selected: boolean) {
    return 10;
  }

  drawOption(gui: GUI, point: Vec2, option: SelectOption, selected: boolean) {
    const color = selected ? StandardColors.YELLOW : StandardColors.WHITE;
    gui.app.drawString(option.name, point.x, point.y, color);
  }
}
