
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
    'if(!h){' +
    'if(gl_FragColor.r<0.1) {' +
    'gl_FragColor=g;' +
    '} else {' +
    'gl_FragColor=f;' +
    '}' +
    '}' +
    '}';
