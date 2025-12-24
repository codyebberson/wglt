import { serializable } from './serialize';

/**
 * Interface for objects that have x and y coordinates.
 */
export interface PointLike {
  x: number;
  y: number;
}

/**
 * Represents a 2D point with x and y coordinates.
 * Used throughout WGLT for positions, offsets, and movement vectors.
 */
@serializable
export class Point implements PointLike {
  x: number;
  y: number;

  /**
   * Creates a new Point.
   * @param x - The x-coordinate.
   * @param y - The y-coordinate.
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Adds another point to this point in place.
   * @param other - The point to add to this point.
   */
  add(other: PointLike): void {
    this.x += other.x;
    this.y += other.y;
  }
}
