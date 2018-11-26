
import {Cell} from './cell';
import {Chars} from './chars';
import {Color, fromRgb} from './color';
import {Console} from './console';

/**
 * All available 2x2 patterns for 2x image loading.
 * Note: The strict IBM CGA font only has halves, not quadrants.
 */
const PATTERNS = [
  {charCode: Chars.BLOCK_TOP_HALF, active: [1, 1, 0, 0]},
  {charCode: Chars.BLOCK_RIGHT_HALF, active: [0, 1, 0, 1]},
];

export function loadImage(url: string, callback: (result: Console) => void) {
  const img = new Image();
  img.onload = () => {
    const w = img.width;
    const h = img.height;
    const data = getImageData(img);
    const result = new Console(w, h);
    let i = 0;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const cell = result.getCell(x, y) as Cell;
        cell.setBackground(fromRgb(data[i++], data[i++], data[i++], data[i++]));
      }
    }

    callback(result);
  };
  img.src = url;
}

export function loadImage2x(url: string, callback: (result: Console) => void) {
  const img = new Image();
  img.onload = () => {
    const w = img.width;
    const h = img.height;
    const data = getImageData(img);
    const result = new Console(w / 2, h / 2);

    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        draw2x2(result, data, x, y, w);
      }
    }

    callback(result);
  };
  img.src = url;
}

function getImageData(img: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.drawImage(img, 0, 0);

  return ctx.getImageData(0, 0, img.width, img.height).data;
}

function draw2x2(
    con: Console, data: Uint8ClampedArray, x: number, y: number, w: number) {
  // Top left
  const i1 = 4 * (y * w + x);
  const r1 = data[i1];
  const g1 = data[i1 + 1];
  const b1 = data[i1 + 2];

  // Top right
  const i2 = 4 * (y * w + x + 1);
  const r2 = data[i2];
  const g2 = data[i2 + 1];
  const b2 = data[i2 + 2];

  // Bottom left
  const i3 = 4 * ((y + 1) * w + x);
  const r3 = data[i3];
  const g3 = data[i3 + 1];
  const b3 = data[i3 + 2];

  // Bottom right
  const i4 = 4 * ((y + 1) * w + x + 1);
  const r4 = data[i4];
  const g4 = data[i4 + 1];
  const b4 = data[i4 + 2];

  const colors = [[r1, g1, b1], [r2, g2, b2], [r3, g3, b3], [r4, g4, b4]];

  // For each possible pattern, calculate the total error
  // Find the pattern with minum error

  let minError = Number.MAX_VALUE;
  let bestCharCode = 0;
  let bestBg = null;
  let bestFg = null;

  for (let i = 0; i < PATTERNS.length; i++) {
    const pattern = PATTERNS[i];
    const patternColors = computeColors(pattern.active, colors);
    if (patternColors.error < minError) {
      minError = patternColors.error;
      bestCharCode = pattern.charCode;
      bestBg = patternColors.bg;
      bestFg = patternColors.fg;
    }
  }

  con.drawChar(
      x / 2, y / 2, bestCharCode, arrayToColor(bestFg as number[]),
      arrayToColor(bestBg as number[]));
}

function computeColors(pattern: number[], colors: number[][]) {
  const sum = [[0, 0, 0], [0, 0, 0]];
  const avg = [[0, 0, 0], [0, 0, 0]];
  const count = [0, 0];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      sum[pattern[i]][j] += colors[i][j];
    }
    count[pattern[i]]++;
  }

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 3; j++) {
      avg[i][j] = sum[i][j] / count[i];
    }
  }

  let error = 0.0;

  for (let i = 0; i < 4; i++) {
    let cellError = 0.0;
    for (let j = 0; j < 3; j++) {
      const delta = colors[i][j] - avg[pattern[i]][j];
      cellError += delta * delta;
    }
    error += Math.sqrt(cellError);
  }

  return {bg: avg[0], fg: avg[1], error};
}

function arrayToColor(rgb: number[]): Color {
  return fromRgb(rgb[0], rgb[1], rgb[2]);
}
