"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Console = void 0;
var blendmode_1 = require("./blendmode");
var cell_1 = require("./cell");
var chars_1 = require("./chars");
var Console = /** @class */ (function () {
    function Console(width, height, blockedFunc) {
        this.width = width;
        this.height = height;
        this.grid = new Array();
        this.originX = 0;
        this.originY = 0;
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
        this.radius = 0;
        for (var y = 0; y < height; y++) {
            var row = new Array();
            for (var x = 0; x < width; x++) {
                row.push(new cell_1.Cell(x, y));
            }
            this.grid.push(row);
        }
        this.clear();
        if (blockedFunc) {
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    this.grid[y][x].blocked = this.grid[y][x].blockedSight = blockedFunc(x, y);
                }
            }
        }
    }
    Console.prototype.clear = function () {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.drawChar(x, y, 0);
            }
        }
    };
    Console.prototype.getCell = function (x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return undefined;
        }
        return this.grid[y][x];
    };
    Console.prototype.getCharCode = function (x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return undefined;
        }
        return this.grid[y][x].charCode;
    };
    Console.prototype.drawChar = function (x, y, c, fg, bg) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            // if (!this.grid[y]) {
            //   console.log('wtf2');
            // }
            // if (!this.grid[y][x]) {
            //   console.log('wtf');
            // }
            this.grid[y | 0][x | 0].setValue(c, fg, bg);
        }
    };
    Console.prototype.drawString = function (x, y, str, fg, bg) {
        var lines = str.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            for (var j = 0; j < line.length; j++) {
                this.drawChar(x + j, y + i, line.charCodeAt(j), fg, bg);
            }
        }
    };
    Console.prototype.drawCenteredString = function (x, y, str, fg, bg) {
        this.drawString(x - Math.floor(str.length / 2), y, str, fg, bg);
    };
    Console.prototype.drawHLine = function (x, y, width, c, fg, bg) {
        for (var xi = x; xi < x + width; xi++) {
            this.drawChar(xi, y, c, fg, bg);
        }
    };
    Console.prototype.drawVLine = function (x, y, height, c, fg, bg) {
        for (var yi = y; yi < y + height; yi++) {
            this.drawChar(x, yi, c, fg, bg);
        }
    };
    Console.prototype.drawRect = function (x, y, width, height, c, fg, bg) {
        this.drawHLine(x, y, width, c, fg, bg);
        this.drawHLine(x, y + height - 1, width, c, fg, bg);
        this.drawVLine(x, y, height, c, fg, bg);
        this.drawVLine(x + width - 1, y, height, c, fg, bg);
    };
    Console.prototype.drawBox = function (x, y, width, height, topChar, rightChar, bottomChar, leftChar, topLeftChar, topRightChar, bottomRightChar, bottomLeftChar, fg, bg) {
        this.fillRect(x, y, width, height, 0, fg, bg);
        this.drawHLine(x, y, width, topChar);
        this.drawHLine(x, y + height - 1, width, bottomChar);
        this.drawVLine(x, y, height, leftChar);
        this.drawVLine(x + width - 1, y, height, rightChar);
        this.drawChar(x, y, topLeftChar);
        this.drawChar(x + width - 1, y, topRightChar);
        this.drawChar(x, y + height - 1, bottomLeftChar);
        this.drawChar(x + width - 1, y + height - 1, bottomRightChar);
    };
    Console.prototype.drawSingleBox = function (x, y, width, height, fg, bg) {
        this.drawBox(x, y, width, height, chars_1.Chars.BOX_SINGLE_HORIZONTAL, chars_1.Chars.BOX_SINGLE_VERTICAL, chars_1.Chars.BOX_SINGLE_HORIZONTAL, chars_1.Chars.BOX_SINGLE_VERTICAL, chars_1.Chars.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT, chars_1.Chars.BOX_SINGLE_DOWN_AND_SINGLE_LEFT, chars_1.Chars.BOX_SINGLE_UP_AND_SINGLE_LEFT, chars_1.Chars.BOX_SINGLE_UP_AND_SINGLE_RIGHT, fg, bg);
    };
    Console.prototype.drawDoubleBox = function (x, y, width, height, fg, bg) {
        this.drawBox(x, y, width, height, chars_1.Chars.BOX_DOUBLE_HORIZONTAL, chars_1.Chars.BOX_DOUBLE_VERTICAL, chars_1.Chars.BOX_DOUBLE_HORIZONTAL, chars_1.Chars.BOX_DOUBLE_VERTICAL, chars_1.Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT, chars_1.Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT, chars_1.Chars.BOX_DOUBLE_UP_AND_DOUBLE_LEFT, chars_1.Chars.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT, fg, bg);
    };
    Console.prototype.fillRect = function (x, y, width, height, c, fg, bg) {
        for (var yi = y; yi < y + height; yi++) {
            this.drawHLine(x, yi, width, c, fg, bg);
        }
    };
    Console.prototype.drawConsole = function (dstX, dstY, srcConsole, srcX, srcY, srcWidth, srcHeight, blendMode) {
        blendMode = blendMode || blendmode_1.BlendMode.None;
        for (var y = 0; y < srcHeight; y++) {
            for (var x = 0; x < srcWidth; x++) {
                var cell = srcConsole.getCell(srcX + x, srcY + y);
                if (cell) {
                    this.drawCell(dstX + x, dstY + y, cell, blendMode);
                }
            }
        }
    };
    Console.prototype.drawCell = function (x, y, cell, blendMode) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.grid[y][x].drawCell(cell, blendMode);
        }
    };
    Console.prototype.setBlocked = function (x, y, blocked) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.grid[y][x].blocked = blocked;
        }
    };
    Console.prototype.setblockedSight = function (x, y, blockedSight) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.grid[y][x].blockedSight = blockedSight;
        }
    };
    Console.prototype.isVisible = function (x, y) {
        if (x < this.minX || x > this.maxX || y < this.minY || y > this.maxY) {
            return false;
        }
        return this.grid[y][x].visible;
    };
    /**
     * Compute the FOV in an octant adjacent to the Y axis
     */
    Console.prototype.computeOctantY = function (deltaX, deltaY) {
        var startSlopes = [];
        var endSlopes = [];
        var iteration = 1;
        var totalObstacles = 0;
        var obstaclesInLastLine = 0;
        var minSlope = 0;
        var x;
        var y;
        var halfSlope;
        var processedCell;
        var visible;
        var extended;
        var centreSlope;
        var startSlope;
        var endSlope;
        var previousEndSlope;
        for (y = this.originY + deltaY; y >= this.minY && y <= this.maxY; y += deltaY, obstaclesInLastLine = totalObstacles, ++iteration) {
            halfSlope = 0.5 / iteration;
            previousEndSlope = -1;
            for (processedCell = Math.floor(minSlope * iteration + 0.5),
                x = this.originX + (processedCell * deltaX); processedCell <= iteration && x >= this.minX && x <= this.maxX; x += deltaX, ++processedCell, previousEndSlope = endSlope) {
                visible = true;
                extended = false;
                centreSlope = processedCell / iteration;
                startSlope = previousEndSlope;
                endSlope = centreSlope + halfSlope;
                if (obstaclesInLastLine > 0) {
                    if (!(this.grid[y - deltaY][x].visible &&
                        !this.grid[y - deltaY][x].blockedSight) &&
                        !(this.grid[y - deltaY][x - deltaX].visible &&
                            !this.grid[y - deltaY][x - deltaX].blockedSight)) {
                        visible = false;
                    }
                    else {
                        for (var idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
                            if (startSlope <= endSlopes[idx] &&
                                endSlope >= startSlopes[idx]) {
                                if (!this.grid[y][x].blockedSight) {
                                    if (centreSlope > startSlopes[idx] &&
                                        centreSlope < endSlopes[idx]) {
                                        visible = false;
                                        break;
                                    }
                                }
                                else {
                                    if (startSlope >= startSlopes[idx] &&
                                        endSlope <= endSlopes[idx]) {
                                        visible = false;
                                        break;
                                    }
                                    else {
                                        startSlopes[idx] = Math.min(startSlopes[idx], startSlope);
                                        endSlopes[idx] = Math.max(endSlopes[idx], endSlope);
                                        extended = true;
                                    }
                                }
                            }
                        }
                    }
                }
                if (visible) {
                    this.grid[y][x].visible = true;
                    if (this.grid[y][x].blockedSight) {
                        if (minSlope >= startSlope) {
                            minSlope = endSlope;
                        }
                        else if (!extended) {
                            startSlopes[totalObstacles] = startSlope;
                            endSlopes[totalObstacles++] = endSlope;
                        }
                    }
                }
            }
        }
    };
    /**
     * Compute the FOV in an octant adjacent to the X axis
     */
    Console.prototype.computeOctantX = function (deltaX, deltaY) {
        var startSlopes = [];
        var endSlopes = [];
        var iteration = 1;
        var totalObstacles = 0;
        var obstaclesInLastLine = 0;
        var minSlope = 0;
        var x;
        var y;
        var halfSlope;
        var processedCell;
        var visible;
        var extended;
        var centreSlope;
        var startSlope;
        var endSlope;
        var previousEndSlope;
        for (x = this.originX + deltaX; x >= this.minX && x <= this.maxX; x += deltaX, obstaclesInLastLine = totalObstacles, ++iteration) {
            halfSlope = 0.5 / iteration;
            previousEndSlope = -1;
            for (processedCell = Math.floor(minSlope * iteration + 0.5),
                y = this.originY + (processedCell * deltaY); processedCell <= iteration && y >= this.minY && y <= this.maxY; y += deltaY, ++processedCell, previousEndSlope = endSlope) {
                visible = true;
                extended = false;
                centreSlope = processedCell / iteration;
                startSlope = previousEndSlope;
                endSlope = centreSlope + halfSlope;
                if (obstaclesInLastLine > 0) {
                    if (!(this.grid[y][x - deltaX].visible &&
                        !this.grid[y][x - deltaX].blockedSight) &&
                        !(this.grid[y - deltaY][x - deltaX].visible &&
                            !this.grid[y - deltaY][x - deltaX].blockedSight)) {
                        visible = false;
                    }
                    else {
                        for (var idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
                            if (startSlope <= endSlopes[idx] &&
                                endSlope >= startSlopes[idx]) {
                                if (!this.grid[y][x].blockedSight) {
                                    if (centreSlope > startSlopes[idx] &&
                                        centreSlope < endSlopes[idx]) {
                                        visible = false;
                                        break;
                                    }
                                }
                                else {
                                    if (startSlope >= startSlopes[idx] &&
                                        endSlope <= endSlopes[idx]) {
                                        visible = false;
                                        break;
                                    }
                                    else {
                                        startSlopes[idx] = Math.min(startSlopes[idx], startSlope);
                                        endSlopes[idx] = Math.max(endSlopes[idx], endSlope);
                                        extended = true;
                                    }
                                }
                            }
                        }
                    }
                }
                if (visible) {
                    this.grid[y][x].visible = true;
                    if (this.grid[y][x].blockedSight) {
                        if (minSlope >= startSlope) {
                            minSlope = endSlope;
                        }
                        else if (!extended) {
                            startSlopes[totalObstacles] = startSlope;
                            endSlopes[totalObstacles++] = endSlope;
                        }
                    }
                }
            }
        }
    };
    Console.prototype.computeFov = function (originX, originY, radius, opt_noClear, opt_octants) {
        this.originX = originX;
        this.originY = originY;
        this.radius = radius;
        if (opt_noClear) {
            this.minX = Math.min(this.minX, Math.max(0, originX - radius));
            this.minY = Math.min(this.minY, Math.max(0, originY - radius));
            this.maxX = Math.max(this.maxX, Math.min(this.width - 1, originX + radius));
            this.maxY = Math.max(this.maxY, Math.min(this.height - 1, originY + radius));
        }
        else {
            this.minX = Math.max(0, originX - radius);
            this.minY = Math.max(0, originY - radius);
            this.maxX = Math.min(this.width - 1, originX + radius);
            this.maxY = Math.min(this.height - 1, originY + radius);
            for (var y = this.minY; y <= this.maxY; y++) {
                for (var x = this.minX; x <= this.maxX; x++) {
                    this.grid[y][x].visible = false;
                }
            }
        }
        this.grid[originY][originX].visible = true;
        if (opt_octants === undefined) {
            this.computeOctantY(1, 1);
            this.computeOctantX(1, 1);
            this.computeOctantX(1, -1);
            this.computeOctantY(1, -1);
            this.computeOctantY(-1, -1);
            this.computeOctantX(-1, -1);
            this.computeOctantX(-1, 1);
            this.computeOctantY(-1, 1);
        }
        else {
            //   \ 4 | 3 /
            //    \  |  /
            //  5  \ | /  2
            //      \|/
            // ------+-------
            //      /|\
            //  6  / | \  1
            //    /  |  \
            //   / 7 | 0 \
            if (opt_octants & 0x001) {
                this.computeOctantY(1, 1);
            }
            if (opt_octants & 0x002) {
                this.computeOctantX(1, 1);
            }
            if (opt_octants & 0x004) {
                this.computeOctantX(1, -1);
            }
            if (opt_octants & 0x008) {
                this.computeOctantY(1, -1);
            }
            if (opt_octants & 0x010) {
                this.computeOctantY(-1, -1);
            }
            if (opt_octants & 0x020) {
                this.computeOctantX(-1, -1);
            }
            if (opt_octants & 0x040) {
                this.computeOctantX(-1, 1);
            }
            if (opt_octants & 0x080) {
                this.computeOctantY(-1, 1);
            }
        }
    };
    /**
     * All visible tiles are marked as explored.
     */
    Console.prototype.updateExplored = function () {
        for (var y = this.minY; y <= this.maxY; y++) {
            for (var x = this.minX; x <= this.maxX; x++) {
                var tile = this.grid[y][x];
                tile.explored = tile.explored || tile.visible;
            }
        }
    };
    return Console;
}());
exports.Console = Console;
