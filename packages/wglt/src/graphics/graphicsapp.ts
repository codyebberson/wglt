import { BaseApp } from '../core/baseapp';
import type { Color } from '../core/color';
import { Font } from '../core/font';
import { Mouse } from '../core/mouse';
import { Point } from '../core/point';
import { Rect } from '../core/rect';
import { Sprite } from '../core/sprite';
import { DrawList } from './drawlist';

/**
 * Configuration options for creating a GraphicsApp instance.
 */
export interface GraphicsAppOptions {
  /** URL to the sprite sheet image. Defaults to '/graphics.png'. */
  readonly imageUrl?: string;

  /** Default font to use for text rendering. */
  readonly defaultFont?: Font;
}

/**
 * The GraphicsApp class provides high-performance tile-based graphics rendering using WebGL2.
 * Perfect for modern roguelikes, tile-based games, and sprite-based graphics.
 * Uses instanced rendering to efficiently draw thousands of sprites.
 *
 * @example
 * ```typescript
 * const app = new GraphicsApp('canvas', 640, 360, FONT_04B03);
 * const playerSprite = new Sprite(0, 16, 16, 16, 2);
 *
 * app.update = () => {
 *   app.drawImage(100, 100, 0, 16, 16, 16); // Draw sprite directly
 *   playerSprite.draw(app, playerX, playerY); // Draw using sprite helper
 * };
 * ```
 */
export class GraphicsApp extends BaseApp {
  private readonly drawList: DrawList;

  /**
   * Creates a new GraphicsApp instance.
   * @param canvasOrSelector - HTML canvas element or CSS selector string.
   * @param pixelWidth - Width of the canvas in pixels.
   * @param pixelHeight - Height of the canvas in pixels.
   * @param options - Optional configuration including sprite sheet URL.
   */
  constructor(
    canvasOrSelector: HTMLCanvasElement | string,
    pixelWidth: number,
    pixelHeight: number,
    options?: GraphicsAppOptions
  ) {
    const canvas =
      typeof canvasOrSelector === 'string'
        ? (document.querySelector(canvasOrSelector) as HTMLCanvasElement)
        : canvasOrSelector;

    const mouse = new Mouse(canvas, pixelWidth, pixelHeight);
    super(canvas, pixelWidth, pixelHeight, mouse);

    const imageUrl = options?.imageUrl || '/graphics.png';
    this.drawList = new DrawList(this.gl, imageUrl);

    this.defaultFont = options?.defaultFont;
  }

  /**
   * The width of the canvas in pixels.
   */
  get width(): number {
    return this.pixelWidth;
  }

  /**
   * The height of the canvas in pixels.
   */
  get height(): number {
    return this.pixelHeight;
  }

  /**
   * Called at the start of each frame. Resets WebGL state and updates sprite animations.
   * @param time - The current time in milliseconds (inherited from BaseApp).
   */
  startFrame(): void {
    this.resetGl();

    // Update global sprite frame
    Sprite.updateGlobalAnimations();
  }

  /**
   * Called at the end of each frame. Flushes all queued draw calls to the GPU.
   */
  endFrame(): void {
    this.drawList.flush(this.pixelWidth, this.pixelHeight);
  }

  private resetGl(): void {
    const gl = this.gl;
    gl.viewport(0, 0, this.pixelWidth, this.pixelHeight);
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
   *
   * @param x The x-coordinate of the top-left corner.
   * @param y The y-coordinate of the top-left corner.
   * @param str The text string to draw.
   * @param color Optional color.
   * @param scale Optional scale factor.
   * @param font Optional font to use, defaults to GraphicsApp's defaultFont.
   * @param out Optional output location of cursor.
   */
  drawString(
    x: number,
    y: number,
    str: string,
    color?: Color,
    scale: number = 1,
    font?: Font,
    out?: Point
  ): void {
    font ??= this.defaultFont;
    if (!font) {
      throw new Error('No font specified for drawString');
    }
    const lines = str.split('\n');
    const lineHeight = font.lineHeight * scale;
    let xi = x;
    let yi = y;
    for (let i = 0; i < lines.length; i++) {
      if (i > 0) {
        xi = x;
        yi += lineHeight;
      }
      for (let j = 0; j < lines[i].length; j++) {
        const charCode = lines[i].charCodeAt(j);
        if (Font.isInRange(charCode)) {
          const srcRect = font.getGlyphRect(charCode);
          const dstWidth = srcRect.width * scale;
          this.drawImage(
            xi,
            yi,
            srcRect.x,
            srcRect.y,
            srcRect.width,
            srcRect.height,
            color,
            dstWidth,
            lineHeight
          );
          xi += dstWidth;
        }
      }
    }
    if (out) {
      out.x = xi;
      out.y = yi;
    }
  }

  /**
   * Draws a string horizontally centered.
   *
   * @param x The x-coordinate of the center.
   * @param y The y-coordinate of the top-left corner.
   * @param str The text string to draw.
   * @param color Optional color.
   * @param scale Optional scale factor.
   * @param font Optional font to use, defaults to GraphicsApp's defaultFont.
   */
  drawCenteredString(
    x: number,
    y: number,
    str: string,
    color?: Color,
    scale: number = 1,
    font?: Font
  ): void {
    font ??= this.defaultFont;
    if (!font) {
      throw new Error('No font specified for drawCenteredString');
    }
    const x2 = (x - (font.getStringWidth(str) * scale) / 2) | 0;
    this.drawString(x2, y, str, color, scale, font);
  }

  /**
   * Draws a right-aligned string.
   *
   * @param x The x-coordinate of the top-right corner.
   * @param y The y-coordinate of the top-right corner.
   * @param str The text string to draw.
   * @param color Optional color.
   * @param scale Optional scale factor.
   * @param font Optional font to use, defaults to GraphicsApp's defaultFont.
   */
  drawRightString(
    x: number,
    y: number,
    str: string,
    color?: Color,
    scale: number = 1,
    font?: Font
  ): void {
    font ??= this.defaultFont;
    if (!font) {
      throw new Error('No font specified for drawRightString');
    }
    const x2 = x - font.getStringWidth(str) * scale;
    this.drawString(x2, y, str, color, scale, font);
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
