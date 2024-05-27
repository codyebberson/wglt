// import { Dialog } from '../../core/gui/dialog';
// import { Key } from '../../core/keys';
// import { Rect } from '../../core/rect';
// import { Vec2 } from '../../core/vec2';
// import { BaseApp } from '../baseapp';
// import { SelectOption } from './selectoption';
// import { SelectOptionRenderer } from './selectoptionrenderer';

// const MARGIN = 4;

// export class ComplexSelectDialog<T extends SelectOption> extends Dialog {
//   options: T[];
//   selectedIndex: number;
//   renderer: SelectOptionRenderer;
//   onSelect?: (option: T) => void;
//   onCancel?: () => void;

//   constructor(rect: Rect, options: T[], renderer: SelectOptionRenderer) {
//     super(rect);
//     this.options = options;
//     this.selectedIndex = 0;
//     this.renderer = renderer;
//   }

//   draw(app: BaseApp): void {
//     super.draw(app);
//     const offset = this.rect;
//     const point = new Vec2(offset.x + MARGIN, offset.y + MARGIN);
//     for (let i = 0; i < this.options.length; i++) {
//       const option = this.options[i];
//       const selected = i === this.selectedIndex;
//       this.renderer.drawOption(this.gui, point, option, selected);
//       point.y += this.renderer.getHeight(option, selected);
//     }
//   }

//   handleInput(app: BaseApp): boolean {
//     for (let i = 0; i < this.options.length; i++) {
//       const key = `Key${String.fromCharCode('A'.charCodeAt(0) + i)}` as Key;
//       if (app.isKeyPressed(key)) {
//         this.selectedIndex = i;
//         if (this.onSelect) {
//           this.onSelect(this.options[i]);
//         }
//       }
//     }

//     if (app.isKeyPressed(Key.VK_ENTER)) {
//       if (this.onSelect) {
//         this.onSelect(this.options[this.selectedIndex]);
//       }
//     }

//     if (app.isKeyPressed(Key.VK_ESCAPE)) {
//       if (this.onCancel) {
//         this.onCancel();
//       }
//     }

//     if (app.isUpKeyPressed()) {
//       this.selectedIndex--;
//     }

//     if (app.isDownKeyPressed()) {
//       this.selectedIndex++;
//     }

//     if (this.selectedIndex < 0) {
//       this.selectedIndex += this.options.length;
//     }

//     if (this.selectedIndex >= this.options.length) {
//       this.selectedIndex -= this.options.length;
//     }

//     const mouse = app.mouse;
//     const offset = this.rect;
//     let y = offset.y + MARGIN;
//     if (mouse.buttons.get(0).upCount === 1 && mouse.x >= offset.x1 && mouse.x < offset.x2) {
//       for (let i = 0; i < this.options.length; i++) {
//         const option = this.options[i];
//         const selected = i === this.selectedIndex;
//         const lineHeight = this.renderer.getHeight(option, selected);
//         const startY = y;
//         const endY = y + lineHeight;
//         if (mouse.y >= startY && mouse.y < endY) {
//           if (selected) {
//             if (this.onSelect) {
//               this.onSelect(option);
//             }
//           } else {
//             this.selectedIndex = i;
//           }
//         }
//         y += lineHeight;
//       }
//     }

//     return true;
//   }
// }
