import { Game } from '../game';
import { Effect } from './effect';
export declare class FadeInEffect extends Effect {
    readonly duration: number;
    constructor(duration: number);
    draw(game: Game): void;
}
