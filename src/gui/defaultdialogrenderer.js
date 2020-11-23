"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDialogRenderer = void 0;
var colors_1 = require("../colors");
var point_1 = require("../point");
var rect_1 = require("../rect");
var dialogstate_1 = require("./dialogstate");
var DefaultDialogRenderer = /** @class */ (function () {
    function DefaultDialogRenderer() {
    }
    DefaultDialogRenderer.prototype.getState = function (terminal, dialog) {
        var width = dialog.contentsRect.width + 4;
        var height = dialog.contentsRect.height + 4;
        var x = ((terminal.width - width) / 2) | 0;
        var y = ((terminal.height - height) / 2) | 0;
        return new dialogstate_1.DialogState(dialog, new rect_1.Rect(x, y, width, height), new point_1.Point(x + 2, y + 2));
    };
    DefaultDialogRenderer.prototype.draw = function (term, dialogState) {
        var dialog = dialogState.dialog;
        var _a = dialogState.rect, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        term.fillRect(x, y, width, height, 0, colors_1.Colors.WHITE, colors_1.Colors.BLACK);
        term.drawSingleBox(x, y, width, height);
        term.drawCenteredString(x + (width / 2) | 0, y, ' ' + dialog.title + ' ');
        dialog.drawContents(term, dialogState.contentsOffset);
    };
    return DefaultDialogRenderer;
}());
exports.DefaultDialogRenderer = DefaultDialogRenderer;
