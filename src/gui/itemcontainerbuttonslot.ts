import {ArrayList} from '../arraylist';
import {Item} from '../item';
import {Key} from '../keys';
import {Rect} from '../rect';

import {ButtonSlot} from './buttonslot';
import {ItemButton} from './itembutton';
import {Panel} from './panel';
import { Serializable } from '../serializable';

@Serializable('ItemContainerButtonSlot')
export class ItemContainerButtonSlot extends ButtonSlot {
  readonly items: ArrayList<Item>;

  constructor(rect: Rect, items: ArrayList<Item>, shortcutKey?: Key) {
    super(rect, shortcutKey);
    this.items = items;
  }

  onDrop(panel: Panel) {
    return panel instanceof ItemButton;
  }
}
