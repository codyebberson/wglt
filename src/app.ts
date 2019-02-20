import {AppOptions} from './appoptions';
import {AppState} from './appstate';
import {Color} from './color';
import {Font, FONT_04B03} from './font';
import {Keyboard} from './keyboard';
import {Mouse} from './mouse';
import {Rect} from './rect';
import {RenderSet} from './renderset';
import {Vec2} from './vec2';

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 224;
const DEFAULT_FILL_WINDOW = false;
const DEFAULT_SCALE_FACTOR = 2.0;

export class App {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGLRenderingContext;
  readonly size: Rect;
  readonly font: Font;
  fillWindow: boolean;
  scaleFactor: number;
  aspectRatio: number;
  readonly center: Vec2;
  readonly renderSet: RenderSet;
  readonly keyboard: Keyboard;
  readonly mouse: Mouse;
  state?: AppState;

  constructor(options: AppOptions) {
    const canvas = options.canvas;
    if (!canvas) {
      throw new Error('Null or missing canvas element');
    }

    const gl = canvas.getContext('webgl', {alpha: false, antialias: false});
    if (!gl) {
      throw new Error('Could not get WebGL context');
    }

    this.canvas = canvas;
    this.gl = gl;
    this.size = options.size || new Rect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
    this.font = options.font || FONT_04B03;
    this.fillWindow = options.fillWindow || DEFAULT_FILL_WINDOW;
    this.scaleFactor = options.scaleFactor || DEFAULT_SCALE_FACTOR;
    this.aspectRatio = this.size.width / this.size.height;
    this.center = new Vec2((this.size.width / 2) | 0, (this.size.height / 2) | 0);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    canvas.width = this.size.width;
    canvas.height = this.size.height;
    canvas.style.outline = 'none';
    canvas.tabIndex = 0;

    this.renderSet = new RenderSet(gl, options.imageUrl, this.font);
    this.keyboard = new Keyboard(canvas);
    this.mouse = new Mouse(this);

    if (this.fillWindow) {
      window.addEventListener('resize', this.handleResizeEvent.bind(this), false);
      this.handleResizeEvent();
    }

    this.renderLoop();
  }

  /**
   * Handles window resize events.
   * Updates canvas size.
   */
  handleResizeEvent() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // The logic here is:
    //  * Think of a rough "minimum viewport"
    //  * The viewport is a rectangle that can be portrait or landscape
    //  * The viewport can be a little bigger on desktop, a little smaller on mobile
    //  * Find the integer scaling factor that best fits the minimum vector
    const mobile = this.isMobile();
    const minMajorAxis = mobile ? 320.0 : 400.0;
    const minMinorAxis = mobile ? 180.0 : 224.0;

    this.scaleFactor = 1.0;
    if (width > height) {
      this.scaleFactor = Math.max(1, Math.min(Math.round(width / minMajorAxis), Math.round(height / minMinorAxis)));
    } else {
      this.scaleFactor = Math.max(1, Math.min(Math.round(width / minMinorAxis), Math.round(height / minMajorAxis)));
    }

    this.size.width = Math.round(width / this.scaleFactor);
    this.size.height = Math.round(height / this.scaleFactor);
    this.aspectRatio = this.size.width / this.size.height;
    this.center.x = (this.size.width / 2) | 0;
    this.center.y = (this.size.height / 2) | 0;

    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
  }

  /**
   * Returns if the browser is on a mobile device.
   */
  isMobile() {
    return navigator.userAgent.match(/Android|iPhone|iPod|IEMobile|WPDesktop|Opera Mini/i);
  }

  renderLoop() {
    this.keyboard.update();
    this.mouse.update();
    this.resetGl();

    if (this.state) {
      this.state.update();
    }

    this.renderSet.flush(this.size.width, this.size.height);
    requestAnimationFrame(this.renderLoop.bind(this));
  }

  private resetGl() {
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
   * Draws a sprite.
   * @param {number} x The x-coordinate of the top-left corner on the screen.
   * @param {number} y The y-coordinate of the top-left corner on the screen.
   * @param {number} u The x-coordinate of the top-left corner on the sprite sheet.
   * @param {number} v The y-coordinate of the top-left corner on the sprite sheet.
   * @param {number} w The width of the sprite.
   * @param {number} h The height of the sprite.
   * @param {Color=} color Optional color.
   * @param {number=} dw Optional destination width.
   * @param {number=} dh Optional destination height.
   */
  drawImage(x: number, y: number, u: number, v: number, w: number, h: number, color?: Color, dw?: number, dh?: number) {
    this.renderSet.drawImage(x, y, u, v, w, h, color, dw, dh);
  }

  /**
   * Draws a string.
   * @param {string} str The text string to draw.
   * @param {number} x The x-coordinate of the top-left corner.
   * @param {number} y The y-coordinate of the top-left corner.
   * @param {Color=} color Optional color.
   */
  drawString(str: string, x: number, y: number, color?: Color) {
    this.renderSet.drawString(str, x, y, color);
  }

  /**
   * Draws a string horizontally centered.
   * @param {string} str The text string to draw.
   * @param {number} x The x-coordinate of the center.
   * @param {number} y The y-coordinate of the top-left corner.
   * @param {Color=} color Optional color.
   */
  drawCenteredString(str: string, x: number, y: number, color?: Color) {
    this.renderSet.drawCenteredString(str, x, y, color);
  }

  isKeyDown(keyCode: number) {
    const key = this.keyboard.getKey(keyCode);
    return key && key.down;
  }

  isKeyPressed(keyCode: number) {
    const key = this.keyboard.getKey(keyCode);
    const count = key ? key.downCount : 0;
    return count === 1 || (count > 30);
  }
}
