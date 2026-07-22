import { Font } from './font.ts';
import { Keyboard } from './keyboard.ts';
import type { Key } from './keys.ts';
import { Mouse } from './mouse.ts';
import { Vec2 } from './vec2.ts';

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
  readonly center: Vec2;
  /** Keyboard input handler. */
  readonly keyboard: Keyboard;
  private readonly boundLoop: () => void;
  private animationFrameId: number | undefined;
  private disposed = false;
  /** The default font used for text rendering. */
  defaultFont: Font | undefined;
  /** Duration of the last frame in milliseconds. */
  lastFrameDuration = 0;
  /** Current application state (for state-based applications). */
  state?: AppState;

  /**
   * Creates a new BaseApp instance.
   * @param canvas - The HTML canvas element to render to.
   * @param pixelWidth - The width of the canvas in pixels.
   * @param pixelHeight - The height of the canvas in pixels.
   * @param mouse - The mouse input handler.
   */
  constructor(
    canvas: HTMLCanvasElement,
    pixelWidth: number,
    pixelHeight: number,
    mouse: Mouse,
    movementKeys?: Partial<Record<Key, Vec2>>
  ) {
    this.canvas = canvas;
    this.pixelWidth = pixelWidth;
    this.pixelHeight = pixelHeight;
    this.mouse = mouse;
    this.center = new Vec2((this.pixelWidth / 2) | 0, (this.pixelHeight / 2) | 0);

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
    });
    if (!gl) {
      throw new Error('WebGL2 is not supported or could not be initialized.');
    }
    this.gl = gl;

    this.keyboard = new Keyboard(canvas, movementKeys);

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

    // Applications intentionally start automatically. Requiring nearly every caller to invoke a
    // separate start() method would add ceremony to the common case; requestAnimationFrame runs
    // after the current constructor call stack, once concrete application initialization finishes.
    this.animationFrameId = requestAnimationFrame(this.boundLoop);
  }

  /** Returns whether this application has been disposed. */
  isDisposed(): boolean {
    return this.disposed;
  }

  /** Optional update callback called each frame. */
  update(): void {
    // Override in subclasses
  }

  /**
   * The main render loop. Updates input, calls user update functions, and renders the frame.
   * @private
   */
  private renderLoop(): void {
    if (this.disposed) {
      return;
    }
    const t = performance.now();
    this.keyboard.updateKeys(t);
    this.mouse.update(t);
    this.startFrame(t);
    this.update?.();
    this.state?.update();
    if (this.disposed) {
      return;
    }
    this.endFrame();
    this.lastFrameDuration = performance.now() - t;
    this.animationFrameId = requestAnimationFrame(this.boundLoop);
  }

  /**
   * Stops this application and releases its event listeners and WebGL resources.
   * Call this when removing an application while its page remains loaded.
   */
  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    this.keyboard.dispose();
    this.mouse.dispose();
    this.disposeResources();
  }

  /** Releases resources owned by a concrete application implementation. */
  protected disposeResources(): void {}

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
