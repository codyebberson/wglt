import { Message } from '../../core/message';
import { Sprite } from '../sprite';

export interface SelectOption {
  id?: string;
  name: string;
  icon?: Sprite;
  description?: string;
  details?: Message[];
}
