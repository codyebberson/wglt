import { InputSet } from './input';
import { Rect } from './rect';
import { Vec2 } from './vec2';

/** Minimum distance in pixels required to register as a drag operation. */
const MIN_DRAG_DISTANCE = 4;

/**
 * Handles mouse and touch input for WGLT applications.
 * Provides click detection, drag operations, mouse wheel support, and touch compatibility.
 * Automatically handles coordinate conversion and canvas aspect ratio adjustments.
 *
 * @example
 * ```typescript
 * // Mouse is typically created by BaseApp, but can be accessed via app.mouse
 *
 * // Check for clicks
 * if (mouse.isClicked()) {
 *   console.log(`Clicked at ${mouse.x}, ${mouse.y}`);
 * }
 *
 * // Check for dragging
 * if (mouse.isDragging()) {
 *   console.log(`Dragging from ${mouse.start.x}, ${mouse.start.y}`);
 * }
 *
 * // Check specific button states
 * if (mouse.buttons.get(0).down) { // Left button
 *   // Handle left button held down
 * }
 *
 * if (mouse.buttons.get(2).isPressed()) { // Right button
 *   // Handle right button press
 * }
 * ```
 */
export class Mouse {
  readonly el: HTMLCanvasElement;
  readonly width: number;
  readonly height: number;
  /** Input state for mouse buttons (0=left, 1=middle, 2=right). */
  readonly buttons = new InputSet<number>();
  /** Previous mouse position (for calculating deltas). */
  readonly prev: Vec2;
  /** Position where the current drag/click started. */
  readonly start: Vec2;
  /** Current mouse x-coordinate in canvas pixels. */
  x: number;
  /** Current mouse y-coordinate in canvas pixels. */
  y: number;
  /** Change in x-coordinate since last frame. */
  dx: number;
  /** Change in y-coordinate since last frame. */
  dy: number;
  /** Total distance dragged since mouse down. */
  dragDistance: number;
  /** Horizontal mouse wheel delta this frame. */
  wheelDeltaX: number;
  /** Vertical mouse wheel delta this frame. */
  wheelDeltaY: number;
  /** Internal storage for wheel delta. */
  lastWheelDeltaX: number;
  /** Internal storage for wheel delta. */
  lastWheelDeltaY: number;
  private readonly mouseListener: (event: MouseEvent) => void;
  private readonly touchListener: (event: TouchEvent) => void;
  private readonly wheelListener: (event: WheelEvent) => void;

  /**
   * Creates a new Mouse input handler.
   * @param el - The HTML canvas element to attach event listeners to.
   * @param width - The logical width of the canvas (for coordinate conversion).
   * @param height - The logical height of the canvas (for coordinate conversion).
   */
  constructor(el: HTMLCanvasElement, width: number, height: number) {
    this.el = el;
    this.width = width;
    this.height = height;
    this.prev = new Vec2(0, 0);
    this.start = new Vec2(0, 0);
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.dragDistance = 0;
    this.wheelDeltaX = 0;
    this.wheelDeltaY = 0;
    this.lastWheelDeltaX = 0;
    this.lastWheelDeltaY = 0;
    this.mouseListener = (event): void => this.handleEvent(event);
    this.touchListener = (event): void => this.handleTouchEvent(event);
    this.wheelListener = (event): void => this.handleWheelEvent(event);

    // Set up event listeners for both mouse and touch
    el.addEventListener('mousedown', this.mouseListener);
    el.addEventListener('mouseup', this.mouseListener);
    el.addEventListener('mousemove', this.mouseListener);
    el.addEventListener('contextmenu', this.mouseListener);
    el.addEventListener('touchstart', this.touchListener);
    el.addEventListener('touchend', this.touchListener);
    el.addEventListener('touchcancel', this.touchListener);
    el.addEventListener('touchmove', this.touchListener);
    el.addEventListener('wheel', this.wheelListener);
  }

