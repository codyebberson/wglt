import { Point } from '../../core/point';
import { BaseApp } from '../baseapp';
import { SelectOption } from './selectoption';

export interface SelectOptionRenderer {
  getHeight(option: SelectOption, selected: boolean): number;

  drawOption(app: BaseApp, point: Point, option: SelectOption, selected: boolean): void;
}
