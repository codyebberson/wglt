/**
 * The ExtendedTexture class "extends" WebGLTexture and
 * provides additional helper properties.
 */
export interface ExtendedTexture extends WebGLTexture {
  /** Whether the image has loaded and been uploaded to the texture. */
  loaded: boolean;
  /** The image-loading error, or undefined while loading and after a successful load. */
  error: Error | undefined;
  width: number;
  height: number;
  image: HTMLImageElement;
  disposed: boolean;
}

/**
 * Initialize a shader program, so WebGL knows how to draw our data.
 *
 * @param gl - WebGL rendering context.
 * @param vsSource - Vertex shader source code.
 * @param fsSource - Fragment shader source code.
 * @returns The shader program.
 */
export function initShaderProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string
): WebGLProgram {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram() as WebGLProgram;
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(shaderProgram);
    gl.deleteProgram(shaderProgram);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error(`Shader program linking failed: ${info}`);
  }

  gl.detachShader(shaderProgram, vertexShader);
  gl.detachShader(shaderProgram, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return shaderProgram;
}

/**
 * Creates a shader of the given type, uploads the source and compiles it.
 *
 * @param gl - WebGL rendering context.
 * @param type - Shader type.
 * @param source - Shader source code.
 * @returns The shader.
 */
export function loadShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compilation failed: ${info}`);
  }

  return shader;
}

/**
 * Initialize a texture and load an image.
 * When the image finished loading copy it into the texture.
 *
 * @param gl - WebGL rendering context.
 * @param url - URL of the image to load.
 * @returns The texture.
 */
export function createTexture(gl: WebGLRenderingContext, url: string): ExtendedTexture {
  const texture = gl.createTexture() as ExtendedTexture;
  texture.loaded = false;
  texture.error = undefined;
  texture.width = 0;
  texture.height = 0;
  texture.disposed = false;

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
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  const image = new Image();
  texture.image = image;

  image.onerror = (): void => {
    if (texture.disposed) {
      return;
    }
    texture.error = new Error(`Failed to load texture: ${url}`);
  };

  image.onload = (): void => {
    if (texture.disposed) {
      return;
    }
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

/** Cancels pending image callbacks and releases a texture created by {@link createTexture}. */
export function disposeTexture(gl: WebGLRenderingContext, texture: ExtendedTexture): void {
  if (texture.disposed) {
    return;
  }
  texture.disposed = true;
  texture.image.onload = (): void => {};
  texture.image.onerror = (): void => {};
  gl.deleteTexture(texture);
}
