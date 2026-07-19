import { registerSerializable } from './serialize';

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
export class Vec2 implements PointLike {
  static {
    registerSerializable(Vec2);
  }

  x: number;
  y: number;

  /**
   * Creates a new Vec2.
   * @param x - The x-coordinate.
   * @param y - The y-coordinate.
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Creates a copy of this Vec2.
   * @returns A new Vec2 with the same coordinates.
   */
  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  /**
   * Adds another point to this point in place.
   * @param other - The point to add to this point.
   * @returns This point after addition.
   */
  add(other: PointLike): this {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  /**
   * Subtracts another point from this point in place.
   * @param other - The point to subtract from this point.
   * @returns This point after subtraction.
   */
  subtract(other: PointLike): this {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  /**
   * Normalizes the vector to have a length of 1.
   * @returns This point after normalization.
   */
  normalize(): this {
    const len = this.length();
    if (len !== 0) {
      this.x /= len;
      this.y /= len;
    }
    return this;
  }

  /**
   * Calculates the length (magnitude) of the vector.
   * @returns The length of the vector.
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Returns the distance between this point and another point.
   * @param other - The other point.
   * @returns The distance between the two points.
   */
  distance(other: PointLike): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculates the dot product of this vector and another vector.
   * @param other - The other vector.
   * @returns The dot product.
   */
  dot(other: PointLike): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Linearly interpolates between this point and another point.
   * @param other - The other point.
   * @param t - The interpolation factor (0.0 to 1.0).
   * @returns This point after interpolation.
   */
  lerp(other: PointLike, t: number): this {
    this.x += (other.x - this.x) * t;
    this.y += (other.y - this.y) * t;
    return this;
  }

  /**
   * Calculates the angle of the vector in radians.
   * @returns The angle in radians.
   */
  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Rotates the vector by a given angle in radians.
   * @param angle - The angle to rotate by in radians.
   * @returns This point after rotation.
   */
  rotate(angle: number): this {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = this.x * cos - this.y * sin;
    const y = this.x * sin + this.y * cos;
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Scales the vector by a given scalar.
   * @param scalar - The scalar to scale by.
   * @returns This point after scaling.
   */
  scale(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Moves this point toward a target point by a maximum distance.
   * @param target - The target point.
   * @param maxDistance - The maximum distance to move.
   * @returns This point after moving.
   */
  moveToward(target: PointLike, maxDistance: number): this {
    const toTarget = new Vec2(target.x - this.x, target.y - this.y);
    const distance = toTarget.length();
    if (distance <= maxDistance || distance === 0) {
      this.x = target.x;
      this.y = target.y;
    } else {
      toTarget.normalize().scale(maxDistance);
      this.add(toTarget);
    }
    return this;
  }

  /**
   * Calculates the direction vector from this point to a target point.
   * @param target - The target point.
   * @returns A normalized vector pointing from this point to the target.
   */
  directionTo(target: PointLike): Vec2 {
    const direction = new Vec2(target.x - this.x, target.y - this.y);
    return direction.normalize();
  }
}
