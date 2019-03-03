import { Actor } from '../actor';
import { AI } from './ai';
export declare class BasicMonster extends AI {
    damageFunc?: (attacker: Actor, target: Actor) => number;
    constructor(actor: Actor, damageFunc?: (attacker: Actor, target: Actor) => number);
    doAi(): void;
}
