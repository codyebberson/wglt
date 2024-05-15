import { Rect } from '@wglt/core';
import { BaseApp } from './baseapp';

const DEFAULT_TICKS_PER_FRAME = 30;

export class Sprite extends Rect {
  static globalAnimIndex = 0;
  readonly frames: number;
  readonly loop: boolean;
  readonly ticksPerFrame: number;
  private animIndex: number;
  private animDelay: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    frames?: number,
    loop?: boolean,
    ticksPerFrame?: number
  ) {
    super(x, y, width, height);
    this.frames = frames || 1;
    this.loop = !!loop;
    this.ticksPerFrame = ticksPerFrame || DEFAULT_TICKS_PER_FRAME;
    this.animIndex = 0;
    this.animDelay = 0;
  }

  draw(app: BaseApp, x: number, y: number, flipped = false): void {
    let frame = this.animIndex;
    if (this.loop) {
      frame = ((Sprite.globalAnimIndex / this.ticksPerFrame) | 0) % this.frames;
    }

    const u = this.x + frame * this.width;
    const v = this.y;

    if (flipped) {
      app.drawImage(x + this.width, y, u, v, this.width, this.height, undefined, -this.width);
    } else {
      app.drawImage(x, y, u, v, this.width, this.height);
    }

    this.animDelay++;
    if (this.animDelay > this.ticksPerFrame) {
      this.animDelay = 0;
      this.animIndex++;
      if (this.animIndex >= this.frames) {
        if (this.loop) {
          this.animIndex = 0;
        } else {
          this.animIndex = this.frames - 1;
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

  static updateGlobalAnimations(): void {
    Sprite.globalAnimIndex++;
  }
}
