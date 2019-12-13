
export class Dialog {

  constructor(contentsRect, title) {
    this.contentsRect = contentsRect;
    this.title = title;
  }

  drawContents(console, offset) {}

  handleInput(terminal, offset) {}
}
