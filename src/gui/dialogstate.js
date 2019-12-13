
export class DialogState {

  constructor(dialog, rect, contentsOffset) {
    this.dialog = dialog;
    this.rect = rect;
    this.contentsOffset = contentsOffset;
    this.open = false;
    this.count = 0;
  }
}
