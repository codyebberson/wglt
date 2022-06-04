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

export const CRT_VERTEX_SHADER_SOURCE = `#version 300 es
precision highp float;
in vec2 a_position;
in vec2 a_texCoord;
out vec4 v_position;
out vec2 v_texCoord;
void main(void) {
  gl_Position=vec4(a_position.x, a_position.y, 0.0, 1.0);
  v_position = vec4(a_position.x, a_position.y, 0.0, 1.0);
  v_texCoord = a_texCoord;
}`;

// export const CRT_FRAGMENT_SHADER_SOURCE = `#version 300 es
// precision highp float;
// in vec4 v_position;
// in vec2 v_texCoord;
// uniform sampler2D	u_texture;
// out vec4 outputColor;

// void main(void)
// {
//   outputColor.rgb = vec3(1.0, 0.5, 0.5);
//   outputColor.a = 1.0;
// }`;

export const CRT_FRAGMENT_SHADER_SOURCE = `#version 300 es
precision highp float;
in vec4 v_position;
in vec2 v_texCoord;
uniform sampler2D	u_texture;
out vec4 outputColor;

// PUBLIC DOMAIN CRT STYLED SCAN-LINE SHADER
//   by Timothy Lottes
// https://www.shadertoy.com/view/XsjSzR
//   modified (borked) by ultrabrite

// Emulated input resolution.
const vec2 texSize=vec2(640.0, 360.0);

// Hardness of scanline.
//  -8.0 = soft
// -16.0 = medium
//  -8.0 = default
float hardScan=-8.0;

// Hardness of pixels in scanline.
// -2.0 = soft
// -4.0 = hard
// -2.0 = default
const float hardPix=-4.0;

// Hardness of shadow mask in scanline.
// 0.5 = hard
// 3.0 = soft
// 2.0 = default
const float hardMask=2.0;

const vec3 compos = vec3(1.0/6.0,1.0/2.0,5.0/6.0);

// Display warp.
// 0.0 = none
// 1.0/8.0 = extreme
// 1.0/24.0 = default
const vec2 warp=vec2(1.0/128.0,1.0/128.0);

//------------------------------------------------------------------------

// Nearest emulated sample given floating point position and texel offset.
// Also zero's off screen.
vec3 Fetch(vec2 pos,vec2 off)
{
  //pos=floor(pos * texSize + off) / texSize;
  if (pos.x<0.0 || pos.x>=1.0 || pos.y<0.0 || pos.y>=1.0)
    return vec3(0.0,0.0,0.0);
  return texture(u_texture,pos.xy).rgb;
}

// Distance in emulated pixels to nearest texel.
vec2 Dist(vec2 pos)
{
  pos=pos * texSize;
  return -((pos-floor(pos))-vec2(0.5));
}

// 1D Gaussian.
float Gaus(float pos,float scale)
{
  return exp2(scale*pos*pos);
}

// 3-tap Gaussian filter along horz line.
vec3 Horz3(vec2 pos,float off)
{
  mat3 m=mat3(Fetch(pos,vec2(-1.0,off)),
        Fetch(pos,vec2( 0.0,off)),
        Fetch(pos,vec2( 1.0,off)));
  float dst=Dist(pos).x;
  // Convert distance to weight.
  vec3 v=vec3(Gaus(dst-1.0,hardPix),
        Gaus(dst+0.0,hardPix),
        Gaus(dst+1.0,hardPix));
    // Return filtered sample.
    return (m*v)/(v.x+v.y+v.z);
}

// 5-tap Gaussian filter along horz line.
vec3 Horz5(vec2 pos,float off)
{
  /*
  vec3 a=Fetch(pos,vec2(-2.0,off));
  vec3 b=Fetch(pos,vec2(-1.0,off));
  vec3 c=Fetch(pos,vec2( 0.0,off));
  vec3 d=Fetch(pos,vec2( 1.0,off));
  vec3 e=Fetch(pos,vec2( 2.0,off));
  float dstx=Dist(pos).x;
  // Convert distance to weight.
  float wa=Gaus(dstx-2.0,hardPix);
  float wb=Gaus(dstx-1.0,hardPix);
  float wc=Gaus(dstx+0.0,hardPix);
  float wd=Gaus(dstx+1.0,hardPix);
  float we=Gaus(dstx+2.0,hardPix);
  */
  vec3 a=Fetch(pos,vec2(-0.2,off));
  vec3 b=Fetch(pos,vec2(-0.1,off));
  vec3 c=Fetch(pos,vec2( 0.0,off));
  vec3 d=Fetch(pos,vec2( 0.1,off));
  vec3 e=Fetch(pos,vec2( 0.2,off));
  float dstx=Dist(pos).x;
  // Convert distance to weight.
  float wa=Gaus(dstx-0.2,hardPix);
  float wb=Gaus(dstx-0.1,hardPix);
  float wc=Gaus(dstx+0.0,hardPix);
  float wd=Gaus(dstx+0.1,hardPix);
  float we=Gaus(dstx+0.2,hardPix);
  // Return filtered sample.
  return (a*wa+b*wb+c*wc+d*wd+e*we)/(wa+wb+wc+wd+we);
}

// Allow nearest three lines to effect pixel.
vec3 Tri(vec2 pos)
{
  vec3 m = Fetch(pos, vec2(0.0, 0.0)); // original only
  float y2 = fract(pos.y*texSize.y);
  if (y2 > 0.667) {
    m *= 0.9;
  }
  return m;
  // mat3 m=mat3(Horz3(pos,-1.0),
  //       Horz5(pos, 0.0),
  //       Horz3(pos, 1.0));
  // mat3 m=mat3(Horz3(pos,-0.25),
  //      Horz5(pos, 0.0),
  //      Horz3(pos, 0.25));
  // vec3 m=Fetch(pos, vec2(0.0, 0.0));
  // float dsty=Dist(pos).y;
  // vec3 v=vec3(Gaus(dsty-1.0,hardScan),
  //       Gaus(dsty+0.0,hardScan),
  //       Gaus(dsty+1.0,hardScan));
  // return m*v;
}

// Distortion of scanlines, and end of screen alpha.
vec2 Warp(vec2 pos)
{
  // pos=pos*2.0-1.0;
  // pos*=1.0+vec2(pos.y*pos.y,pos.x*pos.x)*warp;
  // return pos*0.5+0.5;
  return pos;
}

// vec3 Mask(float x)
// {
//   //vec3 v  = clamp((fract(x)-compos)*hardMask,-1.0/3.0,1.0/3.0);
//   //return 2.0/3.0+abs(v);
//   // return 1.0;
//   return vec3(1.0,1.0,1.0);
// }

void main()
{
  // outputColor.rgb = Tri(Warp(v_texCoord.xy)) * Mask(v_texCoord.x*texSize.x);
  outputColor.rgb = Tri(Warp(v_texCoord.xy));
  //outputColor.rgb = texture(u_texture, v_texCoord).rgb; // original
  //outputColor.rgb = texture(u_texture, v_texCoord).rgb * Mask(v_texCoord.x*texSize.x);
  // outputColor.rgb = vec3(0.5, 0.5, 0.5);
  // outputColor.rgb = texture(u_texture, Warp(v_texCoord.xy)).rgb * Mask(v_texCoord.x*texSize.x);
  outputColor.a = 1.0;
}`;
