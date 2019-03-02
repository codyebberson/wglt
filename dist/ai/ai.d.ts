import { Actor } from '../actor';
export declare abstract class AI {
    readonly actor: Actor;
    activatedCount: number;
    seen: boolean;
    constructor(actor: Actor);
    abstract doAi(): void;
}
