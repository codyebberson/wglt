import { BaseApp } from '../core/baseapp';
import { Color } from '../core/color';
import { MonospacedFont } from '../core/font';
import { Rect } from '../core/rect';
import { Vec2 } from '../core/vec2';
import { RenderSet } from './renderset';

const WIDTH = 640;
const HEIGHT = 360;

// // Arrow keys, numpad, vi
// const NORTHWEST_KEYS = [Key.VK_NUMPAD7, Key.VK_Y];
// const NORTHEAST_KEYS = [Key.VK_NUMPAD9, Key.VK_U];
// const SOUTHWEST_KEYS = [Key.VK_NUMPAD1, Key.VK_B];
// const SOUTHEAST_KEYS = [Key.VK_NUMPAD3, Key.VK_N];
// const UP_KEYS = [Key.VK_UP, Key.VK_NUMPAD8, Key.VK_K];
// const LEFT_KEYS = [Key.VK_LEFT, Key.VK_NUMPAD4, Key.VK_H];
// const DOWN_KEYS = [Key.VK_DOWN, Key.VK_NUMPAD2, Key.VK_J];
// const RIGHT_KEYS = [Key.VK_RIGHT, Key.VK_NUMPAD6, Key.VK_L];
// const WAIT_KEYS = [Key.VK_SPACE, Key.VK_NUMPAD5];

// export abstract class AppState {
//   constructor(readonly app: BaseApp) {}
//   abstract update(): void;
// }

export abstract class GraphicsApp extends BaseApp {
  // readonly canvas: HTMLCanvasElement;
  // readonly gl: WebGLRenderingContext;
  // readonly size: Rect;
  // readonly font: Font;
  readonly center: Vec2;
  readonly fillSourceRect: Rect;
  readonly renderSet: RenderSet;
  // readonly keyboard: Keyboard;
  // readonly mouse: Mouse;
  // update?: () => void;
  // readonly gui: GUI;
  // state?: AppState;
  // game?: BaseGame;

  constructor() {
    super(
      document.createElement('canvas'),
      new Rect(0, 0, WIDTH, HEIGHT),
      new MonospacedFont(new Rect(0, 0, 6, 8))
    );
    // const options = {
    //   canvas: document.querySelector('canvas') as HTMLCanvasElement,
    //   imageUrl: '/graphics.png',
    // };

    // const canvas = options.canvas;
    // if (!canvas) {
    //   throw new Error('Null or missing canvas element');
    // }

    const canvas = this.canvas;

    // const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    // if (!gl) {
    //   throw new Error('Could not get WebGL context');
    // }

    // this.canvas = canvas;
    // this.gl = gl;
    // this.size = new Rect(0, 0, WIDTH, HEIGHT);
    // this.font = new MonospacedFont(new Rect(0, 0, 6, 8));
    this.center = new Vec2((this.size.width / 2) | 0, (this.size.height / 2) | 0);
    this.fillSourceRect = new Rect(1008, 0, 16, 16);

    // gl.disable(gl.DEPTH_TEST);
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    canvas.width = this.size.width;
    canvas.height = this.size.height;
    canvas.style.outline = 'none';
    canvas.tabIndex = 0;
    canvas.focus();

    this.renderSet = new RenderSet(this.gl, '/graphics.png', this.font);
    // this.keyboard = new Keyboard(canvas);
    // this.mouse = new Mouse(canvas, this.size.width, this.size.height);
    // this.gui = new GUI(this);

    this.renderLoop();
  }

  // renderLoop(): void {
  //   const t = performance.now();
  //   this.keyboard.updateKeys(t);
  //   this.mouse.update(t);
  //   this.resetGl();

  //   if (this.state) {
  //     this.state.update();
  //   }

  //   // this.gui.handleInput();
  //   // this.gui.handleInput();
  //   // this.gui.draw();

  //   // if (this.update) {
  //   //   this.update();
  //   // }

  //   this.renderSet.flush(WIDTH, HEIGHT);
  //   requestAnimationFrame(() => this.renderLoop());
  // }

  startFrame(): void {
    this.resetGl();
  }

  endFrame(): void {
    this.renderSet.flush(WIDTH, HEIGHT);
  }

  private resetGl(): void {
    const gl = this.gl;
    gl.viewport(0, 0, WIDTH, HEIGHT);
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
    const src = this.fillSourceRect;
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
   * @param str The text string to draw.
   * @param x The x-coordinate of the top-left corner.
   * @param y The y-coordinate of the top-left corner.
   * @param color Optional color.
   * @param out Optional output location of cursor.
   */
  drawString(str: string, x: number, y: number, color?: Color, out?: Vec2): void {
    this.renderSet.drawString(str, x, y, color, out);
  }

  /**
   * Draws a string horizontally centered.
   * @param str The text string to draw.
   * @param x The x-coordinate of the center.
   * @param y The y-coordinate of the top-left corner.
   * @param color Optional color.
   */
  drawCenteredString(str: string, x: number, y: number, color?: Color): void {
    this.renderSet.drawCenteredString(str, x, y, color);
  }

  /**
   * Draws a right-aligned string.
   * @param str The text string to draw.
   * @param x The x-coordinate of the top-right corner.
   * @param y The y-coordinate of the top-right corner.
   * @param color Optional color.
   */
  drawRightString(str: string, x: number, y: number, color?: Color): void {
    this.renderSet.drawRightString(str, x, y, color);
  }

  // isKeyDown(key: Key): boolean {
  //   return this.keyboard.getKey(key).down;
  // }

  // isKeyPressed(key: Key): boolean {
  //   return this.keyboard.getKey(key).isPressed();
  // }

  // isDownLeftKeyPressed(): boolean {
  //   return this.isKeyArrayPressed(SOUTHWEST_KEYS);
  // }

  // isDownKeyPressed(): boolean {
  //   return this.isKeyArrayPressed(DOWN_KEYS);
  // }

  // isDownRightKeyPressed(): boolean {
  //   return this.isKeyArrayPressed(SOUTHEAST_KEYS);
  // }

  // isLeftKeyPressed(): boolean {
  //   return this.isKeyArrayPressed(LEFT_KEYS);
  // }

  // isWaitKeyPressed(): boolean {
  //   return this.isKeyArrayPressed(WAIT_KEYS);
  // }

  // isRightKeyPressed(): boolean {
  //   return this.isKeyArrayPressed(RIGHT_KEYS);
  // }

  // isUpLeftKeyPressed(): boolean {
  //   return this.isKeyArrayPressed(NORTHWEST_KEYS);
  // }

  // isUpKeyPressed(): boolean {
  //   return this.isKeyArrayPressed(UP_KEYS);
  // }

  // isUpRightKeyPressed(): boolean {
  //   return this.isKeyArrayPressed(NORTHEAST_KEYS);
  // }

  // private isKeyArrayPressed(keys: Key[]): boolean {
  //   for (let i = 0; i < keys.length; i++) {
  //     if (this.isKeyPressed(keys[i])) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }
}
