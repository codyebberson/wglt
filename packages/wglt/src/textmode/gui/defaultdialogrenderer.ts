// import { Dialog } from '../../core/gui/dialog';
// import { SimplePalette } from '../../core/palettes/simple';
// import { Terminal } from '../terminal';

// export class DefaultDialogRenderer {
//   // getState(terminal: Terminal, dialog: Dialog): DialogState {
//   //   const width = dialog.contentsRect.width + 4;
//   //   const height = dialog.contentsRect.height + 4;
//   //   const x = ((terminal.width - width) / 2) | 0;
//   //   const y = ((terminal.height - height) / 2) | 0;
//   //   return new DialogState(dialog, new Rect(x, y, width, height), new Point(x + 2, y + 2));
//   // }

//   draw(term: Terminal, dialog: Dialog): void {
//     // const dialog = dialogState.dialog;
//     const { x, y, width, height } = dialog.rect;
//     // term.fillRect(x, y, width, height, 0, SimplePalette.WHITE, SimplePalette.BLACK);
//     term.fillRect(x, y, width, height, SimplePalette.BLACK);
//     // term.drawSingleBox(x, y, width, height);
//     term.drawCenteredString(` ${dialog.title} `, (x + width / 2) | 0, y);
//     // dialog.drawContents(term, dialogState.contentsOffset);
//     dialog.draw(app);
//   }
// }
