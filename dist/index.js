(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("wglt", [], factory);
	else if(typeof exports === 'object')
		exports["wglt"] = factory();
	else
		root["wglt"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ai/ai.ts":
/*!**********************!*\
  !*** ./src/ai/ai.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AI {
    constructor(entity) {
        this.entity = entity;
        this.activatedCount = -1;
    }
}
exports.AI = AI;


/***/ }),

/***/ "./src/ai/basicmonster.ts":
/*!********************************!*\
  !*** ./src/ai/basicmonster.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ai_1 = __webpack_require__(/*! ./ai */ "./src/ai/ai.ts");
class BasicMonster extends ai_1.AI {
    doAi() {
        const monster = this.entity;
        const player = monster.game.player;
        if (!player) {
            return;
        }
        if (monster.distanceTo(player) >= 2) {
            // Move towards player if far away
            monster.moveToward(player.x, player.y);
        }
        else if (player.health > 0) {
            // Close enough, attack! (if the player is still alive.)
            monster.attack(player);
        }
    }
}
exports.BasicMonster = BasicMonster;


/***/ }),

/***/ "./src/ai/confusedmonster.ts":
/*!***********************************!*\
  !*** ./src/ai/confusedmonster.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const rng_1 = __webpack_require__(/*! ../rng */ "./src/rng.ts");
const ai_1 = __webpack_require__(/*! ./ai */ "./src/ai/ai.ts");
class ConfusedMonster extends ai_1.AI {
    constructor(entity) {
        super(entity);
        this.rng = new rng_1.RNG();
        this.numTurns = 10;
        this.oldAi = entity.ai;
    }
    doAi() {
        if (this.numTurns > 0) {
            // Still confused...
            // Move in a random direction, and decrease the number of turns confused
            this.entity.move(this.rng.nextRange(-1, 1), this.rng.nextRange(-1, 1));
            this.numTurns--;
        }
        else {
            this.entity.ai = this.oldAi;
            // addMessage('The ' + this.owner.name + ' is no longer confused!',
            // wglt.Colors.LIGHT_RED);
        }
    }
}
exports.ConfusedMonster = ConfusedMonster;


/***/ }),

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const font_1 = __webpack_require__(/*! ./font */ "./src/font.ts");
const keyboard_1 = __webpack_require__(/*! ./keyboard */ "./src/keyboard.ts");
const mouse_1 = __webpack_require__(/*! ./mouse */ "./src/mouse.ts");
const rect_1 = __webpack_require__(/*! ./rect */ "./src/rect.ts");
const renderset_1 = __webpack_require__(/*! ./renderset */ "./src/renderset.ts");
const vec2_1 = __webpack_require__(/*! ./vec2 */ "./src/vec2.ts");
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 224;
const DEFAULT_FILL_WINDOW = false;
const DEFAULT_SCALE_FACTOR = 2.0;
class App {
    constructor(options) {
        const canvas = options.canvas;
        if (!canvas) {
            throw new Error('Null or missing canvas element');
        }
        const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
        if (!gl) {
            throw new Error('Could not get WebGL context');
        }
        this.canvas = canvas;
        this.gl = gl;
        this.size = options.size || new rect_1.Rect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.font = options.font || font_1.FONT_04B03;
        this.fillWindow = options.fillWindow || DEFAULT_FILL_WINDOW;
        this.scaleFactor = options.scaleFactor || DEFAULT_SCALE_FACTOR;
        // this.aspectRatio = this.size.width / this.size.height;
        this.center = new vec2_1.Vec2((this.size.width / 2) | 0, (this.size.height / 2) | 0);
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        canvas.width = this.size.width;
        canvas.height = this.size.height;
        canvas.style.outline = 'none';
        canvas.tabIndex = 0;
        canvas.focus();
        this.renderSet = new renderset_1.RenderSet(gl, options.imageUrl, this.font);
        this.keyboard = new keyboard_1.Keyboard(canvas);
        this.mouse = new mouse_1.Mouse(this);
        if (this.fillWindow) {
            window.addEventListener('resize', this.handleResizeEvent.bind(this), false);
            this.handleResizeEvent();
        }
        this.renderLoop();
    }
    /**
     * Handles window resize events.
     * Updates canvas size.
     */
    handleResizeEvent() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // The logic here is:
        //  * Think of a rough "minimum viewport"
        //  * The viewport is a rectangle that can be portrait or landscape
        //  * The viewport can be a little bigger on desktop, a little smaller on mobile
        //  * Find the integer scaling factor that best fits the minimum vector
        const mobile = this.isMobile();
        const minMajorAxis = mobile ? 320.0 : 400.0;
        const minMinorAxis = mobile ? 180.0 : 224.0;
        this.scaleFactor = 1.0;
        if (width > height) {
            this.scaleFactor = Math.max(1, Math.min(Math.round(width / minMajorAxis), Math.round(height / minMinorAxis)));
        }
        else {
            this.scaleFactor = Math.max(1, Math.min(Math.round(width / minMinorAxis), Math.round(height / minMajorAxis)));
        }
        this.size.width = Math.round(width / this.scaleFactor);
        this.size.height = Math.round(height / this.scaleFactor);
        // this.aspectRatio = this.size.width / this.size.height;
        this.center.x = (this.size.width / 2) | 0;
        this.center.y = (this.size.height / 2) | 0;
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        this.canvas.style.left = '0';
        this.canvas.style.top = '0';
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
    }
    /**
     * Returns if the browser is on a mobile device.
     */
    isMobile() {
        return navigator.userAgent.match(/Android|iPhone|iPod|IEMobile|WPDesktop|Opera Mini/i);
    }
    renderLoop() {
        this.keyboard.update();
        this.mouse.update();
        this.resetGl();
        if (this.state) {
            this.state.update();
        }
        this.renderSet.flush(this.size.width, this.size.height);
        requestAnimationFrame(this.renderLoop.bind(this));
    }
    resetGl() {
        const gl = this.gl;
        gl.viewport(0, 0, this.size.width, this.size.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Reset sprite index buffers
        this.renderSet.positionArrayIndex = 0;
        this.renderSet.texcoordArrayIndex = 0;
        this.renderSet.colorArrayIndex = 0;
    }
    /**
     * Draws a sprite.
     * @param {number} x The x-coordinate of the top-left corner on the screen.
     * @param {number} y The y-coordinate of the top-left corner on the screen.
     * @param {number} u The x-coordinate of the top-left corner on the sprite sheet.
     * @param {number} v The y-coordinate of the top-left corner on the sprite sheet.
     * @param {number} w The width of the sprite.
     * @param {number} h The height of the sprite.
     * @param {Color=} color Optional color.
     * @param {number=} dw Optional destination width.
     * @param {number=} dh Optional destination height.
     */
    drawImage(x, y, u, v, w, h, color, dw, dh) {
        this.renderSet.drawImage(x, y, u, v, w, h, color, dw, dh);
    }
    /**
     * Draws a string.
     * @param {string} str The text string to draw.
     * @param {number} x The x-coordinate of the top-left corner.
     * @param {number} y The y-coordinate of the top-left corner.
     * @param {Color=} color Optional color.
     */
    drawString(str, x, y, color) {
        this.renderSet.drawString(str, x, y, color);
    }
    /**
     * Draws a string horizontally centered.
     * @param {string} str The text string to draw.
     * @param {number} x The x-coordinate of the center.
     * @param {number} y The y-coordinate of the top-left corner.
     * @param {Color=} color Optional color.
     */
    drawCenteredString(str, x, y, color) {
        this.renderSet.drawCenteredString(str, x, y, color);
    }
    isKeyDown(keyCode) {
        const key = this.keyboard.getKey(keyCode);
        return key && key.down;
    }
    isKeyPressed(keyCode) {
        const key = this.keyboard.getKey(keyCode);
        const count = key ? key.downCount : 0;
        return count === 1 || (count > 30);
    }
}
exports.App = App;


/***/ }),

/***/ "./src/appstate.ts":
/*!*************************!*\
  !*** ./src/appstate.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const gui_1 = __webpack_require__(/*! ./gui */ "./src/gui.ts");
class AppState {
    constructor(app) {
        this.app = app;
        this.gui = new gui_1.GUI(app);
    }
    update() {
        this.gui.handleInput();
        this.gui.draw();
    }
}
exports.AppState = AppState;


/***/ }),

/***/ "./src/color.ts":
/*!**********************!*\
  !*** ./src/color.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
    return ((r << 24) + (g << 16) + (b << 8) + a);
}
exports.fromRgb = fromRgb;
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
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
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
exports.fromHsv = fromHsv;


/***/ }),

/***/ "./src/colors.ts":
/*!***********************!*\
  !*** ./src/colors.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = __webpack_require__(/*! ./color */ "./src/color.ts");
class Colors {
}
Colors.BLACK = color_1.fromRgb(0, 0, 0);
Colors.WHITE = color_1.fromRgb(0xff, 0xff, 0xff);
Colors.GRAY = color_1.fromRgb(0x80, 0x80, 0x80);
Colors.LIGHT_GRAY = color_1.fromRgb(0xaa, 0xaa, 0xaa);
Colors.DARK_GRAY = color_1.fromRgb(0x55, 0x55, 0x55);
Colors.YELLOW = color_1.fromRgb(0xff, 0xff, 0x55);
Colors.BROWN = color_1.fromRgb(0xaa, 0x55, 0x00);
Colors.RED = color_1.fromRgb(0xff, 0x00, 0x00);
Colors.LIGHT_RED = color_1.fromRgb(0xff, 0x55, 0x55);
Colors.DARK_RED = color_1.fromRgb(0xaa, 0x00, 0x00);
Colors.LIGHT_GREEN = color_1.fromRgb(0x55, 0xff, 0x55);
Colors.DARK_GREEN = color_1.fromRgb(0x00, 0xaa, 0x00);
Colors.LIGHT_CYAN = color_1.fromRgb(0x55, 0xff, 0xff);
Colors.DARK_CYAN = color_1.fromRgb(0x00, 0xaa, 0xaa);
Colors.LIGHT_BLUE = color_1.fromRgb(0x55, 0x55, 0xff);
Colors.DARK_BLUE = color_1.fromRgb(0x00, 0x00, 0xaa);
Colors.LIGHT_MAGENTA = color_1.fromRgb(0xff, 0x55, 0xff);
Colors.DARK_MAGENTA = color_1.fromRgb(0xaa, 0x00, 0xaa);
Colors.ORANGE = color_1.fromRgb(0xff, 0x88, 0x00);
exports.Colors = Colors;


