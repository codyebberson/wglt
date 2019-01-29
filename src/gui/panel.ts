import {GUI} from '../gui';
import {Rect} from '../rect';

export abstract class Panel {
  readonly gui: GUI;
  readonly rect: Rect;
  readonly modal: boolean;

  constructor(gui: GUI, rect: Rect, modal?: boolean) {
    this.gui = gui;
    this.rect = rect;
    this.modal = !!modal;
  }

  drawContents(): void {}

  handleInput(): boolean {
    return false;
  }
}
