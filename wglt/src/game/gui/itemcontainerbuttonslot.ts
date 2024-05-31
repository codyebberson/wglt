import { ButtonSlot } from '../../core/gui/buttonslot';
import { Component } from '../../core/gui/component';
import { ItemButton } from './itembutton';

export class ItemContainerButtonSlot extends ButtonSlot {
  onDrop(component: Component): boolean {
    if (component instanceof ItemButton) {
      this.moveChild(component);
      return true;
    }
    return false;
  }
}