/***/ }),

/***/ "./src/effects/bumpeffect.ts":
/*!***********************************!*\
  !*** ./src/effects/bumpeffect.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = __webpack_require__(/*! ./effect */ "./src/effects/effect.ts");
const DURATION = 12;
class BumpEffect extends effect_1.Effect {
    constructor(entity, target) {
        super(DURATION, true);
        this.entity = entity;
        this.dx = target.x - entity.x;
        this.dy = target.y - entity.y;
    }
    update() {
        const t = DURATION - this.countdown;
        if (t >= 0 && t < 4) {
            this.entity.offsetX += this.dx;
            this.entity.offsetY += this.dy;
        }
        if (t >= 4 && t < 8) {
            this.entity.offsetX -= this.dx;
            this.entity.offsetY -= this.dy;
        }
        super.update();
    }
}
exports.BumpEffect = BumpEffect;


/***/ }),

/***/ "./src/effects/effect.ts":
/*!*******************************!*\
  !*** ./src/effects/effect.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Effect {
    constructor(countdown, blocking) {
        this.countdown = countdown;
        this.blocking = blocking;
    }
    isDone() {
        return this.countdown <= 0;
    }
    update() {
        this.countdown--;
    }
    draw(game) { }
}
exports.Effect = Effect;


/***/ }),

/***/ "./src/effects/floatingtexteffect.ts":
/*!*******************************************!*\
  !*** ./src/effects/floatingtexteffect.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __webpack_require__(/*! ../colors */ "./src/colors.ts");
const effect_1 = __webpack_require__(/*! ./effect */ "./src/effects/effect.ts");
class FloatingTextEffect extends effect_1.Effect {
    constructor(str, pixelX, pixelY, color) {
        super(40, false);
        this.str = str;
        this.pixelX = pixelX;
        this.pixelY = pixelY;
        this.color = color || colors_1.Colors.WHITE;
    }
    draw(game) {
        const frame = 40 - this.countdown;
        const x = this.pixelX - game.viewport.x;
        const y = this.pixelY - game.viewport.y;
        const y2 = y - Math.min(4, Math.floor(frame / 2));
        game.app.drawCenteredString(this.str, x, y2, this.color);
    }
}
exports.FloatingTextEffect = FloatingTextEffect;


/***/ }),

/***/ "./src/effects/projectileeffect.ts":
/*!*****************************************!*\
  !*** ./src/effects/projectileeffect.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = __webpack_require__(/*! ./effect */ "./src/effects/effect.ts");
class ProjectileEffect extends effect_1.Effect {
    constructor(sprite, position, velocity, duration) {
        super(duration, true);
        this.sprite = sprite;
        this.position = position;
        this.velocity = velocity;
        this.duration = duration;
    }
    update() {
        super.update();
        this.position.add(this.velocity);
    }
    draw(game) {
        const x = this.position.x - game.viewport.x;
        const y = this.position.y - game.viewport.y;
        this.sprite.draw(game.app, x, y);
    }
}
exports.ProjectileEffect = ProjectileEffect;


/***/ }),

/***/ "./src/effects/slideeffect.ts":
/*!************************************!*\
  !*** ./src/effects/slideeffect.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = __webpack_require__(/*! ./effect */ "./src/effects/effect.ts");
class SlideEffect extends effect_1.Effect {
    constructor(entity, dx, dy, count) {
        super(count, true);
        this.entity = entity;
        this.dx = dx;
        this.dy = dy;
    }
    update() {
        this.countdown--;
        if (this.countdown >= 0) {
            this.entity.offsetX += this.dx;
            this.entity.offsetY += this.dy;
        }
        if (this.countdown === 0) {
            this.entity.x += this.entity.offsetX / this.entity.game.tileSize.width;
            this.entity.y += this.entity.offsetY / this.entity.game.tileSize.height;
            this.entity.offsetX = 0;
            this.entity.offsetY = 0;
        }
    }
}
exports.SlideEffect = SlideEffect;


/***/ }),

/***/ "./src/entity.ts":
/*!***********************!*\
  !*** ./src/entity.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __webpack_require__(/*! ./colors */ "./src/colors.ts");
const bumpeffect_1 = __webpack_require__(/*! ./effects/bumpeffect */ "./src/effects/bumpeffect.ts");
const floatingtexteffect_1 = __webpack_require__(/*! ./effects/floatingtexteffect */ "./src/effects/floatingtexteffect.ts");
const slideeffect_1 = __webpack_require__(/*! ./effects/slideeffect */ "./src/effects/slideeffect.ts");
const vec2_1 = __webpack_require__(/*! ./vec2 */ "./src/vec2.ts");
const xarray_1 = __webpack_require__(/*! ./xarray */ "./src/xarray.ts");
class Entity extends vec2_1.Vec2 {
    constructor(game, x, y, name, sprite, blocks) {
        super(x, y);
        this.game = game;
        this.offsetX = 0;
        this.offsetY = 0;
        this.name = name;
        this.sprite = sprite;
        this.blocks = blocks;
        this.health = 100;
        this.maxHealth = 100;
        this.actionPoints = 1;
        this.inventory = new xarray_1.XArray();
        this.canPickup = false;
        this.canAttack = false;
    }
    get pixelX() {
        return this.x * this.game.tileSize.width + this.offsetX;
    }
    get pixelY() {
        return this.y * this.game.tileSize.height + this.offsetY;
    }
    move(dx, dy) {
        const destX = this.x + dx;
        const destY = this.y + dy;
        if (this.game.tileMap && this.game.tileMap.isBlocked(destX, destY)) {
            return false;
        }
        const count = 4;
        const xSpeed = this.game.tileSize.width / count;
        const ySpeed = this.game.tileSize.height / count;
        this.game.effects.push(new slideeffect_1.SlideEffect(this, dx * xSpeed, dy * ySpeed, count));
        this.game.blocked = true;
        this.actionPoints--;
        return true;
    }
    moveToward(targetX, targetY) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.hypot(dx, dy);
        this.move(Math.round(dx / distance), Math.round(dy / distance));
    }
    tryMoveOrAttack(dx, dy) {
        const destX = this.x + dx;
        const destY = this.y + dy;
        for (let i = 0; i < this.game.entities.length; i++) {
            const other = this.game.entities[i];
            if (this !== other && other.x === destX && other.y === destY) {
                if (this.onBump) {
                    if (this.onBump(other)) {
                        return true;
                    }
                }
            }
        }
        return this.move(dx, dy);
    }
    attack(target) {
        const damage = 10;
        if (this.onAttack) {
            this.onAttack(this, target, damage);
        }
        target.takeDamage(damage);
        this.actionPoints--;
        this.game.effects.push(new bumpeffect_1.BumpEffect(this, target));
        this.game.blocked = true;
    }
    takeDamage(damage) {
        this.health -= damage;
        this.game.effects.push(new floatingtexteffect_1.FloatingTextEffect(damage.toString(), this.pixelX + 8, this.pixelY - 4, colors_1.Colors.RED));
        if (this.onDamage) {
            this.onDamage(this);
        }
        if (this.health <= 0) {
            this.health = 0;
            if (this.onDeath) {
                this.onDeath(this);
            }
            const index = this.game.entities.indexOf(this);
            if (index >= 0) {
                this.game.entities.splice(index, 1);
            }
        }
    }
    pickup(item) {
        if (item.onPickup) {
            item.onPickup(this, item);
        }
        // item.container = this.player.inventory;
        this.inventory.push(item);
        const index = this.game.entities.indexOf(item);
        if (index >= 0) {
            this.game.entities.splice(index, 1);
        }
    }
    use() {
        if (!this.onUse) {
            return false;
        }
        this.onUse(this);
        return true;
    }
    distanceTo(other) {
        return Math.hypot(other.x - this.x, other.y - this.y);
    }
    distance(x, y) {
        return Math.hypot(x - this.x, y - this.y);
    }
    draw() {
        this.sprite.draw(this.game.app, this.pixelX - this.game.viewport.x, this.pixelY - this.game.viewport.y);
    }
    sendToBack() { }
}
exports.Entity = Entity;


/***/ }),

/***/ "./src/font.ts":
/*!*********************!*\
  !*** ./src/font.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const START_CHAR_CODE = 32;
const END_CHAR_CODE = 126;
class Font {
    /**
     * Returns whether the character is in the printable range.
     * @param charCode The integer character ASCII code.
     */
    isInRange(charCode) {
        return charCode >= START_CHAR_CODE && charCode <= END_CHAR_CODE;
    }
    /**
     * Returns the width of a string with the currently configured font.
     * @param str The text string.
     */
    getStringWidth(str) {
        let sum = 0;
        for (let i = 0; i < str.length; i++) {
            sum += this.getWidth(str.charCodeAt(i));
        }
        return sum;
    }
}
exports.Font = Font;
class MonospacedFont extends Font {
    constructor(glyphSize) {
        super();
        this.glyphSize = glyphSize;
    }
    getOffset(charCode) {
        return (charCode - START_CHAR_CODE) * this.glyphSize.width;
    }
    getWidth() {
        return this.glyphSize.width;
    }
    getHeight() {
        return this.glyphSize.height;
    }
}
exports.MonospacedFont = MonospacedFont;
class ProportionalFont extends Font {
    constructor(height, widths) {
        super();
        this.height = height;
        this.widths = widths;
        this.offsets = [0];
        let offset = 0;
        for (let i = 0; i < this.widths.length; i++) {
            offset += this.widths[i];
            this.offsets.push(offset);
        }
    }
    getOffset(charCode) {
        return this.offsets[charCode - START_CHAR_CODE];
    }
    getWidth(charCode) {
        return this.widths[charCode - START_CHAR_CODE];
    }
    getHeight() {
        return this.height;
    }
}
exports.ProportionalFont = ProportionalFont;
exports.FONT_04B03 = new ProportionalFont(8, [
    4, 2, 4, 6, 5, 6, 6, 2, 3, 3, 4, 4, 3, 4, 2, 6, 5, 3, 5, 5, 5, 5, 5, 5, 5, 5, 2, 2, 4, 4, 4, 5,
    6, 5, 5, 4, 5, 4, 4, 5, 5, 4, 5, 5, 4, 6, 5, 5, 5, 5, 5, 5, 4, 5, 5, 6, 5, 5, 4, 3, 6, 3, 4, 5,
    3, 5, 5, 4, 5, 5, 4, 5, 5, 2, 3, 5, 2, 6, 5, 5, 5, 5, 4, 5, 4, 5, 5, 6, 4, 5, 5, 4, 2, 4, 5, 0
]);


