import { Color } from '../color';
import { SimplePalette } from '../palettes/simple';
import { Rect } from '../rect';
import { Component } from './component';

export const HorizontalAlignment = {
  LEFT: 0,
  CENTER: 1,
  RIGHT: 2,
};

export const VerticalAlignment = {
  TOP: 0,
  CENTER: 1,
  BOTTOM: 2,
};

export class Label extends Component {
  constructor(
    rect: Rect,
    readonly text: string,
    readonly fg: Color = SimplePalette.WHITE,
    readonly bg: Color | undefined = undefined,
    readonly halign = HorizontalAlignment.LEFT,
    readonly valign = VerticalAlignment.TOP
  ) {
    super(rect);
  }
}
