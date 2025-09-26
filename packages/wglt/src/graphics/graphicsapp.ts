import { BaseApp } from '../core/baseapp';
import { Color } from '../core/color';
import { Font } from '../core/font';
import { Mouse } from '../core/mouse';
import { Point } from '../core/point';
import { Rect } from '../core/rect';
import { Sprite } from '../core/sprite';
import { DrawList } from './drawlist';

export interface GraphicsAppOptions {
  readonly imageUrl?: string;
}

export class GraphicsApp extends BaseApp {
  private readonly drawList: DrawList;

  constructor(
    canvasOrSelector: HTMLCanvasElement | string,
    size: Rect,
    font: Font,
    options?: GraphicsAppOptions
  ) {
    const canvas =
      typeof canvasOrSelector === 'string'
        ? (document.querySelector(canvasOrSelector) as HTMLCanvasElement)
        : canvasOrSelector;

    const mouse = new Mouse(canvas, size.width, size.height);
    super(canvas, size, font, mouse);

    const imageUrl = options?.imageUrl || '/graphics.png';
    this.drawList = new DrawList(this.gl, imageUrl);
  }

  startFrame(): void {
    this.resetGl();

    // Update global sprite frame
    Sprite.updateGlobalAnimations();
  }

  endFrame(): void {
    this.drawList.flush(this.size.width, this.size.height);
  }

  private resetGl(): void {
    const gl = this.gl;
    gl.viewport(0, 0, this.size.width, this.size.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  /**
   * Draws a sprite.
   * @param x The x-coordinate of the top-left corner on the screen.
   * @param y The y-coordinate of the top-left corner on the screen.
   * @param u The x-coordinate of the top-left corner on the sprite sheet.
   * @param v The y-coordinate of the top-left corner on the sprite sheet.
   * @param w The width of the sprite.
   * @param h The height of the sprite.
   * @param color Optional color.
   * @param dw Optional destination width.
   * @param dh Optional destination height.
   */
  drawImage(
    x: number,
    y: number,
    u: number,
    v: number,
    w: number,
    h: number,
    color?: Color,
    dw?: number,
    dh?: number
  ): void {
    this.drawList.drawImage(x, y, u, v, w, h, color, dw, dh);
  }

  /**
   * Draws a string.
   * @param x0 The x-coordinate of the top-left corner.
   * @param y0 The y-coordinate of the top-left corner.
   * @param str The text string to draw.
   * @param color Optional color.
   * @param out Optional output location of cursor.
   */
  drawString(x0: number, y0: number, str: string, color?: Color, out?: Point): void {
    const lines = str.split('\n');
    const height = this.font.getHeight();
    let x = x0;
    let y = y0;
    for (let i = 0; i < lines.length; i++) {
      if (i > 0) {
        x = x0;
        y += height;
      }
      for (let j = 0; j < lines[i].length; j++) {
        const charCode = lines[i].charCodeAt(j);
        if (this.font.isInRange(charCode)) {
          const offset = this.font.getOffset(charCode);
          const width = this.font.getWidth(charCode);
          this.drawImage(x, y, offset, 0, width, height, color);
          x += width;
        }
      }
    }
    if (out) {
      out.x = x;
      out.y = y;
    }
  }

  /**
   * Draws a string horizontally centered.
   * @param x The x-coordinate of the center.
   * @param y The y-coordinate of the top-left corner.
   * @param str The text string to draw.
   * @param color Optional color.
   */
  drawCenteredString(x: number, y: number, str: string, color?: Color): void {
    const x2 = (x - this.font.getStringWidth(str) / 2) | 0;
    this.drawString(x2, y, str, color);
  }

  /**
   * Draws a right-aligned string.
   * @param x The x-coordinate of the top-right corner.
   * @param y The y-coordinate of the top-right corner.
   * @param str The text string to draw.
   * @param color Optional color.
   */
  drawRightString(x: number, y: number, str: string, color?: Color): void {
    const x2 = x - this.font.getStringWidth(str);
    this.drawString(x2, y, str, color);
  }

  /**
   * Draws a character.
   * @param c The ASCII character code.
   * @param x The x-coordinate of the top-left corner.
   * @param y The y-coordinate of the top-left corner.
   * @param color Optional color.
   */
  drawChar(c: number, x: number, y: number, color?: Color): void {
    if (this.font.isInRange(c)) {
      const offset = this.font.getOffset(c);
      const width = this.font.getWidth(c);
      const height = this.font.getHeight();
      this.drawImage(x, y, offset, 0, width, height, color);
    }
  }

  drawAutoRect(sourceRect: Rect, destRect: Rect): void {
    // Draws the dialog chrome using a 3x3 grid
    // 0   1   2   3
    //   x   x   x
    // 1
    //   x   x   x
    // 2
    //   x   x   x
    // 3

    // Source image is the baseRect
    const sx0 = sourceRect.x;
    const sy0 = sourceRect.y;
    const sw = (sourceRect.width / 3) | 0;
    const sh = (sourceRect.height / 3) | 0;
    const sx1 = sx0 + sw;
    const sy1 = sy0 + sh;
    const sx2 = sx0 + 2 * sw;
    const sy2 = sy0 + 2 * sw;

    // Destination rect is the dialog
    const dx0 = destRect.x;
    const dy0 = destRect.y;
    const dw = destRect.width - 2 * sw;
    const dh = destRect.height - 2 * sh;
    const dx1 = dx0 + sw;
    const dy1 = dy0 + sh;
    const dx2 = dx1 + dw;
    const dy2 = dy1 + dh;

    // Top-left corner
    this.drawImage(dx0, dy0, sx0, sy0, sw, sh, undefined, sw, sh);

    // Top edge
    this.drawImage(dx1, dy0, sx1, sy0, sw, sh, undefined, dw, sh);

    // Top-right corner
    this.drawImage(dx2, dy0, sx2, sy0, sw, sh, undefined, sw, sh);

    // Left edge
    this.drawImage(dx0, dy1, sx0, sy1, sw, sh, undefined, sw, dh);

    // Center
    this.drawImage(dx1, dy1, sx1, sy1, sw, sh, undefined, dw, dh);

    // Right edge
    this.drawImage(dx2, dy1, sx2, sy1, sw, sh, undefined, sw, dh);

    // Bottom-left corner
    this.drawImage(dx0, dy2, sx0, sy2, sw, sh, undefined, sw, sh);

    // Bottom edge
    this.drawImage(dx1, dy2, sx1, sy2, sw, sh, undefined, dw, sh);

    // Bottom-right corner
    this.drawImage(dx2, dy2, sx2, sy2, sw, sh, undefined, sw, sh);
  }
}
