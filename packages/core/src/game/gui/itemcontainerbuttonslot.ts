import { Panel } from '@wglt/graphics';
import { ButtonSlot } from '@wglt/graphics';
import { ItemButton } from './itembutton';

export class ItemContainerButtonSlot extends ButtonSlot {
  onDrop(panel: Panel): boolean {
    return panel instanceof ItemButton;
  }
}
