import { Entity } from '../entity';
import { Animation } from './animation';
export declare class BumpAnimation extends Animation {
    readonly entity: Entity;
    readonly dx: number;
    readonly dy: number;
    constructor(entity: Entity, target: Entity);
    update(): void;
}
