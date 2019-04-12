import { TileMap } from "./tilemap";
/**
 * @constructor
 * @param {number} width
 * @param {number} height
 * @param {number} layerCount
 */
export declare class TileMapRenderer {
    readonly gl: WebGLRenderingContext;
    readonly tileMap: TileMap;
    private readonly quadVertBuffer;
    private readonly tilemapShader;
    private readonly positionAttribute;
    private readonly textureAttribute;
    private readonly viewportSizeUniform;
    private readonly viewOffsetUniform;
    private readonly mapSizeUniform;
    private readonly tileSizeUniform;
    private readonly animFrameUniform;
    private readonly tileSamplerUniform;
    private readonly spriteSamplerUniform;
    private readonly layerTextures;
    constructor(gl: WebGLRenderingContext, tileMap: TileMap);
    draw(x: number, y: number, width: number, height: number, animFrame?: number): void;
}
