export declare class ExtendedTexture extends WebGLTexture {
    loaded: boolean;
    width: number;
    height: number;
    constructor();
}
/**
 * Initialize a shader program, so WebGL knows how to draw our data
 */
export declare function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram;
/**
 * Creates a shader of the given type, uploads the source and
 * compiles it.
 */
export declare function loadShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader;
/**
 * Initialize a texture and load an image.
 * When the image finished loading copy it into the texture.
 */
export declare function createTexture(gl: WebGLRenderingContext, url: string): ExtendedTexture;
