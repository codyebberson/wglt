import { Entity } from '../entity';
import { Animation } from './animation';
export declare class SlideAnimation extends Animation {
    readonly entity: Entity;
    readonly dx: number;
    readonly dy: number;
    constructor(entity: Entity, dx: number, dy: number, count: number);
    update(): void;
}
