import { App } from './app';
import { Color } from './color';
import { Rect } from './rect';
import { Serializable } from './serializable';

const DEFAULT_TICKS_PER_FRAME = 30;

@Serializable('Sprite')
export class Sprite extends Rect {
  static globalAnimIndex = 0;
  readonly frames: number;
  readonly loop: boolean;
  readonly ticksPerFrame: number;
  readonly colorOverride?: Color;
  private animIndex: number;
  private animDelay: number;

  constructor(
      x: number,
      y: number,
      width: number,
      height: number,
      frames?: number,
      loop?: boolean,
      ticksPerFrame?: number,
      colorOverride?: Color) {
    super(x, y, width, height);
    this.frames = frames || 1;
    this.loop = !!loop;
    this.ticksPerFrame = ticksPerFrame || DEFAULT_TICKS_PER_FRAME;
    this.colorOverride = colorOverride;
    this.animIndex = 0;
    this.animDelay = 0;
  }

  draw(app: App, x: number, y: number, colorOverride?: Color) {
    let frame = this.animIndex;
    if (this.loop) {
      frame = ((Sprite.globalAnimIndex / this.ticksPerFrame) | 0) % this.frames;
    }

    const u = this.x + frame * this.width;
    const v = this.y;
    const color = colorOverride || this.colorOverride;
    app.drawImage(x, y, u, v, this.width, this.height, color);

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

  clone() {
    return new Sprite(
      this.x,
      this.y,
      this.width,
      this.height,
      this.frames,
      this.loop,
      this.ticksPerFrame,
      this.colorOverride);
  }

  static updateGlobalAnimations() {
    Sprite.globalAnimIndex++;
  }
}
