import { Ability } from './ability';
import { Actor } from './actor';
export declare class Talent {
    readonly actor: Actor;
    readonly ability: Ability;
    rank: number;
    cooldown: number;
    constructor(actor: Actor, ability: Ability, rank?: number);
    use(): boolean;
}
