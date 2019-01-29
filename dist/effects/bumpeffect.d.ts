import { Entity } from '../entity';
import { Effect } from './effect';
export declare class BumpEffect extends Effect {
    readonly entity: Entity;
    readonly dx: number;
    readonly dy: number;
    constructor(entity: Entity, target: Entity);
    update(): void;
}
