import { Game } from './game';
import { SelectOption } from './gui/selectoption';
import { Sprite } from './sprite';
import { TileMapCell } from './tilemap';
import { Vec2 } from './vec2';
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
    distanceTo(other: Entity | TileMapCell): number;
    distance(x: number, y: number): number;
    draw(): void;
    sendToBack(): void;
    onBump(bumper: Entity): void;
}
