import { Rect } from '../rect';
import { Effect } from './effect';
export declare class ScrollEffect extends Effect {
    readonly viewport: Rect;
    readonly dx: number;
    readonly dy: number;
    constructor(entity: Rect, dx: number, dy: number, count: number);
    update(): void;
}