/***/ }),

/***/ "./src/game.ts":
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const appstate_1 = __webpack_require__(/*! ./appstate */ "./src/appstate.ts");
const keys_1 = __webpack_require__(/*! ./keys */ "./src/keys.ts");
const path_1 = __webpack_require__(/*! ./path */ "./src/path.ts");
const rect_1 = __webpack_require__(/*! ./rect */ "./src/rect.ts");
const sprite_1 = __webpack_require__(/*! ./sprite */ "./src/sprite.ts");
const vec2_1 = __webpack_require__(/*! ./vec2 */ "./src/vec2.ts");
const DEFAULT_TILE_WIDTH = 16;
const DEFAULT_TILE_HEIGHT = 16;
class Game extends appstate_1.AppState {
    constructor(app, options) {
        super(app);
        this.tileSize = options.tileSize || new rect_1.Rect(0, 0, DEFAULT_TILE_WIDTH, DEFAULT_TILE_HEIGHT);
        this.viewport = new rect_1.Rect(0, 0, app.size.width, app.size.height);
        this.effects = [];
        this.entities = [];
        this.turnIndex = 0;
        this.blocked = false;
        this.cursor = new vec2_1.Vec2(-1, -1);
        this.pathIndex = 0;
    }
    update() {
        sprite_1.Sprite.updateGlobalAnimations();
        if (!this.gui.handleInput()) {
            this.updateEffects();
            this.updateEntities();
            if (this.onUpdate) {
                this.onUpdate();
            }
            this.updateViewport();
        }
        this.drawTileMap();
        this.drawTargeting();
        this.drawEntities();
        this.drawEffects();
        this.gui.draw();
    }
    updateEffects() {
        // Reset blocked
        this.blocked = false;
        // Update effects
        for (let i = 0; i < this.effects.length; i++) {
            const effect = this.effects[i];
            if (!effect.blocking || !this.blocked) {
                effect.update();
                if (effect.blocking) {
                    this.blocked = true;
                }
            }
        }
        // Remove completed effects
        for (let i = this.effects.length - 1; i >= 0; i--) {
            if (this.effects[i].isDone()) {
                this.effects.splice(i, 1);
            }
        }
    }
    updateEntities() {
        // If not blocked on any animations,
        // then try to do enemy AI
        // const startTurnIndex = this.turnIndex;
        let turnCount = 0;
        while (true) {
            if (this.turnIndex < 0 || this.turnIndex >= this.entities.length) {
                // Turn index out of range
                break;
            }
            if (turnCount > this.entities.length * 2) {
                // Looped back to original entity
                // In that case, quit to next frame to avoid infinite loops
                break;
            }
            const currEntity = this.entities[this.turnIndex];
            if (currEntity.actionPoints > 0) {
                if (currEntity === this.player) {
                    this.handlePlayerInput();
                    break;
                }
                else {
                    this.doAi(currEntity);
                }
            }
            if (!this.blocked && currEntity.actionPoints <= 0) {
                // Turn is over
                currEntity.actionPoints = 0;
                this.nextTurn();
            }
            if (this.blocked) {
                // Waiting for animations
                break;
            }
            turnCount++;
        }
    }
    updateViewport() {
        if (this.player) {
            const horizontalMargin = (this.app.size.width * 0.25) | 0;
            const verticalMargin = (this.app.size.height * 0.25) | 0;
            if (this.player.pixelX - this.viewport.x < horizontalMargin) {
                this.viewport.x = this.player.pixelX - horizontalMargin;
            }
            if (this.viewport.x + this.viewport.width - (this.player.pixelX + this.tileSize.width) < horizontalMargin) {
                this.viewport.x = this.player.pixelX + this.tileSize.width + horizontalMargin - this.viewport.width;
            }
            if (this.player.pixelY - this.viewport.y < verticalMargin) {
                this.viewport.y = this.player.pixelY - verticalMargin;
            }
            if (this.viewport.y + this.viewport.height - (this.player.pixelY + this.tileSize.height) < verticalMargin) {
                this.viewport.y = this.player.pixelY + this.tileSize.height + verticalMargin - this.viewport.height;
            }
            this.viewport.width = this.app.size.width;
            this.viewport.height = this.app.size.height;
        }
        if (this.app.mouse.down) {
            this.viewport.x -= this.app.mouse.dx;
            this.viewport.y -= this.app.mouse.dy;
        }
    }
    drawTileMap() {
        if (this.app.renderSet.spriteTexture.loaded && this.tileMap) {
            this.tileMap.draw(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
        }
    }
    drawTargeting() {
        if (this.isTargeting() && this.targetSprite) {
            const x = this.cursor.x * this.tileSize.width - this.viewport.x;
            const y = this.cursor.y * this.tileSize.height - this.viewport.y;
            this.targetSprite.draw(this.app, x, y);
        }
    }
    drawEntities() {
        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i];
            if (!this.tileMap || this.tileMap.isVisible(entity.x, entity.y)) {
                entity.draw();
            }
        }
    }
    drawEffects() {
        let blockingCount = 0;
        for (let i = 0; i < this.effects.length; i++) {
            const effect = this.effects[i];
            if (blockingCount === 0 || !effect.blocking) {
                effect.draw(this);
            }
            if (effect.blocking) {
                blockingCount++;
            }
        }
    }
    isTargeting() {
        return !!this.targetCallback;
    }
    startTargeting(callback) {
        this.targetCallback = callback;
        if (this.player) {
            this.cursor.x = this.player.x;
            this.cursor.y = this.player.y;
        }
    }
    endTargeting() {
        if (this.targetCallback) {
            this.targetCallback(this.cursor.x, this.cursor.y);
        }
        this.cancelTargeting();
    }
    cancelTargeting() {
        this.targetCallback = undefined;
    }
    handlePlayerInput() {
        if (!this.player || this.blocked) {
            return;
        }
        if (this.app.mouse.dx !== 0 || this.app.mouse.dy !== 0) {
            this.cursor.x = ((this.viewport.x + this.app.mouse.x) / this.tileSize.width) | 0;
            this.cursor.y = ((this.viewport.y + this.app.mouse.y) / this.tileSize.height) | 0;
        }
        if (this.isTargeting()) {
            if (this.app.isKeyPressed(keys_1.Keys.VK_ENTER) || this.app.mouse.isClicked()) {
                this.endTargeting();
            }
            if (this.app.isKeyPressed(keys_1.Keys.VK_ESCAPE)) {
                this.cancelTargeting();
            }
            if (this.app.isKeyPressed(keys_1.Keys.VK_UP)) {
                this.cursor.y--;
            }
            if (this.app.isKeyPressed(keys_1.Keys.VK_LEFT)) {
                this.cursor.x--;
            }
            if (this.app.isKeyPressed(keys_1.Keys.VK_RIGHT)) {
                this.cursor.x++;
            }
            if (this.app.isKeyPressed(keys_1.Keys.VK_DOWN)) {
                this.cursor.y++;
            }
            return;
        }
        if (this.app.mouse.isClicked()) {
            const tx = ((this.viewport.x + this.app.mouse.x) / this.tileSize.width) | 0;
            const ty = ((this.viewport.y + this.app.mouse.y) / this.tileSize.height) | 0;
            this.targetEntity = this.getEnemyAt(tx, ty);
            if (this.targetEntity) {
                this.targetTile = undefined;
                this.path = undefined;
                if (this.player.distance(this.targetEntity.x, this.targetEntity.y) <= 1.0) {
                    this.player.attack(this.targetEntity);
                }
                return;
            }
            if (this.tileMap) {
                const target = this.tileMap.getCell(tx, ty);
                if (target && target !== this.targetTile) {
                    this.targetTile = target;
                    this.path = path_1.computePath(this.tileMap, this.player, this.targetTile, 100);
                    this.pathIndex = 0;
                }
            }
        }
        let nextStep = null;
        if (this.path) {
            nextStep = this.path[this.pathIndex];
            while (nextStep && nextStep.x === this.player.x && nextStep.y === this.player.y) {
                this.pathIndex++;
                nextStep = this.pathIndex < this.path.length ? this.path[this.pathIndex] : null;
            }
            if (nextStep && this.getEnemyAt(nextStep.x, nextStep.y)) {
                // Entity in the way.  Cancel the path.
                nextStep = null;
            }
            if (!nextStep) {
                this.targetTile = undefined;
                this.path = undefined;
            }
        }
        const down = this.app.isKeyPressed(keys_1.Keys.VK_NUMPAD2) || this.app.isKeyPressed(keys_1.Keys.VK_DOWN) ||
            (nextStep && nextStep.y > this.player.y);
        const left = this.app.isKeyPressed(keys_1.Keys.VK_NUMPAD4) || this.app.isKeyPressed(keys_1.Keys.VK_LEFT) ||
            (nextStep && nextStep.x < this.player.x);
        const right = this.app.isKeyPressed(keys_1.Keys.VK_NUMPAD6) || this.app.isKeyPressed(keys_1.Keys.VK_RIGHT) ||
            (nextStep && nextStep.x > this.player.x);
        const up = this.app.isKeyPressed(keys_1.Keys.VK_NUMPAD8) || this.app.isKeyPressed(keys_1.Keys.VK_UP) ||
            (nextStep && nextStep.y < this.player.y);
        const wait = this.app.isKeyPressed(keys_1.Keys.VK_NUMPAD5);
        if (up) {
            this.player.tryMoveOrAttack(0, -1);
        }
        if (left) {
            this.player.tryMoveOrAttack(-1, 0);
        }
        if (right) {
            this.player.tryMoveOrAttack(1, 0);
        }
        if (down) {
            this.player.tryMoveOrAttack(0, 1);
        }
        if (wait) {
            this.player.actionPoints = 0;
        }
    }
    doAi(entity) {
        if (entity.ai) {
            if (!this.tileMap || (this.tileMap.isVisible(entity.x, entity.y) && entity.ai.activatedCount > 0)) {
                entity.ai.doAi();
            }
        }
        entity.actionPoints = 0;
    }
    nextTurn() {
        if (this.player && this.entities[this.turnIndex] === this.player) {
            // Player just finished turn
            // Update FOV
            if (this.player && this.tileMap) {
                this.tileMap.computeFov(this.player.x, this.player.y, 13);
                // Determine which entities are activated
                for (let i = 0; i < this.entities.length; i++) {
                    const entity = this.entities[i];
                    if (entity.ai) {
                        if (this.tileMap.isVisible(entity.x, entity.y)) {
                            entity.ai.activatedCount++;
                        }
                        else {
                            entity.ai.activatedCount = -1;
                        }
                    }
                }
            }
            // Sort entities by distance from player
            this.entities.sort((a, b) => {
                if (!this.player) {
                    return 0;
                }
                const ad = Math.hypot(a.x - this.player.x, a.y - this.player.y);
                const bd = Math.hypot(b.x - this.player.x, b.y - this.player.y);
                return ad - bd;
            });
        }
        this.turnIndex++;
        if (this.turnIndex >= this.entities.length) {
            // Reached the end of the entities list.  Start at beginning.
            this.turnIndex = 0;
            for (let i = 0; i < this.entities.length; i++) {
                this.entities[i].actionPoints = 1;
            }
        }
    }
    getEnemyAt(x, y) {
        for (let i = 0; i < this.entities.length; i++) {
            const other = this.entities[i];
            if (!other.canAttack || other.health <= 0) {
                // Dead, ignore
                continue;
            }
            if (other.x === x && other.y === y) {
                return other;
            }
        }
        return undefined;
    }
}
exports.Game = Game;


