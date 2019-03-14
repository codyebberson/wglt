import { Actor } from '../actor';
export declare abstract class AI {
    readonly actor: Actor;
    alwaysActive: boolean;
    constructor(actor: Actor);
    abstract doAi(): void;
}
