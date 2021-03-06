
/**
 * Vertex shader program.
 *
 * a = attribute vec2 aVertexPosition;
 * b = attribute vec2 aTextureCoord;
 * c = attribute vec3 aFgColor;
 * d = attribute vec3 aBgColor;
 * e = varying vec2 vTextureCoord;
 * f = varying vec4 vFgColor;
 * g = varying vec4 vBgColor;
 */
export const VERTEX_SHADER_SOURCE = 'attribute vec2 a;' +
    'attribute vec2 b;' +
    'attribute vec3 c;' +
    'attribute vec3 d;' +
    'varying highp vec2 e;' +
    'varying highp vec4 f;' +
    'varying highp vec4 g;' +
    'void main(void){' +
    'gl_Position=vec4(a.x,a.y,0,1);' +
    'e=b/16.0;' +
    'f=vec4(c.r,c.g,c.b,1);' +
    'g=vec4(d.r,d.g,d.b,1);' +
    '}';

/**
 * Fragment shader program.
 *
 * e = varying vec2 vTextureCoord;
 * f = varying vec4 vFgColor;
 * g = varying vec4 vBgColor;
 * h = uniform bool uGraphicalTiles;
 * s = uniform sampler2D uSampler;
 */
export const FRAGMENT_SHADER_SOURCE = 'varying highp vec2 e;' +
    'varying highp vec4 f;' +
    'varying highp vec4 g;' +
    'uniform bool h;' +
    'uniform sampler2D s;' +
    'void main(void){' +
    'gl_FragColor=texture2D(s,e);' +
    'if(h){' +
    // Using graphical tiles
    'if(gl_FragColor.a<0.1){' +
    // The current pixel of the foreground sprite is transparent.
    // Draw the background tile instead.
    // Use the background red channel for the tile X coordinate.
    // Use the background green channel for the tile Y coordinate.
    // Use the fractional component of the texture coord for the pixel offset.
    'gl_FragColor=texture2D(s,g.rg*16.0+fract(e*16.0)/16.0);' +
    '}' +
    '}else{' +
    // Using ASCII characters
    'if(gl_FragColor.r<0.1) {' +
    // Black background, so use bgColor
    'gl_FragColor=g;' +
    '} else {' +
    // White background, so use fgColor
    'gl_FragColor=f;' +
    '}' +
    '}' +
    '}';