/***/ }),

/***/ "./src/glutils.ts":
/*!************************!*\
  !*** ./src/glutils.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ExtendedTexture extends WebGLTexture {
    constructor() {
        super();
        this.loaded = false;
        this.width = 0;
        this.height = 0;
    }
}
exports.ExtendedTexture = ExtendedTexture;
/**
 * Initialize a shader program, so WebGL knows how to draw our data
 */
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    return shaderProgram;
}
exports.initShaderProgram = initShaderProgram;
/**
 * Creates a shader of the given type, uploads the source and
 * compiles it.
 */
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}
exports.loadShader = loadShader;
/**
 * Initialize a texture and load an image.
 * When the image finished loading copy it into the texture.
 */
function createTexture(gl, url) {
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
    const pixel = new Uint8Array([0, 0, 0, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
    const image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        texture.loaded = true;
        texture.width = image.width;
        texture.height = image.height;
    };
    image.src = url;
    return texture;
}
exports.createTexture = createTexture;


/***/ }),

/***/ "./src/gui.ts":
/*!********************!*\
  !*** ./src/gui.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const dialogrenderer_1 = __webpack_require__(/*! ./gui/dialogrenderer */ "./src/gui/dialogrenderer.ts");
const rect_1 = __webpack_require__(/*! ./rect */ "./src/rect.ts");
class GUI {
    constructor(app) {
        this.app = app;
        this.panels = [];
        this.renderer = new dialogrenderer_1.DialogRenderer(new rect_1.Rect(0, 0, 1, 1));
    }
    add(panel) {
        this.panels.push(panel);
    }
    handleInput() {
        for (let i = this.panels.length - 1; i >= 0; i--) {
            const panel = this.panels[i];
            if (panel.handleInput && panel.handleInput()) {
                return true;
            }
            if (panel.modal) {
                return true;
            }
        }
        return false;
    }
    draw() {
        for (let i = 0; i < this.panels.length; i++) {
            this.panels[i].drawContents();
        }
    }
}
exports.GUI = GUI;


/***/ }),

/***/ "./src/gui/dialog.ts":
/*!***************************!*\
  !*** ./src/gui/dialog.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const panel_1 = __webpack_require__(/*! ./panel */ "./src/gui/panel.ts");
class Dialog extends panel_1.Panel {
    constructor(gui, rect, title) {
        super(gui, rect, true);
        this.title = title;
    }
    drawContents() {
        this.gui.renderer.draw(this.gui.app, this);
    }
    handleInput() {
        return false;
    }
    close() {
        const panels = this.gui.panels;
        const index = panels.indexOf(this);
        if (index >= 0) {
            panels.splice(index, 1);
        }
    }
}
exports.Dialog = Dialog;


/***/ }),

/***/ "./src/gui/dialogrenderer.ts":
/*!***********************************!*\
  !*** ./src/gui/dialogrenderer.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class DialogRenderer {
    constructor(baseRect) {
        this.baseRect = baseRect;
    }
    draw(app, dialog) {
        // Draws the dialog chrome using a 3x3 grid
        // 0   1   2   3
        //   x   x   x
        // 1
        //   x   x   x
        // 2
        //   x   x   x
        // 3
        // Source image is the baseRect
        const sx0 = this.baseRect.x;
        const sy0 = this.baseRect.y;
        const sw = (this.baseRect.width / 3) | 0;
        const sh = (this.baseRect.height / 3) | 0;
        const sx1 = sx0 + sw;
        const sy1 = sy0 + sh;
        const sx2 = sx0 + 2 * sw;
        const sy2 = sy0 + 2 * sw;
        // Destination rect is the dialog
        const dx0 = dialog.rect.x;
        const dy0 = dialog.rect.y;
        const dw = dialog.rect.width - 2 * sw;
        const dh = dialog.rect.height - 2 * sh;
        const dx1 = dx0 + sw;
        const dy1 = dy0 + sh;
        const dx2 = dx1 + dw;
        const dy2 = dy1 + dh;
        // Top-left corner
        app.drawImage(dx0, dy0, sx0, sy0, sw, sh, undefined, sw, sh);
        // Top edge
        app.drawImage(dx1, dy0, sx1, sy0, sw, sh, undefined, dw, sh);
        // Top-right corner
        app.drawImage(dx2, dy0, sx2, sy0, sw, sh, undefined, sw, sh);
        // Left edge
        app.drawImage(dx0, dy1, sx0, sy1, sw, sh, undefined, sw, dh);
        // Center
        app.drawImage(dx1, dy1, sx1, sy1, sw, sh, undefined, dw, dh);
        // Right edge
        app.drawImage(dx2, dy1, sx2, sy1, sw, sh, undefined, sw, dh);
        // Bottom-left corner
        app.drawImage(dx0, dy2, sx0, sy2, sw, sh, undefined, sw, sh);
        // Bottom edge
        app.drawImage(dx1, dy2, sx1, sy2, sw, sh, undefined, dw, sh);
        // Bottom-right corner
        app.drawImage(dx2, dy2, sx2, sy2, sw, sh, undefined, sw, sh);
    }
}
exports.DialogRenderer = DialogRenderer;


/***/ }),

/***/ "./src/gui/imagepanel.ts":
/*!*******************************!*\
  !*** ./src/gui/imagepanel.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const panel_1 = __webpack_require__(/*! ./panel */ "./src/gui/panel.ts");
class ImagePanel extends panel_1.Panel {
    constructor(gui, srcRect, destRect) {
        super(gui, destRect);
        this.srcRect = srcRect;
    }
    drawContents() {
        const src = this.srcRect;
        const dst = this.rect;
        this.gui.app.drawImage(dst.x, dst.y, src.x, src.y, dst.width, dst.height);
    }
}
exports.ImagePanel = ImagePanel;


/***/ }),

/***/ "./src/gui/messagelog.ts":
/*!*******************************!*\
  !*** ./src/gui/messagelog.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __webpack_require__(/*! ../colors */ "./src/colors.ts");
const panel_1 = __webpack_require__(/*! ./panel */ "./src/gui/panel.ts");
class Message {
    constructor(text, color) {
        this.text = text;
        this.color = color;
    }
}
class MessageLog extends panel_1.Panel {
    constructor(gui, rect, maxItems) {
        super(gui, rect);
        this.messages = [];
        this.maxItems = maxItems || 5;
    }
    add(text, color) {
        this.messages.push(new Message(text, color || colors_1.Colors.WHITE));
        if (this.messages.length > this.maxItems) {
            this.messages.splice(0, this.messages.length - this.maxItems);
        }
    }
    drawContents() {
        const x = this.rect.x;
        let y = this.rect.y;
        if (y < 0) {
            // Negative y value indicates attached to bottom of screen
            const bottom = this.gui.app.size.height + y + this.rect.height;
            y = bottom - this.messages.length * 10;
        }
        for (let i = 0; i < this.messages.length; i++) {
            const msg = this.messages[i];
            this.gui.app.drawString(msg.text, x, y, msg.color);
            y += 10;
        }
    }
    handleInput() {
        return false;
    }
}
exports.MessageLog = MessageLog;


/***/ }),

/***/ "./src/gui/panel.ts":
/*!**************************!*\
  !*** ./src/gui/panel.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Panel {
    constructor(gui, rect, modal) {
        this.gui = gui;
        this.rect = rect;
        this.modal = !!modal;
    }
    drawContents() { }
    handleInput() {
        return false;
    }
}
exports.Panel = Panel;


/***/ }),

/***/ "./src/gui/selectdialog.ts":
/*!*********************************!*\
  !*** ./src/gui/selectdialog.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = __webpack_require__(/*! ../keys */ "./src/keys.ts");
