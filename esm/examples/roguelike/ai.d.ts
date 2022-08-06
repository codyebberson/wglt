import { Actor } from './actor';
export interface AI {
    owner?: Actor;
    takeTurn(): void;
}
export declare class BasicMonster implements AI {
    owner?: Actor;
    constructor();
    takeTurn(): void;
}
export declare class ConfusedMonster implements AI {
    owner?: Actor;
    oldAi: AI;
    numTurns: number;
    constructor(oldAi: AI);
    takeTurn(): void;
}
