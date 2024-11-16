import { Color } from './color';
import { serializable } from './serialize';

@serializable
export class Message {
  constructor(
    readonly text: string | undefined,
    readonly fg?: Color | undefined
  ) {}
}
