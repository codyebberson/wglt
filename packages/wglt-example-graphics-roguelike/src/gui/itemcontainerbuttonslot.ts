import { ButtonSlot, Component } from 'wglt';
import { ItemButton } from './itembutton';

export class ItemContainerButtonSlot extends ButtonSlot {
  onDrop(source: Component): boolean {
    if (source instanceof ItemButton) {
      this.moveChild(source);
      return true;
    }
    return false;
  }
}
