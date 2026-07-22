import type { Font } from '../../core/font.ts';
import { Button } from '../../core/gui/button.ts';
import { ButtonSlot } from '../../core/gui/buttonslot.ts';
import { Dialog } from '../../core/gui/dialog.ts';
import { Label } from '../../core/gui/label.ts';
import { MessageLog } from '../../core/gui/messagelog.ts';
import { Panel } from '../../core/gui/panel.ts';
import { SelectInput } from '../../core/gui/selectinput.ts';
import { Theme } from '../../core/gui/theme.ts';
import { Insets } from '../../core/insets.ts';
import { Rect } from '../../core/rect.ts';
import { GraphicsApp } from '../graphicsapp.ts';
import { AutoRectRenderer } from './autorectrenderer.ts';
import { GraphicsButtonRenderer } from './buttonrenderer.ts';
import { GraphicsButtonSlotRenderer } from './buttonslotrenderer.ts';
import { GraphicsLabelRenderer } from './labelrenderer.ts';
import { GraphicsMessageLogRenderer } from './messagelogrenderer.ts';
import { GraphicsSelectInputRenderer } from './selectinputrenderer.ts';

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
    this.tooltipPadding = new Insets(6, 6, 4, 6);
  }
}
