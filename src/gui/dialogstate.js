"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogState = void 0;
var DialogState = /** @class */ (function () {
    function DialogState(dialog, rect, contentsOffset) {
        this.dialog = dialog;
        this.rect = rect;
        this.contentsOffset = contentsOffset;
        this.open = false;
        this.count = 0;
    }
    return DialogState;
}());
exports.DialogState = DialogState;
