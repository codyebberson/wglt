// import { GUI } from '../../core/gui/gui';
// import { SelectOption } from '../../core/gui/selectoption';
// import { SelectOptionRenderer } from '../../core/gui/selectoptionrenderer';
// import { SimplePalette } from '../../core/palettes/simple';
// import { Vec2 } from '../../core/vec2';

// export class DefaultSelectOptionRenderer implements SelectOptionRenderer {
//   getHeight(_option: SelectOption, _selected: boolean): number {
//     return 10;
//   }

//   drawOption(gui: GUI, point: Vec2, option: SelectOption, selected: boolean): void {
//     const color = selected ? SimplePalette.YELLOW : SimplePalette.WHITE;
//     gui.app.drawString(option.name, point.x, point.y, color);
//   }
// }