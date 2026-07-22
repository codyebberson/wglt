import { Rect } from '../../core/rect.ts';
import { Component } from './component.ts';
import { Panel } from './panel.ts';

export class Dialog extends Panel {
  title?: string;

  constructor(rect: Rect, title?: string, ...children: Component[]) {
    super(rect);
    this.title = title;
    if (children) {
      for (const child of children) {
        this.addChild(child);
      }
    }
  }

  handleInput(): boolean {
    const app = this.root?.context;
    if (!app) {
      return false;
    }

    if (app.keyboard.isEscapeKeyPressed()) {
      this.visible = false;
      return true;
    }

    if (this.handleChildrenInput()) {
      return true;
    }

    const mouse = app.mouse;
    if (mouse.isClicked() && !this.screenRect.contains(mouse)) {
      this.visible = false;
      return true;
    }

    return false;
  }

  close(): void {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }
}
