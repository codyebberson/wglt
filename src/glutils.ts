
/**
 * The ExtendedTexture class "extends" WebGLTexture and
 * provides additional helper properties.
 *
 * It is not actually a class, as we are really just dynamically
 * adding properties to a WebGLTexture object.
 *
 * Previously this was actually a class, and actually extended WebGLTexture.
 * However, that caused type errors with Jest.
 * This works well enough.
 */
export interface ExtendedTexture {
  loaded: boolean;
  width: number;
  height: number;
}

/**
 * Initialize a shader program, so WebGL knows how to draw our data
 */
export function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram() as WebGLProgram;
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  return shaderProgram;
}

/**
 * Creates a shader of the given type, uploads the source and
 * compiles it.
 */
export function loadShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

/**
 * Initialize a texture and load an image.
 * When the image finished loading copy it into the texture.
 */
export function createTexture(gl: WebGLRenderingContext, url: string): ExtendedTexture {
  const texture = gl.createTexture() as ExtendedTexture;
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 0, 255]);
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    texture.loaded = true;
    texture.width = image.width;
    texture.height = image.height;
  };
  image.src = url;

  return texture;
}
