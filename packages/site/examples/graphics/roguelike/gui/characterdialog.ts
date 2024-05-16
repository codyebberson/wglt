import { Pico8Palette, Rect } from 'wglt';
import { ButtonSlot, Dialog } from 'wglt';
import { ItemButton } from 'wglt';
import { Player } from '../entities/player';
import { Equipment } from '../equipment/equipment';
import { EquipmentSlot } from '../equipment/equipmentslot';

const MARGIN = 4;
const BUTTON_SPACING = 2;

export class CharacterDialog extends Dialog {
  readonly player: Player;

  constructor(rect: Rect, player: Player) {
    super(rect);
    this.player = player;
    this.modal = true;

    const capacity = 10;
    for (let i = 0; i < capacity; i++) {
      // Slots are repositioned at render time
      this.addChild(new ButtonSlot(new Rect(0, 0, 24, 24)));
    }

    player.equipment.addListener({
      onAdd: (_, item) => this.addItem(item),
      onRemove: (_, item) => this.removeItem(item),
    });
  }

  get headSlot(): ButtonSlot {
    return this.children.get(0) as ButtonSlot;
  }

  get neckSlot(): ButtonSlot {
    return this.children.get(1) as ButtonSlot;
  }

  get backSlot(): ButtonSlot {
    return this.children.get(2) as ButtonSlot;
  }

  get chestSlot(): ButtonSlot {
    return this.children.get(3) as ButtonSlot;
  }

  get handsSlot(): ButtonSlot {
    return this.children.get(4) as ButtonSlot;
  }

  get legsSlot(): ButtonSlot {
    return this.children.get(5) as ButtonSlot;
  }

  get feetSlot(): ButtonSlot {
    return this.children.get(6) as ButtonSlot;
  }

  get ringSlot(): ButtonSlot {
    return this.children.get(7) as ButtonSlot;
  }

  get mainHandSlot(): ButtonSlot {
    return this.children.get(8) as ButtonSlot;
  }

  get offHandSlot(): ButtonSlot {
    return this.children.get(9) as ButtonSlot;
  }

  private addItem(item: Equipment): void {
    const slot = this.getSlot(item);
    if (slot) {
      slot.addChild(new ItemButton(slot.rect.clone(), this.player.inventory, item));
    }
  }

  private removeItem(item: Equipment): void {
    const slot = this.getSlot(item);
    if (slot) {
      const button = slot.button;
      if (button) {
        slot.removeChild(button);
      }
    }
  }

  private getSlot(item: Equipment): ButtonSlot | undefined {
    switch (item.slot) {
      case EquipmentSlot.HEAD:
        return this.headSlot;
      case EquipmentSlot.NECK:
        return this.neckSlot;
      case EquipmentSlot.BACK:
        return this.backSlot;
      case EquipmentSlot.CHEST:
        return this.chestSlot;
      case EquipmentSlot.HANDS:
        return this.handsSlot;
      case EquipmentSlot.LEGS:
        return this.legsSlot;
      case EquipmentSlot.FEET:
        return this.feetSlot;
      case EquipmentSlot.RING:
        return this.ringSlot;
      case EquipmentSlot.MAINHAND:
        return this.mainHandSlot;
      case EquipmentSlot.OFFHAND:
        return this.offHandSlot;
      default:
        return undefined;
    }
  }

  drawContents(): void {
    super.drawContents();

    if (!this.gui || !this.gui.renderer.buttonSlotRect) {
      return;
    }

    // Update positions of button slots
    const containerRect = this.rect;
    const buttonRect = this.gui.renderer.buttonSlotRect;
    const centerX = ((containerRect.x1 + containerRect.x2) / 2) | 0;
    const x = containerRect.x + MARGIN;
    let y = containerRect.y + MARGIN;

    this.gui.app.drawCenteredString('ORYX THE BRAVE', centerX, y, Pico8Palette.WHITE);
    y += 10;

    const desc = `Level ${this.player.level}`;

    this.gui.app.drawCenteredString(desc, centerX, y, Pico8Palette.WHITE);
    y += 10;

    // Draw the player sprite at 2x
    this.player.sprite.draw(this.gui.app, centerX - 8, y + 32);

    // Left column:  head, neck, back, chest
    for (let i = 0; i < 4; i++) {
      const child = this.children.get(i);
      child.rect.x = x;
      child.rect.y = y + i * (buttonRect.height + BUTTON_SPACING);
      child.rect.width = buttonRect.width;
      child.rect.height = buttonRect.height;
    }

    // Right column: hands, legs, ring1, ring2
    for (let i = 0; i < 4; i++) {
      const child = this.children.get(4 + i);
      child.rect.x = containerRect.x2 - MARGIN - buttonRect.width;
      child.rect.y = y + i * (buttonRect.height + BUTTON_SPACING);
      child.rect.width = buttonRect.width;
      child.rect.height = buttonRect.height;
    }

    this.mainHandSlot.rect.x = centerX - buttonRect.width - 1;
    this.mainHandSlot.rect.y = y + 90;
    this.mainHandSlot.rect.width = buttonRect.width;
    this.mainHandSlot.rect.height = buttonRect.height;

    this.offHandSlot.rect.x = centerX + 1;
    this.offHandSlot.rect.y = y + 90;
    this.offHandSlot.rect.width = buttonRect.width;
    this.offHandSlot.rect.height = buttonRect.height;

    y += 5 * (buttonRect.height + BUTTON_SPACING) + MARGIN;

    this.gui.app.drawString('Armor', x + 2, y, Pico8Palette.YELLOW);
    this.gui.app.drawRightString(this.player.armor.toString(), x + 85, y, Pico8Palette.WHITE);
    y += 10;

    this.gui.app.drawString('Constitution', x + 2, y, Pico8Palette.YELLOW);
    this.gui.app.drawRightString(
      this.player.constitution.toString(),
      x + 85,
      y,
      Pico8Palette.WHITE
    );
    this.gui.app.drawString(`+${this.player.constitutionModifier}`, x + 95, y, Pico8Palette.GREEN);
    y += 10;

    this.gui.app.drawString('Strength', x + 2, y, Pico8Palette.YELLOW);
    this.gui.app.drawRightString(this.player.strength.toString(), x + 85, y, Pico8Palette.WHITE);
    this.gui.app.drawString(`+${this.player.strengthModifier}`, x + 95, y, Pico8Palette.GREEN);
    y += 10;

    this.gui.app.drawString('Dexterity', x + 2, y, Pico8Palette.YELLOW);
    this.gui.app.drawRightString(this.player.dexterity.toString(), x + 85, y, Pico8Palette.WHITE);
    this.gui.app.drawString(`+${this.player.dexterityModifier}`, x + 95, y, Pico8Palette.GREEN);
    y += 10;

    this.gui.app.drawString('Intelligence', x + 2, y, Pico8Palette.YELLOW);
    this.gui.app.drawRightString(
      this.player.intelligence.toString(),
      x + 85,
      y,
      Pico8Palette.WHITE
    );
    this.gui.app.drawString(`+${this.player.intelligenceModifier}`, x + 95, y, Pico8Palette.GREEN);
    y += 10;

    this.rect.height = y + MARGIN - containerRect.y;
    this.drawChildren();
  }
}
