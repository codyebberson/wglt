"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("../src/colors");
var console_1 = require("../src/console");
var dialogstate_1 = require("../src/gui/dialogstate");
var gui_1 = require("../src/gui");
var messagedialog_1 = require("../src/gui/messagedialog");
var selectdialog_1 = require("../src/gui/selectdialog");
var keys_1 = require("../src/keys");
var point_1 = require("../src/point");
var rect_1 = require("../src/rect");
var terminal_1 = require("../src/terminal");
var CustomRenderer = /** @class */ (function () {
    function CustomRenderer() {
    }
    CustomRenderer.prototype.getState = function (terminal, dialog) {
        var width = dialog.contentsRect.width + 4;
        var height = dialog.contentsRect.height + 4;
        var x = ((terminal.width - width) / 2) | 0;
        var y = ((terminal.height - height) / 2) | 0;
        var state = new dialogstate_1.DialogState(dialog, new rect_1.Rect(x, y, width, height), new point_1.Point(2, 2));
        state.buffer = new console_1.Console(width, height);
        return state;
    };
    CustomRenderer.prototype.draw = function (terminal, dialogState) {
        var buffer = dialogState.buffer;
        if (!buffer) {
            return;
        }
        var dialog = dialogState.dialog;
        var _a = dialogState.rect, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        buffer.fillRect(0, 0, width, height, 0, colors_1.Colors.LIGHT_CYAN, colors_1.Colors.DARK_CYAN);
        buffer.drawSingleBox(0, 0, width, height);
        buffer.drawCenteredString((width / 2) | 0, 0, ' ' + dialog.title + ' ');
        dialog.drawContents(buffer, dialogState.contentsOffset);
        this.fadeIn(terminal, x, y, buffer, dialogState.count);
        dialogState.count += 2;
    };
    CustomRenderer.prototype.fadeIn = function (dst, dstX, dstY, src, count) {
        for (var y_1 = 0; y_1 < src.height; y_1++) {
            for (var x_1 = 0; x_1 < src.width; x_1++) {
                var dist = x_1 + y_1;
                if (dist < count) {
                    var cell = src.getCell(x_1, y_1);
                    if (cell) {
                        dst.drawCell(dstX + x_1, dstY + y_1, cell);
                    }
                }
            }
        }
    };
    return CustomRenderer;
}());
var term = new terminal_1.Terminal(document.querySelector('canvas'), 80, 45);
var gui = new gui_1.GUI(term, new CustomRenderer());
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
    term.fillRect(0, 0, 80, 45, 0, colors_1.Colors.LIGHT_GREEN, colors_1.Colors.BLACK);
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(1, 5, 'Press "h" to open a MessageDialog');
    term.drawString(1, 7, 'Press "i" to open a SelectDialog');
    term.drawString(x, y, '@');
    gui.draw();
};
