import { BaseApp } from '../core/baseapp';
import { Rect } from '../core/rect';

const DEFAULT_TICKS_PER_FRAME = 20;

export class Sprite extends Rect {
  private animFrame: number;
  private animDelay: number;

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
    this.animFrame = 0;
    this.animDelay = 0;
  }

  draw(app: BaseApp, x: number, y: number, flipped = false): void {
    const u = this.x + this.animFrame * this.width;
    const v = this.y;

    if (flipped) {
      app.drawImage(x + this.width, y, u, v, this.width, this.height, undefined, -this.width);
    } else {
      app.drawImage(x, y, u, v, this.width, this.height);
    }

    this.animDelay++;
    if (this.frames > 1 && this.animDelay > this.ticksPerFrame) {
      this.animDelay = 0;
      this.animFrame++;
      if (this.animFrame >= this.frames) {
        if (this.loop) {
          this.animFrame = 0;
        } else {
          this.animFrame = this.frames - 1;
        }
      }
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
}
