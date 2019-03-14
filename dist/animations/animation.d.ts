import { Game } from '../game';
import { AnimationPromise } from './animationpromise';
export declare abstract class Animation {
    readonly promise: AnimationPromise;
    countdown: number;
    blocking: boolean;
    onDone?: Function;
    constructor(countdown: number, blocking: boolean);
    isDone(): boolean;
    update(): void;
    draw(game: Game): void;
}
