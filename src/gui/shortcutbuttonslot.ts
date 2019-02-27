import {Button} from './button';
import {ButtonSlot} from './buttonslot';
import {ItemButton} from './itembutton';
import {ItemShortcutButton} from './itemshortcutbutton';
import {Panel} from './panel';

export class ShortcutButtonSlot extends ButtonSlot {
  onDrop(panel: Panel) {
    if (this.children.length > 0) {
      // Already has a button
      // TODO: Add ability to replace an existing shortcut
      return false;
    }

    if (panel instanceof ItemButton) {
      const itemButton = panel as ItemButton;
      const containerItems = itemButton.containerItems;
      const shortcutItem = itemButton.stackItems.get(0);
      this.add(new ItemShortcutButton(this.rect.clone(), containerItems, shortcutItem));
    }

    // if (!(panel instanceof Button)) {
    //   // Not a button
    //   return false;
    // }

    // this.add(new ItemShortcutButton(this.rect.clone(), panel as Button));

    // Even though the operation was successful,
    // return false because we don't want to move the original button
    return false;
  }
}
