import {Key} from '../keys';
import {Rect} from '../rect';

import {ButtonSlot} from './buttonslot';
import {ItemButton} from './itembutton';
import {Panel} from './panel';
import { Serializable } from '../serializable';

@Serializable('ItemContainerButtonSlot')
export class ItemContainerButtonSlot extends ButtonSlot {

  constructor(rect: Rect, shortcutKey?: Key) {
    super(rect, shortcutKey);
  }

  onDrop(panel: Panel) {
    return panel instanceof ItemButton;
  }
}
