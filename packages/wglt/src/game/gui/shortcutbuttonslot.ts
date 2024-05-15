import { ButtonSlot } from '../../graphics/gui/buttonslot';
import { Panel } from '../../graphics/gui/panel';
import { ItemButton } from './itembutton';
import { ItemShortcutButton } from './itemshortcutbutton';
import { TalentButton } from './talentbutton';

export class ShortcutButtonSlot extends ButtonSlot {
  onDrop(panel: Panel): boolean {
    if (this.children.length > 0) {
      // Already has a button
      // TODO: Add ability to replace an existing shortcut
      return false;
    }

    if (panel instanceof ItemButton) {
      const itemButton = panel as ItemButton;
      const containerItems = itemButton.containerItems;
      const shortcutItem = itemButton.stackItems.get(0);
      this.addChild(new ItemShortcutButton(this.rect.clone(), containerItems, shortcutItem));
      // Even though the operation was successful,
      // return false because we don't want to move the original button
      return false;
    }

    if (panel instanceof TalentButton) {
      if (panel.shortcut) {
        // Move the existing shortcut
        return true;
      }
      // Create a shortcut to the talent
      this.addChild(new TalentButton(this.rect.clone(), panel.talent, true));
      return false;
    }

    if (panel instanceof ItemShortcutButton || (panel instanceof TalentButton && panel.shortcut)) {
      // Move button
      return true;
    }

    return false;
  }
}
