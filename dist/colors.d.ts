export declare const COLOR_BLACK = 0;
export declare const COLOR_WHITE = 4294967040;
export declare const COLOR_LIGHT_GRAY = 2863311360;
export declare const COLOR_DARK_GRAY = 1431655680;
export declare const COLOR_YELLOW = 4294923520;
export declare const COLOR_BROWN = 2857697280;
export declare const COLOR_LIGHT_RED = 4283782400;
export declare const COLOR_DARK_RED = 2852126720;
export declare const COLOR_LIGHT_GREEN = 1442796800;
export declare const COLOR_DARK_GREEN = 11141120;
export declare const COLOR_LIGHT_CYAN = 1442840320;
export declare const COLOR_DARK_CYAN = 11184640;
export declare const COLOR_LIGHT_BLUE = 1431699200;
export declare const COLOR_DARK_BLUE = 43520;
export declare const COLOR_LIGHT_MAGENTA = 4283825920;
export declare const COLOR_DARK_MAGENTA = 2852170240;
export declare const COLOR_ORANGE = 4287102976;
/**
 * Creates a big-endian 32-bit RGBA color from red, green, and blue components.
 * @param r Red (0-255).
 * @param g Green (0-255).
 * @param b Blue (0-255).
 * @return A 32-bit unsigned integer color.
 */
export declare function createColor(r: number, g: number, b: number): number;
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
export declare function createHsvColor(h: number, s: number, v: number): number;
