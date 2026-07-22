import type { Color } from '../color.ts';
import type { Font } from '../font.ts';
import { SimplePalette } from '../palettes/simple.ts';
import { Rect } from '../rect.ts';
import { Component } from './component.ts';

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
 * Computes the aligned start coordinate for content placed within a span.
 *
 * Works for both axes because {@link HorizontalAlignment} and
 * {@link VerticalAlignment} share the same numeric values: `0` (left/top),
 * `1` (center), and `2` (right/bottom).
 *
 * @param start - The starting edge of the span (rect x or y).
 * @param available - The size of the span (rect width or height).
 * @param extent - The size of the content being placed.
 * @param align - The alignment value (0, 1, or 2).
 * @returns The aligned start coordinate.
 */
export function alignStart(
  start: number,
  available: number,
  extent: number,
  align: number
): number {
  if (align === HorizontalAlignment.CENTER) {
    return start + Math.floor((available - extent) / 2);
  }
  if (align === HorizontalAlignment.RIGHT) {
    return start + available - extent;
  }
  return start;
}

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
  readonly font: Font | undefined;

  /**
   * Creates a new Label component.
   * @param rect - The position and size of the label.
   * @param text - The text to display.
   * @param fg - Foreground (text) color. Defaults to white.
   * @param bg - Background color. Defaults to transparent.
   * @param halign - Horizontal text alignment. Defaults to LEFT.
   * @param valign - Vertical text alignment. Defaults to TOP.
   * @param font - Optional font to use for the text.
   */
  constructor(
    rect: Rect,
    text: string,
    fg: Color = SimplePalette.WHITE,
    bg: Color | undefined = undefined,
    halign = HorizontalAlignment.LEFT,
    valign = VerticalAlignment.TOP,
    font?: Font
  ) {
    super(rect);
    this.text = text;
    this.fg = fg;
    this.bg = bg;
    this.halign = halign;
    this.valign = valign;
    this.font = font;
  }
}
