
// import * from './glconstants';
import { FONT_CHAR_WIDTH, FONT_CHAR_HEIGHT, FONT_IMAGE } from './font';
import { Keys } from './keys';
import { VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE } from './shaders';


function interpolate(i, max) {
    return -1.0 + 2.0 * (i / max);
}

export class Terminal {
    private canvas: HTMLCanvasElement;
    private width: number;
    private height: number;
    private pixelWidth: number;
    private pixelHeight: number;
    private keys: Keys;
    private gl: WebGLRenderingContext;
    private program: WebGLProgram;
    private positionAttribLocation: GLint;
    private textureAttribLocation: GLint;
    private fgColorAttribLocation: GLint;
    private bgColorAttribLocation: GLint;
    private positionsArray: Float32Array;
    private indexArray: Uint16Array;
    private textureArray: Float32Array;
    private foregroundUint8Array: Uint8Array;
    private foregroundDataView: DataView;
    private backgroundUint8Array: Uint8Array;
    private backgroundDataView: DataView;
    private positionBuffer: WebGLBuffer;
    private indexBuffer: WebGLBuffer;
    private textureBuffer: WebGLBuffer;
    private foregroundBuffer: WebGLBuffer;
    private backgroundBuffer: WebGLBuffer;
    private texture: WebGLTexture;
    update: Function;

