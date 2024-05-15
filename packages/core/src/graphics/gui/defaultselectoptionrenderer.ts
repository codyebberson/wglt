import { Vec2 } from '@wglt/core';
import { SimplePalette } from '@wglt/core';
import { GUI } from './gui';
import { SelectOption } from './selectoption';
import { SelectOptionRenderer } from './selectoptionrenderer';

export class DefaultSelectOptionRenderer implements SelectOptionRenderer {
  getHeight(_option: SelectOption, _selected: boolean): number {
    return 10;
  }

  drawOption(gui: GUI, point: Vec2, option: SelectOption, selected: boolean): void {
    const color = selected ? SimplePalette.YELLOW : SimplePalette.WHITE;
    gui.app.drawString(option.name, point.x, point.y, color);
  }
}
