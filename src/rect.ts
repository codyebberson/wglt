import {Mouse} from './mouse';
import {Vec2} from './vec2';

export class Rect extends Vec2 {
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

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

  clone() {
    return new Rect(this.x, this.y, this.width, this.height);
  }

  getCenter() {
    return new Vec2(this.x + (this.width / 2) | 0, this.y + (this.height / 2) | 0);
  }

  intersects(other: Rect) {
    return this.x <= other.x2 && this.x2 >= other.x && this.y <= other.y2 && this.y2 >= other.y;
  }

  contains(point: Vec2|Mouse) {
    return point.x >= this.x && point.x <= this.x2 && point.y >= this.y && point.y <= this.y2;
  }
}
