import { Point, Rect, SimplePalette } from '@wglt/core';
import { Terminal } from '../terminal';
import { Dialog } from './dialog';
import { DialogState } from './dialogstate';

export class DefaultDialogRenderer {
  getState(terminal: Terminal, dialog: Dialog): DialogState {
    const width = dialog.contentsRect.width + 4;
    const height = dialog.contentsRect.height + 4;
    const x = ((terminal.width - width) / 2) | 0;
    const y = ((terminal.height - height) / 2) | 0;
    return new DialogState(dialog, new Rect(x, y, width, height), new Point(x + 2, y + 2));
  }

  draw(term: Terminal, dialogState: DialogState): void {
    const dialog = dialogState.dialog;
    const { x, y, width, height } = dialogState.rect;
    term.fillRect(x, y, width, height, 0, SimplePalette.WHITE, SimplePalette.BLACK);
    term.drawSingleBox(x, y, width, height);
    term.drawCenteredString((x + width / 2) | 0, y, ` ${dialog.title} `);
    dialog.drawContents(term, dialogState.contentsOffset);
  }
}
