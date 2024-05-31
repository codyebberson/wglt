import { Color } from './color';
import { Font } from './font';
import { Button } from './gui/button';
import { Component } from './gui/component';
import { Keyboard } from './keyboard';
import { Key } from './keys';
import { Mouse } from './mouse';
import { Point } from './point';
import { Rect } from './rect';

// Arrow keys, numpad, vi
const NORTHWEST_KEYS = [Key.VK_NUMPAD7, Key.VK_Y];
const NORTHEAST_KEYS = [Key.VK_NUMPAD9, Key.VK_U];
const SOUTHWEST_KEYS = [Key.VK_NUMPAD1, Key.VK_B];
const SOUTHEAST_KEYS = [Key.VK_NUMPAD3, Key.VK_N];
const UP_KEYS = [Key.VK_UP, Key.VK_NUMPAD8, Key.VK_K];
const LEFT_KEYS = [Key.VK_LEFT, Key.VK_NUMPAD4, Key.VK_H];
const DOWN_KEYS = [Key.VK_DOWN, Key.VK_NUMPAD2, Key.VK_J];
const RIGHT_KEYS = [Key.VK_RIGHT, Key.VK_NUMPAD6, Key.VK_L];
const WAIT_KEYS = [Key.VK_SPACE, Key.VK_NUMPAD5];

const DEFAULT_MOVEMENT_KEYS: Partial<Record<Key, Point>> = {
  // Up
  [Key.VK_K]: new Point(0, -1),
  [Key.VK_UP]: new Point(0, -1),
  [Key.VK_NUMPAD8]: new Point(0, -1),
  // Down
  [Key.VK_J]: new Point(0, 1),
  [Key.VK_DOWN]: new Point(0, 1),
  [Key.VK_NUMPAD2]: new Point(0, 1),
  // Left
  [Key.VK_H]: new Point(-1, 0),
  [Key.VK_LEFT]: new Point(-1, 0),
  [Key.VK_NUMPAD4]: new Point(-1, 0),
  // Right
  [Key.VK_L]: new Point(1, 0),
  [Key.VK_RIGHT]: new Point(1, 0),
  [Key.VK_NUMPAD6]: new Point(1, 0),
  // Top-left
  [Key.VK_Y]: new Point(-1, -1),
  [Key.VK_NUMPAD7]: new Point(-1, -1),
  // Top-right
  [Key.VK_U]: new Point(1, -1),
  [Key.VK_NUMPAD9]: new Point(1, -1),
  // Bottom-left
  [Key.VK_B]: new Point(-1, 1),
  [Key.VK_NUMPAD1]: new Point(-1, 1),
  // Bottom-right
  [Key.VK_N]: new Point(1, 1),
  [Key.VK_NUMPAD3]: new Point(1, 1),
  // Wait
  [Key.VK_PERIOD]: new Point(0, 0),
  [Key.VK_NUMPAD5]: new Point(0, 0),
};

export abstract class AppState {
  constructor(readonly app: BaseApp) {}
  abstract update(): void;
}

export interface BaseAppConfig {
  readonly canvas: HTMLCanvasElement;
  readonly sizeInPixels: Rect;
  readonly font: Font;
}

export abstract class BaseApp {
  readonly gl: WebGLRenderingContext;
  readonly center: Point;
  readonly keyboard: Keyboard;
  update?: () => void;
  state?: AppState;

