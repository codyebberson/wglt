import { Console } from '../console';
import { Point } from '../point';
import { Rect } from '../rect';
import { Dialog } from './dialog';
export declare class DialogState {
    readonly dialog: Dialog;
    readonly rect: Rect;
    readonly contentsOffset: Point;
    open: boolean;
    count: number;
    buffer?: Console;
    constructor(dialog: Dialog, rect: Rect, contentsOffset: Point);
}
