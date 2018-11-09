
export type Color = number;

/**
 * Creates a big-endian 32-bit RGBA color from red, green, and blue components.
 * @param r Red (0-255).
 * @param g Green (0-255).
 * @param b Blue (0-255).
 * @return A 32-bit unsigned integer color.
 */
export function fromRgb(r: number, g: number, b: number): Color {
  return ((r << 24) + (g << 16) + (b << 8)) as Color;
}


/**
 * Converts a color from HSV format to RGBA format.
 *
 * Based on: https://stackoverflow.com/a/17243070/2051724
 *
 * @param h Hue (0.0 - 1.0).
 * @param s Saturation (0.0 - 1.0).
 * @param v Value (0.0 - 1.0).
 * @return A 32-bit unsigned integer color.
 */
export function fromHsv(h: number, s: number, v: number): Color {
  let r, g, b, i, f, p, q, t;
  i = (h * 6) | 0;
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v, g = t, b = p;
      break;
    case 1:
      r = q, g = v, b = p;
      break;
    case 2:
      r = p, g = v, b = t;
      break;
    case 3:
      r = p, g = q, b = v;
      break;
    case 4:
      r = t, g = p, b = v;
      break;
    case 5:
      r = v, g = p, b = q;
      break;
    default:
      r = 0;
      g = 0;
      b = 0;
  }
  return fromRgb((r * 255) | 0, (g * 255) | 0, (b * 255) | 0);
}
