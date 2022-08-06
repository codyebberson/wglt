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
export declare const VERTEX_SHADER_SOURCE: string;
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
export declare const FRAGMENT_SHADER_SOURCE: string;
export declare const CRT_VERTEX_SHADER_SOURCE = "#version 300 es\nprecision highp float;\nin vec2 a_position;\nin vec2 a_texCoord;\nout vec2 v_texCoord;\nvoid main(void) {\n  gl_Position=vec4(a_position.x, a_position.y, 0.0, 1.0);\n  v_texCoord = a_texCoord;\n}";
export declare const CRT_FRAGMENT_SHADER_SOURCE = "#version 300 es\n#define PI 3.1415926535897932384626433832795\nprecision highp float;\nin vec2 v_texCoord;\nuniform sampler2D u_texture;\nuniform float u_blur;\nuniform float u_curvature;\nuniform float u_chroma;\nuniform float u_scanlineWidth;\nuniform float u_scanlineIntensity;\nuniform float u_vignette;\nout vec4 outputColor;\n\nvec2 curve(vec2 uv) {\n  uv = (uv - 0.5) * 2.0;\n  uv *= 1.1;\n  uv.x *= 1.0 + pow((abs(uv.y) * u_curvature), 2.0);\n  uv.y *= 1.0 + pow((abs(uv.x) * u_curvature), 2.0);\n  uv /= 1.1;\n  uv = (uv / 2.0) + 0.5;\n  return uv;\n}\n\nvoid main() {\n  vec2 iResolution = vec2(640.0, 360.0);\n  vec2 q = v_texCoord;\n  vec2 fragCoord = v_texCoord;\n  vec2 uv = q;\n  uv = curve(uv);\n\n  // Outside of range is black\n  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {\n    outputColor = vec4(0.0, 0.0, 0.0, 1.0);\n    return;\n  }\n\n  vec4 col;\n\n  // Chromatic aberration\n  // col = texture(u_texture, uv.xy);\n  col.r = 0.7 * texture(u_texture, vec2(uv.x + 0.001 * u_chroma, uv.y + 0.001 * u_chroma)).r;\n  col.g = 0.7 * texture(u_texture, vec2(uv.x + 0.000 * u_chroma, uv.y - 0.002 * u_chroma)).g;\n  col.b = 0.7 * texture(u_texture, vec2(uv.x - 0.002 * u_chroma, uv.y + 0.000 * u_chroma)).b;\n  \n  // Blur\n  col += 0.05 * texture(u_texture, vec2(uv.x - 2.0 * u_blur / iResolution.x, uv.y));\n  col += 0.10 * texture(u_texture, vec2(uv.x - 1.0 * u_blur / iResolution.x, uv.y));\n  col += 0.10 * texture(u_texture, vec2(uv.x + 1.0 * u_blur / iResolution.x, uv.y));\n  col += 0.05 * texture(u_texture, vec2(uv.x + 2.0 * u_blur / iResolution.x, uv.y));\n\n  // Vignette\n  col *= pow(16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), u_vignette);\n\n  // Scanlines\n  col *= clamp(1.0 + u_scanlineWidth * sin(uv.y * iResolution.y * 2.0 * PI), 1.0 - u_scanlineIntensity, 1.0);\n\n  outputColor = vec4(col.rgb, 1.0);\n}";
