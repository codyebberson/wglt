import { Game } from './game';
import { SelectOption } from './gui/selectoption';
import { Sprite } from './sprite';
import { Vec2 } from './vec2';
import { Actor } from './actor';
export declare class Entity extends Vec2 implements SelectOption {
    readonly game: Game;
    readonly offset: Vec2;
    name: string;
    sprite: Sprite;
    blocks: boolean;
    zIndex: number;
    constructor(game: Game, x: number, y: number, name: string, sprite: Sprite, blocks: boolean);
    readonly pixelX: number;
    readonly pixelY: number;
    readonly centerPixelX: number;
    readonly centerPixelY: number;
    distanceTo(other: Vec2): number;
    distance(x: number, y: number): number;
    draw(): void;
    startTurn(): void;
    endTurn(): void;
    sendToBack(): void;
    /**
     * Handles when another actor bumps this entity.
     * Returns true on success (something happened).
     * Returns false on failure (bump is rejected).
     * @param bumper The actor that bumped this entity.
     */
    onBump(bumper: Actor): boolean;
}
