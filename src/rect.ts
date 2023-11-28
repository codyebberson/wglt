import { Point } from './point';
import { serializable } from './serialize';

@serializable
export class Rect {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly height: number
  ) {}

  get left(): number {
    return this.x;
  }

  get top(): number {
    return this.y;
  }

  get x2(): number {
    return this.x + this.width;
  }

  get y2(): number {
    return this.y + this.height;
  }

  getCenter(): Point {
    return new Point((this.x + this.width / 2) | 0, (this.y + this.height / 2) | 0);
  }

  intersects(other: Rect): boolean {
    return this.x <= other.x2 && this.x2 >= other.x && this.y <= other.y2 && this.y2 >= other.y;
  }

  contains(point: Point | Rect): boolean {
    return point.x >= this.x && point.x < this.x2 && point.y >= this.y && point.y < this.y2;
  }
}
