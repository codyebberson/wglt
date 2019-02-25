import { Entity } from '../entity';
import { Rect } from '../rect';
import { Button } from './button';
export declare class EntityButton extends Button {
    readonly entity: Entity;
    constructor(destRect: Rect, entity: Entity);
    click(): void;
}
