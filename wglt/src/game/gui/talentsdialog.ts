import { ArrayList } from '../../core/arraylist';
import { BaseApp } from '../../core/baseapp';
import { ButtonSlot } from '../../core/gui/buttonslot';
import { Dialog } from '../../core/gui/dialog';
import { Key } from '../../core/keys';
import { Message } from '../../core/message';
import { Rect } from '../../core/rect';
import { Talent } from '../talent';
import { TalentButton } from './talentbutton';

const MARGIN = 4;
const BUTTON_SPACING = 2;

export class TalentsDialog extends Dialog {
  readonly messages: Message[];
  readonly capacity: number;
  readonly talents: ArrayList<Talent>;

  constructor(rect: Rect, messages: Message[], capacity: number, talents: ArrayList<Talent>) {
    super(rect);
    this.messages = messages;
    this.capacity = capacity;
    this.talents = talents;

    talents.addListener({
      onAdd: (_, talent) => this.addItem(talent),
      onRemove: (_, talent) => this.removeItem(talent),
    });

    for (let i = 0; i < capacity; i++) {
      // Slots are repositioned at render time
      const key = `Key${String.fromCharCode('A'.charCodeAt(0) + i)}` as Key;
      this.addChild(new ButtonSlot(new Rect(0, 0, 24, 24), key));
    }
  }

  private addItem(talent: Talent): void {
    const freeSlot = this.getNextFreeSlot();
    if (freeSlot) {
      freeSlot.addChild(new TalentButton(freeSlot.rect.clone(), talent));
    }
  }

  private removeItem(talent: Talent): void {
    for (let i = 0; i < this.children.length; i++) {
      const buttonSlot = this.children.get(i) as ButtonSlot;
      const button = buttonSlot.button;
      if (button && button instanceof TalentButton) {
        if (button.talent === talent) {
          buttonSlot.removeChild(button);
        }
      }
    }
  }

  private getNextFreeSlot(): ButtonSlot | undefined {
    for (let i = 0; i < this.children.length; i++) {
      const buttonSlot = this.children.get(i) as ButtonSlot;
      if (!buttonSlot.button) {
        return buttonSlot;
      }
    }
    return undefined;
  }

  draw(app: BaseApp): void {
    super.draw(app);

    // const buttonRect = (this.gui.renderer as GraphicsDialogRenderer)?.buttonSlotRect;
    // if (!buttonRect) {
    //   return;
    // }

    // TODO
    const buttonRect = new Rect(0, 32, 24, 24);

    // Update positions of button slots
    const containerRect = this.rect;
    let x = containerRect.x + MARGIN;
    let y = containerRect.y + MARGIN;

    for (let i = 0; i < this.messages.length; i++) {
      const msg = this.messages[i];
      app.drawString(x, y, msg.text, msg.color);
      y += 10;
    }

    for (let i = 0; i < this.capacity; i++) {
      const child = this.children.get(i);
      child.rect.x = x;
      child.rect.y = y;
      child.rect.width = buttonRect.width;
      child.rect.height = buttonRect.height;

      x += buttonRect.width + BUTTON_SPACING;
      if (x > containerRect.x2 - buttonRect.width - MARGIN) {
        x = containerRect.x + MARGIN;
        y += buttonRect.height + BUTTON_SPACING;
      }
    }

    this.rect.height = y + MARGIN - containerRect.y;
    this.drawChildren(app);
  }
}
