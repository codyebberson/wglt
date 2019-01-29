import { Game } from '../game';
import { Sprite } from '../sprite';
import { Vec2 } from '../vec2';
import { Effect } from './effect';
export declare class ProjectileEffect extends Effect {
    readonly sprite: Sprite;
    readonly position: Vec2;
    readonly velocity: Vec2;
    readonly duration: number;
    constructor(sprite: Sprite, position: Vec2, velocity: Vec2, duration: number);
    update(): void;
    draw(game: Game): void;
}
