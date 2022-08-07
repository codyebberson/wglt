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
 * s = uniform sampler2D uSampler;
 * o = out vec4 oColor;
 */
export const FRAGMENT_SHADER_SOURCE =
  '#version 300 es\n' +
  'precision highp float;' +
  'in vec2 e;' +
  'in vec4 f;' +
  'in vec4 g;' +
  'uniform sampler2D s;' +
  'out vec4 o;' +
  'void main(void){' +
  'o=texture(s,e);' +
  // Using ASCII characters
  'if(o.r<0.1) {' +
  // Black background, so use bgColor
  'o=g;' +
  '} else {' +
  // White background, so use fgColor
  'o=f;' +
  '}' +
  '}';

export const CRT_VERTEX_SHADER_SOURCE = `#version 300 es
precision highp float;
in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;
void main(void) {
  gl_Position=vec4(a_position.x, a_position.y, 0.0, 1.0);
  v_texCoord = a_texCoord;
}`;

export const CRT_FRAGMENT_SHADER_SOURCE = `#version 300 es
#define PI 3.1415926535897932384626433832795
precision highp float;
in vec2 v_texCoord;
uniform sampler2D u_texture;
uniform float u_blur;
uniform float u_curvature;
uniform float u_chroma;
uniform float u_scanlineWidth;
uniform float u_scanlineIntensity;
uniform float u_vignette;
out vec4 outputColor;

vec2 curve(vec2 uv) {
  uv = (uv - 0.5) * 2.0;
  uv *= 1.1;
  uv.x *= 1.0 + pow((abs(uv.y) * u_curvature), 2.0);
  uv.y *= 1.0 + pow((abs(uv.x) * u_curvature), 2.0);
  uv /= 1.1;
  uv = (uv / 2.0) + 0.5;
  return uv;
}

void main() {
  vec2 iResolution = vec2(640.0, 360.0);
  vec2 q = v_texCoord;
  vec2 fragCoord = v_texCoord;
  vec2 uv = q;
  uv = curve(uv);

  // Outside of range is black
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    outputColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  vec4 col;

  // Chromatic aberration
  // col = texture(u_texture, uv.xy);
  col.r = 0.7 * texture(u_texture, vec2(uv.x + 0.001 * u_chroma, uv.y + 0.001 * u_chroma)).r;
  col.g = 0.7 * texture(u_texture, vec2(uv.x + 0.000 * u_chroma, uv.y - 0.002 * u_chroma)).g;
  col.b = 0.7 * texture(u_texture, vec2(uv.x - 0.002 * u_chroma, uv.y + 0.000 * u_chroma)).b;
  
  // Blur
  col += 0.05 * texture(u_texture, vec2(uv.x - 2.0 * u_blur / iResolution.x, uv.y));
  col += 0.10 * texture(u_texture, vec2(uv.x - 1.0 * u_blur / iResolution.x, uv.y));
  col += 0.10 * texture(u_texture, vec2(uv.x + 1.0 * u_blur / iResolution.x, uv.y));
  col += 0.05 * texture(u_texture, vec2(uv.x + 2.0 * u_blur / iResolution.x, uv.y));

  // Vignette
  col *= pow(16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), u_vignette);

  // Scanlines
  col *= clamp(1.0 + u_scanlineWidth * sin(uv.y * iResolution.y * 2.0 * PI), 1.0 - u_scanlineIntensity, 1.0);

  outputColor = vec4(col.rgb, 1.0);
}`;
