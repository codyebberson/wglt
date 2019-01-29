import { Entity } from '../entity';
import { Effect } from './effect';
export declare class SlideEffect extends Effect {
    readonly entity: Entity;
    readonly dx: number;
    readonly dy: number;
    constructor(entity: Entity, dx: number, dy: number, count: number);
    update(): void;
}