const dialog_1 = __webpack_require__(/*! ./dialog */ "./src/gui/dialog.ts");
const MARGIN = 4;
const LINE_HEIGHT = 10;
class SelectDialog extends dialog_1.Dialog {
    constructor(gui, rect, title, options, callback) {
        super(gui, rect, title);
        this.options = options;
        this.callback = callback;
    }
    drawContents() {
        super.drawContents();
        const offset = this.rect;
        for (let i = 0; i < this.options.length; i++) {
            const str = String.fromCharCode(65 + i) + ' - ' + this.options[i].name;
            this.gui.app.drawString(str, offset.x + MARGIN, offset.y + MARGIN + i * LINE_HEIGHT);
        }
    }
    handleInput() {
        for (let i = 0; i < this.options.length; i++) {
            if (this.gui.app.isKeyPressed(keys_1.Keys.VK_A + i)) {
                this.callback(this.options[i]);
                this.close();
            }
        }
        if (this.gui.app.isKeyPressed(keys_1.Keys.VK_ESCAPE)) {
            this.close();
        }
        const mouse = this.gui.app.mouse;
        const offset = this.rect;
        if (mouse.upCount === 1 && mouse.x >= offset.x1 && mouse.x < offset.x2) {
            for (let i = 0; i < this.options.length; i++) {
                const startY = offset.y + MARGIN + i * LINE_HEIGHT;
                const endY = startY + LINE_HEIGHT;
                if (mouse.y >= startY && mouse.y < endY) {
                    this.callback(this.options[i]);
                    this.close();
                }
            }
        }
        return true;
    }
}
exports.SelectDialog = SelectDialog;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./app */ "./src/app.ts"));
__export(__webpack_require__(/*! ./appstate */ "./src/appstate.ts"));
__export(__webpack_require__(/*! ./color */ "./src/color.ts"));
__export(__webpack_require__(/*! ./colors */ "./src/colors.ts"));
__export(__webpack_require__(/*! ./entity */ "./src/entity.ts"));
__export(__webpack_require__(/*! ./game */ "./src/game.ts"));
__export(__webpack_require__(/*! ./ai/ai */ "./src/ai/ai.ts"));
__export(__webpack_require__(/*! ./ai/basicmonster */ "./src/ai/basicmonster.ts"));
__export(__webpack_require__(/*! ./ai/confusedmonster */ "./src/ai/confusedmonster.ts"));
__export(__webpack_require__(/*! ./effects/bumpeffect */ "./src/effects/bumpeffect.ts"));
__export(__webpack_require__(/*! ./effects/effect */ "./src/effects/effect.ts"));
__export(__webpack_require__(/*! ./effects/floatingtexteffect */ "./src/effects/floatingtexteffect.ts"));
__export(__webpack_require__(/*! ./effects/projectileeffect */ "./src/effects/projectileeffect.ts"));
__export(__webpack_require__(/*! ./effects/slideeffect */ "./src/effects/slideeffect.ts"));
__export(__webpack_require__(/*! ./gui */ "./src/gui.ts"));
__export(__webpack_require__(/*! ./gui/dialog */ "./src/gui/dialog.ts"));
__export(__webpack_require__(/*! ./gui/dialogrenderer */ "./src/gui/dialogrenderer.ts"));
__export(__webpack_require__(/*! ./gui/imagepanel */ "./src/gui/imagepanel.ts"));
__export(__webpack_require__(/*! ./gui/panel */ "./src/gui/panel.ts"));
__export(__webpack_require__(/*! ./gui/messagelog */ "./src/gui/messagelog.ts"));
__export(__webpack_require__(/*! ./gui/selectdialog */ "./src/gui/selectdialog.ts"));
__export(__webpack_require__(/*! ./input */ "./src/input.ts"));
__export(__webpack_require__(/*! ./keyboard */ "./src/keyboard.ts"));
__export(__webpack_require__(/*! ./keys */ "./src/keys.ts"));
__export(__webpack_require__(/*! ./path */ "./src/path.ts"));
__export(__webpack_require__(/*! ./vec2 */ "./src/vec2.ts"));
__export(__webpack_require__(/*! ./rect */ "./src/rect.ts"));
__export(__webpack_require__(/*! ./rng */ "./src/rng.ts"));
__export(__webpack_require__(/*! ./sprite */ "./src/sprite.ts"));
__export(__webpack_require__(/*! ./tilemap */ "./src/tilemap.ts"));


/***/ }),

/***/ "./src/input.ts":
/*!**********************!*\
  !*** ./src/input.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Input {
    constructor() {
        this.down = false;
        this.downCount = 0;
        this.upCount = 0;
    }
    update() {
        if (this.down) {
            this.downCount++;
            this.upCount = 0;
        }
        else {
            this.downCount = 0;
            this.upCount++;
        }
    }
}
exports.Input = Input;


/***/ }),

/***/ "./src/keyboard.ts":
/*!*************************!*\
  !*** ./src/keyboard.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = __webpack_require__(/*! ./input */ "./src/input.ts");
/**
 * Number of keys to track.
 */
const KEY_COUNT = 256;
class Keyboard {
    /**
     * Creates a new keyboard module.
     *
     * @param el DOM el to attach listeners.
     */
    constructor(el) {
        this.keys = new Array(KEY_COUNT);
        for (let i = 0; i < KEY_COUNT; i++) {
            this.keys[i] = new input_1.Input();
        }
        el.addEventListener('keydown', e => this.setKey(e, true));
        el.addEventListener('keyup', e => this.setKey(e, false));
    }
    setKey(e, state) {
        e.stopPropagation();
        e.preventDefault();
        const keyCode = e.keyCode;
        if (keyCode >= 0 && keyCode < KEY_COUNT) {
            this.keys[keyCode].down = state;
        }
    }
    update() {
        for (let i = 0; i < KEY_COUNT; i++) {
            if (this.keys[i].down) {
                this.keys[i].downCount++;
            }
            else {
                this.keys[i].downCount = 0;
            }
        }
    }
    getKey(keyCode) {
        return keyCode >= 0 && keyCode < KEY_COUNT ? this.keys[keyCode] : null;
    }
}
exports.Keyboard = Keyboard;


/***/ }),

/***/ "./src/keys.ts":
/*!*********************!*\
  !*** ./src/keys.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Keys {
}
Keys.VK_CANCEL = 3;
Keys.VK_HELP = 6;
Keys.VK_BACK_SPACE = 8;
Keys.VK_TAB = 9;
Keys.VK_CLEAR = 12;
Keys.VK_ENTER = 13;
Keys.VK_SHIFT = 16;
Keys.VK_CONTROL = 17;
Keys.VK_ALT = 18;
Keys.VK_PAUSE = 19;
Keys.VK_CAPS_LOCK = 20;
Keys.VK_ESCAPE = 27;
Keys.VK_SPACE = 32;
Keys.VK_PAGE_UP = 33;
Keys.VK_PAGE_DOWN = 34;
Keys.VK_END = 35;
Keys.VK_HOME = 36;
Keys.VK_LEFT = 37;
Keys.VK_UP = 38;
Keys.VK_RIGHT = 39;
Keys.VK_DOWN = 40;
Keys.VK_PRINTSCREEN = 44;
Keys.VK_INSERT = 45;
Keys.VK_DELETE = 46;
Keys.VK_0 = 48;
Keys.VK_1 = 49;
Keys.VK_2 = 50;
Keys.VK_3 = 51;
Keys.VK_4 = 52;
Keys.VK_5 = 53;
Keys.VK_6 = 54;
Keys.VK_7 = 55;
Keys.VK_8 = 56;
Keys.VK_9 = 57;
Keys.VK_COLON = 58;
Keys.VK_SEMICOLON = 59;
Keys.VK_LESS_THAN = 60;
Keys.VK_EQUALS = 61;
Keys.VK_GREATER_THAN = 62;
Keys.VK_QUESTION_MARK = 63;
Keys.VK_AT = 64;
Keys.VK_A = 65;
Keys.VK_B = 66;
Keys.VK_C = 67;
Keys.VK_D = 68;
Keys.VK_E = 69;
Keys.VK_F = 70;
Keys.VK_G = 71;
Keys.VK_H = 72;
Keys.VK_I = 73;
Keys.VK_J = 74;
Keys.VK_K = 75;
Keys.VK_L = 76;
Keys.VK_M = 77;
Keys.VK_N = 78;
Keys.VK_O = 79;
Keys.VK_P = 80;
Keys.VK_Q = 81;
Keys.VK_R = 82;
Keys.VK_S = 83;
Keys.VK_T = 84;
Keys.VK_U = 85;
Keys.VK_V = 86;
Keys.VK_W = 87;
Keys.VK_X = 88;
Keys.VK_Y = 89;
Keys.VK_Z = 90;
Keys.VK_CONTEXT_MENU = 93;
Keys.VK_NUMPAD0 = 96;
Keys.VK_NUMPAD1 = 97;
Keys.VK_NUMPAD2 = 98;
Keys.VK_NUMPAD3 = 99;
Keys.VK_NUMPAD4 = 100;
Keys.VK_NUMPAD5 = 101;
Keys.VK_NUMPAD6 = 102;
Keys.VK_NUMPAD7 = 103;
Keys.VK_NUMPAD8 = 104;
Keys.VK_NUMPAD9 = 105;
Keys.VK_MULTIPLY = 106;
Keys.VK_ADD = 107;
Keys.VK_SEPARATOR = 108;
Keys.VK_SUBTRACT = 109;
Keys.VK_DECIMAL = 110;
Keys.VK_DIVIDE = 111;
Keys.VK_F1 = 112;
Keys.VK_F2 = 113;
Keys.VK_F3 = 114;
Keys.VK_F4 = 115;
Keys.VK_F5 = 116;
Keys.VK_F6 = 117;
Keys.VK_F7 = 118;
Keys.VK_F8 = 119;
Keys.VK_F9 = 120;
Keys.VK_F10 = 121;
Keys.VK_F11 = 122;
Keys.VK_F12 = 123;
Keys.VK_F13 = 124;
Keys.VK_F14 = 125;
Keys.VK_F15 = 126;
Keys.VK_F16 = 127;
Keys.VK_F17 = 128;
Keys.VK_F18 = 129;
Keys.VK_F19 = 130;
Keys.VK_F20 = 131;
Keys.VK_F21 = 132;
Keys.VK_F22 = 133;
Keys.VK_F23 = 134;
Keys.VK_F24 = 135;
Keys.VK_NUM_LOCK = 144;
Keys.VK_SCROLL_LOCK = 145;
Keys.VK_CIRCUMFLEX = 160;
Keys.VK_EXCLAMATION = 161;
Keys.VK_DOUBLE_QUOTE = 162;
Keys.VK_HASH = 163;
Keys.VK_DOLLAR = 164;
Keys.VK_PERCENT = 165;
Keys.VK_AMPERSAND = 166;
Keys.VK_UNDERSCORE = 167;
Keys.VK_OPEN_PAREN = 168;
Keys.VK_CLOSE_PAREN = 169;
Keys.VK_ASTERISK = 170;
Keys.VK_PLUS = 171;
Keys.VK_PIPE = 172;
Keys.VK_HYPHEN_MINUS = 173;
Keys.VK_OPEN_CURLY_BRACKET = 174;
Keys.VK_CLOSE_CURLY_BRACKET = 175;
Keys.VK_TILDE = 176;
Keys.VK_COMMA = 188;
Keys.VK_PERIOD = 190;
Keys.VK_SLASH = 191;
Keys.VK_BACK_QUOTE = 192;
Keys.VK_OPEN_BRACKET = 219;
Keys.VK_BACK_SLASH = 220;
Keys.VK_CLOSE_BRACKET = 221;
Keys.VK_QUOTE = 222;
Keys.VK_META = 224;
Keys.VK_ALTGR = 225;
Keys.VK_WIN = 91;
Keys.VK_KANA = 21;
Keys.VK_HANGUL = 21;
Keys.VK_EISU = 22;
Keys.VK_JUNJA = 23;
Keys.VK_FINAL = 24;
Keys.VK_HANJA = 25;
Keys.VK_KANJI = 25;
Keys.VK_CONVERT = 28;
Keys.VK_NONCONVERT = 29;
Keys.VK_ACCEPT = 30;
Keys.VK_MODECHANGE = 31;
Keys.VK_SELECT = 41;
Keys.VK_PRINT = 42;
Keys.VK_EXECUTE = 43;
Keys.VK_SLEEP = 95;
exports.Keys = Keys;


/***/ }),

