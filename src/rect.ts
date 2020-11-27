import { Point } from './point';

export class Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly left: number;
  readonly top: number;
  readonly x2: number;
  readonly y2: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = this.left = x;
    this.y = this.top = y;
    this.width = width;
    this.height = height;
    this.x2 = x + width;
    this.y2 = y + height;
  }

  getCenter() {
    return new Point(this.x + (this.width / 2) | 0, this.y + (this.height / 2) | 0);
  }

  intersects(other: Rect) {
    return this.x <= other.x2 && this.x2 >= other.x && this.y <= other.y2 && this.y2 >= other.y;
  }

  contains(point: Rect) {
    return point.x >= this.x && point.y < this.x2 && point.y >= this.y && point.y < this.y2;
  }
}
