import { Entity } from '../entity';
export declare abstract class AI {
    readonly entity: Entity;
    activatedCount: number;
    constructor(entity: Entity);
    abstract doAi(): void;
}
