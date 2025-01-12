import { ButtonSlot } from './buttonslot';
import { ItemButton } from './itembutton';
import { Panel } from './panel';

export class ItemContainerButtonSlot extends ButtonSlot {
  onDrop(panel: Panel) {
    return panel instanceof ItemButton;
  }
}
