"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mouse = void 0;
var rect_1 = require("./rect");
var input_1 = require("./input");
var Mouse = /** @class */ (function () {
    function Mouse(terminal, options) {
        var _this = this;
        this.el = terminal.canvas;
        this.width = terminal.width;
        this.height = terminal.height;
        this.options = options;
        this.prevX = 0;
        this.prevY = 0;
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.buttons = [new input_1.Input(), new input_1.Input(), new input_1.Input()];
        var el = this.el;
        el.addEventListener('mousedown', function (e) { return _this.handleEvent(e); });
        el.addEventListener('mouseup', function (e) { return _this.handleEvent(e); });
        el.addEventListener('mousemove', function (e) { return _this.handleEvent(e); });
        el.addEventListener('contextmenu', function (e) { return _this.handleEvent(e); });
        var touchEventHandler = this.handleTouchEvent.bind(this);
        el.addEventListener('touchstart', touchEventHandler);
        el.addEventListener('touchend', touchEventHandler);
        el.addEventListener('touchcancel', touchEventHandler);
        el.addEventListener('touchmove', touchEventHandler);
    }
    Mouse.prototype.handleTouchEvent = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.type === 'touchend' && this.options.requestFullscreen) {
            this.requestFullscreen();
        }
        if (e.touches.length > 0) {
            var touch = e.touches[0];
            this.updatePosition(touch.clientX, touch.clientY);
            this.buttons[0].down = true;
        }
        else {
            this.buttons[0].down = false;
        }
    };
    Mouse.prototype.handleEvent = function (e) {
        e.stopPropagation();
        e.preventDefault();
        this.updatePosition(e.clientX, e.clientY);
        if (e.type === 'mousedown') {
            this.buttons[e.button].down = true;
            this.el.focus();
            if (this.options.requestFullscreen) {
                this.requestFullscreen();
            }
        }
        if (e.type === 'mouseup') {
            this.buttons[e.button].down = false;
        }
    };
    Mouse.prototype.updatePosition = function (clientX, clientY) {
        var rect = this.el.getBoundingClientRect();
        // If the client rect is not the same aspect ratio as canvas,
        // then we are fullscreen.
        // Need to update client rect accordingly.
        var terminalAspectRatio = this.width / this.height;
        var rectAspectRatio = rect.width / rect.height;
        if (rectAspectRatio - terminalAspectRatio > 0.01) {
            var actualWidth = terminalAspectRatio * rect.height;
            var excess = rect.width - actualWidth;
            rect = new rect_1.Rect(Math.floor(excess / 2), 0, actualWidth, rect.height);
        }
        if (rectAspectRatio - terminalAspectRatio < -0.01) {
            var actualHeight = rect.width / terminalAspectRatio;
            var excess = rect.height - actualHeight;
            rect = new rect_1.Rect(0, Math.floor(excess / 2), rect.width, actualHeight);
        }
        this.x = (this.width * (clientX - rect.left) / rect.width) | 0;
        this.y = (this.height * (clientY - rect.top) / rect.height) | 0;
    };
    Mouse.prototype.requestFullscreen = function () {
        var canvas = this.el;
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        }
    };
    Mouse.prototype.update = function () {
        this.dx = this.x - this.prevX;
        this.dy = this.y - this.prevY;
        this.prevX = this.x;
        this.prevY = this.y;
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].update();
        }
    };
    return Mouse;
}());
exports.Mouse = Mouse;
