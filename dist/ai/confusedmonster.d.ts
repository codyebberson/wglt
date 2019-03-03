import { Actor } from '../actor';
import { AI } from './ai';
export declare class ConfusedMonster extends AI {
    numTurns: number;
    oldAi?: AI;
    constructor(actor: Actor);
    doAi(): void;
}
