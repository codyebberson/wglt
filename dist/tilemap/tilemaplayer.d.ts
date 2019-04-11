/**
 * @constructor
 * @param {number} width
 * @param {number} height
 */
export declare class TileMapLayer {
    readonly width: number;
    readonly height: number;
    readonly imageData: Uint8Array;
    constructor(width: number, height: number);
    clear(): void;
    getIndex(x: number, y: number): number;
    setTile(x: number, y: number, tile: number): void;
    getTile(x: number, y: number): number;
    isAnimated(x: number, y: number): boolean;
    setAnimated(x: number, y: number, animated: boolean): void;
    getAlpha(x: number, y: number): number;
    setAlpha(x: number, y: number, alpha: number): void;
}
