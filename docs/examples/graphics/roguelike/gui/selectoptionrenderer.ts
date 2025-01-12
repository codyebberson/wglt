import {GUI} from '../gui';
import {Vec2} from '../vec2';

import {SelectOption} from './selectoption';

export interface SelectOptionRenderer {
  getHeight(option: SelectOption, selected: boolean): number;

  drawOption(gui: GUI, point: Vec2, option: SelectOption, selected: boolean): void;
}