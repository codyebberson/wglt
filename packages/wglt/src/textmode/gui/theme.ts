import { Dialog } from '../../core/gui/dialog.ts';
import { Label } from '../../core/gui/label.ts';
import { MessageDialog } from '../../core/gui/messagedialog.ts';
import { SelectInput } from '../../core/gui/selectinput.ts';
import { Theme } from '../../core/gui/theme.ts';
import { Terminal } from '../terminal.ts';
import { TerminalDialogRenderer } from './dialogrenderer.ts';
import { TerminalLabelRenderer } from './labelrenderer.ts';
import { TerminalSelectInputRenderer } from './selectinputrenderer.ts';

export class DefaultTerminalTheme extends Theme<Terminal> {
  constructor() {
    super();

    this.renderers.set(Dialog, new TerminalDialogRenderer());
    this.renderers.set(MessageDialog, new TerminalDialogRenderer());
    this.renderers.set(Label, new TerminalLabelRenderer());
    this.renderers.set(SelectInput, new TerminalSelectInputRenderer());
  }
}
