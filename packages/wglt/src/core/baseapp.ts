import { Color } from '../core/color';
import { Font } from '../core/font';
import { Keyboard } from '../core/keyboard';
import { Key } from '../core/keys';
import { Mouse } from '../core/mouse';
import { Rect } from '../core/rect';
import { Vec2 } from '../core/vec2';

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

export abstract class AppState {
  constructor(readonly app: BaseApp) {}
  abstract update(): void;
}

export abstract class BaseApp {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGLRenderingContext;
  readonly size: Rect;
  readonly font: Font;
  readonly center: Vec2;
  readonly keyboard: Keyboard;
  readonly mouse: Mouse;
  state?: AppState;

  constructor(canvas: HTMLCanvasElement, size: Rect, font: Font) {
    this.canvas = canvas;
    this.size = size;
    this.font = font;
    this.center = new Vec2((this.size.width / 2) | 0, (this.size.height / 2) | 0);

    this.gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
    }) as WebGLRenderingContext;

    this.keyboard = new Keyboard(canvas);
    this.mouse = new Mouse(canvas, this.size.width, this.size.height);

    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;
    this.canvas.style.imageRendering = 'pixelated';
    this.canvas.style.outline = 'none';
    this.canvas.tabIndex = 0;
    this.canvas.focus();

    this.renderLoop();
  }

  renderLoop(): void {
    const t = performance.now();
    this.keyboard.updateKeys(t);
    this.mouse.update(t);
    this.startFrame();
    this.state?.update();
    this.endFrame();
    requestAnimationFrame(() => this.renderLoop());
  }

  abstract startFrame(): void;

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
   * @param str The text string to draw.
   * @param x The x-coordinate of the top-left corner.
   * @param y The y-coordinate of the top-left corner.
   * @param color Optional color.
   * @param out Optional output location of cursor.
   */
  abstract drawString(str: string, x: number, y: number, color?: Color, out?: Vec2): void;

  /**
   * Draws a string horizontally centered.
   * @param str The text string to draw.
   * @param x The x-coordinate of the center.
   * @param y The y-coordinate of the top-left corner.
   * @param color Optional color.
   */
  abstract drawCenteredString(str: string, x: number, y: number, color?: Color): void;

  /**
   * Draws a right-aligned string.
   * @param str The text string to draw.
   * @param x The x-coordinate of the top-right corner.
   * @param y The y-coordinate of the top-right corner.
   * @param color Optional color.
   */
  abstract drawRightString(str: string, x: number, y: number, color?: Color): void;

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

  private isKeyArrayPressed(keys: Key[]): boolean {
    for (let i = 0; i < keys.length; i++) {
      if (this.isKeyPressed(keys[i])) {
        return true;
      }
    }
    return false;
  }
}
