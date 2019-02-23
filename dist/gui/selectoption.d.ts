import { Sprite } from "../sprite";
import { Message } from "../message";
export interface SelectOption {
    name: string;
    icon?: Sprite;
    description?: string;
    details?: Message[];
}
