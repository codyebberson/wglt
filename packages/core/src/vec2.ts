export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(delta: Vec2): void {
    this.x += delta.x;
    this.y += delta.y;
  }
}
