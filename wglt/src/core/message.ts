import { Color } from './color';
import { serializable } from './serialize';

// export const MessageAlign = {
//   LEFT: 'left',
//   CENTER: 'center',
//   RIGHT: 'right',
// };

@serializable
export class Message {
  constructor(
    readonly text: string | undefined,
    readonly fg?: Color | undefined
    // readonly bg?: Color | undefined,
    // readonly children?: Message[],
    // readonly align?: string | undefined
  ) {}

  // static fromChildren(...children: Message[]): Message {
  //   return new Message(undefined, undefined, undefined, children);
  // }

  // readonly text: string;
  // readonly color: Color;

  // constructor(text: string, color: Color) {
  //   this.text = text;
  //   this.color = color;
  // }

  // draw(app: BaseApp, pos: Point): void {
  //   app.drawString(pos.x, pos.y, this.text, this.color, pos);
  // }

  // getWidth(font: Font): number {
  //   return font.getStringWidth(this.text);
  // }
}
