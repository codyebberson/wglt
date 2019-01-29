
// import {Application} from '../application';
// // import {Console} from '../console';
// import {Keys} from '../keys';
// import {Point} from '../point';
// import {Rect} from '../rect';

// import {Dialog} from './dialog';

// export class MessageDialog extends Dialog {
//   readonly lines: string[];

//   constructor(title: string, message: string) {
//     const lines = message.split('\n');
//     let width = title.length;
//     for (let i = 0; i < lines.length; i++) {
//       width = Math.max(width, lines[i].length);
//     }

//     const height = lines.length;
//     const rect = new Rect(0, 0, width, height);
//     super(rect, title);
//     this.lines = lines;
//   }

//   drawContents(app: Application, offset: Point) {
//     for (let i = 0; i < this.lines.length; i++) {
//       app.drawString(this.lines[i], offset.x, offset.y + i);
//     }
//   }

//   handleInput(app: Application, offset: Point) {
//     return app.isKeyPressed(Keys.VK_ESCAPE);
//   }
// }
