import { Dialog } from '../../core/gui/dialog';
import { Label } from '../../core/gui/label';
import { MessageDialog } from '../../core/gui/messagedialog';
import { SelectInput } from '../../core/gui/selectinput';
import { Theme } from '../../core/gui/theme';
import { Terminal } from '../terminal';
import { TerminalDialogRenderer } from './dialogrenderer';
import { TerminalLabelRenderer } from './labelrenderer';
import { TerminalSelectInputRenderer } from './selectinputrenderer';

export class DefaultTerminalTheme extends Theme<Terminal> {
  constructor() {
    super();

    this.renderers.set(Dialog, new TerminalDialogRenderer());
    this.renderers.set(MessageDialog, new TerminalDialogRenderer());
    this.renderers.set(Label, new TerminalLabelRenderer());
    this.renderers.set(SelectInput, new TerminalSelectInputRenderer());
  }
}
