import type { Font } from '../../core/font';
import { GUI } from '../../core/gui/gui';
import { alignStart, Label } from '../../core/gui/label';
import type { Renderer } from '../../core/gui/renderer';
import { GraphicsApp } from '../graphicsapp';

export class GraphicsLabelRenderer implements Renderer<GraphicsApp, Label> {
  readonly font: Font | undefined;

  constructor(font?: Font) {
    this.font = font;
  }

  render(gui: GUI<GraphicsApp>, component: Label): void {
    if (!component.text) {
      return;
    }

    const app = gui.context;
    const font = component.font ?? this.font ?? app.defaultFont;
    const rect = component.screenRect;

    // Align within the label rect. Requires a font to measure the text; when
    // none is available fall back to the top-left corner (drawString reports
    // the missing font).
    let x = rect.x;
    let y = rect.y;
    if (font) {
      x = alignStart(rect.x, rect.width, font.getStringWidth(component.text), component.halign);
      y = alignStart(rect.y, rect.height, font.lineHeight, component.valign);
    }

    app.drawString(x, y, component.text, component.fg, undefined, font);
  }
}