  /** Removes the mouse and touch event listeners. */
  dispose(): void {
    this.el.removeEventListener('mousedown', this.mouseListener);
    this.el.removeEventListener('mouseup', this.mouseListener);
    this.el.removeEventListener('mousemove', this.mouseListener);
    this.el.removeEventListener('contextmenu', this.mouseListener);
    this.el.removeEventListener('touchstart', this.touchListener);
    this.el.removeEventListener('touchend', this.touchListener);
    this.el.removeEventListener('touchcancel', this.touchListener);
    this.el.removeEventListener('touchmove', this.touchListener);
    this.el.removeEventListener('wheel', this.wheelListener);
    this.buttons.clear();
  }

  private handleTouchEvent(e: TouchEvent): void {
    e.stopPropagation();
    e.preventDefault();

    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.updatePosition(touch.clientX, touch.clientY);
      this.buttons.get(0).setDown(true);
    } else {
      this.buttons.get(0).setDown(false);
    }
  }

  private handleEvent(e: MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();

    this.updatePosition(e.clientX, e.clientY);

    if (e.type === 'mousedown') {
      this.dragDistance = 0;
      this.prev.x = this.start.x = this.x;
      this.prev.y = this.start.y = this.y;
      this.buttons.get(e.button).setDown(true);
      this.el.focus();
    }

    if (e.type === 'mouseup') {
      this.buttons.get(e.button).setDown(false);
    }
  }

  private updatePosition(clientX: number, clientY: number): void {
    let rect: Rect | DOMRect = this.el.getBoundingClientRect();

    // If the client rect is not the same aspect ratio as canvas,
    // then we are fullscreen.
    // Need to update client rect accordingly.

    const terminalAspectRatio = this.width / this.height;
    const rectAspectRatio = rect.width / rect.height;

    if (rectAspectRatio - terminalAspectRatio > 0.01) {
      const actualWidth = terminalAspectRatio * rect.height;
      const excess = rect.width - actualWidth;
      rect = new Rect(Math.floor(excess / 2), 0, actualWidth, rect.height);
    }

    if (rectAspectRatio - terminalAspectRatio < -0.01) {
      const actualHeight = rect.width / terminalAspectRatio;
      const excess = rect.height - actualHeight;
      rect = new Rect(0, Math.floor(excess / 2), rect.width, actualHeight);
    }

    this.x = ((this.width * (clientX - rect.left)) / rect.width) | 0;
    this.y = ((this.height * (clientY - rect.top)) / rect.height) | 0;
  }

  private handleWheelEvent(e: WheelEvent): void {
    e.stopPropagation();
    e.preventDefault();
    this.lastWheelDeltaX = e.deltaX;
    this.lastWheelDeltaY = e.deltaY;
  }

  /**
   * Updates mouse state for the current frame.
   * Called automatically by the game loop.
   * @param time - Current time in milliseconds.
   * @internal
   */
  update(time: number): void {
    this.dx = this.x - this.prev.x;
    this.dy = this.y - this.prev.y;
    this.prev.x = this.x;
    this.prev.y = this.y;

    this.wheelDeltaX = this.lastWheelDeltaX;
    this.wheelDeltaY = this.lastWheelDeltaY;
    this.lastWheelDeltaX = 0;
    this.lastWheelDeltaY = 0;

    this.buttons.updateAll(time);
    if (this.buttons.get(0).down) {
      this.dragDistance += Math.abs(this.dx) + Math.abs(this.dy);
    }
  }

  /**
   * Checks if the left mouse button was clicked (pressed and released without dragging).
   * @returns True if a click occurred this frame.
   */
  isClicked(): boolean {
    return this.buttons.get(0).upCount === 1 && this.dragDistance < MIN_DRAG_DISTANCE;
  }

  /**
   * Checks if the mouse is currently being dragged.
   * @returns True if the left button is down and has moved beyond the minimum drag distance.
   */
  isDragging(): boolean {
    return this.buttons.get(0).down && this.dragDistance > MIN_DRAG_DISTANCE;
  }
}
