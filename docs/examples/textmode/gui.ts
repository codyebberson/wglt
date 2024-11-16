import {
  CgaPalette,
  Dialog,
  GUI,
  Key,
  Label,
  MessageDialog,
  Rect,
  Terminal,
  TerminalDialogRenderer,
  TerminalLabelRenderer,
} from 'wglt';

const term = new Terminal('canvas', 80, 45);

const gui = new GUI(term);
// gui.ren

// const dialogConstructor = Dialog.constructor as ComponentConstructor<Dialog>;
gui.renderers.set(Dialog, new TerminalDialogRenderer());
console.log('gui.renders.size', gui.renderers.size);

// const messageDialogConstructor = MessageDialog.constructor as ComponentConstructor<MessageDialog>;
gui.renderers.set(MessageDialog, new TerminalDialogRenderer());
console.log('gui.renders.size', gui.renderers.size);

gui.renderers.set(Label, new TerminalLabelRenderer());

// const options = ['Sword', 'Banana', 'Magic Potion', 'Red Stapler'];

let x = 10;
let y = 15;

term.update = () => {
  if (!gui.handleInput()) {
    if (term.isKeyDown(Key.VK_UP)) {
      y--;
    }

    if (term.isKeyDown(Key.VK_LEFT)) {
      x--;
    }

    if (term.isKeyDown(Key.VK_RIGHT)) {
      x++;
    }

    if (term.isKeyDown(Key.VK_DOWN)) {
      y++;
    }

    if (term.isKeyPressed(Key.VK_H)) {
      gui.addChild(new MessageDialog(new Rect(30, 15, 20, 10), 'ALERT', 'Hello World'));
    }

    if (term.isKeyPressed(Key.VK_F)) {
      const dialog = new Dialog(new Rect(20, 10, 40, 20), 'Formatted Text');

      dialog.addChild(
        new Label(new Rect(1, 1, 20, 1), 'Dagger of the Rising Moon', CgaPalette.DARK_MAGENTA)
      );

      dialog.addChild(new Label(new Rect(1, 3, 20, 1), 'Item Level 200', CgaPalette.YELLOW));
      dialog.addChild(new Label(new Rect(1, 4, 20, 1), 'Binds when picked up', CgaPalette.WHITE));
      dialog.addChild(new Label(new Rect(1, 5, 20, 1), 'Unique-Equipped', CgaPalette.WHITE));

      dialog.addChild(new Label(new Rect(1, 7, 20, 1), 'One-Hand', CgaPalette.WHITE));
      dialog.addChild(new Label(new Rect(33, 7, 20, 1), 'Dagger', CgaPalette.WHITE));
      dialog.addChild(new Label(new Rect(1, 8, 20, 1), '195-293 Damage', CgaPalette.WHITE));
      dialog.addChild(new Label(new Rect(29, 8, 20, 1), 'Speed 1.70', CgaPalette.WHITE));

      dialog.addChild(
        new Label(new Rect(1, 9, 20, 1), '143.53 damage per second', CgaPalette.WHITE)
      );
      dialog.addChild(new Label(new Rect(1, 10, 20, 1), '+43 Stamina', CgaPalette.WHITE));
      dialog.addChild(new Label(new Rect(1, 11, 20, 20), 'Total: 1.70', CgaPalette.LIGHT_GRAY));
      dialog.addChild(new Label(new Rect(1, 13, 20, 1), 'Durability 75 / 75', CgaPalette.WHITE));
      dialog.addChild(new Label(new Rect(1, 14, 20, 1), 'Requires Level 80', CgaPalette.WHITE));

      dialog.addChild(
        new Label(
          new Rect(1, 16, 20, 1),
          'Equip: Improves critical strike by 22',
          CgaPalette.LIGHT_GREEN
        )
      );
      dialog.addChild(
        new Label(
          new Rect(1, 17, 20, 1),
          'Equip: Improves hit rating by 38',
          CgaPalette.LIGHT_GREEN
        )
      );
      dialog.addChild(
        new Label(
          new Rect(1, 18, 20, 1),
          'Equip: Increases attack power by 78',
          CgaPalette.LIGHT_GREEN
        )
      );

      gui.addChild(dialog);
    }

    //   if (term.isKeyPressed(Key.VK_S)) {
    //     const messages = [];
    //     for (let i = 0; i < 100; i++) {
    //       messages.push(
    //         new Message(
    //           `Hello World - line ${i + 1}`,
    //           fromRgb(Math.random() * 255, Math.random() * 255, Math.random() * 255)
    //         )
    //       );
    //     }
    //     gui.add(
    //       new ScrollableMessageDialog(
    //         new Rect(4, 4, 72, 37),
    //         'Message Log',
    //         new Message(undefined, undefined, undefined, messages)
    //       )
    //     );
    //   }
    //   if (term.isKeyPressed(Key.VK_I)) {
    //     gui.add(
    //       new SelectDialog('INVENTORY', options, (choice) => {
    //         gui.add(new MessageDialog('ALERT', `You chose: ${options[choice]}`));
    //       })
    //     );
    //   }
  }

  term.console.fillRect(0, 0, 80, 45, 0, CgaPalette.YELLOW, CgaPalette.DARK_BLUE);
  term.drawString(1, 1, 'Hello world!');
  term.drawString(1, 3, 'Use arrow keys to move');
  term.drawString(1, 5, 'Press "h" to open a MessageDialog');
  term.drawString(1, 7, 'Press "f" to open a MessageDialog with formatted text');
  term.drawString(1, 9, 'Press "s" to open a ScrollableMessageDialog');
  term.drawString(1, 11, 'Press "i" to open a SelectDialog');
  term.drawString(1, 13, `Number of components: ${gui.children.length}`);
  term.drawString(x, y, '@');
  gui.draw();
};
