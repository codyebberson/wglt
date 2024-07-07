import { BaseApp } from '../core/baseapp';
import { Color } from '../core/color';
import { Font } from '../core/font';
import { Button } from '../core/gui/button';
import { Component } from '../core/gui/component';
import { Mouse } from '../core/mouse';
import { Point } from '../core/point';
import { Rect } from '../core/rect';
import { RenderSet } from './renderset';

export interface GraphicsAppConfig {
  readonly size: Rect;
  readonly font: Font;
  readonly fillSourceRect: Rect;
  readonly dialogRect: Rect;
  readonly closeButtonRect: Rect;
  readonly buttonRect: Rect;
  readonly buttonSlotRect: Rect;
}

export class GraphicsApp extends BaseApp {
  readonly renderSet: RenderSet;

  constructor(readonly config: GraphicsAppConfig) {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    const mouse = new Mouse(canvas, config.size.width, config.size.height);
    super(canvas, config.size, config.font, mouse);
    this.renderSet = new RenderSet(this.gl, '/graphics.png', this.font);
  }

  startFrame(): void {
    this.resetGl();

    // Reset sprite index buffers
    this.renderSet.positionArrayIndex = 0;
    this.renderSet.texcoordArrayIndex = 0;
    this.renderSet.colorArrayIndex = 0;
  }

  endFrame(): void {
    this.renderSet.flush(this.size.width, this.size.height);
  }

  private resetGl(): void {
    const gl = this.gl;
    gl.viewport(0, 0, this.size.width, this.size.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Reset sprite index buffers
    this.renderSet.positionArrayIndex = 0;
    this.renderSet.texcoordArrayIndex = 0;
    this.renderSet.colorArrayIndex = 0;
  }

  /**
   * Fills a rectangle with a solid color.
   * @param x Destination x coordinate.
   * @param y Destination y coordinate.
   * @param w Destination width.
   * @param h Destination height.
   * @param color The rectangle color.
   */
  fillRect(x: number, y: number, w: number, h: number, color: Color): void {
    // const src = this.fillSourceRect;
    const src = this.config.fillSourceRect;
    this.drawImage(x, y, src.x, src.y, src.width, src.height, color, w, h);
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
    this.renderSet.drawImage(x, y, u, v, w, h, color, dw, dh);
  }

  /**
   * Draws a string.
   * @param x The x-coordinate of the top-left corner.
   * @param y The y-coordinate of the top-left corner.
   * @param str The text string to draw.
   * @param color Optional color.
   * @param out Optional output location of cursor.
   */
  drawString(x: number, y: number, str: string, color?: Color, out?: Point): void {
    this.renderSet.drawString(str, x, y, color, out);
  }

  /**
   * Draws a string horizontally centered.
   * @param x The x-coordinate of the center.
   * @param y The y-coordinate of the top-left corner.
   * @param str The text string to draw.
   * @param color Optional color.
   */
  drawCenteredString(x: number, y: number, str: string, color?: Color): void {
    this.renderSet.drawCenteredString(str, x, y, color);
  }

  /**
   * Draws a right-aligned string.
   * @param x The x-coordinate of the top-right corner.
   * @param y The y-coordinate of the top-right corner.
   * @param str The text string to draw.
   * @param color Optional color.
   */
  drawRightString(x: number, y: number, str: string, color?: Color): void {
    this.renderSet.drawRightString(str, x, y, color);
  }

  drawPanelFrame(component: Component): void {
    this.drawAutoRect(this.config.dialogRect, component.rect);
  }

  drawDialogFrame(component: Component): void {
    this.drawAutoRect(this.config.dialogRect, component.rect);
  }

  drawButtonFrame(button: Button): void {
    this.drawAutoRect(this.config.buttonRect, button.rect);
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
