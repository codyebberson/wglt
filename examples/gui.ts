import { Colors, fromRgb, GUI, Keys, Message, MessageDialog, Rect, SelectDialog, Terminal } from '../src/';
import { ScrollableMessageDialog } from '../src/gui/scrollablemessagedialog';

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, 80, 45);

const gui = new GUI(term);

const options = ['Sword', 'Banana', 'Magic Potion', 'Red Stapler'];

let x = 10;
let y = 15;

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
    if (term.isKeyPressed(Keys.VK_F)) {
      gui.add(
        new MessageDialog(
          'Formatted Text',
          new Message('Dagger of the Rising Moon', Colors.DARK_MAGENTA, undefined, [
            new Message('Item Level 200', Colors.YELLOW),
            new Message('Binds when picked up', Colors.WHITE),
            new Message('Unique-Equipped', Colors.WHITE),
            new Message(' '),
            new Message('One-Hand                              Dagger', Colors.WHITE),
            new Message('195-293 Damage                    Speed 1.70', Colors.WHITE),
            new Message('143.53 damage per second', Colors.WHITE),
            new Message('+43 Stamina', Colors.WHITE),
            new Message(' '),
            new Message('Durability 75 / 75', Colors.WHITE),
            new Message('Requires Level 80', Colors.WHITE),
            new Message(' '),
            new Message('Equip: Improves critical strike rating by 22', Colors.LIGHT_GREEN),
            new Message('Equip: Improves hit rating by 38', Colors.LIGHT_GREEN),
            new Message('Equip: Increases attack power by 78', Colors.LIGHT_GREEN),
          ])
        )
      );
    }
    if (term.isKeyPressed(Keys.VK_S)) {
      const messages = [];
      for (let i = 0; i < 100; i++) {
        messages.push(
          new Message(
            'Hello World - line ' + (i + 1),
            fromRgb(Math.random() * 255, Math.random() * 255, Math.random() * 255)
          )
        );
      }
      gui.add(
        new ScrollableMessageDialog(
          new Rect(4, 4, 72, 37),
          'Message Log',
          new Message(undefined, undefined, undefined, messages)
        )
      );
    }
    if (term.isKeyPressed(Keys.VK_I)) {
      gui.add(
        new SelectDialog('INVENTORY', options, (choice) => {
          gui.add(new MessageDialog('ALERT', 'You chose: ' + options[choice]));
        })
      );
    }
  }

  term.clear();
  term.fillRect(0, 0, 80, 45, 0, Colors.YELLOW, Colors.DARK_BLUE);
  term.drawString(1, 1, 'Hello world!');
  term.drawString(1, 3, 'Use arrow keys to move');
  term.drawString(1, 5, 'Press "h" to open a MessageDialog');
  term.drawString(1, 7, 'Press "f" to open a MessageDialog with formatted text');
  term.drawString(1, 9, 'Press "s" to open a ScrollableMessageDialog');
  term.drawString(1, 11, 'Press "i" to open a SelectDialog');
  term.drawString(x, y, '@');
  gui.draw();
};
