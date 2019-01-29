
// import {Application} from '../application';
// import {Colors} from '../colors';
// import {Point} from '../point';
// import {Rect} from '../rect';

// // import {Terminal} from '../terminal';

// import {Dialog} from './dialog';
// import {DialogRenderer} from './dialogrenderer';
// import {DialogState} from './dialogstate';

// export class DefaultDialogRenderer implements DialogRenderer {
//   getState(app: Application, dialog: Dialog) {
//     const width = dialog.contentsRect.width + 4;
//     const height = dialog.contentsRect.height + 4;
//     const x = ((app.width - width) / 2) | 0;
//     const y = ((app.height - height) / 2) | 0;
//     return new DialogState(
//         dialog, new Rect(x, y, width, height), new Point(x + 2, y + 2));
//   }

//   draw(app: Application, dialogState: DialogState) {
//     const dialog = dialogState.dialog;
//     const {x, y, width, height} = dialogState.rect;
//     // term.fillRect(x, y, width, height, 0, Colors.WHITE, Colors.BLACK);
//     // app.drawSingleBox(x, y, width, height);
//     app.drawCenteredString(' ' + dialog.title + ' ', x + (width / 2) | 0, y);
//     dialog.drawContents(app, dialogState.contentsOffset);
//   }
// }