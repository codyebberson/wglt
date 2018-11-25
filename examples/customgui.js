
function CustomRenderer() {

    this.getState = function (terminal, dialog) {
        const width = dialog.contentsRect.width + 4;
        const height = dialog.contentsRect.height + 4;
        const x = ((terminal.width - width) / 2) | 0;
        const y = ((terminal.height - height) / 2) | 0;
        const state = new wglt.DialogState(
            dialog,
            new wglt.Rect(x, y, width, height),
            new wglt.Point(2, 2));
        state.buffer = new wglt.Console(width, height);
        return state;
    }

    this.draw = function (terminal, dialogState) {
        const buffer = dialogState.buffer;
        const dialog = dialogState.dialog;
        const { x, y, width, height } = dialogState.rect;
        buffer.fillRect(0, 0, width, height, 0, wglt.Colors.LIGHT_CYAN, wglt.Colors.DARK_CYAN);
        buffer.drawSingleBox(0, 0, width, height);
        buffer.drawCenteredString((width / 2) | 0, 0, ' ' + dialog.title + ' ');
        dialog.drawContents(buffer, dialogState.contentsOffset);
        this.fadeIn(terminal, x, y, buffer, dialogState.count);
        dialogState.count++;
    }

    this.fadeIn = function(dst, dstX, dstY, src, count) {
      for (let y = 0; y < src.height; y++) {
        for (let x = 0; x < src.width; x++) {
            const dist = x + y;
            if (dist < count) {
                const cell = src.getCell(x, y);
                dst.drawCell(dstX + x, dstY + y, cell);
            }
        }
      }
    }
}

const term = new wglt.Terminal(document.querySelector('canvas'), 80, 50);

const gui = new wglt.GUI(term, new CustomRenderer());

const options = [
    'Sword',
    'Banana',
    'Magic Potion',
    'Red Stapler'
];

let x = 10;
let y = 10;

term.update = function () {
    if (!gui.handleInput(term)) {
        if (term.isKeyDown(wglt.Keys.VK_UP)) {
            y--;
        }
        if (term.isKeyDown(wglt.Keys.VK_LEFT)) {
            x--;
        }
        if (term.isKeyDown(wglt.Keys.VK_RIGHT)) {
            x++;
        }
        if (term.isKeyDown(wglt.Keys.VK_DOWN)) {
            y++;
        }
        if (term.isKeyPressed(wglt.Keys.VK_H)) {
            gui.add(new wglt.MessageDialog('ALERT', 'Hello World'));
        }
        if (term.isKeyPressed(wglt.Keys.VK_I)) {
            gui.add(new wglt.SelectDialog('INVENTORY', options, (choice) => {
                gui.add(new wglt.MessageDialog('ALERT', 'You chose: ' + options[choice]));
            }));
        }
    }

    term.clear();
    term.fillRect(0, 0, 80, 50, 0, wglt.Colors.LIGHT_GREEN, wglt.Colors.BLACK);
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(1, 5, 'Press "h" to open a MessageDialog');
    term.drawString(1, 7, 'Press "i" to open a SelectDialog');
    term.drawString(x, y, '@');
    gui.draw();
};
