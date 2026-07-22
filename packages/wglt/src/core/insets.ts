import { registerSerializable } from './serialize.ts';

/**
 * Interface for objects that have x and y coordinates.
 */
export interface InsetsLike {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Represents a 2D point with x and y coordinates.
 * Used throughout WGLT for positions, offsets, and movement vectors.
 */
export class Insets implements InsetsLike {
  static {
    registerSerializable('wglt.Insets', Insets);
  }

  top: number;
  right: number;
  bottom: number;
  left: number;

  /**
   * Creates a new Insets.
   * @param top - The top inset.
   * @param right - The right inset.
   * @param bottom - The bottom inset.
   * @param left - The left inset.
   */
  constructor(top: number, right: number, bottom: number, left: number) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }
}
