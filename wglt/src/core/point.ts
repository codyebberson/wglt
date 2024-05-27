import { serializable } from './serialize';

export interface PointLike {
  readonly x: number;
  readonly y: number;
}

@serializable
export class Point implements PointLike {
  constructor(
    readonly x: number,
    readonly y: number
  ) {}
}
