import { serializable } from './serialize';
import { type PointLike, Vec2 } from './vec2';

/**
 * Represents a rectangle with x, y position and width, height dimensions.
 * Used throughout WGLT for screen regions, collision detection, and UI layout.
 */
@serializable
export class Rect {
  x: number;
  y: number;
  width: number;
  height: number;

  /**
   * Creates a new rectangle.
   * @param x - The x-coordinate of the top-left corner.
   * @param y - The y-coordinate of the top-left corner.
   * @param width - The width of the rectangle.
   * @param height - The height of the rectangle.
   */
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * The x-coordinate of the left edge (same as x).
   */
  get x1(): number {
    return this.x;
  }

  /**
   * The y-coordinate of the top edge (same as y).
   */
  get y1(): number {
    return this.y;
  }

  /**
   * The x-coordinate of the right edge.
   */
  get x2(): number {
    return this.x + this.width;
  }

  /**
   * The y-coordinate of the bottom edge.
   */
  get y2(): number {
    return this.y + this.height;
  }

  /**
   * The x-coordinate of the left edge (same as x).
   */
  get left(): number {
    return this.x;
  }

  /**
   * The y-coordinate of the top edge (same as y).
   */
  get top(): number {
    return this.y;
  }

  /**
   * Creates a copy of this rectangle.
   * @returns A new Rect with the same dimensions and position.
   */
  clone(): Rect {
    return new Rect(this.x, this.y, this.width, this.height);
  }

  /**
   * Copies the dimensions and position from another rectangle.
   * @param other - The rectangle to copy from.
   */
  copy(other: Rect): void {
    this.x = other.x;
    this.y = other.y;
    this.width = other.width;
    this.height = other.height;
  }

  /**
   * Gets the center point of the rectangle.
   * @returns A Vec2 representing the center coordinates.
   */
  getCenter(): Vec2 {
    return new Vec2((this.x + this.width / 2) | 0, (this.y + this.height / 2) | 0);
  }

  /**
   * Checks if this rectangle intersects with another rectangle.
   * @param other - The rectangle to check intersection with.
   * @returns True if the rectangles intersect, false otherwise.
   */
  intersects(other: Rect): boolean {
    return this.x <= other.x2 && this.x2 >= other.x && this.y <= other.y2 && this.y2 >= other.y;
  }

  /**
   * Checks if a point is contained within this rectangle.
   * @param point - The point to check.
   * @returns True if the point is inside the rectangle, false otherwise.
   */
  contains(point: PointLike): boolean {
    return point.x >= this.x && point.x <= this.x2 && point.y >= this.y && point.y <= this.y2;
  }
}