/***/ "./src/mouse.ts":
/*!**********************!*\
  !*** ./src/mouse.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = __webpack_require__(/*! ./input */ "./src/input.ts");
const rect_1 = __webpack_require__(/*! ./rect */ "./src/rect.ts");
class Mouse extends input_1.Input {
    constructor(app) {
        super();
        this.app = app;
        this.prevX = 0;
        this.prevY = 0;
        this.startX = 0;
        this.startY = 0;
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        const el = app.canvas;
        const mouseEventHandler = this.handleEvent.bind(this);
        el.addEventListener('mousedown', mouseEventHandler);
        el.addEventListener('mouseup', mouseEventHandler);
        el.addEventListener('mousemove', mouseEventHandler);
        el.addEventListener('contextmenu', mouseEventHandler);
        const touchEventHandler = this.handleTouchEvent.bind(this);
        el.addEventListener('touchstart', touchEventHandler);
        el.addEventListener('touchend', touchEventHandler);
        el.addEventListener('touchcancel', touchEventHandler);
        el.addEventListener('touchmove', touchEventHandler);
    }
    handleTouchEvent(e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            this.updatePosition(touch.clientX, touch.clientY);
            this.down = true;
        }
        else {
            this.down = false;
        }
    }
    handleEvent(e) {
        e.stopPropagation();
        e.preventDefault();
        this.updatePosition(e.clientX, e.clientY);
        if (e.type === 'mousedown') {
            this.down = true;
            this.startX = this.x;
            this.startY = this.y;
            this.app.canvas.focus();
        }
        if (e.type === 'mouseup') {
            this.down = false;
        }
    }
    updatePosition(clientX, clientY) {
        let rect = this.app.canvas.getBoundingClientRect();
        // If the client rect is not the same aspect ratio as canvas,
        // then we are fullscreen.
        // Need to update client rect accordingly.
        const terminalAspectRatio = this.app.size.width / this.app.size.height;
        const rectAspectRatio = rect.width / rect.height;
        if (rectAspectRatio - terminalAspectRatio > 0.01) {
            const actualWidth = terminalAspectRatio * rect.height;
            const excess = rect.width - actualWidth;
            rect = new rect_1.Rect(Math.floor(excess / 2), 0, actualWidth, rect.height);
        }
        if (rectAspectRatio - terminalAspectRatio < -0.01) {
            const actualHeight = rect.width / terminalAspectRatio;
            const excess = rect.height - actualHeight;
            rect = new rect_1.Rect(0, Math.floor(excess / 2), rect.width, actualHeight);
        }
        this.x = (this.app.size.width * (clientX - rect.left) / rect.width) | 0;
        this.y = (this.app.size.height * (clientY - rect.top) / rect.height) | 0;
    }
    update() {
        super.update();
        this.dx = this.x - this.prevX;
        this.dy = this.y - this.prevY;
        this.prevX = this.x;
        this.prevY = this.y;
    }
    isClicked() {
        return this.upCount === 1 && Math.hypot(this.x - this.startX, this.y - this.startY) < 16;
    }
}
exports.Mouse = Mouse;


/***/ }),

/***/ "./src/path.ts":
/*!*********************!*\
  !*** ./src/path.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// const dxs = [-1, 0, 1, -1, 1, -1, 0, 1];
// const dys = [-1, -1, -1, 0, 0, 1, 1, 1];
// const costs = [1.5, 1, 1.5, 1, 1, 1.5, 1, 1.5];
const dxs = [0, -1, 1, 0];
const dys = [-1, 0, 0, 1];
const costs = [1, 1, 1, 1];
/**
 * Calculates Dijkstra's algorithm.
 *
 * @param {!Object} source Starting point, must have x and y properties.
 * @param {!Object=} dest Optional destination point, must have x and y properties.
 * @param {!number=} maxDist Optional maximum distance to examine.
 * @return {?Array} Array of steps if destination found; null otherwise.
 */
function computePath(map, source, dest, maxDist) {
    clearDijkstra(map, dest);
    const sourceCell = map.grid[source.y][source.x];
    sourceCell.g = 0.0;
    const q = [sourceCell];
    while (q.length > 0) {
        const u = getMinCell(q);
        if (u.x === dest.x && u.y === dest.y) {
            return buildPath(u);
        }
        for (let i = 0; i < dxs.length; i++) {
            const x = u.x + dxs[i];
            const y = u.y + dys[i];
            if (x >= 0 && x < map.width && y >= 0 && y < map.height) {
                const v = map.grid[y][x];
                const alt = u.g + costs[i];
                if (alt < v.g && alt <= maxDist && !map.grid[y][x].blocked) {
                    v.g = alt;
                    v.prev = u;
                    q.push(v);
                }
            }
        }
    }
    return undefined;
}
exports.computePath = computePath;
function clearDijkstra(map, dest) {
    for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
            const cell = map.grid[y][x];
            cell.g = Infinity;
            cell.h = Math.min(Math.abs(x - dest.x), Math.abs(y - dest.y));
            cell.prev = null;
        }
    }
}
function getMinCell(q) {
    let bestCell = null;
    let bestIndex = -1;
    let minDist = Infinity;
    for (let i = 0; i < q.length; i++) {
        const cell = q[i];
        if (cell.g !== Infinity && cell.g + cell.h < minDist) {
            bestCell = cell;
            bestIndex = i;
            minDist = cell.g + cell.h;
        }
    }
    q.splice(bestIndex, 1);
    return bestCell;
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


/***/ }),

/***/ "./src/rect.ts":
/*!*********************!*\
  !*** ./src/rect.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vec2_1 = __webpack_require__(/*! ./vec2 */ "./src/vec2.ts");
class Rect extends vec2_1.Vec2 {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
    }
    get x1() {
        return this.x;
    }
    get y1() {
        return this.y;
    }
    get x2() {
        return this.x + this.width;
    }
    get y2() {
        return this.y + this.height;
    }
    get left() {
        return this.x;
    }
    get top() {
        return this.y;
    }
    getCenter() {
        return new vec2_1.Vec2(this.x + (this.width / 2) | 0, this.y + (this.height / 2) | 0);
    }
    intersects(other) {
        return this.x <= other.x2 && this.x2 >= other.x && this.y <= other.y2 && this.y2 >= other.y;
    }
}
exports.Rect = Rect;


/***/ }),

/***/ "./src/renderset.ts":
/*!**************************!*\
  !*** ./src/renderset.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const glutils_1 = __webpack_require__(/*! ./glutils */ "./src/glutils.ts");
/**
 * Maximum number of elements per buffer.
 *
 * Some browsers / video cards allow large buffers, but 16-bit is the safe max.
 * https://stackoverflow.com/a/5018021/2051724
 *
 * @const {number}
 */
const BUFFER_SIZE = 65536;
const spriteVertexShader = 'uniform vec2 u_viewportSize;' +
    'attribute vec2 a_position;' +
    'attribute vec2 a_texCoord;' +
    'attribute vec4 a_color;' +
    'varying vec2 v_texCoord;' +
    'varying vec4 v_color;' +
    'void main() {' +
    // convert the rectangle from pixels to 0.0 to 1.0
    'vec2 zeroToOne = a_position / u_viewportSize;' +
    // convert from 0->1 to 0->2
    'vec2 zeroToTwo = zeroToOne * 2.0;' +
    // convert from 0->2 to -1->+1 (clipspace)
    'vec2 clipSpace = zeroToTwo - 1.0;' +
    'gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);' +
    // pass the texCoord to the fragment shader
    // The GPU will interpolate this value between points.
    'v_texCoord = a_texCoord;' +
    'v_color = a_color;' +
    '}';
const spriteFragmentShader = 'precision highp float;' +
    // our texture
    'uniform sampler2D u_image;' +
    // the texCoords passed in from the vertex shader.
    'varying vec2 v_texCoord;' +
    // the color overrides passed in from the vertex shader.
    'varying vec4 v_color;' +
    'void main() {' +
    'gl_FragColor = texture2D(u_image, v_texCoord);' +
    'if (gl_FragColor.a < 0.1) discard;' +
    'if (v_color.a > 0.5) gl_FragColor = v_color;' +
    '}';
