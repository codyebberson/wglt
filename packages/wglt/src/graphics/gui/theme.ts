import { Button } from '../../core/gui/button';
import { ButtonSlot } from '../../core/gui/buttonslot';
import { Dialog } from '../../core/gui/dialog';
import { Label } from '../../core/gui/label';
import { MessageLog } from '../../core/gui/messagelog';
import { Panel } from '../../core/gui/panel';
import { SelectInput } from '../../core/gui/selectinput';
import { Theme } from '../../core/gui/theme';
import { Rect } from '../../core/rect';
import { GraphicsApp } from '../graphicsapp';
import { AutoRectRenderer } from './autorectrenderer';
import { GraphicsButtonRenderer } from './buttonrenderer';
import { GraphicsButtonSlotRenderer } from './buttonslotrenderer';
import { GraphicsLabelRenderer } from './labelrenderer';
import { GraphicsMessageLogRenderer } from './messagelogrenderer';
import { GraphicsSelectInputRenderer } from './selectinputrenderer';

export interface DefaultGraphicsThemeOptions {
  readonly dialogSourceRect: Rect;
  readonly buttonSlotRect: Rect;
}

export class DefaultGraphicsTheme extends Theme<GraphicsApp> {
  constructor(options: DefaultGraphicsThemeOptions) {
    super();

    const { dialogSourceRect, buttonSlotRect } = options;

    this.renderers.set(Dialog, new AutoRectRenderer(dialogSourceRect));
    this.renderers.set(ButtonSlot, new GraphicsButtonSlotRenderer(buttonSlotRect));
    this.renderers.set(Panel, new AutoRectRenderer(buttonSlotRect));
    this.renderers.set(Label, new GraphicsLabelRenderer());
    this.renderers.set(Button, new GraphicsButtonRenderer());
    this.renderers.set(SelectInput, new GraphicsSelectInputRenderer());
    this.renderers.set(MessageLog, new GraphicsMessageLogRenderer());
  }
}
