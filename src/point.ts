import { serializable } from './serialize';

export interface PointLike {
  readonly x: number;
  readonly y: number;
}

@serializable
export class Point implements PointLike {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
