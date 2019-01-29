import { Entity } from '../entity';
import { RNG } from '../rng';
import { AI } from './ai';
export declare class ConfusedMonster extends AI {
    readonly rng: RNG;
    numTurns: number;
    oldAi?: AI;
    constructor(entity: Entity);
    doAi(): void;
}
