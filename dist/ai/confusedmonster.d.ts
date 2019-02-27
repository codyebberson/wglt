import { Actor } from '../actor';
import { RNG } from '../rng';
import { AI } from './ai';
export declare class ConfusedMonster extends AI {
    readonly rng: RNG;
    numTurns: number;
    oldAi?: AI;
    constructor(actor: Actor);
    doAi(): void;
}
