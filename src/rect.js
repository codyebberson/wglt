"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = void 0;
var point_1 = require("./point");
var Rect = /** @class */ (function () {
    function Rect(x, y, width, height) {
        this.x = this.left = x;
        this.y = this.top = y;
        this.width = width;
        this.height = height;
        this.x2 = x + width;
        this.y2 = y + height;
    }
    Rect.prototype.getCenter = function () {
        return new point_1.Point(this.x + (this.width / 2) | 0, this.y + (this.height / 2) | 0);
    };
    Rect.prototype.intersects = function (other) {
        return this.x <= other.x2 && this.x2 >= other.x && this.y <= other.y2 && this.y2 >= other.y;
    };
    Rect.prototype.contains = function (point) {
        return point.x >= this.x && point.y < this.x2 && point.y >= this.y && point.y < this.y2;
    };
    return Rect;
}());
exports.Rect = Rect;
