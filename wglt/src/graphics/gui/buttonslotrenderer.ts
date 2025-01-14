import { getShortcutKeyDisplay } from '../../core/gui/button';
import { ButtonSlot } from '../../core/gui/buttonslot';
import { GUI } from '../../core/gui/gui';
import { GraphicsApp } from '../graphicsapp';
import { AutoRectRenderer } from './autorectrenderer';

export class GraphicsButtonSlotRenderer extends AutoRectRenderer<ButtonSlot> {
  render(gui: GUI<GraphicsApp>, component: ButtonSlot): void {
    super.render(gui, component);

    if (component.shortcutKey) {
      gui.context.drawRightString(
        component.screenRect.x + component.screenRect.width - 2,
        component.screenRect.y + 2,
        getShortcutKeyDisplay(component.shortcutKey)
      );
    }
  }
}
