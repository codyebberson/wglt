"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
var blendmode_1 = require("./blendmode");
var colors_1 = require("./colors");
var color_1 = require("./color");
function convertCharCode(charCode) {
    if ((typeof charCode === 'string') && charCode.length > 0) {
        return charCode.charCodeAt(0);
    }
    else {
        return charCode;
    }
}
// export class Tile extends Cell {
//   constructor(x, y) {
//     super();
//     this.x = x;
//     this.y = y;
//     this.blocked = false;
//     this.blockedSight = false;
//     this.explored = false;
//     this.visible = false;
//     this.pathId = -1;
//     this.g = 0.0;
//     this.h = 0.0;
//     this.prev = null;
//   }
// }
var Cell = /** @class */ (function () {
    function Cell(x, y, charCode, fg, bg, meta) {
        this.x = x;
        this.y = y;
        if (charCode !== undefined) {
            this.charCode = convertCharCode(charCode);
        }
        else {
            this.charCode = ' '.charCodeAt(0);
        }
        if (fg !== undefined) {
            this.fg = fg;
        }
        else {
            this.fg = colors_1.Colors.WHITE;
        }
        if (bg !== undefined) {
            this.bg = bg;
        }
        else {
            this.bg = colors_1.Colors.BLACK;
        }
        if (meta !== undefined) {
            this.meta = meta;
        }
        this.dirty = true;
        this.blocked = false;
        this.blockedSight = false;
        this.explored = false;
        this.visible = false;
        this.pathId = -1;
        this.g = 0;
        this.h = 0;
        this.prev = null;
    }
    Cell.prototype.setCharCode = function (charCode) {
        if (this.charCode !== charCode) {
            this.charCode = charCode;
            this.dirty = true;
        }
    };
    Cell.prototype.setForeground = function (fg) {
        if (fg !== undefined && fg !== null && fg !== this.fg) {
            this.fg = fg;
            this.dirty = true;
        }
    };
    Cell.prototype.setBackground = function (bg) {
        if (bg !== undefined && bg !== null && bg !== this.bg) {
            this.bg = bg;
            this.dirty = true;
        }
    };
    Cell.prototype.setMeta = function (meta) {
        if (meta !== undefined) {
            this.meta = meta;
            this.dirty = true;
        }
    };
    Cell.prototype.setValue = function (charCode, fg, bg, meta) {
        if (typeof charCode === 'string') {
            charCode = charCode.charCodeAt(0);
        }
        if (typeof charCode === 'number') {
            this.setCharCode(charCode);
            if (fg !== undefined) {
                this.setForeground(fg);
            }
            if (bg !== undefined) {
                this.setBackground(bg);
            }
            this.setMeta(meta);
        }
        else {
            this.drawCell(charCode, blendmode_1.BlendMode.None);
        }
        return this.dirty;
    };
    Cell.prototype.drawCell = function (otherCell, blendMode) {
        var alpha = otherCell.bg & 0xFF;
        if (blendMode === blendmode_1.BlendMode.None || otherCell.charCode > 0) {
            this.setCharCode(otherCell.charCode);
            this.setForeground(otherCell.fg);
        }
        else if (alpha > 0 && alpha < 255) {
            this.setForeground(this.blendColors(this.fg, otherCell.bg, blendMode));
        }
        if (blendMode === blendmode_1.BlendMode.None || alpha === 255) {
            this.setBackground(otherCell.bg);
        }
        else if (alpha > 0) {
            this.setBackground(this.blendColors(this.bg, otherCell.bg, blendMode));
        }
        this.setMeta(otherCell.meta);
    };
    Cell.prototype.blendColors = function (c1, c2, blendMode) {
        var alpha = c2 & 0xFF;
        var w1 = (255 - alpha) / 255.0;
        var w2 = 1.0 - w1;
        var r1 = (c1 >> 24) & 0xFF;
        var g1 = (c1 >> 16) & 0xFF;
        var b1 = (c1 >> 8) & 0xFF;
        var r2 = (c2 >> 24) & 0xFF;
        var g2 = (c2 >> 16) & 0xFF;
        var b2 = (c2 >> 8) & 0xFF;
        switch (blendMode) {
            case blendmode_1.BlendMode.Blend:
                return color_1.fromRgb((w1 * r1 + w2 * r2) | 0, (w1 * g1 + w2 * g2) | 0, (w1 * b1 + w2 * b2) | 0);
            case blendmode_1.BlendMode.Add:
                return color_1.fromRgb(this.clamp((r1 + w2 * r2) | 0), this.clamp((g1 + w2 * g2) | 0), this.clamp((b1 + w2 * b2) | 0));
            default:
                return c2;
        }
    };
    Cell.prototype.clamp = function (x) {
        return Math.min(255, x);
    };
    return Cell;
}());
exports.Cell = Cell;
