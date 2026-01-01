import { Rect } from '../core/rect';
import type { GraphicsApp } from '../graphics/graphicsapp';

const DEFAULT_TICKS_PER_FRAME = 20;

/**
 * Represents an animated sprite from a sprite sheet.
 * Extends Rect to define the source region, with additional animation capabilities.
 * All sprites share a global animation timer for synchronized animations.
 *
 * @example
 * ```typescript
 * // Static sprite (single frame)
 * const coin = new Sprite(32, 16, 16, 16, 1);
 *
 * // Animated sprite (4 frames, loops)
 * const player = new Sprite(0, 32, 16, 16, 4, true, 15);
 *
 * // Draw the sprite
 * player.draw(app, playerX, playerY);
 *
 * // Draw flipped horizontally
 * player.draw(app, playerX, playerY, true);
 * ```
 */
export class Sprite extends Rect {
  /** Global animation frame counter, shared by all sprites. */
  static globalAnimIndex = 0;
  readonly frames: number;
  readonly loop: boolean;
  readonly ticksPerFrame: number;

  /**
   * Creates a new Sprite.
   * @param x - The x-coordinate of the sprite on the sprite sheet.
   * @param y - The y-coordinate of the sprite on the sprite sheet.
   * @param width - The width of each frame in pixels.
   * @param height - The height of each frame in pixels.
   * @param frames - Number of animation frames (default: 1 for static sprites).
   * @param loop - Whether the animation should loop (default: true).
   * @param ticksPerFrame - Number of game ticks per animation frame (default: 20).
   */
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    frames = 1,
    loop = true,
    ticksPerFrame = DEFAULT_TICKS_PER_FRAME
  ) {
    super(x, y, width, height);
    this.frames = frames;
    this.loop = loop;
    this.ticksPerFrame = ticksPerFrame;
  }

  /**
   * Draws the sprite at the specified screen coordinates.
   * Automatically handles animation frame calculation based on global timer.
   * @param app - The GraphicsApp instance to draw with.
   * @param x - The x-coordinate on screen to draw at.
   * @param y - The y-coordinate on screen to draw at.
   * @param flipped - Whether to flip the sprite horizontally (default: false).
   * @param frame - Optional specific frame to draw (overrides animation).
   */
  draw(app: GraphicsApp, x: number, y: number, flipped: boolean = false, frame?: number): void {
    if (frame === undefined) {
      frame = ((Sprite.globalAnimIndex / this.ticksPerFrame) | 0) % this.frames;
    }

    const u = this.x + frame * this.width;
    const v = this.y;

    if (flipped) {
      app.drawImage(x + this.width, y, u, v, this.width, this.height, undefined, -this.width);
    } else {
      app.drawImage(x, y, u, v, this.width, this.height);
    }
  }

  /**
   * Creates a copy of this sprite with the same properties.
   * @returns A new Sprite instance with identical configuration.
   */
  clone(): Sprite {
    return new Sprite(
      this.x,
      this.y,
      this.width,
      this.height,
      this.frames,
      this.loop,
      this.ticksPerFrame
    );
  }

  /**
   * Updates the global animation timer used by all sprites.
   * Called automatically by GraphicsApp each frame.
   * @internal
   */
  static updateGlobalAnimations(): void {
    Sprite.globalAnimIndex++;
  }
}
