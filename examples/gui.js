"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("../src/colors");
var gui_1 = require("../src/gui");
var messagedialog_1 = require("../src/gui/messagedialog");
var selectdialog_1 = require("../src/gui/selectdialog");
var keys_1 = require("../src/keys");
var terminal_1 = require("../src/terminal");
var term = new terminal_1.Terminal(document.querySelector('canvas'), 80, 45);
var gui = new gui_1.GUI(term);
var options = [
    'Sword',
    'Banana',
    'Magic Potion',
    'Red Stapler'
];
var x = 10;
var y = 10;
term.update = function () {
    if (!gui.handleInput()) {
        if (term.isKeyDown(keys_1.Keys.VK_UP)) {
            y--;
        }
        if (term.isKeyDown(keys_1.Keys.VK_LEFT)) {
            x--;
        }
        if (term.isKeyDown(keys_1.Keys.VK_RIGHT)) {
            x++;
        }
        if (term.isKeyDown(keys_1.Keys.VK_DOWN)) {
            y++;
        }
        if (term.isKeyPressed(keys_1.Keys.VK_H)) {
            gui.add(new messagedialog_1.MessageDialog('ALERT', 'Hello World'));
        }
        if (term.isKeyPressed(keys_1.Keys.VK_I)) {
            gui.add(new selectdialog_1.SelectDialog('INVENTORY', options, function (choice) {
                gui.add(new messagedialog_1.MessageDialog('ALERT', 'You chose: ' + options[choice]));
            }));
        }
    }
    term.clear();
    term.fillRect(0, 0, 80, 45, 0, colors_1.Colors.YELLOW, colors_1.Colors.DARK_BLUE);
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(1, 5, 'Press "h" to open a MessageDialog');
    term.drawString(1, 7, 'Press "i" to open a SelectDialog');
    term.drawString(x, y, '@');
    gui.draw();
};
