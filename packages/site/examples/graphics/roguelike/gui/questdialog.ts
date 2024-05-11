import { Rect } from '@wglt/core';
import { Pico8Palette } from '@wglt/core';
import { Dialog } from '@wglt/graphics';
import { Quest } from '../quests/quest';

const MARGIN = 8;

export class QuestDialog extends Dialog {
  quest?: Quest;

  constructor(rect: Rect) {
    super(rect);
    this.modal = true;
  }

  drawContents(): void {
    super.drawContents();

    if (!this.gui || !this.gui.renderer.buttonSlotRect || !this.quest) {
      return;
    }

    // Update positions of button slots
    const containerRect = this.rect;
    const x = containerRect.x + MARGIN;
    let y = containerRect.y + MARGIN;

    for (let i = 0; i < this.quest.description.length; i++) {
      this.gui.app.drawString(this.quest.description[i], x, y, Pico8Palette.WHITE);
      y += 10;
    }

    this.rect.height = Math.max(200, y + MARGIN - containerRect.y);
    this.drawChildren();
  }
}
