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
export const VERTEX_SHADER_SOURCE =
  '#version 300 es\n' +
  'precision highp float;' +
  'in vec2 a;' +
  'in vec2 b;' +
  'in vec3 c;' +
  'in vec3 d;' +
  'out vec2 e;' +
  'out vec4 f;' +
  'out vec4 g;' +
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
 * o = out vec4 oColor;
 */
export const FRAGMENT_SHADER_SOURCE =
  '#version 300 es\n' +
  'precision highp float;' +
  'in vec2 e;' +
  'in vec4 f;' +
  'in vec4 g;' +
  'uniform bool h;' +
  'uniform sampler2D s;' +
  'out vec4 o;' +
  'void main(void){' +
  'o=texture(s,e);' +
  'if(h){' +
  // Using graphical tiles
  'if(o.a<0.1){' +
  // The current pixel of the foreground sprite is transparent.
  // Draw the background tile instead.
  // Use the background red channel for the tile X coordinate.
  // Use the background green channel for the tile Y coordinate.
  // Use the fractional component of the texture coord for the pixel offset.
  'o=texture(s,g.rg*16.0+fract(e*16.0)/16.0);' +
  '}' +
  '}else{' +
  // Using ASCII characters
  'if(o.r<0.1) {' +
  // Black background, so use bgColor
  'o=g;' +
  '} else {' +
  // White background, so use fgColor
  'o=f;' +
  '}' +
  '}' +
  '}';