  constructor(
    readonly canvas: HTMLCanvasElement,
    readonly size: Rect,
    readonly font: Font,
    readonly mouse: Mouse
  ) {
    this.canvas = canvas;
    this.size = size;
    this.font = font;
    this.center = new Point((this.size.width / 2) | 0, (this.size.height / 2) | 0);

    this.gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
    }) as WebGL2RenderingContext;

    this.keyboard = new Keyboard(canvas);

    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;
    this.canvas.style.imageRendering = 'pixelated';
    this.canvas.style.outline = 'none';
    this.canvas.tabIndex = 0;
    this.canvas.focus();

    requestAnimationFrame(() => this.renderLoop());
  }

  private renderLoop(): void {
    const t = performance.now();
    this.keyboard.updateKeys(t);
    this.mouse.update(t);
    this.startFrame(t);
    this.update?.();
    this.state?.update();
    this.endFrame();
    requestAnimationFrame(() => this.renderLoop());
  }

  abstract startFrame(time: number): void;

  abstract endFrame(): void;

  /**
   * Fills a rectangle with a solid color.
   * @param x Destination x coordinate.
   * @param y Destination y coordinate.
   * @param w Destination width.
   * @param h Destination height.
   * @param color The rectangle color.
   */
  abstract fillRect(x: number, y: number, w: number, h: number, color: Color): void;

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
  abstract drawImage(
    x: number,
    y: number,
    u: number,
    v: number,
    w: number,
    h: number,
    color?: Color,
    dw?: number,
    dh?: number
  ): void;

  /**
   * Draws a string.
   * @param x The x-coordinate of the top-left corner.
   * @param y The y-coordinate of the top-left corner.
   * @param str The text string to draw.
   * @param color Optional color.
   * @param out Optional output location of cursor.
   */
  abstract drawString(x: number, y: number, str: string, color?: Color, out?: Point): void;

  /**
   * Draws a string horizontally centered.
   * @param x The x-coordinate of the center.
   * @param y The y-coordinate of the top-left corner.
   * @param str The text string to draw.
   * @param color Optional color.
   */
  abstract drawCenteredString(x: number, y: number, str: string, color?: Color): void;

  /**
   * Draws a right-aligned string.
   * @param x The x-coordinate of the top-right corner.
   * @param y The y-coordinate of the top-right corner.
   * @param str The text string to draw.
   * @param color Optional color.
   */
  abstract drawRightString(x: number, y: number, str: string, color?: Color): void;

  abstract drawPanelFrame(component: Component): void;

  abstract drawDialogFrame(component: Component): void;

  abstract drawButtonFrame(button: Button): void;

  isKeyDown(key: Key): boolean {
    return this.keyboard.getKey(key).down;
  }

  isKeyPressed(key: Key): boolean {
    return this.keyboard.getKey(key).isPressed();
  }

  isDownLeftKeyPressed(): boolean {
    return this.isKeyArrayPressed(SOUTHWEST_KEYS);
  }

  isDownKeyPressed(): boolean {
    return this.isKeyArrayPressed(DOWN_KEYS);
  }

  isDownRightKeyPressed(): boolean {
    return this.isKeyArrayPressed(SOUTHEAST_KEYS);
  }

  isLeftKeyPressed(): boolean {
    return this.isKeyArrayPressed(LEFT_KEYS);
  }

  isWaitKeyPressed(): boolean {
    return this.isKeyArrayPressed(WAIT_KEYS);
  }

  isRightKeyPressed(): boolean {
    return this.isKeyArrayPressed(RIGHT_KEYS);
  }

  isUpLeftKeyPressed(): boolean {
    return this.isKeyArrayPressed(NORTHWEST_KEYS);
  }

  isUpKeyPressed(): boolean {
    return this.isKeyArrayPressed(UP_KEYS);
  }

  isUpRightKeyPressed(): boolean {
    return this.isKeyArrayPressed(NORTHEAST_KEYS);
  }

  /**
   * Returns a standard roguelike movement key if pressed.
   * Implemented control systems:
   * 1) Numpad arrows
   * 2) VIM keys
   * 3) Normal arrows (4 directions only)
   * 4) Numpad 5 and '.' (period) for "wait"
   * If a key is pressed, returns the movement delta.
   * If no key is pressed, returns undefined.
   * See: http://www.roguebasin.com/index.php?title=Preferred_Key_Controls
   */
  getMovementKey(
    movementKeys: Partial<Record<Key, Point>> = DEFAULT_MOVEMENT_KEYS
  ): Point | undefined {
    for (const [key, delta] of Object.entries(movementKeys) as [Key, Point][]) {
      if (this.isKeyPressed(key)) {
        return delta;
      }
    }
    return undefined;
  }

  private isKeyArrayPressed(keys: Key[]): boolean {
    for (let i = 0; i < keys.length; i++) {
      if (this.isKeyPressed(keys[i])) {
        return true;
      }
    }
    return false;
  }
}
