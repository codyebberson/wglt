"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUI = void 0;
var defaultdialogrenderer_1 = require("./gui/defaultdialogrenderer");
var GUI = /** @class */ (function () {
    function GUI(terminal, renderer) {
        this.terminal = terminal;
        this.renderer = renderer || new defaultdialogrenderer_1.DefaultDialogRenderer();
        this.dialogs = [];
    }
    GUI.prototype.add = function (dialog) {
        this.dialogs.push(this.renderer.getState(this.terminal, dialog));
    };
    GUI.prototype.handleInput = function () {
        if (this.dialogs.length === 0) {
            return false;
        }
        var activeIndex = this.dialogs.length - 1;
        var activeState = this.dialogs[this.dialogs.length - 1];
        var activeDialog = activeState.dialog;
        if (activeDialog.handleInput(this.terminal, activeState.contentsOffset)) {
            this.dialogs.splice(activeIndex, 1);
        }
        return true;
    };
    GUI.prototype.draw = function () {
        for (var i = 0; i < this.dialogs.length; i++) {
            this.renderer.draw(this.terminal, this.dialogs[i]);
        }
    };
    return GUI;
}());
exports.GUI = GUI;
