import {Point} from './point.js';

export class Rect {
  constructor(x, y, width, height) {
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

  intersects(other) {
    return this.x <= other.x2 && this.x2 >= other.x && this.y <= other.y2 && this.y2 >= other.y;
  }
}
