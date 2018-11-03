
export const COLOR_BLACK = 0x00000000;
export const COLOR_WHITE = 0xffffff00;
export const COLOR_LIGHT_GRAY = 0xaaaaaa00;
export const COLOR_DARK_GRAY = 0x55555500;
export const COLOR_YELLOW = 0xffff5500;
export const COLOR_BROWN = 0xaa550000;
export const COLOR_LIGHT_RED = 0xff555500;
export const COLOR_DARK_RED = 0xaa000000;
export const COLOR_LIGHT_GREEN = 0x55ff5500;
export const COLOR_DARK_GREEN = 0x00aa0000;
export const COLOR_LIGHT_CYAN = 0x55ffff00;
export const COLOR_DARK_CYAN = 0x00aaaa00;
export const COLOR_LIGHT_BLUE = 0x5555ff00;
export const COLOR_DARK_BLUE = 0x0000aa00;
export const COLOR_LIGHT_MAGENTA = 0xff55ff00;
export const COLOR_DARK_MAGENTA = 0xaa00aa00;
export const COLOR_ORANGE = 0xff880000;

/**
 * Creates a big-endian 32-bit RGBA color from red, green, and blue components.
 * @param {number} r Red (0-255).
 * @param {number} g Green (0-255).
 * @param {number} b Blue (0-255).
 * @return {number} A 32-bit little-endian color.
 */
export function createColor(r, g, b) {
    return (r << 24) + (g << 16) + (b << 8);
}

/**
 * Converts a color from HSV format to RGBA format.
 *
 * Based on: https://stackoverflow.com/a/17243070/2051724
 *
 * @param {number} h Hue.
 * @param {number} s Saturation.
 * @param {number} v Value.
 * @param {number=} a Optional alpha, default is 1 (opaque).
 */
export function createHsvColor(h, s, v) {
    var r, g, b, i, f, p, q, t;
    i = (h * 6) | 0;
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return createColor((r * 255) | 0, (g * 255) | 0, (b * 255) | 0);
}
