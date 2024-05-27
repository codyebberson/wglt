// import { SimplePalette } from '../../core/palettes/simple';
// import { Vec2 } from '../../core/vec2';
// import { BaseApp } from '../baseapp';
// import { SelectOption } from './selectoption';
// import { SelectOptionRenderer } from './selectoptionrenderer';

// export class MenuItemRenderer implements SelectOptionRenderer {
//   readonly expandedHeight: number;
//   readonly collapsedHeight: number;

//   constructor(expandedHeight: number, collapsedHeight: number) {
//     this.expandedHeight = expandedHeight;
//     this.collapsedHeight = collapsedHeight;
//   }

//   drawOption(app: BaseApp, point: Vec2, option: SelectOption, selected?: boolean): void {
//     let x = point.x;
//     const y = point.y;
//     let titleColor = SimplePalette.LIGHT_GRAY;
//     let descColor = SimplePalette.LIGHT_GRAY;

//     if (selected) {
//       titleColor = SimplePalette.YELLOW;
//       descColor = SimplePalette.WHITE;
//     }

//     if (option.icon) {
//       option.icon.draw(app, x, y);
//       x += option.icon.width + 2;
//     }

//     app.drawString(option.name, x, y, titleColor);

//     if (option.description) {
//       app.drawString(option.description, x + 3, y + 10, descColor);
//     }

//     if (selected && option.details) {
//       for (let j = 0; j < option.details.length; j++) {
//         const msg = option.details[j];
//         const color = selected ? msg.color : SimplePalette.LIGHT_GRAY;
//         app.drawString(msg.text, x + 3, y + 20 + j * 10, color);
//       }
//     }
//   }

//   getHeight(_: SelectOption, selected: boolean): number {
//     return selected ? this.expandedHeight : this.collapsedHeight;
//   }
// }
