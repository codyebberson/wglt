import {StandardColors} from '../palettes/standardcolors';
import {GUI} from '../gui';
import {Vec2} from '../vec2';

import {SelectOption} from './selectoption';
import {SelectOptionRenderer} from './selectoptionrenderer';
import { Serializable } from '../serializable';

@Serializable('DefaultSelectOptionRenderer')
export class DefaultSelectOptionRenderer implements SelectOptionRenderer {
  getHeight(option: SelectOption, selected: boolean) {
    return 10;
  }

  drawOption(gui: GUI, point: Vec2, option: SelectOption, selected: boolean) {
    const color = selected ? StandardColors.YELLOW : StandardColors.WHITE;
    gui.app.drawString(option.name, point.x, point.y, color);
  }
}