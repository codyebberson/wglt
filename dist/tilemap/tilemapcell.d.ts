import { Vec2 } from "../vec2";
export declare class TileMapCell extends Vec2 {
    tile: number;
    blocked: boolean;
    blockedSight: boolean;
    visible: boolean;
    seen: boolean;
    g: number;
    h: number;
    prev: TileMapCell | null;
    constructor(x: number, y: number, tile: number);
}
