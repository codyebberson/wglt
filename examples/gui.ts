
import { Colors } from '../src/colors';
import { GUI } from '../src/gui';
import { MessageDialog } from '../src/gui/messagedialog';
import { SelectDialog } from '../src/gui/selectdialog';
import { Keys } from '../src/keys';
import { Terminal } from '../src/terminal';

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, 80, 45);

const gui = new GUI(term);

const options = [
  'Sword',
  'Banana',
  'Magic Potion',
  'Red Stapler'
];

let x = 10;
let y = 10;

term.update = function () {
  if (!gui.handleInput()) {
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
  term.fillRect(0, 0, 80, 45, 0, Colors.YELLOW, Colors.DARK_BLUE);
  term.drawString(1, 1, 'Hello world!');
  term.drawString(1, 3, 'Use arrow keys to move');
  term.drawString(1, 5, 'Press "h" to open a MessageDialog');
  term.drawString(1, 7, 'Press "i" to open a SelectDialog');
  term.drawString(x, y, '@');
  gui.draw();
};
