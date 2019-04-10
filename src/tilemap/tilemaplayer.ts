

// /**
//  * @constructor
//  * @param {number} width
//  * @param {number} height
//  */
// export class TileMapLayer {
//   readonly width: number;
//   readonly height: number;
//   readonly imageData: Uint8Array;
//   readonly dimensions: Float32Array;
//   // texture: WebGLTexture | null;

//   constructor(width: number, height: number) {
//     this.width = width;
//     this.height = height;
//     this.imageData = new Uint8Array(4 * width * height);
//     this.dimensions = new Float32Array([width, height]);
//     this.texture = null;
//     this.clear();
//   }

//   clear() {
//     let i = 0;
//     while (i < this.imageData.length) {
//       this.imageData[i++] = 255;
//       this.imageData[i++] = 255;
//       this.imageData[i++] = 0;
//       this.imageData[i++] = 0;
//     }
//   }

//   setAlpha(x: number, y: number, alpha: number) {
//     this.imageData[4 * (y * this.width + x) + 3] = alpha;
//   }

//   initGl(gl: WebGLRenderingContext) {
//     this.texture = gl.createTexture();
//     gl.bindTexture(gl.TEXTURE_2D, this.texture);
//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.imageData);

//     // MUST be filtered with NEAREST or tile lookup fails
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//   }

//   updateGl(gl: WebGLRenderingContext) {
//     gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, this.imageData);
//   }
// }
