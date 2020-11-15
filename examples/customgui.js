
import {Colors} from '../src/colors.js';
import {Console} from '../src/console.js';
import {DialogState} from '../src/gui/dialogstate.js';
import {GUI} from '../src/gui.js';
import {MessageDialog} from '../src/gui/messagedialog.js';
import {SelectDialog} from '../src/gui/selectdialog.js';
import {Keys} from '../src/keys.js';
import {Point} from '../src/point.js';
import {Rect} from '../src/rect.js';
import {Terminal} from '../src/terminal.js';

function CustomRenderer() {

    this.getState = function (terminal, dialog) {
        const width = dialog.contentsRect.width + 4;
        const height = dialog.contentsRect.height + 4;
        const x = ((terminal.width - width) / 2) | 0;
        const y = ((terminal.height - height) / 2) | 0;
        const state = new DialogState(
            dialog,
            new Rect(x, y, width, height),
            new Point(2, 2));
        state.buffer = new Console(width, height);
        return state;
    }

    this.draw = function (terminal, dialogState) {
        const buffer = dialogState.buffer;
        const dialog = dialogState.dialog;
        const { x, y, width, height } = dialogState.rect;
        buffer.fillRect(0, 0, width, height, 0, Colors.LIGHT_CYAN, Colors.DARK_CYAN);
        buffer.drawSingleBox(0, 0, width, height);
        buffer.drawCenteredString((width / 2) | 0, 0, ' ' + dialog.title + ' ');
        dialog.drawContents(buffer, dialogState.contentsOffset);
        this.fadeIn(terminal, x, y, buffer, dialogState.count);
        dialogState.count += 2;
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

const term = new Terminal(document.querySelector('canvas'), 80, 45);

const gui = new GUI(term, new CustomRenderer());

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
        if (term.isKeyDown(Keys.VK_UP)) {
            y--;
        }
        if (term.isKeyDown(Keys.VK_LEFT)) {
            x--;
        }
        if (term.isKeyDown(Keys.VK_RIGHT)) {
            x++;
        }
        if (term.isKeyDown(Keys.VK_DOWN)) {
            y++;
        }
        if (term.isKeyPressed(Keys.VK_H)) {
            gui.add(new MessageDialog('ALERT', 'Hello World'));
        }
        if (term.isKeyPressed(Keys.VK_I)) {
            gui.add(new SelectDialog('INVENTORY', options, (choice) => {
                gui.add(new MessageDialog('ALERT', 'You chose: ' + options[choice]));
            }));
        }
    }

    term.clear();
    term.fillRect(0, 0, 80, 45, 0, Colors.LIGHT_GREEN, Colors.BLACK);
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(1, 5, 'Press "h" to open a MessageDialog');
    term.drawString(1, 7, 'Press "i" to open a SelectDialog');
    term.drawString(x, y, '@');
    gui.draw();
};
