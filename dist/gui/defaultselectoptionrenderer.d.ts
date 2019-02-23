import { GUI } from '../gui';
import { Vec2 } from '../vec2';
import { SelectOption } from './selectoption';
import { SelectOptionRenderer } from './selectoptionrenderer';
export declare class DefaultSelectOptionRenderer implements SelectOptionRenderer {
    getHeight(option: SelectOption, selected: boolean): number;
    drawOption(gui: GUI, point: Vec2, option: SelectOption, selected: boolean): void;
}
