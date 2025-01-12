import { Color, Console, Message, serializable, wordWrap } from 'wglt';
import { Colors } from './color';

@serializable
export class MessageLog {
  readonly messages: Message[] = [];

  /**
   * Adds a message to the log.
   * @param text The message text.
   * @param fg The text color.
   */
  add(text: string, fg: Color = Colors.WHITE): void {
    this.messages.push(new Message(text, fg));
  }

  /**
   * Renders this log over the given area.
   * @param console The console to render the message log to.
   * @param x The x coordinate to start rendering at.
   * @param y The y coordinate to start rendering at.
   * @param width The width of the area to render to.
   * @param height The height of the message log.
   */
  render(console: Console, x: number, y: number, width: number, height: number): void {
    let yOffset = height - 1;
    for (let i = this.messages.length - 1; i >= 0 && yOffset >= 0; i--) {
      const message = this.messages[i];
      const lines = wordWrap(message.text as string, width).reverse();
      for (const line of lines) {
        console.drawString(x, y + yOffset, line, message.fg);
        yOffset--;
      }
    }
  }
}
