import { Actor } from '../actor';
export declare abstract class AI {
    readonly actor: Actor;
    activatedCount: number;
    constructor(actor: Actor);
    abstract doAi(): void;
}
