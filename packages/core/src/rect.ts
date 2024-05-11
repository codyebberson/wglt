import { Mouse } from './mouse';
import { PointLike } from './point';
import { serializable } from './serialize';
import { Vec2 } from './vec2';

@serializable
export class Rect {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}

  get x1(): number {
    return this.x;
  }

  get y1(): number {
    return this.y;
  }

  get x2(): number {
    return this.x + this.width;
  }

  get y2(): number {
    return this.y + this.height;
  }

  get left(): number {
    return this.x;
  }

  get top(): number {
    return this.y;
  }

  clone(): Rect {
    return new Rect(this.x, this.y, this.width, this.height);
  }

  copy(other: Rect): void {
    this.x = other.x;
    this.y = other.y;
    this.width = other.width;
    this.height = other.height;
  }

  getCenter(): Vec2 {
    return new Vec2((this.x + this.width / 2) | 0, (this.y + this.height / 2) | 0);
  }

  intersects(other: Rect): boolean {
    return this.x <= other.x2 && this.x2 >= other.x && this.y <= other.y2 && this.y2 >= other.y;
  }

  contains(point: Vec2 | PointLike | Mouse): boolean {
    return point.x >= this.x && point.x <= this.x2 && point.y >= this.y && point.y <= this.y2;
  }
}