class RenderSet {
    constructor(gl, url, font) {
        this.gl = gl;
        this.font = font;
        const program = glutils_1.initShaderProgram(gl, spriteVertexShader, spriteFragmentShader);
        this.program = program;
        this.viewportSizeLocation = gl.getUniformLocation(program, 'u_viewportSize');
        this.positionLocation = gl.getAttribLocation(program, 'a_position');
        this.texcoordLocation = gl.getAttribLocation(program, 'a_texCoord');
        this.colorLocation = gl.getAttribLocation(program, 'a_color');
        this.positionBuffer = gl.createBuffer();
        this.texcoordBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
        this.spriteTexture = glutils_1.createTexture(gl, url);
        this.positionArray = new Float32Array(BUFFER_SIZE);
        this.positionArrayIndex = 0;
        this.texcoordArray = new Float32Array(BUFFER_SIZE);
        this.texcoordArrayIndex = 0;
        this.colorUint8Array = new Uint8Array(BUFFER_SIZE);
        this.colorDataView = new DataView(this.colorUint8Array.buffer);
        this.colorArrayIndex = 0;
    }
    /**
     * Draws a string horizontally centered.
     * @param {string} str The text string to draw.
     * @param {number} x The x-coordinate of the center.
     * @param {number} y The y-coordinate of the top-left corner.
     * @param {number=} color Optional color.
     */
    drawCenteredString(str, x, y, color) {
        const x2 = x - (this.font.getStringWidth(str) / 2) | 0;
        this.drawString(str, x2, y, color);
    }
    /**
     * Draws a string.
     * @param {string} str The text string to draw.
     * @param {number} x0 The x-coordinate of the top-left corner.
     * @param {number} y0 The y-coordinate of the top-left corner.
     * @param {number=} color Optional color.
     */
    drawString(str, x0, y0, color) {
        const lines = str.split('\n');
        const height = this.font.getHeight();
        let y = y0;
        for (let i = 0; i < lines.length; i++) {
            let x = x0;
            for (let j = 0; j < lines[i].length; j++) {
                const charCode = lines[i].charCodeAt(j);
                if (this.font.isInRange(charCode)) {
                    const offset = this.font.getOffset(charCode);
                    const width = this.font.getWidth(charCode);
                    this.drawImage(x, y, offset, 0, width, height, color);
                    x += width;
                }
            }
            y += height;
        }
    }
    /**
     * Draws a character.
     * @param {number} c The ASCII character code.
     * @param {number} x The x-coordinate of the top-left corner.
     * @param {number} y The y-coordinate of the top-left corner.
     * @param {number=} color Optional color.
     */
    drawChar(c, x, y, color) {
        if (this.font.isInRange(c)) {
            const offset = this.font.getOffset(c);
            const width = this.font.getWidth(c);
            const height = this.font.getHeight();
            this.drawImage(x, y, offset, 0, width, height, color);
        }
    }
    /**
     * Draws a sprite.
     * @param {number} x The x-coordinate of the top-left corner on the screen.
     * @param {number} y The y-coordinate of the top-left corner on the screen.
     * @param {number} u The x-coordinate of the top-left corner on the sprite sheet.
     * @param {number} v The y-coordinate of the top-left corner on the sprite sheet.
     * @param {number} w The width of the sprite.
     * @param {number} h The height of the sprite.
     * @param {number=} color Optional color.
     * @param {number=} dw Optional destination width.
     * @param {number=} dh Optional destination height.
     */
    drawImage(x, y, u, v, w, h, optColor, optDw, optDh) {
        const spriteTexture = this.spriteTexture;
        if (!spriteTexture.loaded) {
            return;
        }
        const dw = optDw !== undefined ? optDw : w;
        const dh = optDh !== undefined ? optDh : h;
        const x2 = x + Math.abs(dw);
        const y2 = y + dh;
        const tx = u / spriteTexture.width;
        const ty = v / spriteTexture.height;
        const tx2 = (u + w) / spriteTexture.width;
        const ty2 = (v + h) / spriteTexture.height;
        const color = optColor || 0;
        // First triangle
        this.positionArray[this.positionArrayIndex++] = x;
        this.positionArray[this.positionArrayIndex++] = y;
        this.positionArray[this.positionArrayIndex++] = x2;
        this.positionArray[this.positionArrayIndex++] = y;
        this.positionArray[this.positionArrayIndex++] = x;
        this.positionArray[this.positionArrayIndex++] = y2;
        this.texcoordArray[this.texcoordArrayIndex++] = tx;
        this.texcoordArray[this.texcoordArrayIndex++] = ty;
        this.texcoordArray[this.texcoordArrayIndex++] = tx2;
        this.texcoordArray[this.texcoordArrayIndex++] = ty;
        this.texcoordArray[this.texcoordArrayIndex++] = tx;
        this.texcoordArray[this.texcoordArrayIndex++] = ty2;
        // Second triangle
        this.positionArray[this.positionArrayIndex++] = x;
        this.positionArray[this.positionArrayIndex++] = y2;
        this.positionArray[this.positionArrayIndex++] = x2;
        this.positionArray[this.positionArrayIndex++] = y;
        this.positionArray[this.positionArrayIndex++] = x2;
        this.positionArray[this.positionArrayIndex++] = y2;
        this.texcoordArray[this.texcoordArrayIndex++] = tx;
        this.texcoordArray[this.texcoordArrayIndex++] = ty2;
        this.texcoordArray[this.texcoordArrayIndex++] = tx2;
        this.texcoordArray[this.texcoordArrayIndex++] = ty;
        this.texcoordArray[this.texcoordArrayIndex++] = tx2;
        this.texcoordArray[this.texcoordArrayIndex++] = ty2;
        for (let i = 0; i < 6; i++) {
            this.colorDataView.setUint32(this.colorArrayIndex, color, false);
            this.colorArrayIndex += 4;
        }
    }
    /**
     * Renders all sprites in the sprite buffers to the screen.
     * @param {number} width Viewport width.
     * @param {number} height Viewport height.
     */
    flush(width, height) {
        if (!this.spriteTexture.loaded || this.positionArrayIndex === 0) {
            return;
        }
        const gl = this.gl;
        // Tell it to use our program (pair of shaders)
        gl.useProgram(this.program);
        // Update the viewport
        gl.uniform2f(this.viewportSizeLocation, width, height);
        // Use the leonardo spriteTexture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.spriteTexture);
        {
            // Bind the position buffer.
            gl.enableVertexAttribArray(this.positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.positionArray, gl.DYNAMIC_DRAW);
            // Tell the position attribute how to get data out of positionBuffer
            // (ARRAY_BUFFER)
            const size = 2; // 2 components per iteration
            const type = gl.FLOAT; // the data is 32bit floats
            const normalize = false; // don't normalize the data
            const stride = 0; // 0 = move forward size * sizeof(type) each iteration
            // to get the next position
            const offset = 0; // start at the beginning of the buffer
            gl.vertexAttribPointer(this.positionLocation, size, type, normalize, stride, offset);
        }
        {
            // Bind the texture coordinate buffer.
            gl.enableVertexAttribArray(this.texcoordLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.texcoordArray, gl.DYNAMIC_DRAW);
            // Tell the position attribute how to get data out of positionBuffer
            // (ARRAY_BUFFER)
            const size = 2; // 2 components per iteration
            const type = gl.FLOAT; // the data is 32bit floats
            const normalize = false; // don't normalize the data
            const stride = 0; // 0 = move forward size * sizeof(type) each iteration
            // to get the next position
            const offset = 0; // start at the beginning of the buffer
            gl.vertexAttribPointer(this.texcoordLocation, size, type, normalize, stride, offset);
        }
        {
            // Bind the color buffer.
            gl.enableVertexAttribArray(this.colorLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.colorUint8Array, gl.DYNAMIC_DRAW);
            // Tell the position attribute how to get data out of positionBuffer
            // (ARRAY_BUFFER)
            const size = 4; // 4 components per iteration
            const type = gl.UNSIGNED_BYTE; // the data is 8-bit unsigned bytes
            const normalize = true; // Normalize from 0-255 to 0.0-1.0
            const stride = 0; // 0 = move forward size * sizeof(type) each iteration
            // to get the next position
            const offset = 0; // start at the beginning of the buffer
            gl.vertexAttribPointer(this.colorLocation, size, type, normalize, stride, offset);
        }
        // Draw the rectangle.
        const primitiveType = gl.TRIANGLES;
        const offset = 0;
        const count = this.positionArrayIndex / 2;
        gl.drawArrays(primitiveType, offset, count);
    }
}
exports.RenderSet = RenderSet;


/***/ }),

/***/ "./src/rng.ts":
/*!********************!*\
  !*** ./src/rng.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Random number generator.
 *
 * LCG
 * https://stackoverflow.com/a/424445/2051724
 */
class RNG {
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
        return start + ((randomUnder1 * rangeSize) | 0);
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
        const values = [];
        const chances = [];
        for (const property in chancesMap) {
            if (chancesMap.hasOwnProperty(property)) {
                values.push(property);
                chances.push(chancesMap[property]);
            }
        }
        return values[this.chooseIndex(chances)];
    }
}
exports.RNG = RNG;


/***/ }),

/***/ "./src/sprite.ts":
/*!***********************!*\
  !*** ./src/sprite.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_TICKS_PER_FRAME = 30;
class Sprite {
    constructor(x, y, width, height, frames, loop, ticksPerFrame, colorOverride) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frames = frames || 1;
        this.loop = !!loop;
        this.ticksPerFrame = ticksPerFrame || DEFAULT_TICKS_PER_FRAME;
        this.colorOverride = colorOverride;
        this.animIndex = 0;
        this.animDelay = 0;
    }
    draw(app, x, y) {
        let frame = this.animIndex;
        if (this.loop) {
            frame = ((Sprite.globalAnimIndex / this.ticksPerFrame) | 0) % this.frames;
        }
        const u = this.x + frame * this.width;
        const v = this.y;
        app.drawImage(x, y, u, v, this.width, this.height, this.colorOverride);
        this.animDelay++;
        if (this.animDelay > this.ticksPerFrame) {
            this.animDelay = 0;
            this.animIndex++;
            if (this.animIndex >= this.frames) {
                if (this.loop) {
                    this.animIndex = 0;
                }
                else {
                    this.animIndex = this.frames - 1;
                }
            }
        }
    }
    static updateGlobalAnimations() {
        Sprite.globalAnimIndex++;
    }
}
Sprite.globalAnimIndex = 0;
exports.Sprite = Sprite;


/***/ }),

/***/ "./src/tilemap.ts":
/*!************************!*\
  !*** ./src/tilemap.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const glutils_1 = __webpack_require__(/*! ./glutils */ "./src/glutils.ts");
const vec2_1 = __webpack_require__(/*! ./vec2 */ "./src/vec2.ts");
const TILE_SIZE = 16;
const TEXTURE_SIZE = 1024;
// Shader
const tilemapVS = 'precision highp float;' +
    'attribute vec2 position;' +
    'attribute vec2 texture;' +
    'varying vec2 pixelCoord;' +
    'varying vec2 texCoord;' +
    'uniform vec2 viewOffset;' +
    'uniform vec2 viewportSize;' +
    'uniform vec2 tileSize;' +
    'uniform vec2 mapSize;' +
    'void main(void) {' +
    '   pixelCoord = (texture * viewportSize) + viewOffset;' +
    '   texCoord = pixelCoord / mapSize / tileSize;' +
    '   gl_Position = vec4(position, 0.0, 1.0);' +
    '}';
