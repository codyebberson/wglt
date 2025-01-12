import { Font } from './font';
import { Keyboard } from './keyboard';
import { Mouse } from './mouse';
import { Point } from './point';
import { Rect } from './rect';

export abstract class AppState<TApp extends BaseApp = BaseApp> {
  constructor(readonly app: TApp) {}
  abstract update(): void;
}

export interface BaseAppConfig {
  readonly canvas: HTMLCanvasElement;
  readonly sizeInPixels: Rect;
  readonly font: Font;
}

export abstract class BaseApp {
  readonly gl: WebGL2RenderingContext;
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
}
