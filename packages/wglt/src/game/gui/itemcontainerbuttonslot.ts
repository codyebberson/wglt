import { ButtonSlot } from '../../graphics/gui/buttonslot';
import { Panel } from '../../graphics/gui/panel';
import { ItemButton } from './itembutton';

export class ItemContainerButtonSlot extends ButtonSlot {
  onDrop(panel: Panel): boolean {
    return panel instanceof ItemButton;
  }
}
