import { Font } from './font';
import { Keyboard } from './keyboard';
import { Mouse } from './mouse';
import { Point } from './point';
import { Rect } from './rect';

/**
 * Abstract base class for application states.
 * States handle game logic, input processing, and rendering for different screens/modes.
 * @template TApp - The type of application this state belongs to.
 */
export abstract class AppState<TApp extends BaseApp = BaseApp> {
  readonly app: TApp;

  /**
   * Creates a new application state.
   * @param app - The application instance this state belongs to.
   */
  constructor(app: TApp) {
    this.app = app;
  }

  /**
   * Updates the state logic. Called once per frame.
   */
  abstract update(): void;
}

/**
 * Configuration interface for creating a BaseApp instance.
 */
export interface BaseAppConfig {
  readonly canvas: HTMLCanvasElement;
  readonly sizeInPixels: Rect;
  readonly font: Font;
}

/**
 * Abstract base class for all WGLT applications.
 * Provides the core game loop, WebGL2 context, and input handling.
 * Subclassed by Terminal and GraphicsApp.
 */
export abstract class BaseApp {
  readonly canvas: HTMLCanvasElement;
  readonly pixelWidth: number;
  readonly pixelHeight: number;
  readonly mouse: Mouse;
  /** The WebGL2 rendering context. */
  readonly gl: WebGL2RenderingContext;
  /** The center point of the canvas in pixels. */
  readonly center: Point;
  /** Keyboard input handler. */
  readonly keyboard: Keyboard;
  private readonly boundLoop: () => void;
  /** The default font used for text rendering. */
  defaultFont: Font | undefined;
  /** Duration of the last frame in milliseconds. */
  lastFrameDuration = 0;
  /** Optional update callback called each frame. */
  update?: () => void;
  /** Current application state (for state-based applications). */
  state?: AppState;

  /**
   * Creates a new BaseApp instance.
   * @param canvas - The HTML canvas element to render to.
   * @param pixelWidth - The width of the canvas in pixels.
   * @param pixelHeight - The height of the canvas in pixels.
   * @param mouse - The mouse input handler.
   */
  constructor(canvas: HTMLCanvasElement, pixelWidth: number, pixelHeight: number, mouse: Mouse) {
    this.canvas = canvas;
    this.pixelWidth = pixelWidth;
    this.pixelHeight = pixelHeight;
    this.mouse = mouse;
    this.center = new Point((this.pixelWidth / 2) | 0, (this.pixelHeight / 2) | 0);

    this.gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
    }) as WebGL2RenderingContext;

    this.keyboard = new Keyboard(canvas);

    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.canvas.width = this.pixelWidth;
    this.canvas.height = this.pixelHeight;
    this.canvas.style.imageRendering = 'pixelated';
    this.canvas.style.outline = 'none';
    this.canvas.tabIndex = 0;
    this.canvas.focus();

    this.boundLoop = this.renderLoop.bind(this);
    requestAnimationFrame(this.boundLoop);
  }

  /**
   * The main render loop. Updates input, calls user update functions, and renders the frame.
   * @private
   */
  private renderLoop(): void {
    const t = performance.now();
    this.keyboard.updateKeys(t);
    this.mouse.update(t);
    this.startFrame(t);
    this.update?.();
    this.state?.update();
    this.endFrame();
    this.lastFrameDuration = performance.now() - t;
    requestAnimationFrame(this.boundLoop);
  }

  /**
   * Called at the beginning of each frame. Subclasses should implement frame setup logic here.
   * @param time - The current time in milliseconds.
   */
  abstract startFrame(time: number): void;

  /**
   * Called at the end of each frame. Subclasses should implement rendering logic here.
   */
  abstract endFrame(): void;
}
