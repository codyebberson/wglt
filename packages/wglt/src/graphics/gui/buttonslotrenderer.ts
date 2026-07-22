import type { Font } from '../../core/font.ts';
import { getShortcutKeyDisplay } from '../../core/gui/button.ts';
import { ButtonSlot } from '../../core/gui/buttonslot.ts';
import { GUI } from '../../core/gui/gui.ts';
import type { Rect } from '../../core/rect.ts';
import { GraphicsApp } from '../graphicsapp.ts';
import { AutoRectRenderer } from './autorectrenderer.ts';

export class GraphicsButtonSlotRenderer extends AutoRectRenderer<ButtonSlot> {
  readonly font: Font | undefined;

  constructor(sourceRect: Rect, font?: Font) {
    super(sourceRect);
    this.font = font;
  }

  render(gui: GUI<GraphicsApp>, component: ButtonSlot): void {
    super.render(gui, component);

    if (component.shortcutKey) {
      gui.context.drawRightString(
        component.screenRect.x + component.screenRect.width - 3,
        component.screenRect.y + 3,
        getShortcutKeyDisplay(component.shortcutKey),
        undefined,
        undefined,
        this.font
      );
    }
  }
}
