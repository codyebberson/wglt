import type { Color } from '../color';
import { SimplePalette } from '../palettes/simple';
import { Rect } from '../rect';
import { Component } from './component';

/**
 * Horizontal text alignment options for Labels.
 */
export const HorizontalAlignment = {
  /** Align text to the left edge. */
  LEFT: 0,
  /** Center text horizontally. */
  CENTER: 1,
  /** Align text to the right edge. */
  RIGHT: 2,
};

/**
 * Vertical text alignment options for Labels.
 */
export const VerticalAlignment = {
  /** Align text to the top edge. */
  TOP: 0,
  /** Center text vertically. */
  CENTER: 1,
  /** Align text to the bottom edge. */
  BOTTOM: 2,
};

/**
 * A text display component with configurable alignment and colors.
 * Labels are non-interactive components used to display static or dynamic text.
 *
 * @example
 * ```typescript
 * // Basic label
 * const label = new Label(new Rect(10, 10, 100, 20), 'Hello World!');
 *
 * // Centered label with custom colors
 * const centeredLabel = new Label(
 *   new Rect(0, 0, 200, 30),
 *   'Centered Text',
 *   Color.YELLOW,
 *   Color.BLUE,
 *   HorizontalAlignment.CENTER,
 *   VerticalAlignment.CENTER
 * );
 *
 * // Right-aligned label
 * const rightLabel = new Label(
 *   new Rect(0, 0, 150, 20),
 *   'Right Aligned',
 *   Color.WHITE,
 *   undefined,
 *   HorizontalAlignment.RIGHT
 * );
 * ```
 */
export class Label extends Component {
  readonly text: string;
  readonly fg: Color;
  readonly bg: Color | undefined;
  readonly halign: number;
  readonly valign: number;

  /**
   * Creates a new Label component.
   * @param rect - The position and size of the label.
   * @param text - The text to display.
   * @param fg - Foreground (text) color. Defaults to white.
   * @param bg - Background color. Defaults to transparent.
   * @param halign - Horizontal text alignment. Defaults to LEFT.
   * @param valign - Vertical text alignment. Defaults to TOP.
   */
  constructor(
    rect: Rect,
    text: string,
    fg: Color = SimplePalette.WHITE,
    bg: Color | undefined = undefined,
    halign = HorizontalAlignment.LEFT,
    valign = VerticalAlignment.TOP
  ) {
    super(rect);
    this.text = text;
    this.fg = fg;
    this.bg = bg;
    this.halign = halign;
    this.valign = valign;
  }
}
