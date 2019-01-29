import { Game } from '../game';
export declare abstract class Effect {
    countdown: number;
    blocking: boolean;
    constructor(countdown: number, blocking: boolean);
    isDone(): boolean;
    update(): void;
    draw(game: Game): void;
}
