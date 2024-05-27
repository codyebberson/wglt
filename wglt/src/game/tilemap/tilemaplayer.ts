import { getTileId } from './tilemap';

/**
 * @constructor
 * @param width
 * @param height
 */
export class TileMapLayer {
  readonly width: number;
  readonly height: number;
  readonly imageData: Uint8Array;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.imageData = new Uint8Array(4 * width * height);
    this.clear();
  }

  clear(): void {
    let i = 0;
    while (i < this.imageData.length) {
      this.imageData[i++] = 0;
    }
  }

  getIndex(x: number, y: number): number {
    return 4 * (y * this.width + x);
  }

  setTile(x: number, y: number, tile: number): void {
    const index = this.getIndex(x, y);
    this.imageData[index] = (tile % 64) | 0;
    this.imageData[index + 1] = (tile / 64) | 0;
  }

  getTile(x: number, y: number): number {
    const index = this.getIndex(x, y);
    return getTileId(this.imageData[index], this.imageData[index + 1]);
  }

  isAnimated(x: number, y: number): boolean {
    const index = this.getIndex(x, y);
    return !!this.imageData[index + 2];
  }

  setAnimated(x: number, y: number, animated: boolean): void {
    const index = this.getIndex(x, y);
    this.imageData[index + 2] = animated ? 1 : 0;
  }

  getAlpha(x: number, y: number): number {
    const index = this.getIndex(x, y);
    return this.imageData[index + 3];
  }

  setAlpha(x: number, y: number, alpha: number): void {
    const index = this.getIndex(x, y);
    this.imageData[index + 3] = alpha;
  }
}
