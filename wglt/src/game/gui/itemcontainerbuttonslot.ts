import { ButtonSlot } from '../../core/gui/buttonslot';
import { Panel } from '../../core/gui/panel';
import { ItemButton } from './itembutton';

export class ItemContainerButtonSlot extends ButtonSlot {
  onDrop(panel: Panel): boolean {
    return panel instanceof ItemButton;
  }
}