const tilemapFS = 'precision highp float;' +
    'varying vec2 pixelCoord;' +
    'varying vec2 texCoord;' +
    'uniform vec2 tileSize;' +
    'uniform sampler2D tiles;' +
    'uniform sampler2D sprites;' +
    'void main(void) {' +
    '   vec4 tile = texture2D(tiles, texCoord);' +
    '   if(tile.x == 1.0 && tile.y == 1.0) { discard; }' +
    '   vec2 spriteOffset = floor(tile.xy * 256.0) * tileSize;' +
    '   vec2 spriteCoord = mod(pixelCoord, tileSize);' +
    '   gl_FragColor = texture2D(sprites, (spriteOffset + spriteCoord) / ' + TEXTURE_SIZE + '.0);' +
    '   gl_FragColor.a = tile.a;' +
    '}';
class TileMapCell extends vec2_1.Vec2 {
    constructor(x, y, tile) {
        super(x, y);
        this.tile = tile;
        this.blocked = true;
        this.visible = false;
        this.seen = false;
        this.g = 0;
        this.h = 0;
        this.prev = null;
    }
}
exports.TileMapCell = TileMapCell;
/**
 * @constructor
 * @param {number} width
 * @param {number} height
 */
class TileMapLayer {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.imageData = new Uint8Array(4 * width * height);
        this.dimensions = new Float32Array([width, height]);
        this.texture = null;
        this.clear();
    }
    clear() {
        for (let i = 0; i < this.imageData.length; i++) {
            this.imageData[i] = 255;
        }
    }
    setAlpha(x, y, alpha) {
        this.imageData[4 * (y * this.width + x) + 3] = alpha;
    }
    initGl(gl) {
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.imageData);
        // MUST be filtered with NEAREST or tile lookup fails
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    updateGl(gl) {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, this.imageData);
    }
}
exports.TileMapLayer = TileMapLayer;
/**
 * @constructor
 * @param {number} width
 * @param {number} height
 * @param {number} layerCount
 */
class TileMap {
    constructor(gl, width, height, layerCount) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.grid = new Array(height);
        this.layers = new Array(layerCount);
        this.tileWidth = 16;
        this.tileHeight = 16;
        // Field-of-view state
        // By default, everything is visible
        this.originX = 0;
        this.originY = 0;
        this.minX = 0;
        this.maxX = width - 1;
        this.minY = 0;
        this.maxY = height - 1;
        for (let y = 0; y < height; y++) {
            this.grid[y] = new Array(width);
            for (let x = 0; x < width; x++) {
                this.grid[y][x] = new TileMapCell(x, y, 0);
            }
        }
        for (let i = 0; i < layerCount; i++) {
            this.layers[i] = new TileMapLayer(width, height);
        }
        const quadVerts = [
            // x  y  u  v
            -1, -1, 0, 1, 1, -1, 1, 1, 1, 1, 1, 0,
            -1, -1, 0, 1, 1, 1, 1, 0, -1, 1, 0, 0
        ];
        this.quadVertBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVerts), gl.STATIC_DRAW);
        this.tilemapShader = glutils_1.initShaderProgram(gl, tilemapVS, tilemapFS);
        this.positionAttribute = gl.getAttribLocation(this.tilemapShader, 'position');
        this.textureAttribute = gl.getAttribLocation(this.tilemapShader, 'texture');
        this.viewportSizeUniform = gl.getUniformLocation(this.tilemapShader, 'viewportSize');
        this.viewOffsetUniform = gl.getUniformLocation(this.tilemapShader, 'viewOffset');
        this.mapSizeUniform = gl.getUniformLocation(this.tilemapShader, 'mapSize');
        this.tileSizeUniform = gl.getUniformLocation(this.tilemapShader, 'tileSize');
        this.tileSamplerUniform = gl.getUniformLocation(this.tilemapShader, 'tiles');
        this.spriteSamplerUniform = gl.getUniformLocation(this.tilemapShader, 'sprites');
        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i].initGl(gl);
        }
    }
    setTile(layerIndex, x, y, tile, blocked) {
        this.grid[y][x].tile = tile;
        this.grid[y][x].blocked = !!blocked;
        const layer = this.layers[layerIndex];
        const ti = 4 * (y * layer.width + x);
        const tx = tile === 0 ? 255 : ((tile - 1) % 64) | 0;
        const ty = tile === 0 ? 255 : ((tile - 1) / 64) | 0;
        layer.imageData[ti + 0] = tx;
        layer.imageData[ti + 1] = ty;
    }
    getCell(tx, ty) {
        if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) {
            return null;
        }
        return this.grid[ty][tx];
    }
    getTile(tx, ty) {
        const cell = this.getCell(tx, ty);
        return cell ? cell.tile : 0;
    }
    isBlocked(tx, ty) {
        const cell = this.getCell(tx, ty);
        return !cell || cell.blocked;
    }
    isVisible(x, y) {
        if (x < this.minX || x > this.maxX || y < this.minY || y > this.maxY) {
            return false;
        }
        return this.grid[y][x].visible;
    }
    isSeen(tx, ty) {
        const cell = this.getCell(tx, ty);
        return cell && cell.seen;
    }
    setSeen(tx, ty, seen) {
        const cell = this.getCell(tx, ty);
        if (cell) {
            cell.seen = seen;
        }
    }
    draw(x, y, width, height) {
        const gl = this.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(this.tilemapShader);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVertBuffer);
        gl.enableVertexAttribArray(this.positionAttribute);
        gl.enableVertexAttribArray(this.textureAttribute);
        gl.vertexAttribPointer(this.positionAttribute, 2, gl.FLOAT, false, 16, 0);
        gl.vertexAttribPointer(this.textureAttribute, 2, gl.FLOAT, false, 16, 8);
        gl.uniform2f(this.viewOffsetUniform, x, y);
        gl.uniform2f(this.viewportSizeUniform, width, height);
        gl.uniform2f(this.tileSizeUniform, this.tileWidth, this.tileHeight);
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(this.spriteSamplerUniform, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.uniform1i(this.tileSamplerUniform, 1);
        const tx1 = (x / this.tileWidth) | 0;
        const ty1 = (y / this.tileHeight) | 0;
        const tx2 = ((x + width) / this.tileWidth) | 0;
        const ty2 = ((y + height) / this.tileHeight) | 0;
        // Draw each layer of the map
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            for (let ty = ty1; ty <= ty2; ty++) {
                for (let tx = tx1; tx <= tx2; tx++) {
                    const alpha = this.isVisible(tx, ty) ? 255 : this.isSeen(tx, ty) ? 144 : 0;
                    layer.setAlpha(tx, ty, alpha);
                }
            }
            gl.uniform2fv(this.mapSizeUniform, layer.dimensions);
            gl.bindTexture(gl.TEXTURE_2D, layer.texture);
            layer.updateGl(gl);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }
    resetFov() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x].seen = false;
                this.grid[y][x].visible = false;
            }
        }
    }
    computeFov(originX, originY, radius) {
        this.originX = originX;
        this.originY = originY;
        this.minX = Math.max(0, originX - radius);
        this.minY = Math.max(0, originY - radius);
        this.maxX = Math.min(this.width - 1, originX + radius);
        this.maxY = Math.min(this.height - 1, originY + radius);
        for (let y = this.minY; y <= this.maxY; y++) {
            for (let x = this.minX; x <= this.maxX; x++) {
                this.grid[y][x].seen = this.grid[y][x].seen || this.grid[y][x].visible;
                this.grid[y][x].visible = false;
            }
        }
        this.grid[originY][originX].visible = true;
        this.computeOctantY(1, 1);
        this.computeOctantX(1, 1);
        this.computeOctantY(1, -1);
        this.computeOctantX(1, -1);
        this.computeOctantY(-1, 1);
        this.computeOctantX(-1, 1);
        this.computeOctantY(-1, -1);
        this.computeOctantX(-1, -1);
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
            for (processedCell = Math.floor(minSlope * iteration + 0.5), x = this.originX + (processedCell * deltaX); processedCell <= iteration && x >= this.minX && x <= this.maxX; x += deltaX, ++processedCell, previousEndSlope = endSlope) {
                visible = true;
                extended = false;
                centreSlope = processedCell / iteration;
                startSlope = previousEndSlope;
                endSlope = centreSlope + halfSlope;
                if (obstaclesInLastLine > 0) {
                    if (!(this.grid[y - deltaY][x].visible && !this.grid[y - deltaY][x].blocked) &&
                        !(this.grid[y - deltaY][x - deltaX].visible && !this.grid[y - deltaY][x - deltaX].blocked)) {
                        visible = false;
                    }
                    else {
                        for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
                            if (startSlope <= endSlopes[idx] && endSlope >= startSlopes[idx]) {
                                if (!this.grid[y][x].blocked) {
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
                    if (this.grid[y][x].blocked) {
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
            for (processedCell = Math.floor(minSlope * iteration + 0.5), y = this.originY + (processedCell * deltaY); processedCell <= iteration && y >= this.minY && y <= this.maxY; y += deltaY, ++processedCell, previousEndSlope = endSlope) {
                visible = true;
                extended = false;
                centreSlope = processedCell / iteration;
                startSlope = previousEndSlope;
                endSlope = centreSlope + halfSlope;
                if (obstaclesInLastLine > 0) {
                    if (!(this.grid[y][x - deltaX].visible && !this.grid[y][x - deltaX].blocked) &&
                        !(this.grid[y - deltaY][x - deltaX].visible && !this.grid[y - deltaY][x - deltaX].blocked)) {
                        visible = false;
                    }
                    else {
                        for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
                            if (startSlope <= endSlopes[idx] && endSlope >= startSlopes[idx]) {
                                if (!this.grid[y][x].blocked) {
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
                    if (this.grid[y][x].blocked) {
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
}
exports.TileMap = TileMap;


/***/ }),

/***/ "./src/vec2.ts":
/*!*********************!*\
  !*** ./src/vec2.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(delta) {
        this.x += delta.x;
        this.y += delta.y;
    }
}
exports.Vec2 = Vec2;


/***/ }),

/***/ "./src/xarray.ts":
/*!***********************!*\
  !*** ./src/xarray.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class XArray extends Array {
    remove(el) {
        const index = this.indexOf(el);
        if (index >= 0) {
            this.splice(index, 1);
        }
    }
}
exports.XArray = XArray;


/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map