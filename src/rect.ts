
export class Rect {
  readonly x: number;
  readonly y: number;
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = this.left = x;
    this.y = this.top = y;
    this.width = width;
    this.height = height;
  }
}
