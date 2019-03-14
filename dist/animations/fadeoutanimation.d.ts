import { Game } from '../game';
import { Animation } from './animation';
export declare class FadeOutAnimation extends Animation {
    readonly duration: number;
    constructor(duration: number);
    draw(game: Game): void;
}