    constructor(canvas, width, height) {
        // const self = this;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.pixelWidth = width * FONT_CHAR_WIDTH;
        this.pixelHeight = height * FONT_CHAR_HEIGHT;

        canvas.width = this.pixelWidth;
        canvas.height = this.pixelHeight;
        canvas.style.width = this.pixelWidth + 'px';
        canvas.style.height = this.pixelHeight + 'px';
        canvas.style.imageRendering = 'pixelated';
        canvas.style.outline = 'none';
        canvas.tabIndex = 0;

        this.keys = new Keys(canvas);

        // Get the WebGL context from the canvas
        const gl = this.gl = canvas.getContext("webgl", { antialias: false });
        if (!gl) {
            throw 'Unable to initialize WebGL. Your browser may not support it.';
        }

        const program = this.program = gl.createProgram();
        gl.attachShader(program, this.buildShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE));
        gl.attachShader(program, this.buildShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE));
        gl.linkProgram(program);
        gl.useProgram(program);

        this.positionAttribLocation = this.getAttribLocation('a');
        this.textureAttribLocation = this.getAttribLocation('b');
        this.fgColorAttribLocation = this.getAttribLocation('c');
        this.bgColorAttribLocation = this.getAttribLocation('d');

        const cellCount = width * height;
        this.positionsArray = new Float32Array(cellCount * 3 * 4);
        this.indexArray = new Uint16Array(cellCount * 6);
        this.textureArray = new Float32Array(cellCount * 2 * 4);
        this.foregroundUint8Array = new Uint8Array(cellCount * 4 * 4);
        this.foregroundDataView = new DataView(this.foregroundUint8Array.buffer);
        this.backgroundUint8Array = new Uint8Array(cellCount * 4 * 4);
        this.backgroundDataView = new DataView(this.backgroundUint8Array.buffer);

        // Init the positions buffer
        let i = 0;
        let j = 0;
        let k = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Top-left
                this.positionsArray[i++] = interpolate(x, width);
                this.positionsArray[i++] = -interpolate(y, height);

                // Top-right
                this.positionsArray[i++] = interpolate(x + 1, width);
                this.positionsArray[i++] = -interpolate(y, height);

                // Bottom-right
                this.positionsArray[i++] = interpolate(x + 1, width);
                this.positionsArray[i++] = -interpolate(y + 1, height);

                // Bottom-left
                this.positionsArray[i++] = interpolate(x, width);
                this.positionsArray[i++] = -interpolate(y + 1, height);

                this.indexArray[j++] = k + 0;
                this.indexArray[j++] = k + 1;
                this.indexArray[j++] = k + 2;
                this.indexArray[j++] = k + 0;
                this.indexArray[j++] = k + 2;
                this.indexArray[j++] = k + 3;

                k += 4;
            }
        }

        this.positionBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.textureBuffer = gl.createBuffer();
        this.foregroundBuffer = gl.createBuffer();
        this.backgroundBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.positionsArray, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexArray, gl.STATIC_DRAW);

        this.texture = this.loadTexture(FONT_IMAGE);

        this.renderLoop();
    }

    private getAttribLocation(name) {
        const location = this.gl.getAttribLocation(this.program, name);
        this.gl.enableVertexAttribArray(location);
        return location;
    }

    private isOutOfRange(x, y) {
        return x < 0 || x >= this.width || y < 0 || y >= this.height;
    }

    setCharCode(x, y, c) {
        if (this.isOutOfRange(x, y)) {
            return;
        }

        const textureX = (c % 16) + (0.5 / 256.0);
        const textureY = ((c / 16) | 0) + (0.5 / 256.0);
        const textureArrayIndex = 8 * (y * this.width + x);

        this.textureArray[textureArrayIndex + 0] = textureX;
        this.textureArray[textureArrayIndex + 1] = textureY;

        this.textureArray[textureArrayIndex + 2] = textureX + 1;
        this.textureArray[textureArrayIndex + 3] = textureY;

        this.textureArray[textureArrayIndex + 4] = textureX + 1;
        this.textureArray[textureArrayIndex + 5] = textureY + 1;

        this.textureArray[textureArrayIndex + 6] = textureX;
        this.textureArray[textureArrayIndex + 7] = textureY + 1;
    }

    clear() {
        this.clearRect(0, 0, this.width, this.height);
    }

    clearRect(rectX, rectY, rectWidth, rectHeight) {
        const charCode = 0;
        const x2 = rectX + rectWidth;
        const y2 = rectY + rectHeight;
        for (let y = rectY; y < y2; y++) {
            for (let x = rectX; x < x2; x++) {
                this.setCharCode(x, y, charCode);
            }
        }
    }

    /**
     * Sets the foreground color of a cell.
     * @param x The horizontal coordinate.
     * @param y The vertical coordinate.
     * @param color The 32-bit color (see createColor).
     */
    setForegroundColor(x: number, y: number, color: number) {
        if (this.isOutOfRange(x, y)) {
            return;
        }

        let index = 16 * (y * this.width + x);
        for (let i = 0; i < 4; i++) {
            this.foregroundDataView.setUint32(index, color, false);
            index += 4;
        }
    }

    /**
     * Sets the background color of a cell.
     * @param x The horizontal coordinate.
     * @param y The vertical coordinate.
     * @param color The 32-bit color (see createColor).
     */
    setBackgroundColor(x: number, y: number, color: number) {
        if (this.isOutOfRange(x, y)) {
            return;
        }

        let index = 16 * (y * this.width + x);
        for (let i = 0; i < 4; i++) {
            this.backgroundDataView.setUint32(index, color, false);
            index += 4;
        }
    }

    /**
     * Draws a string with optional colors.
     * @param x
     * @param y
     * @param str
     * @param opt_fg
     * @param opt_bg
     */
    drawString(x: number, y: number, str: string, opt_fg, opt_bg) {
        for (let i = 0; i < str.length; i++) {
            this.setCharCode(x + i, y, str.charCodeAt(i));
        }

        if (opt_fg) {
            this.fillForegroundRect(x, y, str.length, 1, opt_fg);
        }

        if (opt_bg) {
            this.fillBackgroundRect(x, y, str.length, 1, opt_bg);
        }
    }

    drawCenteredString(x, y, str, opt_fg, opt_bg) {
        this.drawString((x - str.length / 2) | 0, y, str, opt_fg, opt_bg);
    }

    fillForegroundRect(x, y, w, h, color) {
        for (let i = y; i < y + h; i++) {
            for (let j = x; j < x + w; j++) {
                this.setForegroundColor(j, i, color);
            }
        }
    }

    fillBackgroundRect(x, y, w, h, color) {
        for (let i = y; i < y + h; i++) {
            for (let j = x; j < x + w; j++) {
                this.setBackgroundColor(j, i, color);
            }
        }
    }

    isKeyDown(keyCode) {
        const key = this.keys.getKey(keyCode);
        return key && key.down;
    }

    isKeyPressed(keyCode) {
        const key = this.keys.getKey(keyCode);
        const count = key ? key.downCount : 0;
        return count === 1 || (count > 30 && count % 3 === 0);
    }

    getKeyDownCount(keyCode) {
        const key = this.keys.getKey(keyCode);
        return key ? key.downCount : 0;
    }

    private buildShader(type, source) {
        const gl = this.gl;
        const sh = gl.createShader(type);
        gl.shaderSource(sh, source);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            throw 'An error occurred compiling the shader: ' + gl.getShaderInfoLog(sh);
        }
        return sh;
    }

    /**
     * Initialize a texture and load an image.
     * When the image finished loading copy it into the texture.
     * @param url
     */
    private loadTexture(url) {
        const gl = this.gl;
        const texture = gl.createTexture();
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
        const pixel = new Uint8Array([0, 0, 0, 255]);  // opaque black
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType,
            pixel);

        const image = new Image();
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
        };
        image.src = url;

        return texture;
    }

    //
    // Draw the scene.
    //
    private render() {
        const gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, 640, 400);

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.vertexAttribPointer(
                this.positionAttribLocation,
                numComponents,
                type,
                normalize,
                stride,
                offset);
        }

        // Tell WebGL how to pull out the texture coordinates from
        // the texture coordinate buffer into the textureCoord attribute.
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.textureArray, gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(
                this.textureAttribLocation,
                numComponents,
                type,
                normalize,
                stride,
                offset);
        }

        // Foreground color
        {
            const numComponents = 4;
            const type = gl.UNSIGNED_BYTE;
            const normalize = true;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.foregroundBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.foregroundUint8Array, gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(
                this.fgColorAttribLocation,
                numComponents,
                type,
                normalize,
                stride,
                offset);
        }

        // Background color
        {
            const numComponents = 4;
            const type = gl.UNSIGNED_BYTE;
            const normalize = true;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.backgroundBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.backgroundUint8Array, gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(
                this.bgColorAttribLocation,
                numComponents,
                type,
                normalize,
                stride,
                offset);
        }

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        // Tell WebGL to use our program when drawing
        gl.useProgram(this.program);

        // Tell WebGL we want to affect texture unit 0
        gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // Tell the shader we bound the texture to texture unit 0
        {
            const vertexCount = this.width * this.height * 6;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    private renderLoop() {
        this.keys.updateKeys();
        if (this.update) {
            this.update();
        }
        this.render();
        requestAnimationFrame(this.renderLoop.bind(this));
    }
}
