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
exports.SelectDialog = void 0;
var keys_1 = require("../keys");
var rect_1 = require("../rect");
var dialog_1 = require("./dialog");
var SelectDialog = /** @class */ (function (_super) {
    __extends(SelectDialog, _super);
    function SelectDialog(title, options, callback) {
        var _this = this;
        var width = title.length;
        for (var i = 0; i < options.length; i++) {
            width = Math.max(width, options[i].length + 4);
        }
        var height = options.length;
        var rect = new rect_1.Rect(0, 0, width, height);
        _this = _super.call(this, rect, title) || this;
        _this.options = options;
        _this.callback = callback;
        return _this;
    }
    SelectDialog.prototype.drawContents = function (console, offset) {
        for (var i = 0; i < this.options.length; i++) {
            var str = String.fromCharCode(65 + i) + ' - ' + this.options[i];
            console.drawString(offset.x, offset.y + i, str);
        }
    };
    SelectDialog.prototype.handleInput = function (terminal, offset) {
        for (var i = 0; i < this.options.length; i++) {
            if (terminal.isKeyPressed(keys_1.Keys.VK_A + i)) {
                this.callback(i);
                return true;
            }
        }
        return terminal.isKeyPressed(keys_1.Keys.VK_ESCAPE);
    };
    return SelectDialog;
}(dialog_1.Dialog));
exports.SelectDialog = SelectDialog;
