import { Vec2 } from '../../core/vec2';
import { BaseApp } from '../baseapp';
import { SelectOption } from './selectoption';

export interface SelectOptionRenderer {
  getHeight(option: SelectOption, selected: boolean): number;

  drawOption(app: BaseApp, point: Vec2, option: SelectOption, selected: boolean): void;
}
