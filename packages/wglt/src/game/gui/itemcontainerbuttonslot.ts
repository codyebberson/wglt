import { Panel } from '../../core/gui/panel';
import { ButtonSlot } from '../../graphics/gui/buttonslot';
import { ItemButton } from './itembutton';

export class ItemContainerButtonSlot extends ButtonSlot {
  onDrop(panel: Panel): boolean {
    return panel instanceof ItemButton;
  }
}
