"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terminal = void 0;
var console_1 = require("./console");
var font_1 = require("./font");
var keys_1 = require("./keys");
var mouse_1 = require("./mouse");
var shaders_1 = require("./shaders");
/**
 * Linearly interpolates a number in the range 0-max to -1.0-1.0.
 *
 * @param i The value between 0 and max.
 * @param max The maximum value.
 * @returns The interpolated value between -1.0 and 1.0.
 */
function interpolate(i, max) {
    return -1.0 + 2.0 * (i / max);
}
var DEFAULT_OPTIONS = {
    font: font_1.DEFAULT_FONT,
    requestFullscreen: false,
};
var Terminal = /** @class */ (function (_super) {
    __extends(Terminal, _super);
    function Terminal(canvas, width, height, options) {
        var _this = _super.call(this, width, height) || this;
        options = options || DEFAULT_OPTIONS;
        _this.canvas = canvas;
        _this.font = options.font || font_1.DEFAULT_FONT;
        _this.pixelWidth = width * _this.font.charWidth;
        _this.pixelHeight = height * _this.font.charHeight;
        canvas.width = _this.pixelWidth;
        canvas.height = _this.pixelHeight;
        canvas.style.width = (_this.font.scale * _this.pixelWidth) + 'px';
        canvas.style.height = (_this.font.scale * _this.pixelHeight) + 'px';
        canvas.style.imageRendering = 'pixelated';
        canvas.style.outline = 'none';
        canvas.tabIndex = 0;
        _this.handleResize();
        window.addEventListener('resize', function () { return _this.handleResize(); });
        _this.keys = new keys_1.Keyboard(canvas);
        _this.mouse = new mouse_1.Mouse(_this, options);
        // Get the WebGL context from the canvas
        var gl = canvas.getContext('webgl', { antialias: false });
        if (!gl) {
            throw new Error('Unable to initialize WebGL. Your browser may not support it.');
        }
        var program = gl.createProgram();
        if (!program) {
            throw new Error('Unable to initialize WebGL. Your browser may not support it.');
        }
        _this.gl = gl;
        _this.program = program;
        gl.attachShader(program, _this.buildShader(gl.VERTEX_SHADER, shaders_1.VERTEX_SHADER_SOURCE));
        gl.attachShader(program, _this.buildShader(gl.FRAGMENT_SHADER, shaders_1.FRAGMENT_SHADER_SOURCE));
        gl.linkProgram(program);
        gl.useProgram(program);
        if (_this.font.graphical) {
            // Set the flag to ignore foreground/background colors, and use texture
            // directly
            gl.uniform1i(gl.getUniformLocation(program, 'h'), 1);
        }
        _this.positionAttribLocation = _this.getAttribLocation('a');
        _this.textureAttribLocation = _this.getAttribLocation('b');
        _this.fgColorAttribLocation = _this.getAttribLocation('c');
        _this.bgColorAttribLocation = _this.getAttribLocation('d');
        var cellCount = width * height;
        _this.positionsArray = new Float32Array(cellCount * 3 * 4);
        _this.indexArray = new Uint16Array(cellCount * 6);
        _this.textureArray = new Float32Array(cellCount * 2 * 4);
        _this.foregroundUint8Array = new Uint8Array(cellCount * 4 * 4);
        _this.foregroundDataView = new DataView(_this.foregroundUint8Array.buffer);
        _this.backgroundUint8Array = new Uint8Array(cellCount * 4 * 4);
        _this.backgroundDataView = new DataView(_this.backgroundUint8Array.buffer);
        // Init the positions buffer
        var i = 0;
        var j = 0;
        var k = 0;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                // Top-left
                _this.positionsArray[i++] = interpolate(x, width);
                _this.positionsArray[i++] = -interpolate(y, height);
                // Top-right
                _this.positionsArray[i++] = interpolate(x + 1, width);
                _this.positionsArray[i++] = -interpolate(y, height);
                // Bottom-right
                _this.positionsArray[i++] = interpolate(x + 1, width);
                _this.positionsArray[i++] = -interpolate(y + 1, height);
                // Bottom-left
                _this.positionsArray[i++] = interpolate(x, width);
                _this.positionsArray[i++] = -interpolate(y + 1, height);
                _this.indexArray[j++] = k + 0;
                _this.indexArray[j++] = k + 1;
                _this.indexArray[j++] = k + 2;
                _this.indexArray[j++] = k + 0;
                _this.indexArray[j++] = k + 2;
                _this.indexArray[j++] = k + 3;
                k += 4;
            }
        }
        _this.positionBuffer = gl.createBuffer();
        _this.indexBuffer = gl.createBuffer();
        _this.textureBuffer = gl.createBuffer();
        _this.foregroundBuffer = gl.createBuffer();
        _this.backgroundBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, _this.positionsArray, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, _this.indexArray, gl.STATIC_DRAW);
        _this.texture = _this.loadTexture(_this.font.url);
        var frameRate = options.frameRate || 15;
        window.setInterval(function () { return _this.renderLoop(); }, 1000 / frameRate);
        return _this;
    }
    Terminal.prototype.handleResize = function () {
        var parent = this.canvas.parentElement;
        if (!parent) {
            return;
        }
        var widthFactor = parent.offsetWidth / this.pixelWidth;
        var heightFactor = parent.offsetHeight / this.pixelHeight;
        var factor = Math.min(widthFactor, heightFactor);
        var width = (factor * this.pixelWidth) | 0;
        var height = (factor * this.pixelHeight) | 0;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
    };
    Terminal.prototype.getAttribLocation = function (name) {
        var location = this.gl.getAttribLocation(this.program, name);
        this.gl.enableVertexAttribArray(location);
        return location;
    };
    Terminal.prototype.flush = function () {
        var textureArrayIndex = 0;
        var colorArrayIndex = 0;
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var cell = this.getCell(x, y);
                if (!cell.dirty) {
                    textureArrayIndex += 8;
                    colorArrayIndex += 16;
                    continue;
                }
                var textureX = (cell.charCode % 16);
                var textureY = ((cell.charCode / 16) | 0);
                this.textureArray[textureArrayIndex++] = textureX;
                this.textureArray[textureArrayIndex++] = textureY;
                this.textureArray[textureArrayIndex++] = textureX + 1;
                this.textureArray[textureArrayIndex++] = textureY;
                this.textureArray[textureArrayIndex++] = textureX + 1;
                this.textureArray[textureArrayIndex++] = textureY + 1;
                this.textureArray[textureArrayIndex++] = textureX;
                this.textureArray[textureArrayIndex++] = textureY + 1;
                for (var i = 0; i < 4; i++) {
                    this.foregroundDataView.setUint32(colorArrayIndex, cell.fg, false);
                    this.backgroundDataView.setUint32(colorArrayIndex, cell.bg, false);
                    colorArrayIndex += 4;
                }
                cell.dirty = false;
            }
        }
    };
    Terminal.prototype.isKeyDown = function (keyCode) {
        var key = this.keys.getKey(keyCode);
        return !!key && key.down;
    };
    Terminal.prototype.isKeyPressed = function (keyCode) {
        var key = this.keys.getKey(keyCode);
        return !!key && key.isPressed();
    };
    Terminal.prototype.getKeyDownCount = function (keyCode) {
        var key = this.keys.getKey(keyCode);
        return key ? key.downCount : 0;
    };
    Terminal.prototype.buildShader = function (type, source) {
        var gl = this.gl;
        var sh = gl.createShader(type);
        if (!sh) {
            throw new Error('An error occurred compiling the shader: ');
        }
        gl.shaderSource(sh, source);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            throw new Error('An error occurred compiling the shader: ' + gl.getShaderInfoLog(sh));
        }
        return sh;
    };
    /**
     * Initialize a texture and load an image.
     * When the image finished loading copy it into the texture.
     * @param url
     */
    Terminal.prototype.loadTexture = function (url) {
        var gl = this.gl;
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Because images have to be download over the internet
        // they might take a moment until they are ready.
        // Until then put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        var level = 0;
        var internalFormat = gl.RGBA;
        var width = 1;
        var height = 1;
        var border = 0;
        var srcFormat = gl.RGBA;
        var srcType = gl.UNSIGNED_BYTE;
        var pixel = new Uint8Array([0, 0, 0, 255]); // opaque black
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
        var image = new Image();
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        };
        image.src = url;
        return texture;
    };
    //
    // Draw the scene.
    //
    Terminal.prototype.render = function () {
        var gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, this.pixelWidth, this.pixelHeight);
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute
        {
            var numComponents = 2;
            var type = gl.FLOAT;
            var normalize = false;
            var stride = 0;
            var offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.vertexAttribPointer(this.positionAttribLocation, numComponents, type, normalize, stride, offset);
        }
        // Tell WebGL how to pull out the texture coordinates from
        // the texture coordinate buffer into the textureCoord attribute.
        {
            var numComponents = 2;
            var type = gl.FLOAT;
            var normalize = false;
            var stride = 0;
            var offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.textureArray, gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(this.textureAttribLocation, numComponents, type, normalize, stride, offset);
        }
        // Foreground color
        {
            var numComponents = 4;
            var type = gl.UNSIGNED_BYTE;
            var normalize = true;
            var stride = 0;
            var offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.foregroundBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.foregroundUint8Array, gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(this.fgColorAttribLocation, numComponents, type, normalize, stride, offset);
        }
        // Background color
        {
            var numComponents = 4;
            var type = gl.UNSIGNED_BYTE;
            var normalize = true;
            var stride = 0;
            var offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.backgroundBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.backgroundUint8Array, gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(this.bgColorAttribLocation, numComponents, type, normalize, stride, offset);
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
            var vertexCount = this.width * this.height * 6;
            var type = gl.UNSIGNED_SHORT;
            var offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    };
    Terminal.prototype.renderLoop = function () {
        this.keys.updateKeys();
        this.mouse.update();
        if (this.update) {
            this.update();
        }
        // if (this.state) {
        //   this.state.update();
        // }
        this.flush();
        this.render();
    };
    return Terminal;
}(console_1.Console));
exports.Terminal = Terminal;
