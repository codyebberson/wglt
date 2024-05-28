import { serializable } from './serialize';

export interface PointLike {
  x: number;
  y: number;
}

@serializable
export class Point implements PointLike {
  constructor(
    public x: number,
    public y: number
  ) {}

  add(other: PointLike): void {
    this.x += other.x;
    this.y += other.y;
  }
}
