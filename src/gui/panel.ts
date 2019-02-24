import {GUI} from '../gui';
import {Rect} from '../rect';

export abstract class Panel {
  gui: GUI|null;
  readonly rect: Rect;
  readonly modal: boolean;

  constructor(rect: Rect, modal?: boolean) {
    this.gui = null;
    this.rect = rect;
    this.modal = !!modal;
  }

  drawContents(): void {}

  handleInput(): boolean {
    return false;
  }
}
