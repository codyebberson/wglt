import { Effect } from './effect';
import { Rect } from '../rect';
export declare class ScrollEffect extends Effect {
    readonly viewport: Rect;
    readonly dx: number;
    readonly dy: number;
    constructor(entity: Rect, dx: number, dy: number, count: number);
    update(): void;
}
