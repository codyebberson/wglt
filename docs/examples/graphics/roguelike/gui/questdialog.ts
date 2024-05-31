import { BaseApp, Dialog, Pico8Palette } from 'wglt';
import { Quest } from '../quests/quest';

const MARGIN = 8;

export class QuestDialog extends Dialog {
  quest?: Quest;

  draw(app: BaseApp): void {
    super.draw(app);

    if (!this.quest) {
      return;
    }

    // Update positions of button slots
    const containerRect = this.rect;
    const x = containerRect.x + MARGIN;
    let y = containerRect.y + MARGIN;

    for (let i = 0; i < this.quest.description.length; i++) {
      app.drawString(x, y, this.quest.description[i], Pico8Palette.WHITE);
      y += 10;
    }

    this.rect.height = Math.max(200, y + MARGIN - containerRect.y);
    this.drawChildren(app);
  }
}
