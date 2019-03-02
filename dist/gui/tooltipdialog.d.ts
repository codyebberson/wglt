import { Message } from '../message';
import { Dialog } from './dialog';
export declare class TooltipDialog extends Dialog {
    messages: Message[];
    constructor();
    showAt(x: number, y: number): void;
    drawContents(): void;
    handleInput(): boolean;
}
