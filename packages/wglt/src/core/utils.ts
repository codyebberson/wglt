/**
 * Creates a centered canvas element in the document body with specified width and height.
 *
 * @param width - The width of the canvas in pixels.
 * @param height - The height of the canvas in pixels.
 * @returns The created HTMLCanvasElement.
 */
export function createCenteredCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `min(100vw, calc(100vh * ${width}/${height}))`;
  canvas.style.position = 'absolute';
  canvas.style.aspectRatio = `${width}/${height}`;
  canvas.style.color = 'white';

  const body = document.body;
  body.style.margin = '0';
  body.style.backgroundColor = '#080808';
  body.style.display = 'grid';
  body.style.placeItems = 'center';
  body.style.height = '100vh';
  body.style.overflow = 'hidden';
  body.appendChild(canvas);

  return canvas;
}

/**
 * Returns the input string wrapped to the maximum line length.
 * @param str - The original input string.
 * @param maxLength - The maximum length of a single line.
 * @returns Array of word wrapped lines.
 */
export function wordWrap(str: string, maxLength: number): string[] {
  const regex = new RegExp(`(\\S(.{0,${maxLength}}\\S)?)\\s+`, 'g');
  return `${str} `
    .replace(regex, '$1\n')
    .trim()
    .split('\n')
    .map((line) => line.trim());
}

/**
 * Capitalizes the first letter of the input string.
 * @param str - The original input string.
 * @returns The capitalized string.
 */
export function capitalize(str: string): string {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Linearly interpolates a number in the range 0-max to -1.0-1.0.
 *
 * @param i - The value between 0 and max.
 * @param max - The maximum value.
 * @returns The interpolated value between -1.0 and 1.0.
 */
export function interpolate(i: number, max: number): number {
  return -1.0 + 2.0 * (i / max);
}
