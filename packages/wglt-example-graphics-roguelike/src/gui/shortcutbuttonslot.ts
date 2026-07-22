import { ButtonSlot, Component } from 'wglt';
import { ItemButton } from './itembutton';
import { ItemShortcutButton } from './itemshortcutbutton';
import { TalentButton } from './talentbutton';

export class ShortcutButtonSlot extends ButtonSlot {
  onDrop(source: Component): boolean {
    if (this.children.length > 0) {
      // Already has a button
      // TODO: Add ability to replace an existing shortcut
      return false;
    }

    if (source instanceof ItemShortcutButton) {
      // Move the existing shortcut
      source.rect.x = 0;
      source.rect.y = 0;
      this.moveChild(source);
      return true;
    }

    if (source instanceof ItemButton) {
      const itemButton = source as ItemButton;
      const containerItems = itemButton.containerItems;
      const shortcutItem = itemButton.stackItems.get(0);
      this.addChild(new ItemShortcutButton(source.rect.clone(), containerItems, shortcutItem));
      // Even though the operation was successful,
      // return false because we don't want to move the original button
      return false;
    }

    if (source instanceof TalentButton) {
      if (source.shortcut) {
        // Move the existing shortcut
        source.rect.x = 0;
        source.rect.y = 0;
        this.moveChild(source);
        return true;
      }
      // Create a shortcut to the talent
      this.addChild(new TalentButton(source.rect.clone(), source.talent, true));
      return false;
    }

    if (
      source instanceof ItemShortcutButton ||
      (source instanceof TalentButton && source.shortcut)
    ) {
      // Move button
      this.moveChild(source);
      return true;
    }

    return false;
  }
}
