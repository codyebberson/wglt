import { Actor } from '../actor';
export declare abstract class AI {
    readonly actor: Actor;
    constructor(actor: Actor);
    abstract doAi(): void;
}
