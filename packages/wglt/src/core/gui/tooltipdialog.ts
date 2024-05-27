import { Rect } from '../../core/rect';
import { Vec2 } from '../../core/vec2';
import { GraphicsApp } from '../../graphics/graphicsapp';
import { BaseApp } from '../baseapp';
import { Message } from '../message';
import { PointLike } from '../point';
import { Component } from './component';

const WIDTH = 100;
const MARGIN = 5;
const LINE_PADDING = 2;

export class TooltipDialog implements Component {
  readonly parent: Component | undefined = undefined;
  readonly rect: Rect;
  visible: boolean;
  messages: Message[];

  constructor() {
    // super(new Rect(0, 0, WIDTH, 10));
    this.rect = new Rect(0, 0, WIDTH, 10);
    this.messages = [];
    this.visible = false;
  }

  showAt(app: BaseApp, x: number, y: number): void {
    // Resize
    const font = app.font;
    const lineHeight = font.getHeight() + LINE_PADDING;
    this.rect.width = 2 * MARGIN;
    this.rect.height = 2 * MARGIN + this.messages.length * lineHeight;

    for (let i = 0; i < this.messages.length; i++) {
      const msg = this.messages[i];
      const width = 2 * MARGIN + msg.getWidth(font);
      this.rect.width = Math.max(this.rect.width, width);
    }

    if (x + this.rect.width >= app.size.width) {
      this.rect.x = x - this.rect.width - 2;
    } else {
      this.rect.x = x + 2;
    }

    if (y - this.rect.height < 0) {
      this.rect.y = y + 2;
    } else {
      this.rect.y = y - this.rect.height - 2;
    }

    if (this.rect.x < 0) {
      this.rect.x = 0;
    }

    if (this.rect.y < 0) {
      this.rect.y = 0;
    }

    this.visible = true;
  }

  draw(app: BaseApp): void {
    // Draw the dialog border
    // super.draw(app);

    // app.drawDialogFrame((app as Gra));
    const graphicsApp = app as GraphicsApp;
    graphicsApp.drawAutoRect(graphicsApp.config.dialogRect, this.rect);

    const lineHeight = app.font.getHeight() + LINE_PADDING;
    const pos = new Vec2(this.rect.x + MARGIN, this.rect.y + MARGIN);

    for (let i = 0; i < this.messages.length; i++) {
      const msg = this.messages[i];
      msg.draw(app, pos);
      pos.x = this.rect.x + MARGIN;
      pos.y += lineHeight;
    }
  }

  handleInput(app: BaseApp): boolean {
    if (app.mouse.isClicked()) {
      this.visible = false;
    }

    return false;
  }

  addChild(panel: Component): void {
    // throw new Error('Method not implemented.');
    // no-op
  }
  removeChild(panel: Component): void {
    // throw new Error('Method not implemented.');
    // no-op
  }
  getPanelAt(point: PointLike): Component | undefined {
    // throw new Error('Method not implemented.');
    return undefined;
  }

  updateTooltip(): Message[] | undefined {
    return undefined;
  }

  isDragging(): boolean {
    // throw new Error('Method not implemented.');
    return false;
  }
  onDrop(_panel: Component): boolean {
    // throw new Error('Method not implemented.');
    return false;
  }
}
