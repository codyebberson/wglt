import { Message } from '../../core/message.ts';
import { Sprite } from '../sprite.ts';

export interface SelectOption {
  id?: string;
  name: string;
  icon?: Sprite;
  description?: string;
  details?: Message[];
}
