import { Message } from '../../core/message';
import { Sprite } from '../sprite';

export interface SelectOption {
  name: string;
  icon?: Sprite;
  description?: string;
  details?: Message[];
}
