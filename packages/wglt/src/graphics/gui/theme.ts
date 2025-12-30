import type { Font } from '../../core/font';
import { Button } from '../../core/gui/button';
import { ButtonSlot } from '../../core/gui/buttonslot';
import { Dialog } from '../../core/gui/dialog';
import { Label } from '../../core/gui/label';
import { MessageLog } from '../../core/gui/messagelog';
import { Panel } from '../../core/gui/panel';
import { SelectInput } from '../../core/gui/selectinput';
import { Theme } from '../../core/gui/theme';
import { Insets } from '../../core/insets';
import { Rect } from '../../core/rect';
import { GraphicsApp } from '../graphicsapp';
import { AutoRectRenderer } from './autorectrenderer';
import { GraphicsButtonRenderer } from './buttonrenderer';
import { GraphicsButtonSlotRenderer } from './buttonslotrenderer';
import { GraphicsLabelRenderer } from './labelrenderer';
import { GraphicsMessageLogRenderer } from './messagelogrenderer';
import { GraphicsSelectInputRenderer } from './selectinputrenderer';

export interface DefaultGraphicsThemeOptions {
  readonly font: Font;
  readonly dialogSourceRect: Rect;
  readonly buttonSlotRect: Rect;
  readonly messageLogSpacing?: number;
}

export class DefaultGraphicsTheme extends Theme<GraphicsApp> {
  constructor(options: DefaultGraphicsThemeOptions) {
    super();

    const { font, dialogSourceRect, buttonSlotRect, messageLogSpacing } = options;

    this.renderers.set(Dialog, new AutoRectRenderer(dialogSourceRect));
    this.renderers.set(ButtonSlot, new GraphicsButtonSlotRenderer(buttonSlotRect, font));
    this.renderers.set(Panel, new AutoRectRenderer(buttonSlotRect));
    this.renderers.set(Label, new GraphicsLabelRenderer(font));
    this.renderers.set(Button, new GraphicsButtonRenderer(font));
    this.renderers.set(SelectInput, new GraphicsSelectInputRenderer(font));
    this.renderers.set(MessageLog, new GraphicsMessageLogRenderer(messageLogSpacing, font));

    this.defaultFont = font;
    this.tooltipPadding = new Insets(6, 6, 6, 6);
  }
}
