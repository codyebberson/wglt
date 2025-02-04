import { Rect } from '../core/rect';
import { GraphicsApp } from '../graphics/graphicsapp';

const DEFAULT_TICKS_PER_FRAME = 20;

export class Sprite extends Rect {
  static globalAnimIndex = 0;
  private animFrame = 0;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    readonly frames = 1,
    readonly loop = true,
    readonly ticksPerFrame = DEFAULT_TICKS_PER_FRAME
  ) {
    super(x, y, width, height);
  }

  draw(app: GraphicsApp, x: number, y: number, flipped = false): void {
    this.animFrame = ((Sprite.globalAnimIndex / this.ticksPerFrame) | 0) % this.frames;

    const u = this.x + this.animFrame * this.width;
    const v = this.y;

    if (flipped) {
      app.drawImage(x + this.width, y, u, v, this.width, this.height, undefined, -this.width);
    } else {
      app.drawImage(x, y, u, v, this.width, this.height);
    }
  }

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

  static updateGlobalAnimations(): void {
    Sprite.globalAnimIndex++;
  }
}
