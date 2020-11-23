"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDialog = void 0;
var keys_1 = require("../keys");
var rect_1 = require("../rect");
var dialog_1 = require("./dialog");
var MessageDialog = /** @class */ (function (_super) {
    __extends(MessageDialog, _super);
    function MessageDialog(title, message) {
        var _this = this;
        var lines = message.split('\n');
        var width = title.length;
        for (var i = 0; i < lines.length; i++) {
            width = Math.max(width, lines[i].length);
        }
        var height = lines.length;
        var rect = new rect_1.Rect(0, 0, width, height);
        _this = _super.call(this, rect, title) || this;
        _this.lines = lines;
        return _this;
    }
    MessageDialog.prototype.drawContents = function (console, offset) {
        for (var i = 0; i < this.lines.length; i++) {
            console.drawString(offset.x, offset.y + i, this.lines[i]);
        }
    };
    MessageDialog.prototype.handleInput = function (terminal, offset) {
        return terminal.isKeyPressed(keys_1.Keys.VK_ESCAPE);
    };
    return MessageDialog;
}(dialog_1.Dialog));
exports.MessageDialog = MessageDialog;
