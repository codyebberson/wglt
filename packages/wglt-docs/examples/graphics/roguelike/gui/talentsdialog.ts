import { ArrayList, ButtonSlot, Dialog, Message, Rect, getKeyForLetterByIndex } from 'wglt';
import { Talent } from '../talent';
import { TalentButton } from './talentbutton';

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
      onAdd: (_, talent): void => this.addItem(talent),
      onRemove: (_, talent): void => this.removeItem(talent),
    });

    for (let i = 0; i < capacity; i++) {
      // Slots are repositioned at render time
      const key = getKeyForLetterByIndex(i);
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
}
