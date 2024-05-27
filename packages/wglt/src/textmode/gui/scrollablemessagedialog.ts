import { Dialog } from '../../core/gui/dialog';
import { Key } from '../../core/keys';
import { Point } from '../../core/point';
import { Rect } from '../../core/rect';
import { Chars } from '../chars';
import { Console } from '../console';
import { Terminal } from '../terminal';
import { Message } from './message';

export class ScrollableMessageDialog extends Dialog {
  readonly messagesHeight: number;
  readonly scrollMax: number;
  readonly scrollbarHeight: number;
  scrollY = 0;

  constructor(
    rect: Rect,
    title: string,
    readonly message: Message
  ) {
    super(rect, title);
    this.messagesHeight = message.getHeight();
    this.scrollMax = Math.max(1, this.messagesHeight - this.rect.height);
    this.scrollbarHeight = (this.rect.height * this.rect.height) / (this.messagesHeight + 1);
  }

  drawContents(console: Console, offset: Point): void {
    console.clip = this.rect;
    console.drawMessage(offset.x, offset.y - this.scrollY, this.message, this.message.getWidth());
    console.clip = undefined;

    // Draw scrollbar
    const scrollbarY = (this.scrollY / this.scrollMax) * (this.rect.height - this.scrollbarHeight);
    console.drawVLine(
      this.rect.x + this.rect.width + 1,
      this.rect.y + scrollbarY,
      this.scrollbarHeight,
      Chars.MEDIUM_SHADE
    );
  }

  handleInput(terminal: Terminal): boolean {
    const moveKey = terminal.getMovementKey();
    if (moveKey) {
      this.scrollY += moveKey.y;
    }
    if (terminal.isKeyPressed(Key.VK_PAGE_DOWN)) {
      this.scrollY += this.rect.height;
    }
    if (terminal.isKeyPressed(Key.VK_PAGE_UP)) {
      this.scrollY -= this.rect.height;
    }
    if (terminal.mouse.wheelDeltaY !== 0) {
      this.scrollY += terminal.mouse.wheelDeltaY < 0 ? -5 : 5;
      terminal.mouse.wheelDeltaY = 0;
    }
    this.scrollY = Math.max(0, Math.min(this.scrollMax, this.scrollY));
    return terminal.isKeyPressed(Key.VK_ESCAPE);
  }
}
