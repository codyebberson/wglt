import {
  Colors,
  Console,
  Dialog,
  DialogRenderer,
  DialogState,
  GUI,
  Key,
  MessageDialog,
  Point,
  Rect,
  SelectDialog,
  Terminal,
} from '../src/';

class CustomRenderer implements DialogRenderer {
  getState(terminal: Terminal, dialog: Dialog): DialogState {
    const width = dialog.contentsRect.width + 4;
    const height = dialog.contentsRect.height + 4;
    const x = ((terminal.width - width) / 2) | 0;
    const y = ((terminal.height - height) / 2) | 0;
    const state = new DialogState(dialog, new Rect(x, y, width, height), new Point(2, 2));
    state.buffer = new Console(width, height);
    return state;
  }

  draw(terminal: Terminal, dialogState: DialogState): void {
    const buffer = dialogState.buffer;
    if (!buffer) {
      return;
    }
    const dialog = dialogState.dialog;
    const { x, y, width, height } = dialogState.rect;
    buffer.fillRect(0, 0, width, height, 0, Colors.LIGHT_CYAN, Colors.DARK_CYAN);
    buffer.drawSingleBox(0, 0, width, height);
    buffer.drawCenteredString((width / 2) | 0, 0, ' ' + dialog.title + ' ');
    dialog.drawContents(buffer, dialogState.contentsOffset);
    this.fadeIn(terminal, x, y, buffer, dialogState.count);
    dialogState.count += 2;
  }

  fadeIn(dst: Console, dstX: number, dstY: number, src: Console, count: number): void {
    for (let y = 0; y < src.height; y++) {
      for (let x = 0; x < src.width; x++) {
        const dist = x + y;
        if (dist < count) {
          const cell = src.getCell(x, y);
          if (cell) {
            dst.drawCell(dstX + x, dstY + y, cell);
          }
        }
      }
    }
  }
}

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, 80, 45);

const gui = new GUI(term, new CustomRenderer());

const options = ['Sword', 'Banana', 'Magic Potion', 'Red Stapler'];

let x = 10;
let y = 10;

term.update = () => {
  if (!gui.handleInput()) {
    const moveKey = term.getMovementKey();
    if (moveKey) {
      x += moveKey.x;
      y += moveKey.y;
    }
    if (term.isKeyPressed(Key.VK_M)) {
      gui.add(new MessageDialog('ALERT', 'Hello World'));
    }
    if (term.isKeyPressed(Key.VK_I)) {
      gui.add(
        new SelectDialog('INVENTORY', options, (choice) => {
          gui.add(new MessageDialog('ALERT', 'You chose: ' + options[choice]));
        })
      );
    }
  }

  term.clear();
  term.fillRect(0, 0, 80, 45, 0, Colors.LIGHT_GREEN, Colors.BLACK);
  term.drawString(1, 1, 'Hello world!');
  term.drawString(1, 3, 'Use arrow keys to move');
  term.drawString(1, 5, 'Press "m" to open a MessageDialog');
  term.drawString(1, 7, 'Press "i" to open a SelectDialog');
  term.drawString(x, y, '@');
  gui.draw();
};
