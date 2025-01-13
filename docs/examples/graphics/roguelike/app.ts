import { FONT_04B03, Font, GraphicsApp, GraphicsAppConfig, Point, Rect } from 'wglt';

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 224;
const DEFAULT_SCALE_FACTOR = 2.0;

export class App extends GraphicsApp {
  readonly size: Rect;
  readonly font: Font;
  scaleFactor: number;
  readonly center: Point;

  constructor(options: GraphicsAppConfig) {
    super(options);

    const canvas = this.canvas;
    const gl = this.gl;

    this.size = options.size || new Rect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
    this.font = options.font || FONT_04B03;
    this.scaleFactor = DEFAULT_SCALE_FACTOR;
    this.center = new Point((this.size.width / 2) | 0, (this.size.height / 2) | 0);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    canvas.width = this.size.width;
    canvas.height = this.size.height;
    canvas.style.outline = 'none';
    canvas.tabIndex = 0;
    canvas.focus();
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
    const minMajorAxis = 400.0;
    const minMinorAxis = 300.0;

    this.scaleFactor = 1.0;
    if (width > height) {
      this.scaleFactor = Math.max(
        1,
        Math.min(Math.round(width / minMajorAxis), Math.round(height / minMinorAxis))
      );
    } else {
      this.scaleFactor = Math.max(
        1,
        Math.min(Math.round(width / minMinorAxis), Math.round(height / minMajorAxis))
      );
    }

    this.size.width = Math.round(width / this.scaleFactor);
    this.size.height = Math.round(height / this.scaleFactor);
    this.center.x = (this.size.width / 2) | 0;
    this.center.y = (this.size.height / 2) | 0;

    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }
}
