import {Item} from '../item';
import {Rect} from '../rect';
import {XArray} from '../xarray';

import {ButtonSlot} from './buttonslot';
import {ItemButton} from './itembutton';
import {Panel} from './panel';

export class ItemContainerButtonSlot extends ButtonSlot {
  readonly items: XArray<Item>;

  constructor(rect: Rect, items: XArray<Item>) {
    super(rect);
    this.items = items;
  }

  onDrop(panel: Panel) {
    return panel instanceof ItemButton;
  }
}
