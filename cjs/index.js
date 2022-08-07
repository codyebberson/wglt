(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.wglt = {}));
})(this, (function (exports) { 'use strict';

    /**
     * The BlendMode enum defines how translucent cells are rendered.
     */
    exports.BlendMode = void 0;
    (function (BlendMode) {
        /**
         * No blending.  Alpha is ignored.
         */
        BlendMode[BlendMode["None"] = 0] = "None";
        /**
         * Alpha blending.
         *
         * dstRGB = (srcRGB * srcA) + (dstRGB * (1-srcA))
         *
         * dstA = srcA + (dstA * (1-srcA))
         */
        BlendMode[BlendMode["Blend"] = 1] = "Blend";
        /**
         * Additive blending.
         *
         * dstRGB = (srcRGB * srcA) + dstRGB
         *
         * dstA = dstA
         */
        BlendMode[BlendMode["Add"] = 2] = "Add";
    })(exports.BlendMode || (exports.BlendMode = {}));

    /**
     * Details about box characters.
     * The first element is the array of details for the first box char (0xB3).
     * Each sub array is the count of stems for top, right, bottom, and left.
     */
    const BOX_CHAR_DETAILS = [
        [1, 0, 1, 0],
        [1, 0, 1, 1],
        [1, 0, 1, 2],
        [2, 0, 2, 1],
        [0, 0, 2, 1],
        [0, 0, 1, 2],
        [2, 0, 2, 2],
        [2, 0, 2, 0],
        [0, 0, 2, 2],
        [2, 0, 0, 2],
        [2, 0, 0, 1],
        [1, 0, 0, 2],
        [0, 0, 1, 1],
        [1, 1, 0, 0],
        [1, 1, 0, 1],
        [0, 1, 1, 1],
        [1, 1, 1, 0],
        [0, 1, 0, 1],
        [1, 1, 1, 1],
        [1, 2, 1, 0],
        [2, 1, 2, 0],
        [2, 2, 0, 0],
        [0, 2, 2, 0],
        [2, 2, 0, 2],
        [0, 2, 2, 2],
        [2, 2, 2, 0],
        [0, 2, 0, 2],
        [2, 2, 2, 2],
        [1, 2, 0, 2],
        [2, 1, 0, 1],
        [0, 2, 1, 2],
        [0, 1, 2, 1],
        [2, 1, 0, 0],
        [1, 2, 0, 0],
        [0, 2, 1, 0],
        [0, 1, 2, 0],
        [2, 1, 2, 1],
        [1, 2, 1, 2],
        [1, 0, 0, 1],
        [0, 1, 1, 0], // 0xDA
    ];
    function isBoxCell(con, x, y) {
        const charCode = con.getCharCode(x, y);
        return charCode !== undefined && charCode >= 0xb3 && charCode <= 0xda;
    }
    function getBoxCount(con, x, y, index) {
        if (x < 0 || y < 0 || x >= con.width || y >= con.height) {
            return 0;
        }
        const charCode = con.getCharCode(x, y);
        if (charCode === undefined || charCode < 0xb3 || charCode > 0xda) {
            return 0;
        }
        return BOX_CHAR_DETAILS[charCode - 0xb3][index];
    }
    function getBoxCell(up, right, down, left) {
        for (let i = 0; i < BOX_CHAR_DETAILS.length; i++) {
            const row = BOX_CHAR_DETAILS[i];
            if (row[0] === up && row[1] === right && row[2] === down && row[3] === left) {
                return 0xb3 + i;
            }
        }
        return 0;
    }
    function fixBoxCells(con) {
        for (let y = 0; y < con.height; y++) {
            for (let x = 0; x < con.width; x++) {
                if (isBoxCell(con, x, y)) {
                    let up = getBoxCount(con, x, y - 1, 2);
                    let right = getBoxCount(con, x + 1, y, 3);
                    let down = getBoxCount(con, x, y + 1, 0);
                    let left = getBoxCount(con, x - 1, y, 1);
                    // There are no single-direction stubs.
                    // If we need one, then we create a full vertical or horizontal pipe.
                    if (up > 0 && right === 0 && down === 0 && left === 0) {
                        down = up;
                    }
                    else if (up === 0 && right > 0 && down === 0 && left === 0) {
                        left = right;
                    }
                    else if (up === 0 && right === 0 && down > 0 && left === 0) {
                        up = down;
                    }
                    else if (up === 0 && right === 0 && down === 0 && left > 0) {
                        right = left;
                    }
                    // Vertical and horizontal axis must have same width.
                    if (left > 0 && right > 0) {
                        left = right = Math.max(left, right);
                    }
                    if (up > 0 && down > 0) {
                        up = down = Math.max(up, down);
                    }
                    const charCode = getBoxCell(up, right, down, left);
                    if ((up || right || down || left) && !(charCode >= 0xb3 && charCode <= 0xda)) {
                        throw new Error('invalid char code! (up=' + up + ', right=' + right + ', down=' + down + ', left=' + left + ')');
                    }
                    con.drawChar(x, y, charCode);
                }
            }
        }
    }

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    /**
     * Creates a big-endian 32-bit RGBA color from red, green, and blue components.
     * @param r Red (0-255).
     * @param g Green (0-255).
     * @param b Blue (0-255).
     * @param a Optional alpha (0-255).
     * @return A 32-bit unsigned integer color.
     */
    function fromRgb(r, g, b, a) {
        if (a === undefined) {
            a = 255;
        }
        return (r << 24) + (g << 16) + (b << 8) + a;
    }
    /**
     * Converts a color from HSV format to RGBA format.
     *
     * Based on: https://stackoverflow.com/a/17243070/2051724
     *
     * @param h Hue (0.0 - 1.0).
     * @param s Saturation (0.0 - 1.0).
     * @param v Value (0.0 - 1.0).
     * @param a Optional alpha (0.0 - 1.0).
     * @return A 32-bit unsigned integer color.
     */
    function fromHsv(h, s, v, a) {
        const i = (h * 6) | 0;
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        let r, g, b;
        switch (i % 6) {
            case 0:
                (r = v), (g = t), (b = p);
                break;
            case 1:
                (r = q), (g = v), (b = p);
                break;
            case 2:
                (r = p), (g = v), (b = t);
                break;
            case 3:
                (r = p), (g = q), (b = v);
                break;
            case 4:
                (r = t), (g = p), (b = v);
                break;
            case 5:
                (r = v), (g = p), (b = q);
                break;
            default:
                r = 0;
                g = 0;
                b = 0;
        }
        if (a === undefined) {
            a = 1.0;
        }
        return fromRgb((r * 255) | 0, (g * 255) | 0, (b * 255) | 0, (a * 255) | 0);
    }

    /**
     * Orignal CGA palette.
     * See: https://en.wikipedia.org/wiki/Color_Graphics_Adapter
     * See: https://lospec.com/palette-list/color-graphics-adapter
     */
    const Colors = {
        BLACK: fromRgb(0, 0, 0),
        WHITE: fromRgb(0xff, 0xff, 0xff),
        LIGHT_GRAY: fromRgb(0xaa, 0xaa, 0xaa),
        DARK_GRAY: fromRgb(0x55, 0x55, 0x55),
        YELLOW: fromRgb(0xff, 0xff, 0x55),
        BROWN: fromRgb(0xaa, 0x55, 0x00),
        LIGHT_RED: fromRgb(0xff, 0x55, 0x55),
        DARK_RED: fromRgb(0xaa, 0x00, 0x00),
        LIGHT_GREEN: fromRgb(0x55, 0xff, 0x55),
        DARK_GREEN: fromRgb(0x00, 0xaa, 0x00),
        LIGHT_CYAN: fromRgb(0x55, 0xff, 0xff),
        DARK_CYAN: fromRgb(0x00, 0xaa, 0xaa),
        LIGHT_BLUE: fromRgb(0x55, 0x55, 0xff),
        DARK_BLUE: fromRgb(0x00, 0x00, 0xaa),
        LIGHT_MAGENTA: fromRgb(0xff, 0x55, 0xff),
        DARK_MAGENTA: fromRgb(0xaa, 0x00, 0xaa),
        ORANGE: fromRgb(0xff, 0x88, 0x00),
    };

    const classDefinitions = new Map();
    /**
     * Decorates a class to make serializable.
     * Any class with the @serializable decorator will be serialized and deserialized.
     * @param value The TypeScript class to mark as serializable.
     */
    function serializable(value) {
        classDefinitions.set(value.name, value);
    }
    /**
     * Serializes a value to JSON.
     * Handles circular references and class instances.
     * @param obj The root object to serialize.
     * @returns A string representation of the object graph.
     */
    function serialize(obj) {
        const instances = [];
        const instancesMap = new WeakMap();
        const root = replace(obj);
        return JSON.stringify({ instances, root });
        function replace(input) {
            if (Array.isArray(input)) {
                return replaceArray(input);
            }
            else if (input && typeof input === 'object') {
                return replaceObject(input);
            }
            else {
                return input;
            }
        }
        function replaceArray(input) {
            const result = [];
            for (let i = 0; i < input.length; i++) {
                result[i] = replace(input[i]);
            }
            return result;
        }
        function replaceObject(input) {
            if (input && input.constructor.name && input.constructor.name !== 'Object') {
                if (!classDefinitions.has(input.constructor.name)) {
                    throw new Error(`Class ${input.constructor.name} is not serializable.`);
                }
                if (instancesMap.has(input)) {
                    return { $ref: instancesMap.get(input) };
                }
                const $ref = instances.length;
                instances.push({ $type: input.constructor.name });
                instancesMap.set(input, $ref);
                instances[$ref] = Object.assign(Object.assign({}, replaceObjectProperties(input)), { $type: input.constructor.name });
                return { $ref };
            }
            return replaceObjectProperties(input);
        }
        function replaceObjectProperties(input) {
            const result = {};
            for (const key of Object.keys(input)) {
                result[key] = replace(input[key]);
            }
            return result;
        }
    }
    /**
     * Deserializes a JSON string to an object graph.
     * Handles circular references and class instances.
     * @param str The JSON string to deserialize.
     * @returns The deserialized object graph.
     */
    function deserialize(str) {
        const input = JSON.parse(str);
        const instances = input.instances;
        // First, replace all objects with class instances
        for (let i = 0; i < instances.length; i++) {
            const instance = instances[i];
            const classDefinition = classDefinitions.get(instance.$type);
            delete instance.$type;
            instances[i] = Object.create(classDefinition.prototype, Object.getOwnPropertyDescriptors(instance));
        }
        // Second, replace all references in the list of class instances
        for (let i = 0; i < instances.length; i++) {
            replaceObjectProperties(instances[i]);
        }
        // Finally, replace all references in the root object graph
        return replace(input.root);
        function replace(input) {
            if (Array.isArray(input)) {
                return replaceArray(input);
            }
            else if (input && typeof input === 'object') {
                return replaceObject(input);
            }
            else {
                return input;
            }
        }
        function replaceArray(input) {
            for (let i = 0; i < input.length; i++) {
                input[i] = replace(input[i]);
            }
            return input;
        }
        function replaceObject(input) {
            if (isRef(input)) {
                return instances[input.$ref];
            }
            replaceObjectProperties(input);
            return input;
        }
        function replaceObjectProperties(input) {
            for (const [key, value] of Object.entries(input)) {
                input[key] = replace(value);
            }
        }
    }
    function isRef(value) {
        return !!(value && typeof value === 'object' && '$ref' in value);
    }

    function convertCharCode(charCode) {
        if (typeof charCode === 'string' && charCode.length > 0) {
            return charCode.charCodeAt(0);
        }
        else {
            return charCode;
        }
    }
    exports.Cell = class Cell {
        constructor(x, y, charCode, fg, bg) {
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
                this.fg = Colors.WHITE;
            }
            if (bg !== undefined) {
                this.bg = bg;
            }
            else {
                this.bg = Colors.BLACK;
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
        setCharCode(charCode) {
            if (this.charCode !== charCode) {
                this.charCode = charCode;
                this.dirty = true;
            }
        }
        setForeground(fg) {
            if (fg !== undefined && fg !== null && fg !== this.fg) {
                this.fg = fg;
                this.dirty = true;
            }
        }
        setBackground(bg) {
            if (bg !== undefined && bg !== null && bg !== this.bg) {
                this.bg = bg;
                this.dirty = true;
            }
        }
        setValue(charCode, fg, bg) {
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
            }
            else {
                this.drawCell(charCode, exports.BlendMode.None);
            }
            return this.dirty;
        }
        drawCell(otherCell, blendMode) {
            const alpha = otherCell.bg & 0xff;
            if (blendMode === exports.BlendMode.None || otherCell.charCode > 0) {
                this.setCharCode(otherCell.charCode);
                this.setForeground(otherCell.fg);
            }
            else if (alpha > 0 && alpha < 255) {
                this.setForeground(this.blendColors(this.fg, otherCell.bg, blendMode));
            }
            if (blendMode === exports.BlendMode.None || alpha === 255) {
                this.setBackground(otherCell.bg);
            }
            else if (alpha > 0) {
                this.setBackground(this.blendColors(this.bg, otherCell.bg, blendMode));
            }
        }
        blendColors(c1, c2, blendMode) {
            const alpha = c2 & 0xff;
            const w1 = (255 - alpha) / 255.0;
            const w2 = 1.0 - w1;
            const r1 = (c1 >> 24) & 0xff;
            const g1 = (c1 >> 16) & 0xff;
            const b1 = (c1 >> 8) & 0xff;
            const r2 = (c2 >> 24) & 0xff;
            const g2 = (c2 >> 16) & 0xff;
            const b2 = (c2 >> 8) & 0xff;
            switch (blendMode) {
                case exports.BlendMode.Blend:
                    return fromRgb((w1 * r1 + w2 * r2) | 0, (w1 * g1 + w2 * g2) | 0, (w1 * b1 + w2 * b2) | 0);
                case exports.BlendMode.Add:
                    return fromRgb(this.clamp((r1 + w2 * r2) | 0), this.clamp((g1 + w2 * g2) | 0), this.clamp((b1 + w2 * b2) | 0));
                default:
                    return c2;
            }
        }
        clamp(x) {
            return Math.min(255, x);
        }
    };
    exports.Cell = __decorate([
        serializable
    ], exports.Cell);

    // https://en.wikipedia.org/wiki/Code_page_437
    // https://en.wikipedia.org/wiki/Block_Elements
    // https://en.wikipedia.org/wiki/Box-drawing_character
    exports.Chars = void 0;
    (function (Chars) {
        Chars[Chars["SMILEY"] = 1] = "SMILEY";
        Chars[Chars["INVERSE_SMILEY"] = 2] = "INVERSE_SMILEY";
        Chars[Chars["HEART"] = 3] = "HEART";
        Chars[Chars["DIAMOND"] = 4] = "DIAMOND";
        Chars[Chars["CLUB"] = 5] = "CLUB";
        Chars[Chars["SPADE"] = 6] = "SPADE";
        Chars[Chars["BULLET"] = 7] = "BULLET";
        Chars[Chars["INVERSE_BULLET"] = 8] = "INVERSE_BULLET";
        Chars[Chars["LIGHT_SHADE"] = 176] = "LIGHT_SHADE";
        Chars[Chars["MEDIUM_SHADE"] = 177] = "MEDIUM_SHADE";
        Chars[Chars["DARK_SHADE"] = 178] = "DARK_SHADE";
        Chars[Chars["BOX_SINGLE_VERTICAL"] = 179] = "BOX_SINGLE_VERTICAL";
        Chars[Chars["BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT"] = 180] = "BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT";
        Chars[Chars["BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT"] = 185] = "BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT";
        Chars[Chars["BOX_DOUBLE_VERTICAL"] = 186] = "BOX_DOUBLE_VERTICAL";
        Chars[Chars["BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT"] = 187] = "BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT";
        Chars[Chars["BOX_DOUBLE_UP_AND_DOUBLE_LEFT"] = 188] = "BOX_DOUBLE_UP_AND_DOUBLE_LEFT";
        Chars[Chars["BOX_SINGLE_DOWN_AND_SINGLE_LEFT"] = 191] = "BOX_SINGLE_DOWN_AND_SINGLE_LEFT";
        Chars[Chars["BOX_SINGLE_UP_AND_SINGLE_RIGHT"] = 192] = "BOX_SINGLE_UP_AND_SINGLE_RIGHT";
        Chars[Chars["BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP"] = 193] = "BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP";
        Chars[Chars["BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN"] = 194] = "BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN";
        Chars[Chars["BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT"] = 195] = "BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT";
        Chars[Chars["BOX_SINGLE_HORIZONTAL"] = 196] = "BOX_SINGLE_HORIZONTAL";
        Chars[Chars["BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL"] = 197] = "BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL";
        Chars[Chars["BOX_DOUBLE_UP_AND_DOUBLE_RIGHT"] = 200] = "BOX_DOUBLE_UP_AND_DOUBLE_RIGHT";
        Chars[Chars["BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT"] = 201] = "BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT";
        Chars[Chars["BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP"] = 202] = "BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP";
        Chars[Chars["BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN"] = 203] = "BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN";
        Chars[Chars["BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT"] = 204] = "BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT";
        Chars[Chars["BOX_DOUBLE_HORIZONTAL"] = 205] = "BOX_DOUBLE_HORIZONTAL";
        Chars[Chars["BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL"] = 206] = "BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL";
        Chars[Chars["BOX_SINGLE_UP_AND_SINGLE_LEFT"] = 217] = "BOX_SINGLE_UP_AND_SINGLE_LEFT";
        Chars[Chars["BOX_SINGLE_DOWN_AND_SINGLE_RIGHT"] = 218] = "BOX_SINGLE_DOWN_AND_SINGLE_RIGHT";
        Chars[Chars["BLOCK_FULL"] = 219] = "BLOCK_FULL";
        Chars[Chars["BLOCK_BOTTOM_HALF"] = 220] = "BLOCK_BOTTOM_HALF";
        Chars[Chars["BLOCK_LEFT_HALF"] = 221] = "BLOCK_LEFT_HALF";
        Chars[Chars["BLOCK_RIGHT_HALF"] = 222] = "BLOCK_RIGHT_HALF";
        Chars[Chars["BLOCK_TOP_HALF"] = 223] = "BLOCK_TOP_HALF";
    })(exports.Chars || (exports.Chars = {}));

    /**
     * Returns the input string wrapped to the maximum line length.
     * @param str The original input string.
     * @param maxLength The maximum length of a single line.
     * @returns Array of word wrapped lines.
     */
    function wordWrap(str, maxLength) {
        const regex = new RegExp('(\\S(.{0,' + maxLength + '}\\S)?)\\s+', 'g');
        return (str + ' ')
            .replace(regex, '$1\n')
            .trim()
            .split('\n')
            .map((line) => line.trim());
    }
    /**
     * Capitalizes the first letter of the input string.
     * @param str The original input string.
     * @returns The capitalized string.
     */
    function capitalize(str) {
        if (!str) {
            return str;
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    exports.Console = class Console {
        constructor(width, height, blockedFunc) {
            this.width = width;
            this.height = height;
            this.grid = [];
            this.originX = 0;
            this.originY = 0;
            this.minX = 0;
            this.maxX = 0;
            this.minY = 0;
            this.maxY = 0;
            this.radius = 0;
            for (let y = 0; y < height; y++) {
                const row = [];
                for (let x = 0; x < width; x++) {
                    row.push(new exports.Cell(x, y));
                }
                this.grid.push(row);
            }
            this.clear();
            if (blockedFunc) {
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        this.grid[y][x].blocked = this.grid[y][x].blockedSight = blockedFunc(x, y);
                    }
                }
            }
        }
        clear() {
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    this.drawChar(x, y, 0);
                }
            }
        }
        getCell(x, y) {
            if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
                return undefined;
            }
            return this.grid[y][x];
        }
        getCharCode(x, y) {
            if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
                return undefined;
            }
            return this.grid[y][x].charCode;
        }
        drawChar(x, y, c, fg, bg) {
            if (this.clip && !this.clip.contains({ x, y })) {
                return;
            }
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.grid[y | 0][x | 0].setValue(c, fg, bg);
            }
        }
        drawString(x, y, str, fg, bg) {
            const lines = str.split('\n');
            for (let i = 0; i < lines.length; i++) {
                this.drawStringLine(x, y + i, lines[i], fg, bg);
            }
        }
        drawStringLine(x, y, line, fg, bg) {
            for (let j = 0; j < line.length; j++) {
                this.drawChar(x + j, y, line.charCodeAt(j), fg, bg);
            }
        }
        drawCenteredString(x, y, str, fg, bg) {
            this.drawString(x - Math.floor(str.length / 2), y, str, fg, bg);
        }
        drawMessage(x, y, message, maxWidth) {
            if (message.text) {
                const lines = wordWrap(message.text, maxWidth || this.width - x);
                for (const line of lines) {
                    this.drawStringLine(x, y, line, message.fg, message.bg);
                    y++;
                }
            }
            if (message.children) {
                for (const child of message.children) {
                    y = this.drawMessage(x, y, child, maxWidth);
                }
            }
            return y;
        }
        drawHLine(x, y, width, c, fg, bg) {
            for (let xi = x; xi < x + width; xi++) {
                this.drawChar(xi, y, c, fg, bg);
            }
        }
        drawVLine(x, y, height, c, fg, bg) {
            for (let yi = y; yi < y + height; yi++) {
                this.drawChar(x, yi, c, fg, bg);
            }
        }
        drawRect(x, y, width, height, c, fg, bg) {
            this.drawHLine(x, y, width, c, fg, bg);
            this.drawHLine(x, y + height - 1, width, c, fg, bg);
            this.drawVLine(x, y, height, c, fg, bg);
            this.drawVLine(x + width - 1, y, height, c, fg, bg);
        }
        drawBox(x, y, width, height, topChar, rightChar, bottomChar, leftChar, topLeftChar, topRightChar, bottomRightChar, bottomLeftChar, fg, bg) {
            this.drawHLine(x, y, width, topChar, fg, bg);
            this.drawHLine(x, y + height - 1, width, bottomChar, fg, bg);
            this.drawVLine(x, y, height, leftChar, fg, bg);
            this.drawVLine(x + width - 1, y, height, rightChar, fg, bg);
            this.drawChar(x, y, topLeftChar, fg, bg);
            this.drawChar(x + width - 1, y, topRightChar, fg, bg);
            this.drawChar(x, y + height - 1, bottomLeftChar, fg, bg);
            this.drawChar(x + width - 1, y + height - 1, bottomRightChar, fg, bg);
        }
        drawSingleBox(x, y, width, height, fg, bg) {
            this.drawBox(x, y, width, height, exports.Chars.BOX_SINGLE_HORIZONTAL, exports.Chars.BOX_SINGLE_VERTICAL, exports.Chars.BOX_SINGLE_HORIZONTAL, exports.Chars.BOX_SINGLE_VERTICAL, exports.Chars.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT, exports.Chars.BOX_SINGLE_DOWN_AND_SINGLE_LEFT, exports.Chars.BOX_SINGLE_UP_AND_SINGLE_LEFT, exports.Chars.BOX_SINGLE_UP_AND_SINGLE_RIGHT, fg, bg);
        }
        drawDoubleBox(x, y, width, height, fg, bg) {
            this.drawBox(x, y, width, height, exports.Chars.BOX_DOUBLE_HORIZONTAL, exports.Chars.BOX_DOUBLE_VERTICAL, exports.Chars.BOX_DOUBLE_HORIZONTAL, exports.Chars.BOX_DOUBLE_VERTICAL, exports.Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT, exports.Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT, exports.Chars.BOX_DOUBLE_UP_AND_DOUBLE_LEFT, exports.Chars.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT, fg, bg);
        }
        fillRect(x, y, width, height, c, fg, bg) {
            for (let yi = y; yi < y + height; yi++) {
                this.drawHLine(x, yi, width, c, fg, bg);
            }
        }
        drawConsole(dstX, dstY, srcConsole, srcX, srcY, srcWidth, srcHeight, blendMode) {
            blendMode = blendMode || exports.BlendMode.None;
            for (let y = 0; y < srcHeight; y++) {
                for (let x = 0; x < srcWidth; x++) {
                    const cell = srcConsole.getCell(srcX + x, srcY + y);
                    if (cell) {
                        this.drawCell(dstX + x, dstY + y, cell, blendMode);
                    }
                }
            }
        }
        drawCell(x, y, cell, blendMode) {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.grid[y][x].drawCell(cell, blendMode);
            }
        }
        setBlocked(x, y, blocked) {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.grid[y][x].blocked = blocked;
            }
        }
        setBlockedSight(x, y, blockedSight) {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.grid[y][x].blockedSight = blockedSight;
            }
        }
        isVisible(x, y) {
            if (x < this.minX || x > this.maxX || y < this.minY || y > this.maxY) {
                return false;
            }
            return this.grid[y][x].visible;
        }
        isBlocked(x, y) {
            if (x < 0 || x > this.width || y < 0 || y > this.height) {
                return true;
            }
            return this.grid[y][x].blocked;
        }
        isBlockedSight(x, y) {
            if (x < 0 || x > this.width || y < 0 || y > this.height) {
                return true;
            }
            return this.grid[y][x].blockedSight;
        }
        /**
         * Compute the FOV in an octant adjacent to the Y axis
         */
        computeOctantY(deltaX, deltaY) {
            const startSlopes = [];
            const endSlopes = [];
            let iteration = 1;
            let totalObstacles = 0;
            let obstaclesInLastLine = 0;
            let minSlope = 0;
            let x;
            let y;
            let halfSlope;
            let processedCell;
            let visible;
            let extended;
            let centreSlope;
            let startSlope;
            let endSlope;
            let previousEndSlope;
            for (y = this.originY + deltaY; y >= this.minY && y <= this.maxY; y += deltaY, obstaclesInLastLine = totalObstacles, ++iteration) {
                halfSlope = 0.5 / iteration;
                previousEndSlope = -1;
                for (processedCell = Math.floor(minSlope * iteration + 0.5), x = this.originX + processedCell * deltaX; processedCell <= iteration && x >= this.minX && x <= this.maxX; x += deltaX, ++processedCell, previousEndSlope = endSlope) {
                    visible = true;
                    extended = false;
                    centreSlope = processedCell / iteration;
                    startSlope = previousEndSlope;
                    endSlope = centreSlope + halfSlope;
                    if (obstaclesInLastLine > 0) {
                        if (!(this.grid[y - deltaY][x].visible && !this.grid[y - deltaY][x].blockedSight) &&
                            !(this.grid[y - deltaY][x - deltaX].visible && !this.grid[y - deltaY][x - deltaX].blockedSight)) {
                            visible = false;
                        }
                        else {
                            for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
                                if (startSlope <= endSlopes[idx] && endSlope >= startSlopes[idx]) {
                                    if (!this.grid[y][x].blockedSight) {
                                        if (centreSlope > startSlopes[idx] && centreSlope < endSlopes[idx]) {
                                            visible = false;
                                            break;
                                        }
                                    }
                                    else {
                                        if (startSlope >= startSlopes[idx] && endSlope <= endSlopes[idx]) {
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
        }
        /**
         * Compute the FOV in an octant adjacent to the X axis
         */
        computeOctantX(deltaX, deltaY) {
            const startSlopes = [];
            const endSlopes = [];
            let iteration = 1;
            let totalObstacles = 0;
            let obstaclesInLastLine = 0;
            let minSlope = 0;
            let x;
            let y;
            let halfSlope;
            let processedCell;
            let visible;
            let extended;
            let centreSlope;
            let startSlope;
            let endSlope;
            let previousEndSlope;
            for (x = this.originX + deltaX; x >= this.minX && x <= this.maxX; x += deltaX, obstaclesInLastLine = totalObstacles, ++iteration) {
                halfSlope = 0.5 / iteration;
                previousEndSlope = -1;
                for (processedCell = Math.floor(minSlope * iteration + 0.5), y = this.originY + processedCell * deltaY; processedCell <= iteration && y >= this.minY && y <= this.maxY; y += deltaY, ++processedCell, previousEndSlope = endSlope) {
                    visible = true;
                    extended = false;
                    centreSlope = processedCell / iteration;
                    startSlope = previousEndSlope;
                    endSlope = centreSlope + halfSlope;
                    if (obstaclesInLastLine > 0) {
                        if (!(this.grid[y][x - deltaX].visible && !this.grid[y][x - deltaX].blockedSight) &&
                            !(this.grid[y - deltaY][x - deltaX].visible && !this.grid[y - deltaY][x - deltaX].blockedSight)) {
                            visible = false;
                        }
                        else {
                            for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
                                if (startSlope <= endSlopes[idx] && endSlope >= startSlopes[idx]) {
                                    if (!this.grid[y][x].blockedSight) {
                                        if (centreSlope > startSlopes[idx] && centreSlope < endSlopes[idx]) {
                                            visible = false;
                                            break;
                                        }
                                    }
                                    else {
                                        if (startSlope >= startSlopes[idx] && endSlope <= endSlopes[idx]) {
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
        }
        computeFov(originX, originY, radius, opt_noClear, opt_octants) {
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
                for (let y = this.minY; y <= this.maxY; y++) {
                    for (let x = this.minX; x <= this.maxX; x++) {
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
        }
        /**
         * All visible tiles are marked as explored.
         */
        updateExplored() {
            for (let y = this.minY; y <= this.maxY; y++) {
                for (let x = this.minX; x <= this.maxX; x++) {
                    const tile = this.grid[y][x];
                    tile.explored = tile.explored || tile.visible;
                }
            }
        }
    };
    exports.Console = __decorate([
        serializable
    ], exports.Console);

    class Font {
        constructor(url, charWidth, charHeight, scale) {
            this.url = url;
            this.charWidth = charWidth;
            this.charHeight = charHeight;
            this.scale = scale || 1.0;
        }
    }
    /**
     * Font image as data URL.
     * IBM terminal font.
     * See img/font.png.
     */
    const FONT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQ' +
        'MAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAEhklEQVRIx42Sv4oUQRDGC4UzadSwwMUD8' +
        'QEKlbWD4Q58B/NGpTVocKO1wXHUzMAH0AcwMTYVGg5ag0IzEXaRjdZEZKNzkKbHqtnzHypY' +
        '09M9+5uvqr7pbYCuC6ftaRhgONXs30eAh0O1rYDm4IS/eH0B8GxRW2vxo396yu/fb0ZFrW1' +
        'zcOXlPU/XPwK8PGjbWhVwM4KnH61912oK4+zmmHJaQotyt1kvtC2Atdo24iohPDiG/v4eIC' +
        'JsY3Wy8Yvr0DSIBOdxgH6v8wsriWhc8s0AtaK/GzSl1jR0nSjQnwki6FQxNFKjgzO2a7BBq' +
        'ucH7dL4M9z96CIhT1Fs/AgKgcA6dKCxI29DaHNwRJ4EGAU1sU0OG9rmE4SIc3A4FChACqqh' +
        'JRwpxkqh9wxag4DSmEJ5DtpFwAP4GUf6lmKcFFti1BYuQp4xN8kxM2kNhjdkTOiTUeAKGvh' +
        'A1rLpMbYACQzCITlTDRMbLYoEa2JWPSMRFZIupcSzMVKcEUkX+sOG+ChNX2vD8ex6k7OFHL' +
        '0P1655JuPd53WAD+yTv3UrCQiuHmYBbfIxpkImuvpBQBkVb5g4XHv3JkNireG8AO9zDhBZu' +
        '2z2OMZ11S5/RIlyMefMNaZ4GsCz5xcjyM6hHYEjAYEfO8Ig1rklAe9sRIeYAdwyoIBq6YIz' +
        'CAKiWoifA3m3o2AzWcdYKOdY47EIf8QABCuYgIUVmdVMEYEDA0Hmo/3D6KKJbh5mxhP3UsW' +
        'IE97wnEygyizOfOLi2JOJW8CeOblW9IHeKZgv4zxuzDryOmb+4aQH+MXV6e0ywdUcxqCjBW' +
        'l5GpbzZduOG1QEiGXP86T7EfiJfkMQ4OO4H0yqyNC2zlziWEN7Ywuc2fQ4p5BNkS5QYXP2h' +
        '5NtRJh0vCKQidtVJmCGAwDSSQpYggSxiRIyzewsgCh4xxiTPDMh5aj//l7btqkr6rQyIOtL' +
        'ji4lVRQwXdzvus40Y53M33fh50GZwF4ExQeMlvuTggLzSi4ElKczUO7zVtpwdyMKdqZKOWb' +
        '2nDblawPxPmuMwFEWBW+jlZR1eYtS442kiBGMWCi/h1/+GAR6NYOJWiqNJXFygFtrkx5C0O' +
        '3IeFGs67HhEEhmBu/BUOT+0551pXxYIF+Elpi5AKRkLl5GUbCCZddyMv621ujEBPP4vSy2f' +
        'otTx3U+d3WBiFOA6VSGSB49v/M7GBX9FPrDaT2c9qr4PCpwZ7qz813R94dVFIe19v33GlMZ' +
        'UghQFb8BrfE7QBmgBMbrn2B3enn/y3B5+DL8UBAdnejdYdBxeV9ejwoYNTgW0Ok/gA7UG2G' +
        'AzanhL0DG7q4svynwF8UwDPu7u/vD0IudzSltMtVbP+J/gUbR29oJ7Fg9s6Uy+DnpiTCOYc' +
        '4cXOeXMWfsusSw7FOg9x655nax6BlecwpOQQ68WBwp+H2LMQTuOq2RUigzh2Q/R3CWARJIJ' +
        'G199EwOTyKBlQMznshCRGeQ5gHABAQl6M4gLEdAzVaBWMCiANdsayDCHBA/hagKYfielrJI' +
        'lipKKQIA9Nf3wBloTHT6BuAx15zRNa1nAAAAAElFTkSuQmCC';
    const DEFAULT_FONT = new Font(FONT_IMAGE, 8, 8);

    /**
     * The FovOctants constants provide bitmasks for various directions.
     *
     *     \ 4 | 3 /
     *      \  |  /
     *    5  \ | /  2
     *        \|/
     *   ------+-------
     *        /|\
     *    6  / | \  1
     *      /  |  \
     *     / 7 | 0 \
     *
     */
    exports.FovOctants = void 0;
    (function (FovOctants) {
        FovOctants[FovOctants["OCTANT_SOUTH_SOUTHEAST"] = 1] = "OCTANT_SOUTH_SOUTHEAST";
        FovOctants[FovOctants["OCTANT_EAST_SOUTHEAST"] = 2] = "OCTANT_EAST_SOUTHEAST";
        FovOctants[FovOctants["OCTANT_EAST_NORTHTHEAST"] = 4] = "OCTANT_EAST_NORTHTHEAST";
        FovOctants[FovOctants["OCTANT_NORTH_NORTHEAST"] = 8] = "OCTANT_NORTH_NORTHEAST";
        FovOctants[FovOctants["OCTANT_NORTH_NORTHWEST"] = 16] = "OCTANT_NORTH_NORTHWEST";
        FovOctants[FovOctants["OCTANT_WEST_NORTHEAST"] = 32] = "OCTANT_WEST_NORTHEAST";
        FovOctants[FovOctants["OCTANT_WEST_SOUTHWEST"] = 64] = "OCTANT_WEST_SOUTHWEST";
        FovOctants[FovOctants["OCTANT_SOUTH_SOUTHWEST"] = 128] = "OCTANT_SOUTH_SOUTHWEST";
    })(exports.FovOctants || (exports.FovOctants = {}));
    exports.FovQuadrants = void 0;
    (function (FovQuadrants) {
        FovQuadrants[FovQuadrants["QUADRANT_SOUTHEAST"] = 3] = "QUADRANT_SOUTHEAST";
        FovQuadrants[FovQuadrants["QUADRANT_EAST"] = 6] = "QUADRANT_EAST";
        FovQuadrants[FovQuadrants["QUADRANT_NORTHEAST"] = 12] = "QUADRANT_NORTHEAST";
        FovQuadrants[FovQuadrants["QUADRANT_NORTH"] = 24] = "QUADRANT_NORTH";
        FovQuadrants[FovQuadrants["QUADRANT_NORTHWEST"] = 48] = "QUADRANT_NORTHWEST";
        FovQuadrants[FovQuadrants["QUADRANT_WEST"] = 96] = "QUADRANT_WEST";
        FovQuadrants[FovQuadrants["QUADRANT_SOUTHWEST"] = 192] = "QUADRANT_SOUTHWEST";
        FovQuadrants[FovQuadrants["QUADRANT_SOUTH"] = 129] = "QUADRANT_SOUTH";
    })(exports.FovQuadrants || (exports.FovQuadrants = {}));
    function getFovQuadrant(dx, dy) {
        if (dx > 0) {
            if (dy > 0) {
                return exports.FovQuadrants.QUADRANT_SOUTHEAST;
            }
            else if (dy === 0) {
                return exports.FovQuadrants.QUADRANT_EAST;
            }
            else {
                return exports.FovQuadrants.QUADRANT_NORTHEAST;
            }
        }
        else if (dx < 0) {
            if (dy > 0) {
                return exports.FovQuadrants.QUADRANT_SOUTHWEST;
            }
            else if (dy === 0) {
                return exports.FovQuadrants.QUADRANT_WEST;
            }
            else {
                return exports.FovQuadrants.QUADRANT_NORTHWEST;
            }
        }
        else {
            if (dy > 0) {
                return exports.FovQuadrants.QUADRANT_SOUTH;
            }
            else {
                return exports.FovQuadrants.QUADRANT_NORTH;
            }
        }
    }

    exports.Point = class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    };
    exports.Point = __decorate([
        serializable
    ], exports.Point);

    exports.Rect = class Rect {
        constructor(x, y, width, height) {
            this.x = this.left = x;
            this.y = this.top = y;
            this.width = width;
            this.height = height;
            this.x2 = x + width;
            this.y2 = y + height;
        }
        getCenter() {
            return new exports.Point((this.x + this.width / 2) | 0, (this.y + this.height / 2) | 0);
        }
        intersects(other) {
            return this.x <= other.x2 && this.x2 >= other.x && this.y <= other.y2 && this.y2 >= other.y;
        }
        contains(point) {
            return point.x >= this.x && point.x < this.x2 && point.y >= this.y && point.y < this.y2;
        }
    };
    exports.Rect = __decorate([
        serializable
    ], exports.Rect);

    class DialogState {
        constructor(dialog, rect, contentsOffset) {
            this.dialog = dialog;
            this.rect = rect;
            this.contentsOffset = contentsOffset;
            this.open = false;
            this.count = 0;
        }
    }

    class DefaultDialogRenderer {
        getState(terminal, dialog) {
            const width = dialog.contentsRect.width + 4;
            const height = dialog.contentsRect.height + 4;
            const x = ((terminal.width - width) / 2) | 0;
            const y = ((terminal.height - height) / 2) | 0;
            return new DialogState(dialog, new exports.Rect(x, y, width, height), new exports.Point(x + 2, y + 2));
        }
        draw(term, dialogState) {
            const dialog = dialogState.dialog;
            const { x, y, width, height } = dialogState.rect;
            term.fillRect(x, y, width, height, 0, Colors.WHITE, Colors.BLACK);
            term.drawSingleBox(x, y, width, height);
            term.drawCenteredString((x + width / 2) | 0, y, ' ' + dialog.title + ' ');
            dialog.drawContents(term, dialogState.contentsOffset);
        }
    }

    class GUI {
        constructor(terminal, renderer) {
            this.terminal = terminal;
            this.renderer = renderer || new DefaultDialogRenderer();
            this.dialogs = [];
        }
        add(dialog) {
            this.dialogs.push(this.renderer.getState(this.terminal, dialog));
        }
        /**
         * Handles input for currently active dialog.
         * Returns true if the input was handled.
         * Returns false otherwise.
         */
        handleInput() {
            if (this.dialogs.length === 0) {
                return false;
            }
            const activeIndex = this.dialogs.length - 1;
            const activeState = this.dialogs[this.dialogs.length - 1];
            const activeDialog = activeState.dialog;
            if (activeDialog.handleInput(this.terminal, activeState.contentsOffset)) {
                this.dialogs.splice(activeIndex, 1);
            }
            return true;
        }
        draw() {
            for (let i = 0; i < this.dialogs.length; i++) {
                this.renderer.draw(this.terminal, this.dialogs[i]);
            }
        }
    }

    class Dialog {
        constructor(contentsRect, title) {
            this.contentsRect = contentsRect;
            this.title = title;
        }
    }

    exports.Message = class Message {
        constructor(text, fg, bg, children) {
            this.text = text;
            this.fg = fg;
            this.bg = bg;
            this.children = children;
        }
        getWidth() {
            let width = 0;
            if (this.text) {
                for (const line of this.text.split('\n')) {
                    width = Math.max(width, line.length);
                }
            }
            if (this.children) {
                for (const child of this.children) {
                    width = Math.max(width, child.getWidth());
                }
            }
            return width;
        }
        getHeight() {
            let result = 0;
            if (this.text) {
                result += this.text.split('\n').length;
            }
            if (this.children) {
                for (const child of this.children) {
                    result += child.getHeight();
                }
            }
            return result;
        }
    };
    exports.Message = __decorate([
        serializable
    ], exports.Message);

    /**
     * The delay in frames before input repeating.
     * Time in milliseconds.
     */
    const INPUT_REPEAT_DELAY = 200.0;
    /**
     * The delay between subsequent repeat firing.
     * Time in milliseconds.
     */
    const INPUT_REPEAT_RATE = 1000.0 / 15.0;
    /**
     * The Input class represents a pysical input.
     * Example: keyboard key or mouse button.
     */
    class Input {
        constructor() {
            this.down = false;
            this.downTime = 0;
            this.repeat = false;
            this.repeatTime = 0;
            this.downCount = 0;
            this.upCount = 100;
        }
        setDown(down) {
            if (this.down !== down) {
                this.down = down;
                this.repeat = false;
                this.downTime = this.repeatTime = performance.now();
            }
        }
        update(time) {
            this.repeat = false;
            if (this.down) {
                this.downCount++;
                this.upCount = 0;
                if (time - this.downTime >= INPUT_REPEAT_DELAY && time - this.repeatTime >= INPUT_REPEAT_RATE) {
                    this.repeat = true;
                    this.repeatTime = time;
                }
            }
            else {
                this.downCount = 0;
                this.upCount++;
            }
        }
        /**
         * Returns true if the input is "pressed".
         * Pressed is a one time event when the input first goes down.
         * It then repeats on repeat delay.
         */
        isPressed() {
            return this.downCount === 1 || this.repeat;
        }
        /**
         * Returns true if the input is "clicked".
         * Clicked is a one time event when the input first goes up.
         */
        isClicked() {
            return this.upCount === 1;
        }
    }
    class InputSet {
        constructor() {
            this.inputs = new Map();
        }
        clear() {
            this.inputs.clear();
        }
        get(key) {
            let input = this.inputs.get(key);
            if (!input) {
                input = new Input();
                this.inputs.set(key, input);
            }
            return input;
        }
        updateAll(time) {
            this.inputs.forEach((input) => input.update(time));
        }
    }

    class Keyboard {
        /**
         * Creates a new keyboard module.
         *
         * @param el DOM el to attach listeners.
         */
        constructor(el) {
            this.keys = new InputSet();
            el.addEventListener('keydown', (e) => this.setKey(e, true));
            el.addEventListener('keyup', (e) => this.setKey(e, false));
        }
        clear() {
            this.keys.clear();
        }
        getKey(key) {
            return this.keys.get(key);
        }
        setKey(e, state) {
            const key = e.code;
            if (key === exports.Key.VK_F11) {
                // Allow fullscreen requests to go through
                return;
            }
            e.stopPropagation();
            e.preventDefault();
            this.keys.get(key).setDown(state);
        }
        updateKeys(time) {
            this.keys.updateAll(time);
        }
    }
    exports.Key = void 0;
    (function (Key) {
        Key["VK_CANCEL"] = "Pause";
        Key["VK_BACKSPACE"] = "Backspace";
        Key["VK_TAB"] = "Tab";
        Key["VK_ENTER"] = "Enter";
        Key["VK_SHIFT_LEFT"] = "ShiftLeft";
        Key["VK_SHIFT_RIGHT"] = "ShiftLeft";
        Key["VK_CONTROL_LEFT"] = "ControlLeft";
        Key["VK_CONTROL_RIGHT"] = "ControlRight";
        Key["VK_ALT_LEFT"] = "AltLeft";
        Key["VK_ALT_RIGHT"] = "AltRight";
        Key["VK_PAUSE"] = "Pause";
        Key["VK_CAPS_LOCK"] = "CapsLock";
        Key["VK_ESCAPE"] = "Escape";
        Key["VK_SPACE"] = "Space";
        Key["VK_PAGE_UP"] = "PageUp";
        Key["VK_PAGE_DOWN"] = "PageDown";
        Key["VK_END"] = "End";
        Key["VK_HOME"] = "Home";
        Key["VK_LEFT"] = "ArrowLeft";
        Key["VK_UP"] = "ArrowUp";
        Key["VK_RIGHT"] = "ArrowRight";
        Key["VK_DOWN"] = "ArrowDown";
        Key["VK_INSERT"] = "Insert";
        Key["VK_DELETE"] = "Delete";
        Key["VK_0"] = "Digit0";
        Key["VK_1"] = "Digit1";
        Key["VK_2"] = "Digit2";
        Key["VK_3"] = "Digit3";
        Key["VK_4"] = "Digit4";
        Key["VK_5"] = "Digit5";
        Key["VK_6"] = "Digit6";
        Key["VK_7"] = "Digit7";
        Key["VK_8"] = "Digit8";
        Key["VK_9"] = "Digit9";
        Key["VK_SEMICOLON"] = "Semicolon";
        Key["VK_EQUALS"] = "Equal";
        Key["VK_A"] = "KeyA";
        Key["VK_B"] = "KeyB";
        Key["VK_C"] = "KeyC";
        Key["VK_D"] = "KeyD";
        Key["VK_E"] = "KeyE";
        Key["VK_F"] = "KeyF";
        Key["VK_G"] = "KeyG";
        Key["VK_H"] = "KeyH";
        Key["VK_I"] = "KeyI";
        Key["VK_J"] = "KeyJ";
        Key["VK_K"] = "KeyK";
        Key["VK_L"] = "KeyL";
        Key["VK_M"] = "KeyM";
        Key["VK_N"] = "KeyN";
        Key["VK_O"] = "KeyO";
        Key["VK_P"] = "KeyP";
        Key["VK_Q"] = "KeyQ";
        Key["VK_R"] = "KeyR";
        Key["VK_S"] = "KeyS";
        Key["VK_T"] = "KeyT";
        Key["VK_U"] = "KeyU";
        Key["VK_V"] = "KeyV";
        Key["VK_W"] = "KeyW";
        Key["VK_X"] = "KeyX";
        Key["VK_Y"] = "KeyY";
        Key["VK_Z"] = "KeyZ";
        Key["VK_CONTEXT_MENU"] = "ContextMenu";
        Key["VK_NUMPAD0"] = "Numpad0";
        Key["VK_NUMPAD1"] = "Numpad1";
        Key["VK_NUMPAD2"] = "Numpad2";
        Key["VK_NUMPAD3"] = "Numpad3";
        Key["VK_NUMPAD4"] = "Numpad4";
        Key["VK_NUMPAD5"] = "Numpad5";
        Key["VK_NUMPAD6"] = "Numpad6";
        Key["VK_NUMPAD7"] = "Numpad7";
        Key["VK_NUMPAD8"] = "Numpad8";
        Key["VK_NUMPAD9"] = "Numpad9";
        Key["VK_NUMPAD_ENTER"] = "NumpadEnter";
        Key["VK_MULTIPLY"] = "NumpadMultiply";
        Key["VK_ADD"] = "NumpadAdd";
        Key["VK_SEPARATOR"] = "NumpadDecimal";
        Key["VK_SUBTRACT"] = "NumpadSubtract";
        Key["VK_DECIMAL"] = "NumpadDecimal";
        Key["VK_DIVIDE"] = "NumpadDivide";
        Key["VK_F1"] = "F1";
        Key["VK_F2"] = "F2";
        Key["VK_F3"] = "F3";
        Key["VK_F4"] = "F4";
        Key["VK_F5"] = "F5";
        Key["VK_F6"] = "F6";
        Key["VK_F7"] = "F7";
        Key["VK_F8"] = "F8";
        Key["VK_F9"] = "F9";
        Key["VK_F10"] = "F10";
        Key["VK_F11"] = "F11";
        Key["VK_F12"] = "F12";
        Key["VK_F13"] = "F13";
        Key["VK_F14"] = "F14";
        Key["VK_F15"] = "F15";
        Key["VK_F16"] = "F16";
        Key["VK_F17"] = "F17";
        Key["VK_F18"] = "F18";
        Key["VK_F19"] = "F19";
        Key["VK_F20"] = "F20";
        Key["VK_F21"] = "F21";
        Key["VK_F22"] = "F22";
        Key["VK_F23"] = "F23";
        Key["VK_F24"] = "F24";
        Key["VK_NUM_LOCK"] = "NumLock";
        Key["VK_SCROLL_LOCK"] = "ScrollLock";
        Key["VK_COMMA"] = "Comma";
        Key["VK_PERIOD"] = "Period";
        Key["VK_SLASH"] = "Slash";
        Key["VK_BACKQUOTE"] = "Backquote";
        Key["VK_OPEN_BRACKET"] = "BracketLeft";
        Key["VK_BACK_SLASH"] = "Backslash";
        Key["VK_CLOSE_BRACKET"] = "BracketRight";
        Key["VK_QUOTE"] = "Quote";
        Key["VK_META"] = "OSLeft";
    })(exports.Key || (exports.Key = {}));

    class MessageDialog extends Dialog {
        constructor(title, message) {
            let rect;
            if (message instanceof exports.Message) {
                rect = new exports.Rect(0, 0, message.getWidth(), message.getHeight());
            }
            else {
                rect = new exports.Rect(0, 0, message.length, 1);
            }
            super(rect, title);
            this.message = message;
        }
        drawContents(console, offset) {
            if (this.message instanceof exports.Message) {
                console.drawMessage(offset.x, offset.y, this.message);
            }
            else {
                console.drawString(offset.x, offset.y, this.message);
            }
        }
        handleInput(terminal) {
            return terminal.isKeyPressed(exports.Key.VK_ESCAPE);
        }
    }

    class ScrollableMessageDialog extends Dialog {
        constructor(rect, title, message) {
            super(rect, title);
            this.message = message;
            this.scrollY = 0;
            this.messagesHeight = message.getHeight();
            this.scrollMax = Math.max(1, this.messagesHeight - this.contentsRect.height);
            this.scrollbarHeight = (this.contentsRect.height * this.contentsRect.height) / (this.messagesHeight + 1);
        }
        drawContents(console, offset) {
            console.clip = this.contentsRect;
            console.drawMessage(offset.x, offset.y - this.scrollY, this.message);
            console.clip = undefined;
            // Draw scrollbar
            const scrollbarY = (this.scrollY / this.scrollMax) * (this.contentsRect.height - this.scrollbarHeight);
            console.drawVLine(this.contentsRect.x + this.contentsRect.width + 1, this.contentsRect.y + scrollbarY, this.scrollbarHeight, exports.Chars.MEDIUM_SHADE);
        }
        handleInput(terminal) {
            const moveKey = terminal.getMovementKey();
            if (moveKey) {
                this.scrollY += moveKey.y;
            }
            if (terminal.isKeyPressed(exports.Key.VK_PAGE_DOWN)) {
                this.scrollY += this.contentsRect.height;
            }
            if (terminal.isKeyPressed(exports.Key.VK_PAGE_UP)) {
                this.scrollY -= this.contentsRect.height;
            }
            if (terminal.mouse.wheelDeltaY !== 0) {
                this.scrollY += terminal.mouse.wheelDeltaY < 0 ? -5 : 5;
                terminal.mouse.wheelDeltaY = 0;
            }
            this.scrollY = Math.max(0, Math.min(this.scrollMax, this.scrollY));
            return terminal.isKeyPressed(exports.Key.VK_ESCAPE);
        }
    }

    class SelectDialog extends Dialog {
        constructor(title, options, callback) {
            let width = title.length;
            for (let i = 0; i < options.length; i++) {
                width = Math.max(width, options[i].length + 4);
            }
            const height = options.length;
            const rect = new exports.Rect(0, 0, width, height);
            super(rect, title);
            this.options = options;
            this.callback = callback;
            this.hoverIndex = -1;
        }
        drawContents(console, offset) {
            for (let i = 0; i < this.options.length; i++) {
                const str = String.fromCharCode(65 + i) + ' - ' + this.options[i];
                if (i === this.hoverIndex) {
                    console.drawString(offset.x, offset.y + i, str, Colors.BLACK, Colors.WHITE);
                }
                else {
                    console.drawString(offset.x, offset.y + i, str, Colors.WHITE, Colors.BLACK);
                }
            }
        }
        handleInput(terminal, offset) {
            const moveKey = terminal.getMovementKey();
            if (moveKey && moveKey.y !== 0) {
                this.hoverIndex = (this.hoverIndex + this.options.length + moveKey.y) % this.options.length;
            }
            if (this.hoverIndex >= 0 && (terminal.isKeyPressed(exports.Key.VK_ENTER) || terminal.isKeyPressed(exports.Key.VK_NUMPAD_ENTER))) {
                this.callback(this.hoverIndex);
                return true;
            }
            if (terminal.mouse.x >= offset.x &&
                terminal.mouse.x < offset.x + this.contentsRect.width &&
                terminal.mouse.y >= offset.y &&
                terminal.mouse.y < offset.y + this.contentsRect.height) {
                this.hoverIndex = terminal.mouse.y - offset.y;
                if (terminal.mouse.buttons.get(0).isClicked()) {
                    terminal.mouse.buttons.clear();
                    this.callback(this.hoverIndex);
                    return true;
                }
            }
            const startCharCode = 'A'.charCodeAt(0);
            for (let i = 0; i < this.options.length; i++) {
                if (terminal.isKeyPressed(('Key' + String.fromCharCode(startCharCode + i)))) {
                    this.callback(i);
                    return true;
                }
            }
            return terminal.isKeyPressed(exports.Key.VK_ESCAPE);
        }
        isMouseOverOption(terminal, offset, index) {
            return (terminal.mouse.x >= offset.x &&
                terminal.mouse.x < offset.x + this.contentsRect.width &&
                terminal.mouse.y === offset.y + index);
        }
    }

    /**
     * All available 2x2 patterns for 2x image loading.
     * Note: The strict IBM CGA font only has halves, not quadrants.
     */
    const PATTERNS = [
        { charCode: exports.Chars.BLOCK_TOP_HALF, active: [1, 1, 0, 0] },
        { charCode: exports.Chars.BLOCK_RIGHT_HALF, active: [0, 1, 0, 1] },
    ];
    function loadImage(url, callback) {
        const img = new Image();
        img.onload = () => {
            const w = img.width;
            const h = img.height;
            const data = getImageData(img);
            const result = new exports.Console(w, h);
            let i = 0;
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const cell = result.getCell(x, y);
                    cell.setBackground(fromRgb(data[i++], data[i++], data[i++], data[i++]));
                }
            }
            callback(result);
        };
        img.src = url;
    }
    function loadImage2x(url, callback) {
        const img = new Image();
        img.onload = () => {
            const w = img.width;
            const h = img.height;
            const data = getImageData(img);
            const result = new exports.Console(w / 2, h / 2);
            for (let y = 0; y < h; y += 2) {
                for (let x = 0; x < w; x += 2) {
                    draw2x2(result, data, x, y, w);
                }
            }
            callback(result);
        };
        img.src = url;
    }
    function getImageData(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, img.width, img.height).data;
    }
    function draw2x2(con, data, x, y, w) {
        // Top left
        const i1 = 4 * (y * w + x);
        const r1 = data[i1];
        const g1 = data[i1 + 1];
        const b1 = data[i1 + 2];
        // Top right
        const i2 = 4 * (y * w + x + 1);
        const r2 = data[i2];
        const g2 = data[i2 + 1];
        const b2 = data[i2 + 2];
        // Bottom left
        const i3 = 4 * ((y + 1) * w + x);
        const r3 = data[i3];
        const g3 = data[i3 + 1];
        const b3 = data[i3 + 2];
        // Bottom right
        const i4 = 4 * ((y + 1) * w + x + 1);
        const r4 = data[i4];
        const g4 = data[i4 + 1];
        const b4 = data[i4 + 2];
        const colors = [
            [r1, g1, b1],
            [r2, g2, b2],
            [r3, g3, b3],
            [r4, g4, b4],
        ];
        // For each possible pattern, calculate the total error
        // Find the pattern with minum error
        let minError = Number.MAX_VALUE;
        let bestCharCode = 0;
        let bestBg = null;
        let bestFg = null;
        for (let i = 0; i < PATTERNS.length; i++) {
            const pattern = PATTERNS[i];
            const patternColors = computeColors(pattern.active, colors);
            if (patternColors.error < minError) {
                minError = patternColors.error;
                bestCharCode = pattern.charCode;
                bestBg = patternColors.bg;
                bestFg = patternColors.fg;
            }
        }
        con.drawChar(x / 2, y / 2, bestCharCode, arrayToColor(bestFg), arrayToColor(bestBg));
    }
    function computeColors(pattern, colors) {
        const sum = [
            [0, 0, 0],
            [0, 0, 0],
        ];
        const avg = [
            [0, 0, 0],
            [0, 0, 0],
        ];
        const count = [0, 0];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                sum[pattern[i]][j] += colors[i][j];
            }
            count[pattern[i]]++;
        }
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                avg[i][j] = sum[i][j] / count[i];
            }
        }
        let error = 0.0;
        for (let i = 0; i < 4; i++) {
            let cellError = 0.0;
            for (let j = 0; j < 3; j++) {
                const delta = colors[i][j] - avg[pattern[i]][j];
                cellError += delta * delta;
            }
            error += Math.sqrt(cellError);
        }
        return { bg: avg[0], fg: avg[1], error };
    }
    function arrayToColor(rgb) {
        return fromRgb(rgb[0], rgb[1], rgb[2]);
    }

    class Mouse {
        constructor(terminal) {
            this.buttons = new InputSet();
            this.el = terminal.canvas;
            this.width = terminal.width;
            this.height = terminal.height;
            this.prevX = 0;
            this.prevY = 0;
            this.x = 0;
            this.y = 0;
            this.dx = 0;
            this.dy = 0;
            this.wheelDeltaX = 0;
            this.wheelDeltaY = 0;
            const el = this.el;
            el.addEventListener('mousedown', (e) => this.handleEvent(e));
            el.addEventListener('mouseup', (e) => this.handleEvent(e));
            el.addEventListener('mousemove', (e) => this.handleEvent(e));
            el.addEventListener('contextmenu', (e) => this.handleEvent(e));
            el.addEventListener('touchstart', (e) => this.handleTouchEvent(e));
            el.addEventListener('touchend', (e) => this.handleTouchEvent(e));
            el.addEventListener('touchcancel', (e) => this.handleTouchEvent(e));
            el.addEventListener('touchmove', (e) => this.handleTouchEvent(e));
            el.addEventListener('wheel', (e) => this.handleWheelEvent(e));
        }
        handleTouchEvent(e) {
            e.stopPropagation();
            e.preventDefault();
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.updatePosition(touch.clientX, touch.clientY);
                this.buttons.get(0).setDown(true);
            }
            else {
                this.buttons.get(0).setDown(false);
            }
        }
        handleEvent(e) {
            e.stopPropagation();
            e.preventDefault();
            this.updatePosition(e.clientX, e.clientY);
            if (e.type === 'mousedown') {
                this.buttons.get(e.button).setDown(true);
                this.el.focus();
            }
            if (e.type === 'mouseup') {
                this.buttons.get(e.button).setDown(false);
            }
        }
        handleWheelEvent(e) {
            e.stopPropagation();
            e.preventDefault();
            this.wheelDeltaX = e.deltaX;
            this.wheelDeltaY = e.deltaY;
        }
        updatePosition(clientX, clientY) {
            let rect = this.el.getBoundingClientRect();
            // If the client rect is not the same aspect ratio as canvas,
            // then we are fullscreen.
            // Need to update client rect accordingly.
            const terminalAspectRatio = this.width / this.height;
            const rectAspectRatio = rect.width / rect.height;
            if (rectAspectRatio - terminalAspectRatio > 0.01) {
                const actualWidth = terminalAspectRatio * rect.height;
                const excess = rect.width - actualWidth;
                rect = new exports.Rect(Math.floor(excess / 2), 0, actualWidth, rect.height);
            }
            if (rectAspectRatio - terminalAspectRatio < -0.01) {
                const actualHeight = rect.width / terminalAspectRatio;
                const excess = rect.height - actualHeight;
                rect = new exports.Rect(0, Math.floor(excess / 2), rect.width, actualHeight);
            }
            this.x = ((this.width * (clientX - rect.left)) / rect.width) | 0;
            this.y = ((this.height * (clientY - rect.top)) / rect.height) | 0;
        }
        update(time) {
            this.dx = this.x - this.prevX;
            this.dy = this.y - this.prevY;
            this.prevX = this.x;
            this.prevY = this.y;
            this.buttons.updateAll(time);
        }
    }

    /**
     * Commodore 64 palette.
     * See: https://www.c64-wiki.com/wiki/Color
     * See: https://lospec.com/palette-list/commodore64
     */
    const Commodore64Palette = {
        BLACK: fromRgb(0, 0, 0),
        WHITE: fromRgb(255, 255, 255),
        RED: fromRgb(136, 0, 0),
        CYAN: fromRgb(170, 255, 238),
        VIOLET: fromRgb(204, 68, 204),
        GREEN: fromRgb(0, 204, 85),
        BLUE: fromRgb(0, 0, 170),
        YELLOW: fromRgb(238, 238, 119),
        ORANGE: fromRgb(221, 136, 85),
        BROWN: fromRgb(102, 68, 0),
        LIGHT_RED: fromRgb(255, 119, 119),
        DARK_GRAY: fromRgb(51, 51, 51),
        GRAY: fromRgb(119, 119, 119),
        LIGHT_GREEN: fromRgb(170, 255, 102),
        LIGHT_BLUE: fromRgb(0, 136, 255),
        LIGHT_GRAY: fromRgb(187, 187, 187),
    };

    /**
     * Colodore palette.
     * Recalculated palette for the VIC II (Commodore 64) by Pepto.
     * See: https://www.pepto.de/projects/colorvic/
     * See: https://lospec.com/palette-list/colodore
     */
    const ColodorePalette = {
        BLACK: fromRgb(0, 0, 0),
        WHITE: fromRgb(255, 255, 255),
        RED: fromRgb(136, 0, 0),
        CYAN: fromRgb(170, 255, 238),
        VIOLET: fromRgb(204, 68, 204),
        GREEN: fromRgb(0, 204, 85),
        BLUE: fromRgb(0, 0, 170),
        YELLOW: fromRgb(238, 238, 119),
        ORANGE: fromRgb(221, 136, 85),
        BROWN: fromRgb(102, 68, 0),
        LIGHT_RED: fromRgb(255, 119, 119),
        DARK_GRAY: fromRgb(51, 51, 51),
        GRAY: fromRgb(119, 119, 119),
        LIGHT_GREEN: fromRgb(170, 255, 102),
        LIGHT_BLUE: fromRgb(0, 136, 255),
        LIGHT_GRAY: fromRgb(187, 187, 187),
    };

    /**
     * PICO 8 palette.
     * See: https://pico-8.fandom.com/wiki/Palette
     * See: https://lospec.com/palette-list/pico-8
     */
    const Pico8Palette = {
        BLACK: fromRgb(0, 0, 0),
        DARK_BLUE: fromRgb(29, 43, 83),
        DARK_PURPLE: fromRgb(126, 37, 83),
        DARK_GREEN: fromRgb(0, 135, 81),
        BROWN: fromRgb(171, 82, 54),
        DARK_GRAY: fromRgb(95, 87, 79),
        LIGHT_GRAY: fromRgb(194, 195, 199),
        WHITE: fromRgb(255, 241, 232),
        RED: fromRgb(255, 0, 77),
        ORANGE: fromRgb(255, 163, 0),
        YELLOW: fromRgb(255, 236, 39),
        GREEN: fromRgb(0, 228, 54),
        BLUE: fromRgb(41, 173, 255),
        LAVENDER: fromRgb(131, 118, 156),
        PINK: fromRgb(255, 119, 168),
        LIGHT_PEACH: fromRgb(255, 204, 170),
    };

    const dxs = [-1, 0, 1, -1, 1, -1, 0, 1];
    const dys = [-1, -1, -1, 0, 0, 1, 1, 1];
    const costs = [1.4, 1, 1.4, 1, 1, 1.4, 1, 1.4];
    let pathId = 0;
    /**
     * Calculates path between two points using Dijkstra's algorithm.
     *
     * @param source Starting point, must have x and y properties.
     * @param dest Destination point, must have x and y properties.
     * @param maxDist Maximum distance to examine.
     * @return Array of steps if destination found; undefined otherwise.
     */
    function computePath(map, source, dest, maxDist) {
        pathId++;
        const sourceCell = map.grid[source.y][source.x];
        sourceCell.pathId = pathId;
        sourceCell.g = 0.0;
        sourceCell.h = Math.hypot(source.x - dest.x, source.y - dest.y);
        sourceCell.prev = null;
        const q = new SortedSet([sourceCell]);
        while (q.size() > 0) {
            const u = q.pop();
            if (u.x === dest.x && u.y === dest.y) {
                return buildPath(u);
            }
            for (let i = 0; i < dxs.length; i++) {
                const x = u.x + dxs[i];
                const y = u.y + dys[i];
                if (x >= 0 && x < map.width && y >= 0 && y < map.height) {
                    const v = map.grid[y][x];
                    if (v.blocked && v.explored && (x !== dest.x || y !== dest.y)) {
                        continue;
                    }
                    if (v.pathId !== pathId) {
                        v.pathId = pathId;
                        v.g = Infinity;
                        v.h = Math.hypot(x - dest.x, y - dest.y);
                        v.prev = null;
                    }
                    const alt = u.g + costs[i];
                    if (alt < v.g && alt <= maxDist) {
                        v.g = alt;
                        v.prev = u;
                        q.insert(v);
                    }
                }
            }
        }
        return undefined;
    }
    function buildPath(cell) {
        const result = [];
        let curr = cell;
        while (curr) {
            result.push(curr);
            curr = curr.prev;
        }
        result.reverse();
        return result;
    }
    class SortedSet {
        constructor(initialValues) {
            this.values = initialValues;
        }
        insert(cell) {
            const array = this.values;
            let low = 0;
            let high = array.length;
            let index = 0;
            while (low < high) {
                const mid = (low + high) >>> 1;
                const midCell = array[mid];
                if (midCell.g + midCell.h > cell.g + cell.h) {
                    low = mid + 1;
                    index = low;
                }
                else {
                    high = mid;
                    index = high;
                }
            }
            array.splice(index, 0, cell);
        }
        pop() {
            return this.values.pop();
        }
        size() {
            return this.values.length;
        }
    }

    /**
     * Random number generator.
     *
     * LCG
     * https://stackoverflow.com/a/424445/2051724
     */
    exports.RNG = class RNG {
        /**
         * Creates a new random number generator.
         *
         * @param seed The integer seed.
         */
        constructor(seed) {
            // LCG using GCC's constants
            this.m = 0x80000000; // 2**31;
            this.a = 1103515245;
            this.c = 12345;
            this.state = seed || 1;
        }
        nextInt() {
            this.state = (this.a * this.state + this.c) % this.m;
            return this.state;
        }
        /**
         * Returns a floating point number between 0.0 and 1.0.
         */
        nextFloat() {
            // returns in range [0,1]
            return this.nextInt() / (this.m - 1);
        }
        /**
         * Returns an integer in the range start (inclusive) to end (exclusive).
         * @param start Lower bound, inclusive.
         * @param end Upper bound, exclusive.
         */
        nextRange(start, end) {
            // returns in range [start, end): including start, excluding end
            // can't modulu nextInt because of weak randomness in lower bits
            const rangeSize = end - start;
            const randomUnder1 = this.nextInt() / this.m;
            const result = start + ((randomUnder1 * rangeSize) | 0);
            if (isNaN(result)) {
                throw new Error('rand nan');
            }
            return result;
        }
        chooseIndex(chances) {
            const total = chances.reduce((a, b) => a + b);
            const roll = this.nextRange(1, total + 1);
            let runningTotal = 0;
            for (let i = 0; i < chances.length; i++) {
                runningTotal += chances[i];
                if (roll <= runningTotal) {
                    return i;
                }
            }
            return chances.length - 1;
        }
        chooseKey(chancesMap) {
            const values = Object.keys(chancesMap);
            const chances = values.map((value) => chancesMap[value]);
            return values[this.chooseIndex(chances)];
        }
    };
    exports.RNG = __decorate([
        serializable
    ], exports.RNG);

    /**
     * Vertex shader program.
     *
     * a = attribute vec2 aVertexPosition;
     * b = attribute vec2 aTextureCoord;
     * c = attribute vec3 aFgColor;
     * d = attribute vec3 aBgColor;
     * e = varying vec2 vTextureCoord;
     * f = varying vec4 vFgColor;
     * g = varying vec4 vBgColor;
     */
    const VERTEX_SHADER_SOURCE = '#version 300 es\n' +
        'precision highp float;' +
        'in vec2 a;' +
        'in vec2 b;' +
        'in vec3 c;' +
        'in vec3 d;' +
        'out vec2 e;' +
        'out vec4 f;' +
        'out vec4 g;' +
        'void main(void){' +
        'gl_Position=vec4(a.x,a.y,0,1);' +
        'e=b/16.0;' +
        'f=vec4(c.r,c.g,c.b,1);' +
        'g=vec4(d.r,d.g,d.b,1);' +
        '}';
    /**
     * Fragment shader program.
     *
     * e = varying vec2 vTextureCoord;
     * f = varying vec4 vFgColor;
     * g = varying vec4 vBgColor;
     * s = uniform sampler2D uSampler;
     * o = out vec4 oColor;
     */
    const FRAGMENT_SHADER_SOURCE = '#version 300 es\n' +
        'precision highp float;' +
        'in vec2 e;' +
        'in vec4 f;' +
        'in vec4 g;' +
        'uniform sampler2D s;' +
        'out vec4 o;' +
        'void main(void){' +
        'o=texture(s,e);' +
        // Using ASCII characters
        'if(o.r<0.1) {' +
        // Black background, so use bgColor
        'o=g;' +
        '} else {' +
        // White background, so use fgColor
        'o=f;' +
        '}' +
        '}';
    const CRT_VERTEX_SHADER_SOURCE = `#version 300 es
precision highp float;
in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;
void main(void) {
  gl_Position=vec4(a_position.x, a_position.y, 0.0, 1.0);
  v_texCoord = a_texCoord;
}`;
    const CRT_FRAGMENT_SHADER_SOURCE = `#version 300 es
#define PI 3.1415926535897932384626433832795
precision highp float;
in vec2 v_texCoord;
uniform sampler2D u_texture;
uniform float u_blur;
uniform float u_curvature;
uniform float u_chroma;
uniform float u_scanlineWidth;
uniform float u_scanlineIntensity;
uniform float u_vignette;
out vec4 outputColor;

vec2 curve(vec2 uv) {
  uv = (uv - 0.5) * 2.0;
  uv *= 1.1;
  uv.x *= 1.0 + pow((abs(uv.y) * u_curvature), 2.0);
  uv.y *= 1.0 + pow((abs(uv.x) * u_curvature), 2.0);
  uv /= 1.1;
  uv = (uv / 2.0) + 0.5;
  return uv;
}

void main() {
  vec2 iResolution = vec2(640.0, 360.0);
  vec2 q = v_texCoord;
  vec2 fragCoord = v_texCoord;
  vec2 uv = q;
  uv = curve(uv);

  // Outside of range is black
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    outputColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  vec4 col;

  // Chromatic aberration
  // col = texture(u_texture, uv.xy);
  col.r = 0.7 * texture(u_texture, vec2(uv.x + 0.001 * u_chroma, uv.y + 0.001 * u_chroma)).r;
  col.g = 0.7 * texture(u_texture, vec2(uv.x + 0.000 * u_chroma, uv.y - 0.002 * u_chroma)).g;
  col.b = 0.7 * texture(u_texture, vec2(uv.x - 0.002 * u_chroma, uv.y + 0.000 * u_chroma)).b;
  
  // Blur
  col += 0.05 * texture(u_texture, vec2(uv.x - 2.0 * u_blur / iResolution.x, uv.y));
  col += 0.10 * texture(u_texture, vec2(uv.x - 1.0 * u_blur / iResolution.x, uv.y));
  col += 0.10 * texture(u_texture, vec2(uv.x + 1.0 * u_blur / iResolution.x, uv.y));
  col += 0.05 * texture(u_texture, vec2(uv.x + 2.0 * u_blur / iResolution.x, uv.y));

  // Vignette
  col *= pow(16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), u_vignette);

  // Scanlines
  col *= clamp(1.0 + u_scanlineWidth * sin(uv.y * iResolution.y * 2.0 * PI), 1.0 - u_scanlineIntensity, 1.0);

  outputColor = vec4(col.rgb, 1.0);
}`;

    /**
     * Linearly interpolates a number in the range 0-max to -1.0-1.0.
     *
     * @param i The value between 0 and max.
     * @param max The maximum value.
     * @returns The interpolated value between -1.0 and 1.0.
     */
    function interpolate(i, max) {
        return -1.0 + 2.0 * (i / max);
    }
    const DEFAULT_OPTIONS = {
        font: DEFAULT_FONT,
    };
    class Terminal extends exports.Console {
        constructor(canvas, width, height, options) {
            var _a;
            super(width, height);
            options = options || DEFAULT_OPTIONS;
            this.canvas = canvas;
            this.font = options.font || DEFAULT_FONT;
            this.crt = options.crt;
            this.pixelWidth = width * this.font.charWidth;
            this.pixelHeight = height * this.font.charHeight;
            this.pixelScale = ((_a = options === null || options === void 0 ? void 0 : options.crt) === null || _a === void 0 ? void 0 : _a.scale) || 1.0;
            canvas.width = this.pixelWidth * this.pixelScale;
            canvas.height = this.pixelHeight * this.pixelScale;
            canvas.style.imageRendering = 'pixelated';
            canvas.style.outline = 'none';
            canvas.tabIndex = 0;
            this.handleResize();
            window.addEventListener('resize', () => this.handleResize());
            this.keys = new Keyboard(canvas);
            this.mouse = new Mouse(this);
            // Get the WebGL context from the canvas
            const gl = canvas.getContext('webgl2', { antialias: false });
            if (!gl) {
                throw new Error('Unable to initialize WebGL. Your browser may not support it.');
            }
            const program = gl.createProgram();
            if (!program) {
                throw new Error('Unable to initialize WebGL. Your browser may not support it.');
            }
            this.gl = gl;
            this.program = program;
            gl.attachShader(program, this.buildShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE));
            gl.attachShader(program, this.buildShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE));
            gl.linkProgram(program);
            gl.useProgram(program);
            this.crtProgram = gl.createProgram();
            gl.attachShader(this.crtProgram, this.buildShader(gl.VERTEX_SHADER, CRT_VERTEX_SHADER_SOURCE));
            gl.attachShader(this.crtProgram, this.buildShader(gl.FRAGMENT_SHADER, CRT_FRAGMENT_SHADER_SOURCE));
            gl.linkProgram(this.crtProgram);
            gl.useProgram(this.crtProgram);
            this.crtBlurLocation = gl.getUniformLocation(this.crtProgram, 'u_blur');
            this.crtCurvatureLocation = gl.getUniformLocation(this.crtProgram, 'u_curvature');
            this.crtChromaLocation = gl.getUniformLocation(this.crtProgram, 'u_chroma');
            this.crtScanlineWidthLocation = gl.getUniformLocation(this.crtProgram, 'u_scanlineWidth');
            this.crtScanlineIntensityLocation = gl.getUniformLocation(this.crtProgram, 'u_scanlineIntensity');
            this.crtVignetteLocation = gl.getUniformLocation(this.crtProgram, 'u_vignette');
            this.crtPositionLocation = gl.getAttribLocation(this.crtProgram, 'a_position');
            this.crtPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.crtPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.crtPositionLocation);
            gl.vertexAttribPointer(this.crtPositionLocation, 2, gl.FLOAT, false, 0, 0);
            this.crtTexCoordLocation = gl.getAttribLocation(this.crtProgram, 'a_texCoord');
            this.crtTexCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.crtTexCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.crtTexCoordLocation);
            gl.vertexAttribPointer(this.crtTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
            this.positionAttribLocation = this.getAttribLocation('a');
            this.textureAttribLocation = this.getAttribLocation('b');
            this.fgColorAttribLocation = this.getAttribLocation('c');
            this.bgColorAttribLocation = this.getAttribLocation('d');
            const cellCount = width * height;
            this.positionsArray = new Float32Array(cellCount * 3 * 4);
            this.indexArray = new Uint16Array(cellCount * 6);
            this.textureArray = new Float32Array(cellCount * 2 * 4);
            this.foregroundUint8Array = new Uint8Array(cellCount * 4 * 4);
            this.foregroundDataView = new DataView(this.foregroundUint8Array.buffer);
            this.backgroundUint8Array = new Uint8Array(cellCount * 4 * 4);
            this.backgroundDataView = new DataView(this.backgroundUint8Array.buffer);
            // Init the frame buffer
            this.frameBufferTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.frameBufferTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.pixelWidth, this.pixelHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            this.frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.frameBufferTexture, 0);
            // Init the positions buffer
            let i = 0;
            let j = 0;
            let k = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    // Top-left
                    this.positionsArray[i++] = interpolate(x, width);
                    this.positionsArray[i++] = -interpolate(y, height);
                    // Top-right
                    this.positionsArray[i++] = interpolate(x + 1, width);
                    this.positionsArray[i++] = -interpolate(y, height);
                    // Bottom-right
                    this.positionsArray[i++] = interpolate(x + 1, width);
                    this.positionsArray[i++] = -interpolate(y + 1, height);
                    // Bottom-left
                    this.positionsArray[i++] = interpolate(x, width);
                    this.positionsArray[i++] = -interpolate(y + 1, height);
                    this.indexArray[j++] = k + 0;
                    this.indexArray[j++] = k + 1;
                    this.indexArray[j++] = k + 2;
                    this.indexArray[j++] = k + 0;
                    this.indexArray[j++] = k + 2;
                    this.indexArray[j++] = k + 3;
                    k += 4;
                }
            }
            this.positionBuffer = gl.createBuffer();
            this.indexBuffer = gl.createBuffer();
            this.textureBuffer = gl.createBuffer();
            this.foregroundBuffer = gl.createBuffer();
            this.backgroundBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.positionsArray, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexArray, gl.STATIC_DRAW);
            this.texture = this.loadTexture(this.font.url);
            this.lastRenderTime = 0;
            this.renderDelta = 0;
            this.fps = 0;
            this.averageFps = 0;
            this.requestAnimationFrame();
        }
        handleResize() {
            const parent = this.canvas.parentElement;
            if (!parent) {
                return;
            }
            const widthFactor = parent.offsetWidth / this.pixelWidth;
            const heightFactor = parent.offsetHeight / this.pixelHeight;
            const factor = Math.min(widthFactor, heightFactor);
            const width = (factor * this.pixelWidth) | 0;
            const height = (factor * this.pixelHeight) | 0;
            this.canvas.style.width = width + 'px';
            this.canvas.style.height = height + 'px';
        }
        getAttribLocation(name) {
            const location = this.gl.getAttribLocation(this.program, name);
            this.gl.enableVertexAttribArray(location);
            return location;
        }
        flush() {
            let textureArrayIndex = 0;
            let colorArrayIndex = 0;
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    const cell = this.getCell(x, y);
                    if (!cell.dirty) {
                        textureArrayIndex += 8;
                        colorArrayIndex += 16;
                        continue;
                    }
                    const textureX = cell.charCode % 16;
                    const textureY = (cell.charCode / 16) | 0;
                    this.textureArray[textureArrayIndex++] = textureX;
                    this.textureArray[textureArrayIndex++] = textureY;
                    this.textureArray[textureArrayIndex++] = textureX + 1;
                    this.textureArray[textureArrayIndex++] = textureY;
                    this.textureArray[textureArrayIndex++] = textureX + 1;
                    this.textureArray[textureArrayIndex++] = textureY + 1;
                    this.textureArray[textureArrayIndex++] = textureX;
                    this.textureArray[textureArrayIndex++] = textureY + 1;
                    for (let i = 0; i < 4; i++) {
                        this.foregroundDataView.setUint32(colorArrayIndex, cell.fg, false);
                        this.backgroundDataView.setUint32(colorArrayIndex, cell.bg, false);
                        colorArrayIndex += 4;
                    }
                    cell.dirty = false;
                }
            }
        }
        isKeyDown(key) {
            return this.keys.getKey(key).down;
        }
        isKeyPressed(key) {
            return this.keys.getKey(key).isPressed();
        }
        getKeyDownCount(key) {
            return this.keys.getKey(key).downCount;
        }
        /**
         * Returns a standard roguelike movement key if pressed.
         * Implemented control systems:
         * 1) Numpad arrows
         * 2) VIM keys
         * 3) Normal arrows (4 directions only)
         * 4) Numpad 5 and '.' (period) for "wait"
         * If a key is pressed, returns the movement delta.
         * If no key is pressed, returns undefined.
         * See: http://www.roguebasin.com/index.php?title=Preferred_Key_Controls
         */
        getMovementKey() {
            if (this.isKeyPressed(exports.Key.VK_NUMPAD1) || this.isKeyPressed(exports.Key.VK_B)) {
                return new exports.Point(-1, 1);
            }
            if (this.isKeyPressed(exports.Key.VK_NUMPAD2) || this.isKeyPressed(exports.Key.VK_J) || this.isKeyPressed(exports.Key.VK_DOWN)) {
                return new exports.Point(0, 1);
            }
            if (this.isKeyPressed(exports.Key.VK_NUMPAD3) || this.isKeyPressed(exports.Key.VK_N)) {
                return new exports.Point(1, 1);
            }
            if (this.isKeyPressed(exports.Key.VK_NUMPAD4) || this.isKeyPressed(exports.Key.VK_H) || this.isKeyPressed(exports.Key.VK_LEFT)) {
                return new exports.Point(-1, 0);
            }
            if (this.isKeyPressed(exports.Key.VK_NUMPAD5) || this.isKeyPressed(exports.Key.VK_PERIOD)) {
                return new exports.Point(0, 0);
            }
            if (this.isKeyPressed(exports.Key.VK_NUMPAD6) || this.isKeyPressed(exports.Key.VK_L) || this.isKeyPressed(exports.Key.VK_RIGHT)) {
                return new exports.Point(1, 0);
            }
            if (this.isKeyPressed(exports.Key.VK_NUMPAD7) || this.isKeyPressed(exports.Key.VK_Y)) {
                return new exports.Point(-1, -1);
            }
            if (this.isKeyPressed(exports.Key.VK_NUMPAD8) || this.isKeyPressed(exports.Key.VK_K) || this.isKeyPressed(exports.Key.VK_UP)) {
                return new exports.Point(0, -1);
            }
            if (this.isKeyPressed(exports.Key.VK_NUMPAD9) || this.isKeyPressed(exports.Key.VK_U)) {
                return new exports.Point(1, -1);
            }
            return undefined;
        }
        buildShader(type, source) {
            const gl = this.gl;
            const sh = gl.createShader(type);
            if (!sh) {
                throw new Error('An error occurred compiling the shader: ');
            }
            gl.shaderSource(sh, source);
            gl.compileShader(sh);
            if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
                throw new Error('An error occurred compiling the shader: ' + gl.getShaderInfoLog(sh));
            }
            return sh;
        }
        /**
         * Initialize a texture and load an image.
         * When the image finished loading copy it into the texture.
         * @param url
         */
        loadTexture(url) {
            const gl = this.gl;
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            // Because images have to be download over the internet
            // they might take a moment until they are ready.
            // Until then put a single pixel in the texture so we can
            // use it immediately. When the image has finished downloading
            // we'll update the texture with the contents of the image.
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 1;
            const height = 1;
            const border = 0;
            const srcFormat = gl.RGBA;
            const srcType = gl.UNSIGNED_BYTE;
            const pixel = new Uint8Array([0, 0, 0, 255]); // opaque black
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
            const image = new Image();
            image.onload = () => {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            };
            image.src = url;
            return texture;
        }
        //
        // Draw the scene.
        //
        render() {
            const gl = this.gl;
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clearDepth(1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            if (this.crt) {
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
            }
            else {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }
            gl.viewport(0, 0, this.pixelWidth, this.pixelHeight);
            // Tell WebGL how to pull out the positions from the position
            // buffer into the vertexPosition attribute
            {
                const numComponents = 2;
                const type = gl.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
                gl.vertexAttribPointer(this.positionAttribLocation, numComponents, type, normalize, stride, offset);
            }
            // Tell WebGL how to pull out the texture coordinates from
            // the texture coordinate buffer into the textureCoord attribute.
            {
                const numComponents = 2;
                const type = gl.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, this.textureArray, gl.DYNAMIC_DRAW);
                gl.vertexAttribPointer(this.textureAttribLocation, numComponents, type, normalize, stride, offset);
            }
            // Foreground color
            {
                const numComponents = 4;
                const type = gl.UNSIGNED_BYTE;
                const normalize = true;
                const stride = 0;
                const offset = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, this.foregroundBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, this.foregroundUint8Array, gl.DYNAMIC_DRAW);
                gl.vertexAttribPointer(this.fgColorAttribLocation, numComponents, type, normalize, stride, offset);
            }
            // Background color
            {
                const numComponents = 4;
                const type = gl.UNSIGNED_BYTE;
                const normalize = true;
                const stride = 0;
                const offset = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, this.backgroundBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, this.backgroundUint8Array, gl.DYNAMIC_DRAW);
                gl.vertexAttribPointer(this.bgColorAttribLocation, numComponents, type, normalize, stride, offset);
            }
            // Tell WebGL which indices to use to index the vertices
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            // Tell WebGL to use our program when drawing
            gl.useProgram(this.program);
            // Tell WebGL we want to affect texture unit 0
            gl.activeTexture(gl.TEXTURE0);
            // Bind the texture to texture unit 0
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            // Tell the shader we bound the texture to texture unit 0
            {
                const vertexCount = this.width * this.height * 6;
                const type = gl.UNSIGNED_SHORT;
                const offset = 0;
                gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
            }
        }
        renderCrt() {
            const crt = this.crt;
            if (!crt) {
                return;
            }
            const gl = this.gl;
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, this.pixelWidth * this.pixelScale, this.pixelHeight * this.pixelScale);
            gl.useProgram(this.crtProgram);
            gl.uniform1f(this.crtBlurLocation, crt.blur);
            gl.uniform1f(this.crtCurvatureLocation, crt.curvature);
            gl.uniform1f(this.crtChromaLocation, crt.chroma);
            gl.uniform1f(this.crtVignetteLocation, crt.vignette);
            gl.uniform1f(this.crtScanlineWidthLocation, crt.scanlineWidth);
            gl.uniform1f(this.crtScanlineIntensityLocation, crt.scanlineIntensity);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.crtPositionBuffer);
            gl.vertexAttribPointer(this.crtPositionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.crtTexCoordBuffer);
            gl.vertexAttribPointer(this.crtTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.frameBufferTexture);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        requestAnimationFrame() {
            window.requestAnimationFrame((t) => this.renderLoop(t));
        }
        renderLoop(time) {
            if (this.lastRenderTime === 0) {
                this.lastRenderTime = time;
                this.fps = 0;
            }
            else {
                this.renderDelta = time - this.lastRenderTime;
                this.lastRenderTime = time;
                this.fps = 1000.0 / this.renderDelta;
                this.averageFps = 0.95 * this.averageFps + 0.05 * this.fps;
            }
            this.keys.updateKeys(time);
            this.mouse.update(time);
            if (this.update) {
                this.update();
            }
            this.flush();
            this.render();
            if (this.crt) {
                this.renderCrt();
            }
            this.requestAnimationFrame();
        }
    }

    exports.ColodorePalette = ColodorePalette;
    exports.Colors = Colors;
    exports.Commodore64Palette = Commodore64Palette;
    exports.DEFAULT_FONT = DEFAULT_FONT;
    exports.DefaultDialogRenderer = DefaultDialogRenderer;
    exports.Dialog = Dialog;
    exports.DialogState = DialogState;
    exports.Font = Font;
    exports.GUI = GUI;
    exports.Keyboard = Keyboard;
    exports.MessageDialog = MessageDialog;
    exports.Mouse = Mouse;
    exports.Pico8Palette = Pico8Palette;
    exports.ScrollableMessageDialog = ScrollableMessageDialog;
    exports.SelectDialog = SelectDialog;
    exports.Terminal = Terminal;
    exports.capitalize = capitalize;
    exports.computePath = computePath;
    exports.deserialize = deserialize;
    exports.fixBoxCells = fixBoxCells;
    exports.fromHsv = fromHsv;
    exports.fromRgb = fromRgb;
    exports.getFovQuadrant = getFovQuadrant;
    exports.loadImage = loadImage;
    exports.loadImage2x = loadImage2x;
    exports.serializable = serializable;
    exports.serialize = serialize;
    exports.wordWrap = wordWrap;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.js.map
