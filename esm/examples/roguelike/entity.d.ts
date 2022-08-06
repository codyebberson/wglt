import { Color } from '../../src/color';
import { Game } from './game';
export declare class Entity {
    game: Game;
    x: number;
    y: number;
    char: string;
    name: string;
    color: Color;
    blocks: boolean;
    constructor(game: Game, x: number, y: number, char: string, name: string, color: Color, blocks?: boolean);
    distanceTo(other: Entity): number;
    distance(x: number, y: number): number;
    sendToBack(): void;
    remove(): void;
    draw(): void;
}
