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

/***/ "./src/ability.ts":
/*!************************!*\
  !*** ./src/ability.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TargetType;
(function (TargetType) {
    TargetType[TargetType["SELF"] = 0] = "SELF";
    TargetType[TargetType["ENTITY"] = 1] = "ENTITY";
    TargetType[TargetType["TILE"] = 2] = "TILE";
})(TargetType = exports.TargetType || (exports.TargetType = {}));


/***/ }),

/***/ "./src/actor.ts":
/*!**********************!*\
  !*** ./src/actor.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ability_1 = __webpack_require__(/*! ./ability */ "./src/ability.ts");
const bumpanimation_1 = __webpack_require__(/*! ./animations/bumpanimation */ "./src/animations/bumpanimation.ts");
const floatingtextanimation_1 = __webpack_require__(/*! ./animations/floatingtextanimation */ "./src/animations/floatingtextanimation.ts");
const slideanimation_1 = __webpack_require__(/*! ./animations/slideanimation */ "./src/animations/slideanimation.ts");
const arraylist_1 = __webpack_require__(/*! ./arraylist */ "./src/arraylist.ts");
const entity_1 = __webpack_require__(/*! ./entity */ "./src/entity.ts");
const serializable_1 = __webpack_require__(/*! ./serializable */ "./src/serializable.ts");
let Actor = class Actor extends entity_1.Entity {
    constructor(game, x, y, name, sprite, blocks) {
        super(game, x, y, name, sprite, blocks);
        this.hp = 100;
        this.maxHp = 100;
        this.ap = 1;
        this.maxAp = 1;
        this.inventory = new arraylist_1.ArrayList();
        this.talents = new arraylist_1.ArrayList();
        this.visibleDuration = -1;
        this.seen = false;
    }
    startTurn() {
        this.ap = this.maxAp;
        for (let j = 0; j < this.talents.length; j++) {
            const talent = this.talents.get(j);
            if (talent.cooldown > 0) {
                talent.cooldown--;
            }
        }
    }
    move(dx, dy, slideCount) {
        const destX = this.x + dx;
        const destY = this.y + dy;
        // TODO: Enforce diagonal vs cardinal movement?
        if (this.blocks) {
            // If this actor blocks (default), then check for walls and entities
            if (this.game.isBlocked(destX, destY)) {
                return false;
            }
        }
        else {
            // If this actor does *not* block, then only check tile map.
            if (this.game.tileMap.isBlocked(destX, destY)) {
                return false;
            }
        }
        // The actor technically moves instantly.
        // However, we set the offset such that it looks like the actor slides over time.
        this.x = destX;
        this.y = destY;
        this.ap--;
        this.offset.x = -dx * this.game.tileSize.width;
        this.offset.y = -dy * this.game.tileSize.height;
        // Now create the slide animation
        const count = slideCount || 4;
        const xSpeed = this.game.tileSize.width / count;
        const ySpeed = this.game.tileSize.height / count;
        this.game.animations.push(new slideanimation_1.SlideAnimation(this, dx * xSpeed, dy * ySpeed, count));
        this.game.blocked = true;
        return true;
    }
    moveTo(destX, destY, slideCount) {
        return this.move(destX - this.x, destY - this.y, slideCount);
    }
    moveToward(targetX, targetY, slideCount) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        if (dx < 0 && dy < 0 && this.move(-1, -1, slideCount)) {
            return true;
        }
        if (dx < 0 && dy > 0 && this.move(-1, 1, slideCount)) {
            return true;
        }
        if (dx > 0 && dy < 0 && this.move(1, -1, slideCount)) {
            return true;
        }
        if (dx > 0 && dy > 0 && this.move(1, 1, slideCount)) {
            return true;
        }
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0 && this.move(-1, 0, slideCount)) {
                return true;
            }
            if (dx > 0 && this.move(1, 0, slideCount)) {
                return true;
            }
            if (dy < 0 && this.move(0, -1, slideCount)) {
                return true;
            }
            if (dy > 0 && this.move(0, 1, slideCount)) {
                return true;
            }
        }
        else {
            if (dy < 0 && this.move(0, -1, slideCount)) {
                return true;
            }
            if (dy > 0 && this.move(0, 1, slideCount)) {
                return true;
            }
            if (dx < 0 && this.move(-1, 0, slideCount)) {
                return true;
            }
            if (dx > 0 && this.move(1, 0, slideCount)) {
                return true;
            }
        }
        return false;
    }
    attack(target, damage) {
        if (target === this) {
            return;
        }
        this.onAttack(target, damage);
        target.takeDamage(this, damage);
        this.ap--;
        this.game.animations.push(new bumpanimation_1.BumpAnimation(this, target));
        this.game.blocked = true;
    }
    takeHeal(heal) {
        this.hp = Math.min(this.hp + heal, this.maxHp);
        this.addFloatingText(heal.toString(), this.game.healColor);
    }
    takeDamage(attacker, damage) {
        if (this.hp <= 0) {
            // Already dead
            return;
        }
        this.hp -= damage;
        this.addFloatingText(damage.toString(), this.game.damageColor);
        if (this.hp <= 0) {
            this.hp = 0;
            this.onDeath(attacker);
            this.game.entities.remove(this);
        }
    }
    pickup(item) {
        item.onPickup(this);
        this.inventory.add(item);
        this.game.entities.remove(item);
    }
    use(item) {
        return item.onUse(this);
    }
    cast(ability, target, callback) {
        if (ability.targetType === ability_1.TargetType.SELF || target) {
            if (ability.cast(this, target)) {
                if (callback) {
                    callback();
                }
            }
        }
        else {
            this.game.startTargeting(ability, callback);
        }
    }
    addFloatingText(str, color) {
        this.game.animations.push(new floatingtextanimation_1.FloatingTextAnimation(this, str, color));
    }
    onAttack(target, damage) { }
    onDeath(attacker) { }
};
Actor = __decorate([
    serializable_1.Serializable('Actor')
], Actor);
exports.Actor = Actor;


/***/ }),

/***/ "./src/ai/ai.ts":
/*!**********************!*\
  !*** ./src/ai/ai.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AI {
    constructor(actor) {
        this.actor = actor;
        this.alwaysActive = false;
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

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ai_1 = __webpack_require__(/*! ./ai */ "./src/ai/ai.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
const DEFAULT_DAMAGE = 1;
let BasicMonster = class BasicMonster extends ai_1.AI {
    constructor(actor, damageFunc) {
        super(actor);
        this.damageFunc = damageFunc;
    }
    doAi() {
        const monster = this.actor;
        const player = monster.game.player;
        if (!player) {
            return;
        }
        if (monster.distanceTo(player) > 1.5) {
            // Move towards player if far away
            monster.moveToward(player.x, player.y);
        }
        else if (player.hp > 0) {
            // Close enough, attack! (if the player is still alive.)
            const damage = this.damageFunc ? this.damageFunc(monster, player) : DEFAULT_DAMAGE;
            monster.attack(player, damage);
        }
    }
};
BasicMonster = __decorate([
    serializable_1.Serializable('BasicMonster')
], BasicMonster);
exports.BasicMonster = BasicMonster;


/***/ }),

/***/ "./src/ai/confusedmonster.ts":
/*!***********************************!*\
  !*** ./src/ai/confusedmonster.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ai_1 = __webpack_require__(/*! ./ai */ "./src/ai/ai.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
let ConfusedMonster = class ConfusedMonster extends ai_1.AI {
    constructor(actor) {
        super(actor);
        this.numTurns = 10;
        this.oldAi = actor.ai;
    }
    doAi() {
        if (this.numTurns > 0) {
            // Still confused...
            // Move in a random direction, and decrease the number of turns confused
            const rng = this.actor.game.rng;
            this.actor.move(rng.nextRange(-1, 2), rng.nextRange(-1, 2));
            this.numTurns--;
        }
        else {
            this.actor.ai = this.oldAi;
        }
    }
};
ConfusedMonster = __decorate([
    serializable_1.Serializable('ConfusedMonster')
], ConfusedMonster);
exports.ConfusedMonster = ConfusedMonster;


/***/ }),

/***/ "./src/animations/animation.ts":
/*!*************************************!*\
  !*** ./src/animations/animation.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const animationpromise_1 = __webpack_require__(/*! ./animationpromise */ "./src/animations/animationpromise.ts");
class Animation {
    constructor(countdown, blocking) {
        this.promise = new animationpromise_1.AnimationPromise();
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
exports.Animation = Animation;


/***/ }),

/***/ "./src/animations/animationpromise.ts":
/*!********************************************!*\
  !*** ./src/animations/animationpromise.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AnimationPromise {
    constructor() {
        this.handlers = [];
    }
    then(handler) {
        this.handlers.push(handler);
        return this;
    }
    resolve() {
        for (let i = 0; i < this.handlers.length; i++) {
            this.handlers[i]();
        }
    }
}
exports.AnimationPromise = AnimationPromise;


/***/ }),

/***/ "./src/animations/bumpanimation.ts":
/*!*****************************************!*\
  !*** ./src/animations/bumpanimation.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const animation_1 = __webpack_require__(/*! ./animation */ "./src/animations/animation.ts");
const DURATION = 12;
class BumpAnimation extends animation_1.Animation {
    constructor(entity, target) {
        super(DURATION, true);
        this.entity = entity;
        this.dx = target.x - entity.x;
        this.dy = target.y - entity.y;
    }
    update() {
        const t = DURATION - this.countdown;
        if (t >= 0 && t < 4) {
            this.entity.offset.x += this.dx;
            this.entity.offset.y += this.dy;
        }
        if (t >= 4 && t < 8) {
            this.entity.offset.x -= this.dx;
            this.entity.offset.y -= this.dy;
        }
        super.update();
    }
}
exports.BumpAnimation = BumpAnimation;


/***/ }),

/***/ "./src/animations/fadeinanimation.ts":
/*!*******************************************!*\
  !*** ./src/animations/fadeinanimation.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = __webpack_require__(/*! ../color */ "./src/color.ts");
const animation_1 = __webpack_require__(/*! ./animation */ "./src/animations/animation.ts");
class FadeInAnimation extends animation_1.Animation {
    constructor(duration) {
        super(duration, true);
        this.duration = duration;
    }
    draw(game) {
        const src = game.blackoutRect;
        if (!src) {
            return;
        }
        const x = this.countdown / this.duration;
        const alpha = Math.max(1, Math.min(255, (255.0 * x) | 0));
        const color = color_1.fromRgb(0, 0, 0, alpha);
        game.app.drawImage(0, 0, src.x, src.y, src.width, src.height, color, game.app.size.width, game.app.size.height);
    }
}
exports.FadeInAnimation = FadeInAnimation;


/***/ }),

/***/ "./src/animations/fadeoutanimation.ts":
/*!********************************************!*\
  !*** ./src/animations/fadeoutanimation.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = __webpack_require__(/*! ../color */ "./src/color.ts");
const animation_1 = __webpack_require__(/*! ./animation */ "./src/animations/animation.ts");
class FadeOutAnimation extends animation_1.Animation {
    constructor(duration) {
        super(duration, true);
        this.duration = duration;
    }
    draw(game) {
        const src = game.blackoutRect;
        if (!src) {
            return;
        }
        const x = 1.0 - this.countdown / this.duration;
        const alpha = Math.max(1, Math.min(255, (255.0 * x) | 0));
        const color = color_1.fromRgb(0, 0, 0, alpha);
        game.app.drawImage(0, 0, src.x, src.y, src.width, src.height, color, game.app.size.width, game.app.size.height);
    }
}
exports.FadeOutAnimation = FadeOutAnimation;


/***/ }),

/***/ "./src/animations/floatingtextanimation.ts":
/*!*************************************************!*\
  !*** ./src/animations/floatingtextanimation.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const standardcolors_1 = __webpack_require__(/*! ../palettes/standardcolors */ "./src/palettes/standardcolors.ts");
const animation_1 = __webpack_require__(/*! ./animation */ "./src/animations/animation.ts");
const DURATION = 40;
class FloatingTextAnimation extends animation_1.Animation {
    constructor(actor, str, color) {
        super(DURATION, false);
        this.actor = actor;
        this.str = str;
        this.color = color || standardcolors_1.StandardColors.WHITE;
    }
    draw(game) {
        const frame = DURATION - this.countdown;
        const x = this.actor.pixelX + ((this.actor.sprite.width / 2) | 0) - game.viewport.x;
        const y = this.actor.pixelY - 3 - game.viewport.y;
        const y2 = y - Math.min(4, Math.floor(frame / 2));
        game.app.drawCenteredString(this.str, x, y2, this.color);
    }
}
exports.FloatingTextAnimation = FloatingTextAnimation;


/***/ }),

/***/ "./src/animations/projectileanimation.ts":
/*!***********************************************!*\
  !*** ./src/animations/projectileanimation.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const animation_1 = __webpack_require__(/*! ./animation */ "./src/animations/animation.ts");
class ProjectileAnimation extends animation_1.Animation {
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
exports.ProjectileAnimation = ProjectileAnimation;


/***/ }),

/***/ "./src/animations/slideanimation.ts":
/*!******************************************!*\
  !*** ./src/animations/slideanimation.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const animation_1 = __webpack_require__(/*! ./animation */ "./src/animations/animation.ts");
class SlideAnimation extends animation_1.Animation {
    constructor(entity, dx, dy, count) {
        super(count, true);
        this.entity = entity;
        this.dx = dx;
        this.dy = dy;
    }
    update() {
        this.countdown--;
        if (this.countdown >= 0) {
            this.entity.offset.x += this.dx;
            this.entity.offset.y += this.dy;
        }
        if (this.countdown === 0) {
            this.entity.offset.x = 0;
            this.entity.offset.y = 0;
        }
    }
}
exports.SlideAnimation = SlideAnimation;


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
const keys_1 = __webpack_require__(/*! ./keys */ "./src/keys.ts");
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 224;
const DEFAULT_FILL_WINDOW = false;
const DEFAULT_SCALE_FACTOR = 2.0;
// Arrow keys, numpad, vi
const NORTHWEST_KEYS = [keys_1.Keys.VK_NUMPAD7, keys_1.Keys.VK_Y];
const NORTHEAST_KEYS = [keys_1.Keys.VK_NUMPAD9, keys_1.Keys.VK_U];
const SOUTHWEST_KEYS = [keys_1.Keys.VK_NUMPAD1, keys_1.Keys.VK_B];
const SOUTHEAST_KEYS = [keys_1.Keys.VK_NUMPAD3, keys_1.Keys.VK_N];
const UP_KEYS = [keys_1.Keys.VK_UP, keys_1.Keys.VK_NUMPAD8, keys_1.Keys.VK_K];
const LEFT_KEYS = [keys_1.Keys.VK_LEFT, keys_1.Keys.VK_NUMPAD4, keys_1.Keys.VK_H];
const DOWN_KEYS = [keys_1.Keys.VK_DOWN, keys_1.Keys.VK_NUMPAD2, keys_1.Keys.VK_J];
const RIGHT_KEYS = [keys_1.Keys.VK_RIGHT, keys_1.Keys.VK_NUMPAD6, keys_1.Keys.VK_L];
const WAIT_KEYS = [keys_1.Keys.VK_SPACE, keys_1.Keys.VK_NUMPAD5];
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
        this.center = new vec2_1.Vec2((this.size.width / 2) | 0, (this.size.height / 2) | 0);
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        canvas.width = this.size.width;
        canvas.height = this.size.height;
        canvas.style.outline = 'none';
        canvas.tabIndex = 0;
        canvas.focus();
        this.mobile = this.isMobile();
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
        const minMinorAxis = mobile ? 224.0 : 300.0;
        this.scaleFactor = 1.0;
        if (width > height) {
            this.scaleFactor = Math.max(1, Math.min(Math.round(width / minMajorAxis), Math.round(height / minMinorAxis)));
        }
        else {
            this.scaleFactor = Math.max(1, Math.min(Math.round(width / minMinorAxis), Math.round(height / minMajorAxis)));
        }
        this.size.width = Math.round(width / this.scaleFactor);
        this.size.height = Math.round(height / this.scaleFactor);
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
     * Run once at startup.
     */
    isMobile() {
        return !!navigator.userAgent.match(/Android|iPhone|iPod|IEMobile|WPDesktop|Opera Mini/i);
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
     * @param {Vec2=} out Optional output location of cursor.
     */
    drawString(str, x, y, color, out) {
        this.renderSet.drawString(str, x, y, color, out);
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
    /**
     * Draws a right-aligned string.
     * @param {string} str The text string to draw.
     * @param {number} x The x-coordinate of the top-right corner.
     * @param {number} y The y-coordinate of the top-right corner.
     * @param {number=} color Optional color.
     */
    drawRightString(str, x, y, color) {
        this.renderSet.drawRightString(str, x, y, color);
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
    isDownLeftKeyPressed() {
        return this.isKeyArrayPressed(SOUTHWEST_KEYS);
    }
    isDownKeyPressed() {
        return this.isKeyArrayPressed(DOWN_KEYS);
    }
    isDownRightKeyPressed() {
        return this.isKeyArrayPressed(SOUTHEAST_KEYS);
    }
    isLeftKeyPressed() {
        return this.isKeyArrayPressed(LEFT_KEYS);
    }
    isWaitKeyPressed() {
        return this.isKeyArrayPressed(WAIT_KEYS);
    }
    isRightKeyPressed() {
        return this.isKeyArrayPressed(RIGHT_KEYS);
    }
    isUpLeftKeyPressed() {
        return this.isKeyArrayPressed(NORTHWEST_KEYS);
    }
    isUpKeyPressed() {
        return this.isKeyArrayPressed(UP_KEYS);
    }
    isUpRightKeyPressed() {
        return this.isKeyArrayPressed(NORTHEAST_KEYS);
    }
    isKeyArrayPressed(keys) {
        for (let i = 0; i < keys.length; i++) {
            if (this.isKeyPressed(keys[i])) {
                return true;
            }
        }
        return false;
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

/***/ "./src/arraylist.ts":
/*!**************************!*\
  !*** ./src/arraylist.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const serializable_1 = __webpack_require__(/*! ./serializable */ "./src/serializable.ts");
let ArrayList = class ArrayList {
    constructor() {
        this.elements = [];
    }
    get length() {
        return this.elements.length;
    }
    clear() {
        this.elements.splice(0, this.elements.length);
    }
    get(index) {
        return this.elements[index];
    }
    add(el) {
        this.elements.push(el);
        if (this.listeners) {
            for (let i = 0; i < this.listeners.length; i++) {
                this.listeners[i].onAdd(this, el);
            }
        }
    }
    remove(el) {
        const index = this.elements.indexOf(el);
        if (index >= 0) {
            this.elements.splice(index, 1);
            if (this.listeners) {
                for (let i = 0; i < this.listeners.length; i++) {
                    this.listeners[i].onRemove(this, el);
                }
            }
        }
    }
    contains(el) {
        return this.elements.indexOf(el) >= 0;
    }
    addListener(listener) {
        if (!this.listeners) {
            this.listeners = [];
        }
        this.listeners.push(listener);
    }
};
ArrayList = __decorate([
    serializable_1.Serializable('ArrayList')
], ArrayList);
exports.ArrayList = ArrayList;


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

/***/ "./src/compoundmessage.ts":
/*!********************************!*\
  !*** ./src/compoundmessage.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = __webpack_require__(/*! ./message */ "./src/message.ts");
class CompoundMessage extends message_1.Message {
    constructor(...messages) {
        super('', 0);
        this.messages = messages;
    }
    draw(app, pos) {
        for (let i = 0; i < this.messages.length; i++) {
            this.messages[i].draw(app, pos);
        }
    }
    getWidth(font) {
        let sum = 0;
        for (let i = 0; i < this.messages.length; i++) {
            sum += this.messages[i].getWidth(font);
        }
        return sum;
    }
}
exports.CompoundMessage = CompoundMessage;


/***/ }),

/***/ "./src/entity.ts":
/*!***********************!*\
  !*** ./src/entity.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vec2_1 = __webpack_require__(/*! ./vec2 */ "./src/vec2.ts");
const serializable_1 = __webpack_require__(/*! ./serializable */ "./src/serializable.ts");
let Entity = class Entity extends vec2_1.Vec2 {
    constructor(game, x, y, name, sprite, blocks) {
        super(x, y);
        this.game = game;
        this.offset = new vec2_1.Vec2(0, 0);
        this.name = name;
        this.sprite = sprite;
        this.blocks = blocks;
        this.zIndex = 1;
    }
    get pixelX() {
        return this.x * this.game.tileSize.width + this.offset.x;
    }
    get pixelY() {
        return this.y * this.game.tileSize.height + this.offset.y;
    }
    get centerPixelX() {
        return this.pixelX + (this.sprite.width / 2) | 0;
    }
    get centerPixelY() {
        return this.pixelY + (this.sprite.height / 2) | 0;
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
    startTurn() { }
    endTurn() { }
    sendToBack() { }
    /**
     * Handles when another actor bumps this entity.
     * Returns true on success (something happened).
     * Returns false on failure (bump is rejected).
     * @param bumper The actor that bumped this entity.
     */
    onBump(bumper) {
        return false;
    }
};
Entity = __decorate([
    serializable_1.Serializable('Entity')
], Entity);
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

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ability_1 = __webpack_require__(/*! ./ability */ "./src/ability.ts");
const actor_1 = __webpack_require__(/*! ./actor */ "./src/actor.ts");
const appstate_1 = __webpack_require__(/*! ./appstate */ "./src/appstate.ts");
const standardcolors_1 = __webpack_require__(/*! ./palettes/standardcolors */ "./src/palettes/standardcolors.ts");
const tooltipdialog_1 = __webpack_require__(/*! ./gui/tooltipdialog */ "./src/gui/tooltipdialog.ts");
const keys_1 = __webpack_require__(/*! ./keys */ "./src/keys.ts");
const path_1 = __webpack_require__(/*! ./path */ "./src/path.ts");
const rect_1 = __webpack_require__(/*! ./rect */ "./src/rect.ts");
const rng_1 = __webpack_require__(/*! ./rng */ "./src/rng.ts");
const sprite_1 = __webpack_require__(/*! ./sprite */ "./src/sprite.ts");
const vec2_1 = __webpack_require__(/*! ./vec2 */ "./src/vec2.ts");
const arraylist_1 = __webpack_require__(/*! ./arraylist */ "./src/arraylist.ts");
const serializable_1 = __webpack_require__(/*! ./serializable */ "./src/serializable.ts");
const tilemap_1 = __webpack_require__(/*! ./tilemap/tilemap */ "./src/tilemap/tilemap.ts");
const tilemaprenderer_1 = __webpack_require__(/*! ./tilemap/tilemaprenderer */ "./src/tilemap/tilemaprenderer.ts");
const item_1 = __webpack_require__(/*! ./item */ "./src/item.ts");
const DEFAULT_MAP_SIZE = new rect_1.Rect(0, 0, 256, 256);
const DEFAULT_MAP_LAYERS = 1;
const DEFAULT_TILE_WIDTH = 16;
const DEFAULT_TILE_HEIGHT = 16;
const DEFAULT_VIEW_DISTANCE = 13;
let Game = class Game extends appstate_1.AppState {
    constructor(app, options) {
        super(app);
        this.viewport = new rect_1.Rect(0, 0, app.size.width, app.size.height);
        this.viewportFocus = new vec2_1.Vec2(0, 0);
        this.focusMargins = options.focusMargins || new vec2_1.Vec2(0, 0);
        this.animations = [];
        this.entities = new arraylist_1.ArrayList();
        this.turnIndex = 0;
        this.blocked = false;
        this.cursor = new vec2_1.Vec2(-1, -1);
        this.tooltip = new tooltipdialog_1.TooltipDialog();
        this.rng = new rng_1.RNG();
        this.pathIndex = 0;
        this.horizontalViewDistance = options.viewDistance || DEFAULT_VIEW_DISTANCE;
        this.verticalViewDistance = options.viewDistance || DEFAULT_VIEW_DISTANCE;
        this.zoom = 1.0;
        this.damageColor = options.damageColor || standardcolors_1.StandardColors.RED;
        this.healColor = options.healColor || standardcolors_1.StandardColors.GREEN;
        if (options.horizontalViewDistance) {
            this.horizontalViewDistance = options.horizontalViewDistance;
        }
        if (options.verticalViewDistance) {
            this.verticalViewDistance = options.verticalViewDistance;
        }
        const mapSize = options.mapSize || DEFAULT_MAP_SIZE;
        const mapLayers = options.mapLayers || DEFAULT_MAP_LAYERS;
        const tileSize = options.tileSize || new rect_1.Rect(0, 0, DEFAULT_TILE_WIDTH, DEFAULT_TILE_HEIGHT);
        this.tileMap = new tilemap_1.TileMap(mapSize.width, mapSize.height, mapLayers, tileSize);
        this.tileMapRenderer = new tilemaprenderer_1.TileMapRenderer(app.gl, this.tileMap);
    }
    get tileSize() {
        return this.tileMap.tileSize;
    }
    log(message, color) {
        if (this.messageLog) {
            this.messageLog.add(message, color);
        }
    }
    addAnimation(animation) {
        this.animations.push(animation);
        return animation.promise;
    }
    update() {
        sprite_1.Sprite.updateGlobalAnimations();
        this.updateTooltip();
        this.updateZoom();
        if (!this.gui.handleInput()) {
            this.updateAnimations();
            this.updateEntities();
            if (this.onUpdate) {
                this.onUpdate();
            }
            this.updateViewport();
        }
        this.drawTileMap();
        if (this.zoom === 1.0) {
            this.drawTargeting();
            this.drawEntities();
            this.drawAnimations();
        }
        this.gui.draw();
    }
    updateTooltip() {
        if (this.gui.dragElement) {
            // No tooltips while drag/drop
            this.tooltip.visible = false;
            return;
        }
        if (!this.tooltip.visible) {
            this.tooltipElement = undefined;
        }
        const mouse = this.app.mouse;
        const longPress = mouse.isLongPress();
        if ((!mouse.down && (mouse.dx !== 0 || mouse.dy !== 0)) || longPress) {
            const hoverPanel = this.gui.getPanelAt(mouse);
            if (this.tooltipElement !== hoverPanel) {
                // Hover element has changed
                this.tooltipElement = hoverPanel;
                if (hoverPanel) {
                    hoverPanel.updateTooltip(this.tooltip);
                    if (longPress) {
                        window.navigator.vibrate(100);
                    }
                }
            }
            if (this.tooltip.visible) {
                if (!this.tooltip.gui) {
                    // If this is the first time we're showing the tooltip,
                    // make sure it is in the GUI system.
                    this.gui.add(this.tooltip);
                }
                // Update the tooltip to be on the mouse
                // This is similar to WoW style tooltips.
                this.tooltip.showAt(mouse.x, mouse.y);
                // On mobile devices, the tooltip is modal
                this.tooltip.modal = this.app.mobile;
            }
        }
    }
    updateZoom() {
        if (this.app.mouse.wheelDelta !== 0) {
            const center = this.viewport.getCenter();
            this.viewportFocus.x = center.x;
            this.viewportFocus.y = center.y;
            if (this.app.mouse.wheelDelta > 0) {
                this.zoom *= 0.5;
            }
            else {
                this.zoom *= 2.0;
            }
            this.viewport.width = (this.zoom * this.app.size.width) | 0;
            this.viewport.height = (this.zoom * this.app.size.height) | 0;
            this.viewport.x = center.x - ((this.app.size.width / this.zoom / 2) | 0);
            this.viewport.y = center.y - ((this.app.size.height / this.zoom / 2) | 0);
        }
    }
    updateAnimations() {
        // Reset blocked
        this.blocked = false;
        // Update animations
        for (let i = 0; i < this.animations.length; i++) {
            const animation = this.animations[i];
            animation.update();
            if (animation.blocking) {
                this.blocked = true;
            }
        }
        // Remove completed animations
        for (let i = this.animations.length - 1; i >= 0; i--) {
            if (this.animations[i].isDone()) {
                this.animations[i].promise.resolve();
                this.animations.splice(i, 1);
            }
        }
    }
    updateEntities() {
        if (this.player && this.player.hp <= 0) {
            // Player is dead.  Do nothing.
            return;
        }
        // If not blocked on any animations,
        // then try to do enemy AI
        // const startTurnIndex = this.turnIndex;
        let turnCount = 0;
        while (true) {
            if (this.entities.length === 0) {
                // No entities
                break;
            }
            if (this.turnIndex >= this.entities.length) {
                // Turn index out of range.  Entities list must have changed.
                // Restart back to first entity.
                this.turnIndex = 0;
            }
            if (turnCount > this.entities.length * 2) {
                // Looped back to original entity
                // In that case, quit to next frame to avoid infinite loops
                break;
            }
            const currEntity = this.entities.get(this.turnIndex);
            if (currEntity instanceof actor_1.Actor) {
                if (currEntity.ap > 0) {
                    if (currEntity === this.player) {
                        if (!this.blocked) {
                            this.handlePlayerInput();
                        }
                        break;
                    }
                    else {
                        this.doAi(currEntity);
                    }
                }
                if (currEntity.ap <= 0) {
                    // Turn is over
                    currEntity.ap = 0;
                    this.nextTurn();
                }
            }
            else {
                this.nextTurn();
            }
            turnCount++;
        }
    }
    resetViewport() {
        if (!this.player) {
            return;
        }
        this.viewportFocus.x = this.player.centerPixelX;
        this.viewportFocus.y = this.player.centerPixelY;
        this.viewport.x = this.viewportFocus.x - ((this.app.size.width / this.zoom / 2) | 0);
        this.viewport.y = this.viewportFocus.y - ((this.app.size.height / this.zoom / 2) | 0);
    }
    updateViewport() {
        this.viewport.width = this.app.size.width / this.zoom;
        this.viewport.height = this.app.size.height / this.zoom;
        const mouse = this.app.mouse;
        if (mouse.isDragging()) {
            this.viewport.x -= mouse.dx / this.zoom;
            this.viewport.y -= mouse.dy / this.zoom;
            this.viewportFocus.x = this.viewport.x + ((this.viewport.width / 2) | 0);
            this.viewportFocus.y = this.viewport.y + ((this.viewport.height / 2) | 0);
        }
        else {
            // Drift viewport toward focus
            const driftRate = 0.05;
            const focusLeftX = this.viewportFocus.x - ((this.app.size.width / this.zoom / 2) | 0);
            if (focusLeftX !== this.viewport.x) {
                let dx = driftRate * focusLeftX - driftRate * this.viewport.x;
                if (dx < 0) {
                    dx = Math.floor(dx);
                }
                else {
                    dx = Math.ceil(dx);
                }
                this.viewport.x += dx;
            }
            const focusTopY = this.viewportFocus.y - ((this.app.size.height / this.zoom / 2) | 0);
            if (focusTopY !== this.viewport.y) {
                let dy = driftRate * focusTopY - driftRate * this.viewport.y;
                if (dy < 0) {
                    dy = Math.floor(dy);
                }
                else {
                    dy = Math.ceil(dy);
                }
                this.viewport.y += dy;
            }
        }
    }
    drawTileMap() {
        if (this.app.renderSet.spriteTexture.loaded) {
            const x = ((this.viewport.x / this.zoom) | 0) * this.zoom;
            const y = ((this.viewport.y / this.zoom) | 0) * this.zoom;
            const animFrame = ((sprite_1.Sprite.globalAnimIndex / 30) | 0) % 2;
            this.tileMapRenderer.draw(x, y, this.viewport.width, this.viewport.height, animFrame);
        }
    }
    drawTargeting() {
        if (this.isTargeting() && this.targetSprite) {
            const x = this.cursor.x * this.tileMap.tileSize.width - this.viewport.x;
            const y = this.cursor.y * this.tileMap.tileSize.height - this.viewport.y;
            this.targetSprite.draw(this.app, x, y);
        }
    }
    drawEntities() {
        for (let z = 0; z < 3; z++) {
            for (let i = 0; i < this.entities.length; i++) {
                const entity = this.entities.get(i);
                if (entity.zIndex === z && this.tileMap.isVisible(entity.x, entity.y)) {
                    entity.draw();
                }
            }
        }
    }
    drawAnimations() {
        let blockingCount = 0;
        for (let i = 0; i < this.animations.length; i++) {
            const animation = this.animations[i];
            if (blockingCount === 0 || !animation.blocking) {
                animation.draw(this);
            }
            if (animation.blocking) {
                blockingCount++;
            }
        }
    }
    isTargeting() {
        return !!this.targetAbility;
    }
    startTargeting(ability, callback) {
        this.targetAbility = ability;
        this.targetCallback = callback;
        if (this.player) {
            this.cursor.x = this.player.x;
            this.cursor.y = this.player.y;
        }
    }
    endTargeting() {
        if (this.player && this.targetAbility) {
            const targetType = this.targetAbility.targetType;
            let target = null;
            if (targetType === ability_1.TargetType.ENTITY) {
                target = this.getActorAt(this.cursor.x, this.cursor.y);
            }
            else if (targetType === ability_1.TargetType.TILE) {
                target = this.tileMap.getCell(this.cursor.x, this.cursor.y);
            }
            if (target) {
                if (this.targetAbility.cast(this.player, target)) {
                    if (this.targetCallback) {
                        this.targetCallback();
                    }
                }
            }
        }
        this.cancelTargeting();
    }
    cancelTargeting() {
        this.targetAbility = undefined;
        this.targetCallback = undefined;
    }
    handlePlayerInput() {
        if (!this.player || this.blocked) {
            return;
        }
        if (this.player.ai) {
            this.player.ai.doAi();
            this.player.ap = 0;
            return;
        }
        const mouse = this.app.mouse;
        if (mouse.down || mouse.dx !== 0 || mouse.dy !== 0) {
            this.cursor.x = ((this.viewport.x + mouse.x) / this.tileMap.tileSize.width) | 0;
            this.cursor.y = ((this.viewport.y + mouse.y) / this.tileMap.tileSize.height) | 0;
        }
        if (this.app.isKeyDown(keys_1.Keys.VK_SHIFT)) {
            let dx = 0;
            let dy = 0;
            if (this.app.isDownLeftKeyPressed()) {
                dx = -1;
                dy = 1;
            }
            if (this.app.isDownKeyPressed()) {
                dy = 1;
            }
            if (this.app.isDownRightKeyPressed()) {
                dx = 1;
                dy = 1;
            }
            if (this.app.isLeftKeyPressed()) {
                dx = -1;
            }
            if (this.app.isRightKeyPressed()) {
                dx = 1;
            }
            if (this.app.isUpLeftKeyPressed()) {
                dx = -1;
                dy = -1;
            }
            if (this.app.isUpKeyPressed()) {
                dy = -1;
            }
            if (this.app.isUpRightKeyPressed()) {
                dx = 1;
                dy = -1;
            }
            this.viewportFocus.x -= dx * this.tileMap.tileSize.height;
            this.viewportFocus.y -= dy * this.tileMap.tileSize.height;
            return;
        }
        if (this.isTargeting()) {
            if (this.app.isKeyPressed(keys_1.Keys.VK_ENTER) || this.app.mouse.isClicked()) {
                this.endTargeting();
            }
            if (this.app.isKeyPressed(keys_1.Keys.VK_ESCAPE)) {
                this.cancelTargeting();
            }
            if (this.app.isDownLeftKeyPressed()) {
                this.cursor.x--;
                this.cursor.y++;
            }
            if (this.app.isDownKeyPressed()) {
                this.cursor.y++;
            }
            if (this.app.isDownRightKeyPressed()) {
                this.cursor.x++;
                this.cursor.y++;
            }
            if (this.app.isLeftKeyPressed()) {
                this.cursor.x--;
            }
            if (this.app.isRightKeyPressed()) {
                this.cursor.x++;
            }
            if (this.app.isUpLeftKeyPressed()) {
                this.cursor.x--;
                this.cursor.y--;
            }
            if (this.app.isUpKeyPressed()) {
                this.cursor.y--;
            }
            if (this.app.isUpRightKeyPressed()) {
                this.cursor.x++;
                this.cursor.y--;
            }
            return;
        }
        if (mouse.isClicked()) {
            const tx = ((this.viewport.x + mouse.x) / this.tileMap.tileSize.width) | 0;
            const ty = ((this.viewport.y + mouse.y) / this.tileMap.tileSize.height) | 0;
            const target = this.tileMap.getCell(tx, ty);
            if (target && target !== this.targetTile) {
                this.targetTile = target;
                this.path = path_1.computePath(this.tileMap, this.player, this.targetTile, 100);
                this.pathIndex = 0;
            }
        }
        let nextStep = null;
        if (this.path) {
            nextStep = this.path[this.pathIndex];
            while (nextStep && nextStep.x === this.player.x && nextStep.y === this.player.y) {
                this.pathIndex++;
                nextStep = this.pathIndex < this.path.length ? this.path[this.pathIndex] : null;
            }
            if (!nextStep) {
                this.stopAutoWalk();
            }
        }
        if (nextStep) {
            const dx = nextStep.x - this.player.x;
            const dy = nextStep.y - this.player.y;
            if (!this.tryMoveOrAttack(dx, dy)) {
                this.stopAutoWalk();
            }
            return;
        }
        if (this.app.isDownLeftKeyPressed() && this.tryMoveOrAttack(-1, 1)) {
            return;
        }
        if (this.app.isDownKeyPressed() && this.tryMoveOrAttack(0, 1)) {
            return;
        }
        if (this.app.isDownRightKeyPressed() && this.tryMoveOrAttack(1, 1)) {
            return;
        }
        if (this.app.isLeftKeyPressed() && this.tryMoveOrAttack(-1, 0)) {
            return;
        }
        if (this.app.isRightKeyPressed() && this.tryMoveOrAttack(1, 0)) {
            return;
        }
        if (this.app.isUpLeftKeyPressed() && this.tryMoveOrAttack(-1, -1)) {
            return;
        }
        if (this.app.isUpKeyPressed() && this.tryMoveOrAttack(0, -1)) {
            return;
        }
        if (this.app.isUpRightKeyPressed() && this.tryMoveOrAttack(1, -1)) {
            return;
        }
        if (this.app.isWaitKeyPressed()) {
            this.player.ap = 0;
        }
    }
    /**
     * Tries to move or attack in the specified direction.
     * Returns true on success (the player moved or attacked).
     * Returns false on failure (unable to move or attack).
     * @param dx The x direction to move.
     * @param dy The y direction to move.
     */
    tryMoveOrAttack(dx, dy) {
        const player = this.player;
        if (!player) {
            return false;
        }
        const destX = player.x + dx;
        const destY = player.y + dy;
        // Check for blocking actors
        // If there is a blocking actor, either bump or stop
        for (let i = 0; i < this.entities.length; i++) {
            const other = this.entities.get(i);
            if (other.blocks && player !== other && other.x === destX && other.y === destY) {
                if (this.path) {
                    // Autowalking...
                    if (this.pathIndex === 1) {
                        // If this is the first stop, go ahead and bump
                        this.stopAutoWalk();
                        return other.onBump(player);
                    }
                    else {
                        // Otherwise stop and make player confirm
                        this.stopAutoWalk();
                        return true;
                    }
                }
                // Otherwise, this is keyboard input, so go ahead and bump
                return other.onBump(player);
            }
        }
        // Check for items
        // There may be multiple items on a tile
        // If there are items, pick them up
        for (let i = this.entities.length - 1; i >= 0; i--) {
            const other = this.entities.get(i);
            if (other instanceof item_1.Item && !other.blocks && other.x === destX && other.y === destY) {
                player.pickup(other);
            }
        }
        return player.move(dx, dy);
    }
    recalculateViewportFocus() {
        const player = this.player;
        if (!player) {
            return;
        }
        const map = this.tileMap;
        const tileWidth = map.tileSize.width;
        const tileHeight = map.tileSize.height;
        let visibleMinX = player.x * tileWidth;
        let visibleMinY = player.y * tileHeight;
        let visibleMaxX = (player.x + 1) * tileWidth;
        let visibleMaxY = (player.y + 1) * tileHeight;
        // Find the bounds of the visible area.
        for (let y = player.y - this.verticalViewDistance; y <= player.y + this.verticalViewDistance; y++) {
            for (let x = player.x - this.horizontalViewDistance; x <= player.x + this.horizontalViewDistance; x++) {
                if (map.isVisible(x, y)) {
                    visibleMinX = Math.min(visibleMinX, x * tileWidth);
                    visibleMinY = Math.min(visibleMinY, y * tileHeight);
                    visibleMaxX = Math.max(visibleMaxX, (x + 1) * tileWidth);
                    visibleMaxY = Math.max(visibleMaxY, (y + 1) * tileHeight);
                }
            }
        }
        // Find the bounds of desired area
        // Ignore Actor.offset, because we're jumping to the destination.
        let minX = player.x * tileWidth;
        let minY = player.y * tileHeight;
        let maxX = minX + tileWidth;
        let maxY = minY + tileHeight;
        if (this.path) {
            // If there is an auto-walk path, use that
            for (let i = this.pathIndex; i < this.path.length; i++) {
                const pathTile = this.path[i];
                minX = Math.min(minX, pathTile.x * tileWidth);
                minY = Math.min(minY, pathTile.y * tileHeight);
                maxX = Math.max(maxX, (pathTile.x + 1) * tileWidth);
                maxY = Math.max(maxY, (pathTile.y + 1) * tileHeight);
            }
        }
        else {
            // Otherwise, use all visible entities.
            for (let i = 0; i < this.entities.length; i++) {
                const entity = this.entities.get(i);
                if (entity instanceof actor_1.Actor && map.isVisible(entity.x, entity.y)) {
                    minX = Math.min(minX, entity.x * tileWidth);
                    minY = Math.min(minY, entity.y * tileHeight);
                    maxX = Math.max(maxX, (entity.x + 1) * tileWidth);
                    maxY = Math.max(maxY, (entity.y + 1) * tileHeight);
                }
            }
        }
        // Find the center of the bounds of all visible actors
        if ((visibleMaxX - visibleMinX) <= (this.viewport.width - 2 * this.focusMargins.x)) {
            // The entire visible range fits in the viewport, so center it
            this.viewportFocus.x = Math.round((visibleMinX + visibleMaxX) / 2.0);
        }
        else {
            // The visible range goes beyond, so focus on entities or path
            this.viewportFocus.x = Math.round((minX + maxX) / 2.0);
        }
        if ((visibleMaxY - visibleMinY) <= (this.viewport.height - 2 * this.focusMargins.y)) {
            // The entire visible range fits in the viewport, so center it
            this.viewportFocus.y = Math.round((visibleMinY + visibleMaxY) / 2.0);
        }
        else {
            // The visible range goes beyond, so focus on entities or path
            this.viewportFocus.y = Math.round((minY + maxY) / 2.0);
        }
    }
    doAi(entity) {
        if (!entity.ai) {
            // No AI - do nothing
            entity.ap = 0;
            return;
        }
        if (entity.visibleDuration > 0 || entity.ai.alwaysActive) {
            entity.ai.doAi();
        }
        entity.ap = 0;
    }
    nextTurn() {
        if (this.turnIndex < this.entities.length) {
            const currEntity = this.entities.get(this.turnIndex);
            currEntity.endTurn();
            if (this.player === currEntity) {
                this.recomputeFov();
            }
        }
        this.turnIndex++;
        if (this.turnIndex >= this.entities.length) {
            this.turnIndex = 0;
        }
        if (this.turnIndex >= 0 && this.turnIndex < this.entities.length) {
            const nextEntity = this.entities.get(this.turnIndex);
            nextEntity.startTurn();
            if (this.player === nextEntity) {
                this.recalculateViewportFocus();
            }
        }
    }
    stopAutoWalk() {
        this.path = undefined;
        this.targetTile = undefined;
    }
    isBlocked(x, y) {
        if (this.tileMap.isBlocked(x, y)) {
            return true;
        }
        for (let i = 0; i < this.entities.length; i++) {
            const other = this.entities.get(i);
            if (other.blocks && other.x === x && other.y === y) {
                return true;
            }
        }
        return false;
    }
    getEntityAt(x, y) {
        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities.get(i);
            if (entity.x === x && entity.y === y) {
                return entity;
            }
        }
        return undefined;
    }
    getActorAt(x, y) {
        for (let i = 0; i < this.entities.length; i++) {
            const other = this.entities.get(i);
            if (other instanceof actor_1.Actor && other.x === x && other.y === y) {
                return other;
            }
        }
        return undefined;
    }
    recomputeFov() {
        if (!this.player) {
            // FOV requires a player and a tile map
            return;
        }
        this.tileMap.computeFov(this.player.x, this.player.y, this.horizontalViewDistance, this.verticalViewDistance);
        // Determine which entities are visible
        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities.get(i);
            if (entity === this.player) {
                continue;
            }
            if (!(entity instanceof actor_1.Actor)) {
                continue;
            }
            if (this.tileMap.isVisible(entity.x, entity.y)) {
                if (!entity.seen) {
                    // Spotted a new entity, stop auto walking
                    entity.seen = true;
                    this.player.addFloatingText('!', standardcolors_1.StandardColors.WHITE);
                    this.stopAutoWalk();
                    this.viewportFocus.x = ((this.player.centerPixelX + entity.centerPixelX) / 2) | 0;
                    this.viewportFocus.y = ((this.player.centerPixelY + entity.centerPixelY) / 2) | 0;
                }
                entity.visibleDuration++;
            }
            else {
                entity.visibleDuration = -1;
            }
        }
    }
};
Game = __decorate([
    serializable_1.Serializable('Game')
], Game);
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

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dialogrenderer_1 = __webpack_require__(/*! ./gui/dialogrenderer */ "./src/gui/dialogrenderer.ts");
const itemshortcutbutton_1 = __webpack_require__(/*! ./gui/itemshortcutbutton */ "./src/gui/itemshortcutbutton.ts");
const panel_1 = __webpack_require__(/*! ./gui/panel */ "./src/gui/panel.ts");
const talentbutton_1 = __webpack_require__(/*! ./gui/talentbutton */ "./src/gui/talentbutton.ts");
const rect_1 = __webpack_require__(/*! ./rect */ "./src/rect.ts");
const vec2_1 = __webpack_require__(/*! ./vec2 */ "./src/vec2.ts");
const itembutton_1 = __webpack_require__(/*! ./gui/itembutton */ "./src/gui/itembutton.ts");
const serializable_1 = __webpack_require__(/*! ./serializable */ "./src/serializable.ts");
let GUI = class GUI {
    constructor(app) {
        this.app = app;
        this.renderer = new dialogrenderer_1.DialogRenderer(new rect_1.Rect(0, 0, 1, 1));
        this.rootPanel = new panel_1.Panel(app.size);
        this.rootPanel.gui = this;
    }
    add(panel) {
        this.rootPanel.add(panel);
    }
    remove(panel) {
        this.rootPanel.remove(panel);
    }
    getPanelAt(point) {
        return this.rootPanel.getPanelAt(point);
    }
    handleInput() {
        if (this.dragElement && this.dragOffset) {
            this.updateDragging();
            return true;
        }
        return this.rootPanel.handleInput();
    }
    draw() {
        this.rootPanel.drawContents();
        if (this.dragElement) {
            // Draw drag element on top of everything else
            this.dragElement.drawContents();
        }
    }
    startDragging(panel) {
        const mouse = this.app.mouse;
        this.dragElement = panel;
        this.dragOffset = new vec2_1.Vec2(mouse.start.x - panel.rect.x, mouse.start.y - panel.rect.y);
    }
    updateDragging() {
        const mouse = this.app.mouse;
        const dragElement = this.dragElement;
        const dragOffset = this.dragOffset;
        if (mouse.down) {
            // Move the element to the mouse
            dragElement.rect.x = mouse.x - dragOffset.x;
            dragElement.rect.y = mouse.y - dragOffset.y;
        }
        else {
            // End the drag
            const target = this.rootPanel.getPanelAt(mouse);
            if (target && target.onDrop(dragElement)) {
                // Found a valid drop target
                dragElement.rect.x = target.rect.x;
                dragElement.rect.y = target.rect.y;
                dragElement.move(target);
            }
            else if (dragElement instanceof itembutton_1.ItemButton && target === this.rootPanel) {
                // Drop item(s)
                dragElement.removeAll();
            }
            else if (dragElement instanceof itemshortcutbutton_1.ItemShortcutButton && target === this.rootPanel) {
                // Destroy the shortcut
                if (dragElement.parent) {
                    dragElement.parent.remove(dragElement);
                }
            }
            else if (dragElement instanceof talentbutton_1.TalentButton && dragElement.shortcut && target === this.rootPanel) {
                // Destroy the shortcut
                if (dragElement.parent) {
                    dragElement.parent.remove(dragElement);
                }
            }
            else {
                // Otherwise move back to the original location
                dragElement.rect.x = mouse.start.x - dragOffset.x;
                dragElement.rect.y = mouse.start.y - dragOffset.y;
            }
            this.dragElement = undefined;
            this.dragOffset = undefined;
        }
    }
};
GUI = __decorate([
    serializable_1.Serializable('GUI')
], GUI);
exports.GUI = GUI;


/***/ }),

/***/ "./src/gui/button.ts":
/*!***************************!*\
  !*** ./src/gui/button.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const panel_1 = __webpack_require__(/*! ./panel */ "./src/gui/panel.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
let Button = class Button extends panel_1.Panel {
    constructor(destRect, sprite, shortcutKey, onClick) {
        super(destRect);
        this.sprite = sprite;
        this.shortcutKey = shortcutKey;
        this.onClick = onClick;
    }
    drawContents() {
        if (!this.gui) {
            return;
        }
        const src = this.sprite;
        const dst = this.rect;
        const offsetX = ((dst.width - src.width) / 2) | 0;
        const offsetY = ((dst.height - src.height) / 2) | 0;
        src.draw(this.gui.app, dst.x + offsetX, dst.y + offsetY);
    }
    handleInput() {
        if (!this.gui) {
            return false;
        }
        const app = this.gui.app;
        const mouse = app.mouse;
        if (this.rect.contains(mouse.start) && mouse.isDragging()) {
            this.gui.startDragging(this);
            return true;
        }
        if ((this.shortcutKey && app.isKeyPressed(this.shortcutKey)) || (this.rect.contains(mouse) && mouse.isClicked())) {
            this.click();
            return true;
        }
        return mouse.down && this.rect.contains(mouse);
    }
    click() {
        if (this.onClick) {
            this.onClick();
        }
    }
    updateTooltip(tooltip) {
        if (this.tooltipMessages) {
            tooltip.messages = this.tooltipMessages;
            tooltip.visible = true;
        }
        else {
            tooltip.visible = false;
        }
    }
};
Button = __decorate([
    serializable_1.Serializable('Button')
], Button);
exports.Button = Button;


/***/ }),

/***/ "./src/gui/buttonslot.ts":
/*!*******************************!*\
  !*** ./src/gui/buttonslot.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const panel_1 = __webpack_require__(/*! ./panel */ "./src/gui/panel.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
let ButtonSlot = class ButtonSlot extends panel_1.Panel {
    constructor(rect, shortcutKey) {
        super(rect);
        this.shortcutKey = shortcutKey;
    }
    get button() {
        return this.children.length > 0 ? this.children.get(0) : undefined;
    }
    drawContents() {
        if (!this.gui) {
            return;
        }
        const dst = this.rect;
        const src = this.gui.renderer.buttonSlotRect;
        if (src) {
            this.gui.app.drawImage(dst.x, dst.y, src.x, src.y, dst.width, dst.height);
        }
        const button = this.button;
        if (button && !button.isDragging()) {
            button.rect.x = this.rect.x;
            button.rect.y = this.rect.y;
            button.rect.width = this.rect.width;
            button.rect.height = this.rect.height;
            this.drawChildren();
        }
        if (this.shortcutKey) {
            this.gui.app.drawRightString(String.fromCharCode(this.shortcutKey), dst.x2 - 3, dst.y + 3);
        }
    }
    handleInput() {
        if (!this.gui) {
            return false;
        }
        if (this.handleChildrenInput()) {
            return true;
        }
        const app = this.gui.app;
        const mouse = app.mouse;
        const button = this.button;
        if (button) {
            if ((this.shortcutKey && app.isKeyPressed(this.shortcutKey)) ||
                (this.rect.contains(mouse) && mouse.isClicked())) {
                button.click();
                return true;
            }
        }
        return mouse.down && this.rect.contains(mouse);
    }
};
ButtonSlot = __decorate([
    serializable_1.Serializable('ButtonSlot')
], ButtonSlot);
exports.ButtonSlot = ButtonSlot;


/***/ }),

/***/ "./src/gui/complexselectdialog.ts":
/*!****************************************!*\
  !*** ./src/gui/complexselectdialog.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = __webpack_require__(/*! ../keys */ "./src/keys.ts");
const vec2_1 = __webpack_require__(/*! ../vec2 */ "./src/vec2.ts");
const defaultselectoptionrenderer_1 = __webpack_require__(/*! ./defaultselectoptionrenderer */ "./src/gui/defaultselectoptionrenderer.ts");
const dialog_1 = __webpack_require__(/*! ./dialog */ "./src/gui/dialog.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
const MARGIN = 4;
let ComplexSelectDialog = class ComplexSelectDialog extends dialog_1.Dialog {
    constructor(rect, options) {
        super(rect);
        this.options = options;
        this.selectedIndex = 0;
        this.renderer = new defaultselectoptionrenderer_1.DefaultSelectOptionRenderer();
    }
    drawContents() {
        if (!this.gui) {
            return;
        }
        super.drawContents();
        const offset = this.rect;
        const point = new vec2_1.Vec2(offset.x + MARGIN, offset.y + MARGIN);
        for (let i = 0; i < this.options.length; i++) {
            const option = this.options[i];
            const selected = i === this.selectedIndex;
            this.renderer.drawOption(this.gui, point, option, selected);
            point.y += this.renderer.getHeight(option, selected);
        }
    }
    handleInput() {
        if (!this.gui) {
            return false;
        }
        const app = this.gui.app;
        for (let i = 0; i < this.options.length; i++) {
            if (app.isKeyPressed(keys_1.Keys.VK_A + i)) {
                this.selectedIndex = i;
                if (this.onSelect) {
                    this.onSelect(this.options[i]);
                }
            }
        }
        if (app.isKeyPressed(keys_1.Keys.VK_ENTER)) {
            if (this.onSelect) {
                this.onSelect(this.options[this.selectedIndex]);
            }
        }
        if (app.isKeyPressed(keys_1.Keys.VK_ESCAPE)) {
            if (this.onCancel) {
                this.onCancel();
            }
        }
        if (app.isUpKeyPressed()) {
            this.selectedIndex--;
        }
        if (app.isDownKeyPressed()) {
            this.selectedIndex++;
        }
        if (this.selectedIndex < 0) {
            this.selectedIndex += this.options.length;
        }
        if (this.selectedIndex >= this.options.length) {
            this.selectedIndex -= this.options.length;
        }
        const mouse = app.mouse;
        const offset = this.rect;
        let y = offset.y + MARGIN;
        if (mouse.upCount === 1 && mouse.x >= offset.x1 && mouse.x < offset.x2) {
            for (let i = 0; i < this.options.length; i++) {
                const option = this.options[i];
                const selected = i === this.selectedIndex;
                const lineHeight = this.renderer.getHeight(option, selected);
                const startY = y;
                const endY = y + lineHeight;
                if (mouse.y >= startY && mouse.y < endY) {
                    if (selected) {
                        if (this.onSelect) {
                            this.onSelect(option);
                        }
                    }
                    else {
                        this.selectedIndex = i;
                    }
                }
                y += lineHeight;
            }
        }
        return true;
    }
};
ComplexSelectDialog = __decorate([
    serializable_1.Serializable('ComplexSelectDialog')
], ComplexSelectDialog);
exports.ComplexSelectDialog = ComplexSelectDialog;


/***/ }),

/***/ "./src/gui/defaultselectoptionrenderer.ts":
/*!************************************************!*\
  !*** ./src/gui/defaultselectoptionrenderer.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const standardcolors_1 = __webpack_require__(/*! ../palettes/standardcolors */ "./src/palettes/standardcolors.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
let DefaultSelectOptionRenderer = class DefaultSelectOptionRenderer {
    getHeight(option, selected) {
        return 10;
    }
    drawOption(gui, point, option, selected) {
        const color = selected ? standardcolors_1.StandardColors.YELLOW : standardcolors_1.StandardColors.WHITE;
        gui.app.drawString(option.name, point.x, point.y, color);
    }
};
DefaultSelectOptionRenderer = __decorate([
    serializable_1.Serializable('DefaultSelectOptionRenderer')
], DefaultSelectOptionRenderer);
exports.DefaultSelectOptionRenderer = DefaultSelectOptionRenderer;


/***/ }),

/***/ "./src/gui/dialog.ts":
/*!***************************!*\
  !*** ./src/gui/dialog.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = __webpack_require__(/*! ../keys */ "./src/keys.ts");
const panel_1 = __webpack_require__(/*! ./panel */ "./src/gui/panel.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
let Dialog = class Dialog extends panel_1.Panel {
    constructor(rect) {
        super(rect);
        this.closeButton = false;
    }
    drawContents() {
        if (!this.gui) {
            return;
        }
        this.gui.renderer.draw(this.gui.app, this);
    }
    handleInput() {
        if (!this.gui) {
            return false;
        }
        if (this.handleChildrenInput()) {
            return true;
        }
        if (this.gui.app.isKeyPressed(keys_1.Keys.VK_ESCAPE)) {
            this.visible = false;
            return true;
        }
        const mouse = this.gui.app.mouse;
        if (mouse.isClicked() && !this.rect.contains(mouse)) {
            this.visible = false;
            return true;
        }
        return false;
    }
    close() {
        if (!this.gui) {
            return;
        }
        this.gui.remove(this);
    }
};
Dialog = __decorate([
    serializable_1.Serializable('Dialog')
], Dialog);
exports.Dialog = Dialog;


/***/ }),

/***/ "./src/gui/dialogrenderer.ts":
/*!***********************************!*\
  !*** ./src/gui/dialogrenderer.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
let DialogRenderer = class DialogRenderer {
    constructor(baseRect, closeButtonRect) {
        this.baseRect = baseRect;
        this.closeButtonRect = closeButtonRect;
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
        if (this.closeButtonRect && dialog.closeButton) {
            const w = this.closeButtonRect.width;
            const h = this.closeButtonRect.height;
            const dx = dialog.rect.x2 - w;
            const dy = dialog.rect.y;
            const sx = this.closeButtonRect.x;
            const sy = this.closeButtonRect.y;
            app.drawImage(dx, dy, sx, sy, w, h);
        }
    }
};
DialogRenderer = __decorate([
    serializable_1.Serializable('DialogRenderer')
], DialogRenderer);
exports.DialogRenderer = DialogRenderer;


/***/ }),

/***/ "./src/gui/imagepanel.ts":
/*!*******************************!*\
  !*** ./src/gui/imagepanel.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const panel_1 = __webpack_require__(/*! ./panel */ "./src/gui/panel.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
let ImagePanel = class ImagePanel extends panel_1.Panel {
    constructor(srcRect, destRect) {
        super(destRect);
        this.srcRect = srcRect;
    }
    drawContents() {
        if (!this.gui) {
            return;
        }
        const src = this.srcRect;
        const dst = this.rect;
        this.gui.app.drawImage(dst.x, dst.y, src.x, src.y, dst.width, dst.height);
    }
};
ImagePanel = __decorate([
    serializable_1.Serializable('ImagePanel')
], ImagePanel);
exports.ImagePanel = ImagePanel;


/***/ }),

/***/ "./src/gui/itembutton.ts":
/*!*******************************!*\
  !*** ./src/gui/itembutton.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const arraylist_1 = __webpack_require__(/*! ../arraylist */ "./src/arraylist.ts");
const button_1 = __webpack_require__(/*! ./button */ "./src/gui/button.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
let ItemButton = class ItemButton extends button_1.Button {
    constructor(rect, containerItems, initialItem) {
        super(rect, initialItem.sprite);
        this.containerItems = containerItems;
        this.stackItems = new arraylist_1.ArrayList();
        this.stackItems.add(initialItem);
        this.tooltipMessages = initialItem.tooltipMessages;
    }
    click() {
        if (this.stackItems.length > 0) {
            const item = this.stackItems.get(0);
            const player = item.game.player;
            if (player) {
                player.use(item);
            }
        }
    }
    removeAll() {
        for (let i = this.stackItems.length - 1; i >= 0; i--) {
            this.containerItems.remove(this.stackItems.get(i));
        }
    }
    drawContents() {
        if (!this.gui) {
            return;
        }
        super.drawContents();
        if (this.stackItems.length > 1) {
            const dst = this.rect;
            this.gui.app.drawRightString(this.stackItems.length.toString(), dst.x2 - 3, dst.y2 - 10);
        }
    }
    updateTooltip(tooltip) {
        if (this.stackItems.length > 0) {
            const item = this.stackItems.get(0);
            item.onUpdateTooltip();
            this.tooltipMessages = item.tooltipMessages;
        }
        super.updateTooltip(tooltip);
    }
};
ItemButton = __decorate([
    serializable_1.Serializable('ItemButton')
], ItemButton);
exports.ItemButton = ItemButton;


/***/ }),

/***/ "./src/gui/itemcontainerbuttonslot.ts":
/*!********************************************!*\
  !*** ./src/gui/itemcontainerbuttonslot.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const buttonslot_1 = __webpack_require__(/*! ./buttonslot */ "./src/gui/buttonslot.ts");
const itembutton_1 = __webpack_require__(/*! ./itembutton */ "./src/gui/itembutton.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
let ItemContainerButtonSlot = class ItemContainerButtonSlot extends buttonslot_1.ButtonSlot {
    constructor(rect, shortcutKey) {
        super(rect, shortcutKey);
    }
    onDrop(panel) {
        return panel instanceof itembutton_1.ItemButton;
    }
};
ItemContainerButtonSlot = __decorate([
    serializable_1.Serializable('ItemContainerButtonSlot')
], ItemContainerButtonSlot);
exports.ItemContainerButtonSlot = ItemContainerButtonSlot;


/***/ }),

/***/ "./src/gui/itemcontainerdialog.ts":
/*!****************************************!*\
  !*** ./src/gui/itemcontainerdialog.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = __webpack_require__(/*! ../keys */ "./src/keys.ts");
const rect_1 = __webpack_require__(/*! ../rect */ "./src/rect.ts");
const dialog_1 = __webpack_require__(/*! ./dialog */ "./src/gui/dialog.ts");
const itembutton_1 = __webpack_require__(/*! ./itembutton */ "./src/gui/itembutton.ts");
const itemcontainerbuttonslot_1 = __webpack_require__(/*! ./itemcontainerbuttonslot */ "./src/gui/itemcontainerbuttonslot.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
const MARGIN = 4;
const BUTTON_SPACING = 2;
let ItemContainerDialog = class ItemContainerDialog extends dialog_1.Dialog {
    constructor(rect, messages, capacity, items) {
        super(rect);
        this.messages = messages;
        this.capacity = capacity;
        this.items = items;
        this.modal = true;
        items.addListener({ onAdd: (_, item) => this.addItem(item), onRemove: (_, item) => this.removeItem(item) });
        for (let i = 0; i < capacity; i++) {
            // Slots are repositioned at render time
            this.add(new itemcontainerbuttonslot_1.ItemContainerButtonSlot(new rect_1.Rect(0, 0, 24, 24), keys_1.Keys.VK_A + i));
        }
    }
    addItem(item) {
        const existingButton = this.getExistingButton(item);
        if (existingButton) {
            existingButton.stackItems.add(item);
            return;
        }
        const freeSlot = this.getNextFreeSlot();
        if (freeSlot) {
            freeSlot.add(new itembutton_1.ItemButton(freeSlot.rect.clone(), this.items, item));
        }
    }
    removeItem(item) {
        for (let i = 0; i < this.children.length; i++) {
            const buttonSlot = this.children.get(i);
            const button = buttonSlot.button;
            if (button && button instanceof itembutton_1.ItemButton) {
                if (button.stackItems.contains(item)) {
                    button.stackItems.remove(item);
                    if (button.stackItems.length === 0) {
                        buttonSlot.remove(button);
                    }
                }
            }
        }
    }
    getExistingButton(item) {
        for (let i = 0; i < this.children.length; i++) {
            const buttonSlot = this.children.get(i);
            const button = buttonSlot.button;
            if (button && button instanceof itembutton_1.ItemButton) {
                const existing = button.stackItems.get(0);
                if (item.isStackable(existing)) {
                    return button;
                }
            }
        }
        return undefined;
    }
    getNextFreeSlot() {
        for (let i = 0; i < this.children.length; i++) {
            const buttonSlot = this.children.get(i);
            if (!buttonSlot.button) {
                return buttonSlot;
            }
        }
        return undefined;
    }
    drawContents() {
        super.drawContents();
        if (!this.gui || !this.gui.renderer.buttonSlotRect) {
            return;
        }
        // Update positions of button slots
        const containerRect = this.rect;
        const buttonRect = this.gui.renderer.buttonSlotRect;
        let x = containerRect.x + MARGIN;
        let y = containerRect.y + MARGIN;
        for (let i = 0; i < this.messages.length; i++) {
            const msg = this.messages[i];
            this.gui.app.drawString(msg.text, x, y, msg.color);
            y += 10;
        }
        for (let i = 0; i < this.capacity; i++) {
            const child = this.children.get(i);
            child.rect.x = x;
            child.rect.y = y;
            child.rect.width = buttonRect.width;
            child.rect.height = buttonRect.height;
            x += buttonRect.width + BUTTON_SPACING;
            if (x > containerRect.x2 - buttonRect.width - MARGIN) {
                x = containerRect.x + MARGIN;
                y += buttonRect.height + BUTTON_SPACING;
            }
        }
        this.rect.height = (y + MARGIN) - containerRect.y;
        this.drawChildren();
    }
};
ItemContainerDialog = __decorate([
    serializable_1.Serializable('ItemContainerDialog')
], ItemContainerDialog);
exports.ItemContainerDialog = ItemContainerDialog;


/***/ }),

/***/ "./src/gui/itemshortcutbutton.ts":
/*!***************************************!*\
  !*** ./src/gui/itemshortcutbutton.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const button_1 = __webpack_require__(/*! ./button */ "./src/gui/button.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
let ItemShortcutButton = class ItemShortcutButton extends button_1.Button {
    constructor(rect, containerItems, shortcutItem) {
        super(rect, shortcutItem.sprite);
        this.containerItems = containerItems;
        this.shortcutItem = shortcutItem;
        this.tooltipMessages = shortcutItem.tooltipMessages;
    }
    click() {
        const item = this.getItem();
        if (item) {
            const player = item.game.player;
            if (player) {
                player.use(item);
            }
        }
    }
    drawContents() {
        if (!this.gui) {
            return;
        }
        super.drawContents();
        if (!this.isDragging()) {
            const dst = this.rect;
            const count = this.countItems();
            this.gui.app.drawRightString(count.toString(), dst.x2 - 3, dst.y2 - 10);
        }
    }
    getItem() {
        for (let i = 0; i < this.containerItems.length; i++) {
            const item = this.containerItems.get(i);
            if (this.shortcutItem.isStackable(item)) {
                return item;
            }
        }
        return undefined;
    }
    countItems() {
        let count = 0;
        for (let i = 0; i < this.containerItems.length; i++) {
            if (this.shortcutItem.isStackable(this.containerItems.get(i))) {
                count++;
            }
        }
        return count;
    }
};
ItemShortcutButton = __decorate([
    serializable_1.Serializable('ItemShortcutButton')
], ItemShortcutButton);
exports.ItemShortcutButton = ItemShortcutButton;


/***/ }),

/***/ "./src/gui/messagelog.ts":
/*!*******************************!*\
  !*** ./src/gui/messagelog.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const standardcolors_1 = __webpack_require__(/*! ../palettes/standardcolors */ "./src/palettes/standardcolors.ts");
const message_1 = __webpack_require__(/*! ../message */ "./src/message.ts");
const panel_1 = __webpack_require__(/*! ./panel */ "./src/gui/panel.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
const vec2_1 = __webpack_require__(/*! ../vec2 */ "./src/vec2.ts");
let MessageLog = class MessageLog extends panel_1.Panel {
    constructor(rect, maxItems) {
        super(rect);
        this.messages = [];
        this.maxItems = maxItems || 5;
    }
    add(message, color) {
        if (message instanceof panel_1.Panel) {
            // TODO:  This is a weird artifact of history
            // The original API was designed before Panels were hierarchical.
            return;
        }
        if (message instanceof message_1.Message) {
            this.messages.push(message);
        }
        else {
            this.messages.push(new message_1.Message(message, color || standardcolors_1.StandardColors.WHITE));
        }
        if (this.messages.length > this.maxItems) {
            this.messages.splice(0, this.messages.length - this.maxItems);
        }
    }
    drawContents() {
        if (!this.gui) {
            return;
        }
        const pos = new vec2_1.Vec2(this.rect.x, this.rect.y);
        if (pos.y < 0) {
            // Negative y value indicates attached to bottom of screen
            const bottom = this.gui.app.size.height + pos.y + this.rect.height;
            pos.y = bottom - this.messages.length * 10;
        }
        for (let i = 0; i < this.messages.length; i++) {
            const msg = this.messages[i];
            msg.draw(this.gui.app, pos);
            pos.x = 0;
            pos.y += 10;
        }
    }
    handleInput() {
        return false;
    }
};
MessageLog = __decorate([
    serializable_1.Serializable('MessageLog')
], MessageLog);
exports.MessageLog = MessageLog;


/***/ }),

/***/ "./src/gui/messagepanel.ts":
/*!*********************************!*\
  !*** ./src/gui/messagepanel.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const panel_1 = __webpack_require__(/*! ./panel */ "./src/gui/panel.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
let MessagePanel = class MessagePanel extends panel_1.Panel {
    constructor(rect, message) {
        super(rect);
        this.message = message;
    }
    drawContents() {
        if (!this.gui) {
            return;
        }
        const msg = this.message;
        const dst = this.rect;
        this.gui.app.drawString(msg.text, dst.x, dst.y, msg.color);
    }
};
MessagePanel = __decorate([
    serializable_1.Serializable('MessagePanel')
], MessagePanel);
exports.MessagePanel = MessagePanel;


/***/ }),

/***/ "./src/gui/panel.ts":
/*!**************************!*\
  !*** ./src/gui/panel.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const arraylist_1 = __webpack_require__(/*! ../arraylist */ "./src/arraylist.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
let Panel = class Panel {
    constructor(rect) {
        this.gui = null;
        this.rect = rect;
        this.children = new arraylist_1.ArrayList();
        this.modal = false;
        this.visible = true;
    }
    setGui(gui) {
        if (this.gui) {
            // Already set
            return;
        }
        this.gui = gui;
        for (let i = 0; i < this.children.length; i++) {
            this.children.get(i).setGui(gui);
        }
    }
    add(panel) {
        panel.parent = this;
        panel.setGui(this.gui);
        this.children.add(panel);
    }
    remove(panel) {
        this.children.remove(panel);
    }
    move(newParent) {
        if (this.parent) {
            this.parent.remove(this);
        }
        newParent.add(this);
    }
    getPanelAt(point) {
        for (let i = this.children.length - 1; i >= 0; i--) {
            const child = this.children.get(i);
            if (!child.visible) {
                // Ignore hidden elements
                continue;
            }
            if (child.isDragging()) {
                // Ignore dragging element
                continue;
            }
            const childResult = child.getPanelAt(point);
            if (childResult) {
                return childResult;
            }
        }
        if (this.rect.contains(point)) {
            return this;
        }
        return undefined;
    }
    drawContents() {
        this.drawChildren();
    }
    drawChildren() {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children.get(i);
            if (!child.visible) {
                // Ignore hidden elements
                continue;
            }
            child.drawContents();
        }
    }
    handleInput() {
        return this.handleChildrenInput();
    }
    handleChildrenInput() {
        // for (let i = 0; i < this.children.length; i++) {
        for (let i = this.children.length - 1; i >= 0; i--) {
            const child = this.children.get(i);
            if (!child.visible) {
                // Ignore hidden elements
                continue;
            }
            if (child.handleInput() || child.modal) {
                return true;
            }
        }
        return false;
    }
    isDragging() {
        return this.gui && this.gui.dragElement === this;
    }
    onDrop(panel) {
        return false;
    }
    updateTooltip(tooltip) {
        // By default, no visible tooltips
        // Inheriting classes can override this method with tooltip details
        tooltip.visible = false;
    }
};
Panel = __decorate([
    serializable_1.Serializable('Panel')
], Panel);
exports.Panel = Panel;


/***/ }),

/***/ "./src/gui/selectdialog.ts":
/*!*********************************!*\
  !*** ./src/gui/selectdialog.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = __webpack_require__(/*! ../keys */ "./src/keys.ts");
const dialog_1 = __webpack_require__(/*! ./dialog */ "./src/gui/dialog.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
const MARGIN = 4;
const LINE_HEIGHT = 10;
let SelectDialog = class SelectDialog extends dialog_1.Dialog {
    constructor(rect, options, callback) {
        super(rect);
        this.options = options;
        this.callback = callback;
    }
    drawContents() {
        if (!this.gui) {
            return;
        }
        super.drawContents();
        const offset = this.rect;
        for (let i = 0; i < this.options.length; i++) {
            const str = String.fromCharCode(65 + i) + ' - ' + this.options[i].name;
            this.gui.app.drawString(str, offset.x + MARGIN, offset.y + MARGIN + i * LINE_HEIGHT);
        }
    }
    handleInput() {
        if (!this.gui) {
            return false;
        }
        for (let i = 0; i < this.options.length; i++) {
            if (this.gui.app.isKeyPressed(keys_1.Keys.VK_A + i)) {
                this.callback(this.options[i]);
                this.close();
                return true;
            }
        }
        if (this.gui.app.isKeyPressed(keys_1.Keys.VK_ESCAPE)) {
            this.close();
            return true;
        }
        const mouse = this.gui.app.mouse;
        const offset = this.rect;
        if (mouse.isClicked() && mouse.x >= offset.x1 && mouse.x < offset.x2) {
            if (this.closeButton && mouse.x >= offset.x2 - 16 && mouse.y < offset.y + 16) {
                this.close();
                return true;
            }
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
};
SelectDialog = __decorate([
    serializable_1.Serializable('SelectDialog')
], SelectDialog);
exports.SelectDialog = SelectDialog;


/***/ }),

/***/ "./src/gui/shortcutbar.ts":
/*!********************************!*\
  !*** ./src/gui/shortcutbar.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = __webpack_require__(/*! ../keys */ "./src/keys.ts");
const rect_1 = __webpack_require__(/*! ../rect */ "./src/rect.ts");
const itemshortcutbutton_1 = __webpack_require__(/*! ./itemshortcutbutton */ "./src/gui/itemshortcutbutton.ts");
const panel_1 = __webpack_require__(/*! ./panel */ "./src/gui/panel.ts");
const shortcutbuttonslot_1 = __webpack_require__(/*! ./shortcutbuttonslot */ "./src/gui/shortcutbuttonslot.ts");
const talentbutton_1 = __webpack_require__(/*! ./talentbutton */ "./src/gui/talentbutton.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
const DEFAULT_SPACING = 2;
let ShortcutBar = class ShortcutBar extends panel_1.Panel {
    constructor(rect, count, spacing) {
        super(rect);
        this.spacing = spacing !== undefined ? spacing : DEFAULT_SPACING;
        for (let i = 0; i < count; i++) {
            const buttonSlot = new shortcutbuttonslot_1.ShortcutButtonSlot(new rect_1.Rect(0, 0, 24, 24), keys_1.Keys.VK_1 + i);
            this.add(buttonSlot);
        }
    }
    addTalent(talent, rightToLeft) {
        if (this.containsTalent(talent)) {
            return;
        }
        const slot = this.getFreeSlot(!!rightToLeft);
        if (slot) {
            slot.add(new talentbutton_1.TalentButton(slot.rect.clone(), talent, true));
        }
    }
    containsTalent(talent) {
        for (let i = 0; i < this.children.length; i++) {
            const slot = this.children.get(i);
            if (slot.button && slot.button instanceof talentbutton_1.TalentButton && slot.button.talent === talent) {
                return true;
            }
        }
        return false;
    }
    addItem(items, item, rightToLeft) {
        if (this.containsItem(item)) {
            return;
        }
        const slot = this.getFreeSlot(!!rightToLeft);
        if (slot) {
            slot.add(new itemshortcutbutton_1.ItemShortcutButton(slot.rect.clone(), items, item));
        }
    }
    containsItem(item) {
        for (let i = 0; i < this.children.length; i++) {
            const slot = this.children.get(i);
            if (slot.button && slot.button instanceof itemshortcutbutton_1.ItemShortcutButton && item.isStackable(slot.button.shortcutItem)) {
                return true;
            }
        }
        return false;
    }
    drawContents() {
        if (!this.gui) {
            return;
        }
        const buttonRect = this.gui.renderer.buttonSlotRect;
        if (!buttonRect) {
            return;
        }
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children.get(i);
            child.rect.x = this.rect.x + i * (buttonRect.width + DEFAULT_SPACING);
            child.rect.y = this.rect.y;
            child.rect.width = buttonRect.width;
            child.rect.height = buttonRect.height;
        }
        this.drawChildren();
    }
    getFreeSlot(rightToLeft) {
        if (rightToLeft) {
            // Right to left
            for (let i = this.children.length - 1; i >= 0; i--) {
                const slot = this.children.get(i);
                if (!slot.button) {
                    return slot;
                }
            }
        }
        else {
            // Left to right
            for (let i = 0; i < this.children.length; i++) {
                const slot = this.children.get(i);
                if (!slot.button) {
                    return slot;
                }
            }
        }
        return undefined;
    }
};
ShortcutBar = __decorate([
    serializable_1.Serializable('ShortcutBar')
], ShortcutBar);
exports.ShortcutBar = ShortcutBar;


/***/ }),

/***/ "./src/gui/shortcutbuttonslot.ts":
/*!***************************************!*\
  !*** ./src/gui/shortcutbuttonslot.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const buttonslot_1 = __webpack_require__(/*! ./buttonslot */ "./src/gui/buttonslot.ts");
const itembutton_1 = __webpack_require__(/*! ./itembutton */ "./src/gui/itembutton.ts");
const itemshortcutbutton_1 = __webpack_require__(/*! ./itemshortcutbutton */ "./src/gui/itemshortcutbutton.ts");
const talentbutton_1 = __webpack_require__(/*! ./talentbutton */ "./src/gui/talentbutton.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
let ShortcutButtonSlot = class ShortcutButtonSlot extends buttonslot_1.ButtonSlot {
    onDrop(panel) {
        if (this.children.length > 0) {
            // Already has a button
            // TODO: Add ability to replace an existing shortcut
            return false;
        }
        if (panel instanceof itembutton_1.ItemButton) {
            const itemButton = panel;
            const containerItems = itemButton.containerItems;
            const shortcutItem = itemButton.stackItems.get(0);
            this.add(new itemshortcutbutton_1.ItemShortcutButton(this.rect.clone(), containerItems, shortcutItem));
            // Even though the operation was successful,
            // return false because we don't want to move the original button
            return false;
        }
        if (panel instanceof talentbutton_1.TalentButton) {
            if (panel.shortcut) {
                // Move the existing shortcut
                return true;
            }
            else {
                // Create a shortcut to the talent
                this.add(new talentbutton_1.TalentButton(this.rect.clone(), panel.talent, true));
                return false;
            }
        }
        if (panel instanceof itemshortcutbutton_1.ItemShortcutButton || (panel instanceof talentbutton_1.TalentButton && panel.shortcut)) {
            // Move button
            return true;
        }
        return false;
    }
};
ShortcutButtonSlot = __decorate([
    serializable_1.Serializable('ShortcutButtonSlot')
], ShortcutButtonSlot);
exports.ShortcutButtonSlot = ShortcutButtonSlot;


/***/ }),

/***/ "./src/gui/talentbutton.ts":
/*!*********************************!*\
  !*** ./src/gui/talentbutton.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const standardcolors_1 = __webpack_require__(/*! ../palettes/standardcolors */ "./src/palettes/standardcolors.ts");
const button_1 = __webpack_require__(/*! ./button */ "./src/gui/button.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
let TalentButton = class TalentButton extends button_1.Button {
    constructor(rect, talent, shortcut) {
        super(rect, talent.ability.sprite);
        this.talent = talent;
        this.shortcut = !!shortcut;
        this.tooltipMessages = talent.ability.tooltipMessages;
    }
    click() {
        this.talent.use();
    }
    drawContents() {
        super.drawContents();
        if (this.talent.cooldown > 0) {
            const game = this.talent.actor.game;
            const cooldownSprite = game.cooldownSprite;
            if (cooldownSprite) {
                const percent = 1.0 - this.talent.cooldown / this.talent.ability.cooldown;
                const frame = Math.round(percent * cooldownSprite.frames);
                const u = cooldownSprite.x + frame * cooldownSprite.width;
                const v = cooldownSprite.y;
                const x = this.rect.x + ((this.rect.width - cooldownSprite.width) / 2) | 0;
                const y = this.rect.y + ((this.rect.height - cooldownSprite.height) / 2) | 0;
                game.app.drawImage(x, y, u, v, cooldownSprite.width, cooldownSprite.height);
                const cx = this.rect.x + (this.rect.width / 2) | 0;
                const cy = this.rect.y + (this.rect.height / 2) | 0;
                game.app.drawCenteredString(this.talent.cooldown.toString(), cx + 1, cy - 2, standardcolors_1.StandardColors.BLACK);
                game.app.drawCenteredString(this.talent.cooldown.toString(), cx, cy - 3, standardcolors_1.StandardColors.WHITE);
            }
        }
    }
};
TalentButton = __decorate([
    serializable_1.Serializable('TalentButton')
], TalentButton);
exports.TalentButton = TalentButton;


/***/ }),

/***/ "./src/gui/talentsdialog.ts":
/*!**********************************!*\
  !*** ./src/gui/talentsdialog.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = __webpack_require__(/*! ../keys */ "./src/keys.ts");
const rect_1 = __webpack_require__(/*! ../rect */ "./src/rect.ts");
const buttonslot_1 = __webpack_require__(/*! ./buttonslot */ "./src/gui/buttonslot.ts");
const dialog_1 = __webpack_require__(/*! ./dialog */ "./src/gui/dialog.ts");
const talentbutton_1 = __webpack_require__(/*! ./talentbutton */ "./src/gui/talentbutton.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
const MARGIN = 4;
const BUTTON_SPACING = 2;
let TalentsDialog = class TalentsDialog extends dialog_1.Dialog {
    constructor(rect, messages, capacity, talents) {
        super(rect);
        this.messages = messages;
        this.capacity = capacity;
        this.talents = talents;
        this.modal = true;
        talents.addListener({ onAdd: (_, talent) => this.addItem(talent), onRemove: (_, talent) => this.removeItem(talent) });
        for (let i = 0; i < capacity; i++) {
            // Slots are repositioned at render time
            this.add(new buttonslot_1.ButtonSlot(new rect_1.Rect(0, 0, 24, 24), keys_1.Keys.VK_A + i));
        }
    }
    addItem(talent) {
        const freeSlot = this.getNextFreeSlot();
        if (freeSlot) {
            freeSlot.add(new talentbutton_1.TalentButton(freeSlot.rect.clone(), talent));
        }
    }
    removeItem(talent) {
        for (let i = 0; i < this.children.length; i++) {
            const buttonSlot = this.children.get(i);
            const button = buttonSlot.button;
            if (button && button instanceof talentbutton_1.TalentButton) {
                if (button.talent === talent) {
                    buttonSlot.remove(button);
                }
            }
        }
    }
    getNextFreeSlot() {
        for (let i = 0; i < this.children.length; i++) {
            const buttonSlot = this.children.get(i);
            if (!buttonSlot.button) {
                return buttonSlot;
            }
        }
        return undefined;
    }
    drawContents() {
        super.drawContents();
        if (!this.gui || !this.gui.renderer.buttonSlotRect) {
            return;
        }
        // Update positions of button slots
        const containerRect = this.rect;
        const buttonRect = this.gui.renderer.buttonSlotRect;
        let x = containerRect.x + MARGIN;
        let y = containerRect.y + MARGIN;
        for (let i = 0; i < this.messages.length; i++) {
            const msg = this.messages[i];
            this.gui.app.drawString(msg.text, x, y, msg.color);
            y += 10;
        }
        for (let i = 0; i < this.capacity; i++) {
            const child = this.children.get(i);
            child.rect.x = x;
            child.rect.y = y;
            child.rect.width = buttonRect.width;
            child.rect.height = buttonRect.height;
            x += buttonRect.width + BUTTON_SPACING;
            if (x > containerRect.x2 - buttonRect.width - MARGIN) {
                x = containerRect.x + MARGIN;
                y += buttonRect.height + BUTTON_SPACING;
            }
        }
        this.rect.height = (y + MARGIN) - containerRect.y;
        this.drawChildren();
    }
};
TalentsDialog = __decorate([
    serializable_1.Serializable('TalentsDialog')
], TalentsDialog);
exports.TalentsDialog = TalentsDialog;


/***/ }),

/***/ "./src/gui/tooltipdialog.ts":
/*!**********************************!*\
  !*** ./src/gui/tooltipdialog.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const rect_1 = __webpack_require__(/*! ../rect */ "./src/rect.ts");
const dialog_1 = __webpack_require__(/*! ./dialog */ "./src/gui/dialog.ts");
const serializable_1 = __webpack_require__(/*! ../serializable */ "./src/serializable.ts");
const vec2_1 = __webpack_require__(/*! ../vec2 */ "./src/vec2.ts");
const WIDTH = 100;
const MARGIN = 5;
const LINE_PADDING = 2;
let TooltipDialog = class TooltipDialog extends dialog_1.Dialog {
    constructor() {
        super(new rect_1.Rect(0, 0, WIDTH, 10));
        this.messages = [];
        this.visible = false;
    }
    showAt(x, y) {
        if (!this.gui) {
            return;
        }
        // Resize
        const app = this.gui.app;
        const font = app.font;
        const lineHeight = font.getHeight() + LINE_PADDING;
        this.rect.width = 2 * MARGIN;
        this.rect.height = 2 * MARGIN + this.messages.length * lineHeight;
        for (let i = 0; i < this.messages.length; i++) {
            const msg = this.messages[i];
            const width = 2 * MARGIN + msg.getWidth(font);
            this.rect.width = Math.max(this.rect.width, width);
        }
        if (x + this.rect.width >= app.size.width) {
            this.rect.x = x - this.rect.width - 2;
        }
        else {
            this.rect.x = x + 2;
        }
        if (y - this.rect.height < 0) {
            this.rect.y = y + 2;
        }
        else {
            this.rect.y = y - this.rect.height - 2;
        }
        if (this.rect.x < 0) {
            this.rect.x = 0;
        }
        if (this.rect.y < 0) {
            this.rect.y = 0;
        }
        this.visible = true;
    }
    drawContents() {
        if (!this.gui) {
            return;
        }
        // Draw the dialog border
        super.drawContents();
        const lineHeight = this.gui.app.font.getHeight() + LINE_PADDING;
        const pos = new vec2_1.Vec2(this.rect.x + MARGIN, this.rect.y + MARGIN);
        for (let i = 0; i < this.messages.length; i++) {
            const msg = this.messages[i];
            msg.draw(this.gui.app, pos);
            pos.x = this.rect.x + MARGIN;
            pos.y += lineHeight;
        }
    }
    handleInput() {
        if (!this.gui) {
            return false;
        }
        if (this.gui.app.mouse.isClicked()) {
            this.visible = false;
        }
        return false;
    }
};
TooltipDialog = __decorate([
    serializable_1.Serializable('TooltipDialog')
], TooltipDialog);
exports.TooltipDialog = TooltipDialog;


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
__export(__webpack_require__(/*! ./ability */ "./src/ability.ts"));
__export(__webpack_require__(/*! ./actor */ "./src/actor.ts"));
__export(__webpack_require__(/*! ./ai/ai */ "./src/ai/ai.ts"));
__export(__webpack_require__(/*! ./ai/basicmonster */ "./src/ai/basicmonster.ts"));
__export(__webpack_require__(/*! ./ai/confusedmonster */ "./src/ai/confusedmonster.ts"));
__export(__webpack_require__(/*! ./animations/animation */ "./src/animations/animation.ts"));
__export(__webpack_require__(/*! ./animations/bumpanimation */ "./src/animations/bumpanimation.ts"));
__export(__webpack_require__(/*! ./animations/fadeinanimation */ "./src/animations/fadeinanimation.ts"));
__export(__webpack_require__(/*! ./animations/fadeoutanimation */ "./src/animations/fadeoutanimation.ts"));
__export(__webpack_require__(/*! ./animations/floatingtextanimation */ "./src/animations/floatingtextanimation.ts"));
__export(__webpack_require__(/*! ./animations/projectileanimation */ "./src/animations/projectileanimation.ts"));
__export(__webpack_require__(/*! ./animations/slideanimation */ "./src/animations/slideanimation.ts"));
__export(__webpack_require__(/*! ./app */ "./src/app.ts"));
__export(__webpack_require__(/*! ./appstate */ "./src/appstate.ts"));
__export(__webpack_require__(/*! ./arraylist */ "./src/arraylist.ts"));
__export(__webpack_require__(/*! ./color */ "./src/color.ts"));
__export(__webpack_require__(/*! ./compoundmessage */ "./src/compoundmessage.ts"));
__export(__webpack_require__(/*! ./entity */ "./src/entity.ts"));
__export(__webpack_require__(/*! ./game */ "./src/game.ts"));
__export(__webpack_require__(/*! ./gui */ "./src/gui.ts"));
__export(__webpack_require__(/*! ./gui/button */ "./src/gui/button.ts"));
__export(__webpack_require__(/*! ./gui/buttonslot */ "./src/gui/buttonslot.ts"));
__export(__webpack_require__(/*! ./gui/complexselectdialog */ "./src/gui/complexselectdialog.ts"));
__export(__webpack_require__(/*! ./gui/dialog */ "./src/gui/dialog.ts"));
__export(__webpack_require__(/*! ./gui/dialogrenderer */ "./src/gui/dialogrenderer.ts"));
__export(__webpack_require__(/*! ./gui/imagepanel */ "./src/gui/imagepanel.ts"));
__export(__webpack_require__(/*! ./gui/itembutton */ "./src/gui/itembutton.ts"));
__export(__webpack_require__(/*! ./gui/itemcontainerdialog */ "./src/gui/itemcontainerdialog.ts"));
__export(__webpack_require__(/*! ./gui/itemshortcutbutton */ "./src/gui/itemshortcutbutton.ts"));
__export(__webpack_require__(/*! ./gui/messagelog */ "./src/gui/messagelog.ts"));
__export(__webpack_require__(/*! ./gui/messagepanel */ "./src/gui/messagepanel.ts"));
__export(__webpack_require__(/*! ./gui/panel */ "./src/gui/panel.ts"));
__export(__webpack_require__(/*! ./gui/selectdialog */ "./src/gui/selectdialog.ts"));
__export(__webpack_require__(/*! ./gui/shortcutbar */ "./src/gui/shortcutbar.ts"));
__export(__webpack_require__(/*! ./gui/shortcutbuttonslot */ "./src/gui/shortcutbuttonslot.ts"));
__export(__webpack_require__(/*! ./gui/talentbutton */ "./src/gui/talentbutton.ts"));
__export(__webpack_require__(/*! ./gui/talentsdialog */ "./src/gui/talentsdialog.ts"));
__export(__webpack_require__(/*! ./input */ "./src/input.ts"));
__export(__webpack_require__(/*! ./item */ "./src/item.ts"));
__export(__webpack_require__(/*! ./keyboard */ "./src/keyboard.ts"));
__export(__webpack_require__(/*! ./keys */ "./src/keys.ts"));
__export(__webpack_require__(/*! ./message */ "./src/message.ts"));
__export(__webpack_require__(/*! ./mouse */ "./src/mouse.ts"));
__export(__webpack_require__(/*! ./palettes/cgacolors */ "./src/palettes/cgacolors.ts"));
__export(__webpack_require__(/*! ./palettes/pico8colors */ "./src/palettes/pico8colors.ts"));
__export(__webpack_require__(/*! ./palettes/standardcolors */ "./src/palettes/standardcolors.ts"));
__export(__webpack_require__(/*! ./path */ "./src/path.ts"));
__export(__webpack_require__(/*! ./rect */ "./src/rect.ts"));
__export(__webpack_require__(/*! ./rng */ "./src/rng.ts"));
__export(__webpack_require__(/*! ./serializable */ "./src/serializable.ts"));
__export(__webpack_require__(/*! ./serializer */ "./src/serializer.ts"));
__export(__webpack_require__(/*! ./sprite */ "./src/sprite.ts"));
__export(__webpack_require__(/*! ./talent */ "./src/talent.ts"));
__export(__webpack_require__(/*! ./tilemap/tilemap */ "./src/tilemap/tilemap.ts"));
__export(__webpack_require__(/*! ./tilemap/tilemapcell */ "./src/tilemap/tilemapcell.ts"));
__export(__webpack_require__(/*! ./tilemap/tilemaprenderer */ "./src/tilemap/tilemaprenderer.ts"));
__export(__webpack_require__(/*! ./vec2 */ "./src/vec2.ts"));


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

/***/ "./src/item.ts":
/*!*********************!*\
  !*** ./src/item.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = __webpack_require__(/*! ./entity */ "./src/entity.ts");
const serializable_1 = __webpack_require__(/*! ./serializable */ "./src/serializable.ts");
let Item = class Item extends entity_1.Entity {
    /**
     * Returns true if this item can be stacked with the other item
     * in containers such as chests and bags.
     *
     * By default, items are stackable if they have the same name.
     * Overriding classes can change this logic.
     *
     * @param other Other item to stack with.
     */
    isStackable(other) {
        return this.name === other.name;
    }
    onBump(player) {
        player.pickup(this);
        player.moveToward(this.x, this.y);
        return true;
    }
    onPickup(user) { }
    onUse(user) {
        return false;
    }
    onUpdateTooltip() { }
};
Item = __decorate([
    serializable_1.Serializable('Item')
], Item);
exports.Item = Item;


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

/***/ "./src/message.ts":
/*!************************!*\
  !*** ./src/message.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(text, color) {
        this.text = text;
        this.color = color;
    }
    draw(app, pos) {
        app.drawString(this.text, pos.x, pos.y, this.color, pos);
    }
    getWidth(font) {
        return font.getStringWidth(this.text);
    }
}
exports.Message = Message;


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
const vec2_1 = __webpack_require__(/*! ./vec2 */ "./src/vec2.ts");
const MIN_DRAG_DISTANCE = 4;
const LONG_PRESS_TICKS = 30;
class Mouse extends input_1.Input {
    constructor(app) {
        super();
        this.app = app;
        this.prev = new vec2_1.Vec2(0, 0);
        this.start = new vec2_1.Vec2(0, 0);
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.dragDistance = 0;
        this.longPress = false;
        this.wheelDelta = 0;
        this.lastWheelDelta = 0;
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
        const wheelEventHandler = this.handleMouseWheel.bind(this);
        el.addEventListener('mousewheel', wheelEventHandler);
    }
    handleTouchEvent(e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            this.updatePosition(touch.clientX, touch.clientY);
        }
        if (e.type === 'touchstart') {
            this.down = true;
            this.prev.x = this.x;
            this.prev.y = this.y;
            this.start.x = this.x;
            this.start.y = this.y;
            this.dx = 0;
            this.dy = 0;
            this.dragDistance = 0;
        }
        if (e.type === 'touchend') {
            this.down = false;
            this.longPress = this.downCount >= LONG_PRESS_TICKS;
        }
    }
    handleEvent(e) {
        e.stopPropagation();
        e.preventDefault();
        this.updatePosition(e.clientX, e.clientY);
        if (e.type === 'mousedown') {
            this.down = true;
            this.start.x = this.x;
            this.start.y = this.y;
            this.dragDistance = 0;
            this.app.canvas.focus();
        }
        if (e.type === 'mouseup') {
            this.down = false;
            this.longPress = this.downCount >= LONG_PRESS_TICKS;
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
    handleMouseWheel(e) {
        e.stopPropagation();
        e.preventDefault();
        const mwe = e;
        this.lastWheelDelta = Math.max(-1, Math.min(1, mwe.deltaY));
        return false;
    }
    update() {
        super.update();
        this.dx = this.x - this.prev.x;
        this.dy = this.y - this.prev.y;
        this.prev.x = this.x;
        this.prev.y = this.y;
        this.wheelDelta = this.lastWheelDelta;
        this.lastWheelDelta = 0;
        if (this.down) {
            this.dragDistance += Math.abs(this.dx) + Math.abs(this.dy);
        }
    }
    isClicked() {
        return this.upCount === 1 && this.dragDistance < MIN_DRAG_DISTANCE && !this.longPress;
    }
    isDragging() {
        return this.down && this.dragDistance > MIN_DRAG_DISTANCE;
    }
    isLongPress() {
        return this.downCount === LONG_PRESS_TICKS && !this.isDragging();
    }
}
exports.Mouse = Mouse;


/***/ }),

/***/ "./src/palettes/cgacolors.ts":
/*!***********************************!*\
  !*** ./src/palettes/cgacolors.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = __webpack_require__(/*! ../color */ "./src/color.ts");
/**
 * https://en.wikipedia.org/wiki/Color_Graphics_Adapter
 */
var CgaColors;
(function (CgaColors) {
    CgaColors[CgaColors["BLACK"] = color_1.fromRgb(0, 0, 0)] = "BLACK";
    CgaColors[CgaColors["BLUE"] = color_1.fromRgb(0x00, 0x00, 0xFF)] = "BLUE";
    CgaColors[CgaColors["GREEN"] = color_1.fromRgb(0x00, 0xAA, 0x00)] = "GREEN";
    CgaColors[CgaColors["CYAN"] = color_1.fromRgb(0x00, 0xAA, 0xAA)] = "CYAN";
    CgaColors[CgaColors["RED"] = color_1.fromRgb(0xAA, 0x00, 0x00)] = "RED";
    CgaColors[CgaColors["MAGENTA"] = color_1.fromRgb(0xAA, 0x00, 0xAA)] = "MAGENTA";
    CgaColors[CgaColors["BROWN"] = color_1.fromRgb(0xAA, 0x55, 0x00)] = "BROWN";
    CgaColors[CgaColors["LIGHT_GRAY"] = color_1.fromRgb(0xAA, 0xAA, 0xAA)] = "LIGHT_GRAY";
    CgaColors[CgaColors["DARK_GRAY"] = color_1.fromRgb(0x55, 0x55, 0x55)] = "DARK_GRAY";
    CgaColors[CgaColors["LIGHT_BLUE"] = color_1.fromRgb(0x55, 0x55, 0xFF)] = "LIGHT_BLUE";
    CgaColors[CgaColors["LIGHT_GREEN"] = color_1.fromRgb(0x55, 0xFF, 0x55)] = "LIGHT_GREEN";
    CgaColors[CgaColors["LIGHT_CYAN"] = color_1.fromRgb(0xFF, 0xFF, 0xFF)] = "LIGHT_CYAN";
    CgaColors[CgaColors["LIGHT_RED"] = color_1.fromRgb(0xFF, 0x55, 0x55)] = "LIGHT_RED";
    CgaColors[CgaColors["LIGHT_MAGENTA"] = color_1.fromRgb(0xFF, 0x55, 0xFF)] = "LIGHT_MAGENTA";
    CgaColors[CgaColors["YELLOW"] = color_1.fromRgb(0xFF, 0xFF, 0x55)] = "YELLOW";
    CgaColors[CgaColors["WHITE"] = color_1.fromRgb(0xFF, 0xFF, 0xFF)] = "WHITE";
})(CgaColors = exports.CgaColors || (exports.CgaColors = {}));


/***/ }),

/***/ "./src/palettes/pico8colors.ts":
/*!*************************************!*\
  !*** ./src/palettes/pico8colors.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = __webpack_require__(/*! ../color */ "./src/color.ts");
/**
 * https://www.romanzolotarev.com/pico-8-color-palette/
 * https://twitter.com/lexaloffle/status/732649035165667329
 */
var Pico8Colors;
(function (Pico8Colors) {
    Pico8Colors[Pico8Colors["BLACK"] = color_1.fromRgb(0, 0, 0)] = "BLACK";
    Pico8Colors[Pico8Colors["DARK_BLUE"] = color_1.fromRgb(29, 43, 83)] = "DARK_BLUE";
    Pico8Colors[Pico8Colors["DARK_PURPLE"] = color_1.fromRgb(126, 37, 83)] = "DARK_PURPLE";
    Pico8Colors[Pico8Colors["DARK_GREEN"] = color_1.fromRgb(0, 135, 81)] = "DARK_GREEN";
    Pico8Colors[Pico8Colors["BROWN"] = color_1.fromRgb(171, 82, 54)] = "BROWN";
    Pico8Colors[Pico8Colors["DARK_GRAY"] = color_1.fromRgb(95, 87, 79)] = "DARK_GRAY";
    Pico8Colors[Pico8Colors["LIGHT_GRAY"] = color_1.fromRgb(194, 195, 199)] = "LIGHT_GRAY";
    Pico8Colors[Pico8Colors["WHITE"] = color_1.fromRgb(255, 241, 232)] = "WHITE";
    Pico8Colors[Pico8Colors["RED"] = color_1.fromRgb(255, 0, 77)] = "RED";
    Pico8Colors[Pico8Colors["ORANGE"] = color_1.fromRgb(255, 163, 0)] = "ORANGE";
    Pico8Colors[Pico8Colors["YELLOW"] = color_1.fromRgb(255, 236, 39)] = "YELLOW";
    Pico8Colors[Pico8Colors["GREEN"] = color_1.fromRgb(0, 228, 54)] = "GREEN";
    Pico8Colors[Pico8Colors["BLUE"] = color_1.fromRgb(41, 173, 255)] = "BLUE";
    Pico8Colors[Pico8Colors["INDIGO"] = color_1.fromRgb(131, 118, 156)] = "INDIGO";
    Pico8Colors[Pico8Colors["PINK"] = color_1.fromRgb(255, 119, 168)] = "PINK";
    Pico8Colors[Pico8Colors["PEACH"] = color_1.fromRgb(255, 204, 170)] = "PEACH";
})(Pico8Colors = exports.Pico8Colors || (exports.Pico8Colors = {}));


/***/ }),

/***/ "./src/palettes/standardcolors.ts":
/*!****************************************!*\
  !*** ./src/palettes/standardcolors.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = __webpack_require__(/*! ../color */ "./src/color.ts");
var StandardColors;
(function (StandardColors) {
    StandardColors[StandardColors["BLACK"] = color_1.fromRgb(0, 0, 0)] = "BLACK";
    StandardColors[StandardColors["WHITE"] = color_1.fromRgb(0xFF, 0xFF, 0xFF)] = "WHITE";
    StandardColors[StandardColors["GRAY"] = color_1.fromRgb(0x80, 0x80, 0x80)] = "GRAY";
    StandardColors[StandardColors["YELLOW"] = color_1.fromRgb(0xFF, 0xFF, 0x00)] = "YELLOW";
    StandardColors[StandardColors["RED"] = color_1.fromRgb(0xFF, 0x00, 0x00)] = "RED";
    StandardColors[StandardColors["GREEN"] = color_1.fromRgb(0x00, 0xFF, 0x00)] = "GREEN";
    StandardColors[StandardColors["CYAN"] = color_1.fromRgb(0x00, 0xFF, 0xFF)] = "CYAN";
    StandardColors[StandardColors["BLUE"] = color_1.fromRgb(0x00, 0x00, 0xFF)] = "BLUE";
    StandardColors[StandardColors["PINK"] = color_1.fromRgb(0xFF, 0x00, 0xFF)] = "PINK";
    StandardColors[StandardColors["ORANGE"] = color_1.fromRgb(0xFF, 0x80, 0x00)] = "ORANGE";
})(StandardColors = exports.StandardColors || (exports.StandardColors = {}));


/***/ }),

/***/ "./src/path.ts":
/*!*********************!*\
  !*** ./src/path.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const dxs = [-1, 0, 1, -1, 1, -1, 0, 1];
const dys = [-1, -1, -1, 0, 0, 1, 1, 1];
const costs = [1.5, 1, 1.5, 1, 1, 1.5, 1, 1.5];
// const dxs = [0, -1, 1, 0];
// const dys = [-1, 0, 0, 1];
// const costs = [1, 1, 1, 1];
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
                if (alt < v.g && alt <= maxDist && ((x === dest.x && y === dest.y) || !map.grid[y][x].blocked)) {
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
    clone() {
        return new Rect(this.x, this.y, this.width, this.height);
    }
    copy(other) {
        this.x = other.x;
        this.y = other.y;
        this.width = other.width;
        this.height = other.height;
    }
    getCenter() {
        return new vec2_1.Vec2(this.x + (this.width / 2) | 0, this.y + (this.height / 2) | 0);
    }
    intersects(other) {
        return this.x <= other.x2 && this.x2 >= other.x && this.y <= other.y2 && this.y2 >= other.y;
    }
    contains(point) {
        return point.x >= this.x && point.x <= this.x2 && point.y >= this.y && point.y <= this.y2;
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
    'if (v_color.a != 0.0) gl_FragColor = v_color;' +
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
     * Draws a right-aligned string.
     * @param {string} str The text string to draw.
     * @param {number} x The x-coordinate of the top-right corner.
     * @param {number} y The y-coordinate of the top-right corner.
     * @param {number=} color Optional color.
     */
    drawRightString(str, x, y, color) {
        const x2 = x - this.font.getStringWidth(str);
        this.drawString(str, x2, y, color);
    }
    /**
     * Draws a string.
     * @param {string} str The text string to draw.
     * @param {number} x0 The x-coordinate of the top-left corner.
     * @param {number} y0 The y-coordinate of the top-left corner.
     * @param {Color=} color Optional color.
     * @param {Vec2=} out Optional output location of cursor.
     */
    drawString(str, x0, y0, color, out) {
        const lines = str.split('\n');
        const height = this.font.getHeight();
        let x = x0;
        let y = y0;
        for (let i = 0; i < lines.length; i++) {
            if (i > 0) {
                x = x0;
                y += height;
            }
            for (let j = 0; j < lines[i].length; j++) {
                const charCode = lines[i].charCodeAt(j);
                if (this.font.isInRange(charCode)) {
                    const offset = this.font.getOffset(charCode);
                    const width = this.font.getWidth(charCode);
                    this.drawImage(x, y, offset, 0, width, height, color);
                    x += width;
                }
            }
        }
        if (out) {
            out.x = x;
            out.y = y;
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

/*
 * Random number generator.
 *
 * Currently using a Mersenne Twister based on:
 * https://gist.github.com/banksean/300494
 *
 * Old version used LCG
 * https://stackoverflow.com/a/424445/2051724
 * but had precision issues which led to cycle issues.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/* Period parameters */
const N = 624;
const M = 397;
const MATRIX_A = 0x9908b0df; /* constant vector a */
const UPPER_MASK = 0x80000000; /* most significant w-r bits */
const LOWER_MASK = 0x7fffffff; /* least significant r bits */
class RNG {
    /**
     * Creates a new random number generator.
     *
     * @param seed The integer seed.
     */
    constructor(seed) {
        this.mt = new Array(N); /* the array for the state vector */
        this.mti = N + 1; /* mti==N+1 means mt[N] is not initialized */
        this.setSeed(seed || 1);
    }
    setSeed(s) {
        // this.state = seed;
        this.mt[0] = s >>> 0;
        for (this.mti = 1; this.mti < N; this.mti++) {
            const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] =
                (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
                    (s & 0x0000ffff) * 1812433253) + this.mti;
            /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
            /* In the previous versions, MSBs of the seed affect   */
            /* only MSBs of the array mt[].                        */
            /* 2002/01/09 modified by Makoto Matsumoto             */
            this.mt[this.mti] >>>= 0;
            /* for >32 bit machines */
        }
    }
    nextInt() {
        let y = 0;
        const mag01 = new Array(0x0, MATRIX_A);
        /* mag01[x] = x * MATRIX_A  for x=0,1 */
        if (this.mti >= N) { /* generate N words at one time */
            var kk;
            // if (this.mti == N+1)   /* if init_genrand() has not been called, */
            //   this.setSeed(5489); /* a default initial seed is used */
            for (kk = 0; kk < N - M; kk++) {
                y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
                this.mt[kk] = this.mt[kk + M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for (; kk < N - 1; kk++) {
                y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
                this.mt[kk] = this.mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y = (this.mt[N - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK);
            this.mt[N - 1] = this.mt[M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
            this.mti = 0;
        }
        y = this.mt[this.mti++];
        /* Tempering */
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);
        return y >>> 0;
    }
    /**
     * Returns a floating point number between 0.0 and 1.0.
     */
    nextFloat() {
        return this.nextInt() * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    }
    /**
     * Returns an integer in the range start (inclusive) to end (exclusive).
     * @param start Lower bound, inclusive.
     * @param end Upper bound, exclusive.
     */
    nextRange(start, end) {
        return start + ((this.nextFloat() * (end - start)) | 0);
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

/***/ "./src/serializable.ts":
/*!*****************************!*\
  !*** ./src/serializable.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const serializemetadata_1 = __webpack_require__(/*! ./serializemetadata */ "./src/serializemetadata.ts");
exports.KNOWN_CLASSES = {};
function Serializable(name, options) {
    return function (ctor) {
        const metadata = serializemetadata_1.createSerializeMetadata(ctor);
        metadata.className = name;
        if (options) {
            metadata.valueType = !!options.valueType;
        }
        exports.KNOWN_CLASSES[name] = metadata;
    };
}
exports.Serializable = Serializable;


/***/ }),

/***/ "./src/serializemetadata.ts":
/*!**********************************!*\
  !*** ./src/serializemetadata.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const METADATA_KEY = '__wgltMetadata';
function createSerializeMetadata(ctor) {
    const metadata = new SerializeMetadata(ctor);
    ctor[METADATA_KEY] = metadata;
    return metadata;
}
exports.createSerializeMetadata = createSerializeMetadata;
function getSerializeMetadata(ctor) {
    const metadata = ctor[METADATA_KEY];
    return metadata || createSerializeMetadata(ctor);
}
exports.getSerializeMetadata = getSerializeMetadata;
class SerializeMetadata {
    constructor(ctor) {
        this.className = 'Object';
        this.valueType = false;
        this.ctor = ctor;
    }
}
exports.SerializeMetadata = SerializeMetadata;


/***/ }),

/***/ "./src/serializer.ts":
/*!***************************!*\
  !*** ./src/serializer.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = __webpack_require__(/*! ./game */ "./src/game.ts");
const renderset_1 = __webpack_require__(/*! ./renderset */ "./src/renderset.ts");
const app_1 = __webpack_require__(/*! ./app */ "./src/app.ts");
const gui_1 = __webpack_require__(/*! ./gui */ "./src/gui.ts");
const panel_1 = __webpack_require__(/*! ./gui/panel */ "./src/gui/panel.ts");
const serializemetadata_1 = __webpack_require__(/*! ./serializemetadata */ "./src/serializemetadata.ts");
const tilemap_1 = __webpack_require__(/*! ./tilemap/tilemap */ "./src/tilemap/tilemap.ts");
const tilemaprenderer_1 = __webpack_require__(/*! ./tilemap/tilemaprenderer */ "./src/tilemap/tilemaprenderer.ts");
class Serializer {
    constructor() {
        this.typeLists = {};
    }
    serialize(obj) {
        const root = this.serializeObject(obj);
        return {
            'root': root,
            'refs': this.typeLists
        };
    }
    serializeObject(obj) {
        if (obj === null || obj === undefined) {
            return obj;
        }
        const objType = typeof obj;
        if (objType === 'boolean' || objType === 'number' || objType === 'string') {
            return obj;
        }
        if (!obj.constructor) {
            throw new Error('Object does not have a constructor');
        }
        if (obj instanceof app_1.App ||
            obj instanceof gui_1.GUI ||
            obj instanceof panel_1.Panel ||
            obj instanceof renderset_1.RenderSet ||
            obj instanceof tilemap_1.TileMap ||
            obj instanceof tilemaprenderer_1.TileMapRenderer ||
            obj instanceof Function) {
            return undefined;
        }
        if (obj instanceof Array) {
            return this.serializeArray(obj);
        }
        const metadata = serializemetadata_1.getSerializeMetadata(obj.constructor);
        const className = metadata.className;
        const refType = !metadata.valueType;
        const result = {};
        if (className && refType) {
            if (obj['_i'] !== undefined) {
                return {
                    '_c': className,
                    '_i': obj['_i']
                };
            }
            let typeList = this.typeLists[className];
            if (!typeList) {
                typeList = [];
                this.typeLists[className] = typeList;
            }
            obj['_i'] = typeList.length;
            typeList.push(result);
        }
        const properties = Object.getOwnPropertyNames(obj);
        let propertyCount = 0;
        for (let i = 0; i < properties.length; i++) {
            const key = properties[i];
            const value = obj[key];
            if (key === '_i') {
                continue;
            }
            if (obj instanceof game_1.Game) {
                if (key === 'tooltip' || key === 'tooltipElement' || key === 'messageLog') {
                    continue;
                }
            }
            const serializedValue = this.serializeObject(value);
            if (serializedValue === undefined) {
                continue;
            }
            result[key] = serializedValue;
            propertyCount++;
        }
        if (propertyCount === 0) {
            // Ignore objects without any properties
            return undefined;
        }
        if (className && refType) {
            return {
                '_c': className,
                '_i': obj['_i']
            };
        }
        else {
            return result;
        }
    }
    serializeArray(a) {
        const result = [];
        for (let i = 0; i < a.length; i++) {
            result.push(this.serializeObject(a[i]));
        }
        return result;
    }
}
exports.Serializer = Serializer;


/***/ }),

/***/ "./src/sprite.ts":
/*!***********************!*\
  !*** ./src/sprite.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Sprite_1;
"use strict";
const rect_1 = __webpack_require__(/*! ./rect */ "./src/rect.ts");
const serializable_1 = __webpack_require__(/*! ./serializable */ "./src/serializable.ts");
const DEFAULT_TICKS_PER_FRAME = 30;
let Sprite = Sprite_1 = class Sprite extends rect_1.Rect {
    constructor(x, y, width, height, frames, loop, ticksPerFrame, colorOverride) {
        super(x, y, width, height);
        this.frames = frames || 1;
        this.loop = !!loop;
        this.ticksPerFrame = ticksPerFrame || DEFAULT_TICKS_PER_FRAME;
        this.colorOverride = colorOverride;
        this.animIndex = 0;
        this.animDelay = 0;
    }
    draw(app, x, y, colorOverride) {
        let frame = this.animIndex;
        if (this.loop) {
            frame = ((Sprite_1.globalAnimIndex / this.ticksPerFrame) | 0) % this.frames;
        }
        const u = this.x + frame * this.width;
        const v = this.y;
        const color = colorOverride || this.colorOverride;
        app.drawImage(x, y, u, v, this.width, this.height, color);
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
    clone() {
        return new Sprite_1(this.x, this.y, this.width, this.height, this.frames, this.loop, this.ticksPerFrame, this.colorOverride);
    }
    static updateGlobalAnimations() {
        Sprite_1.globalAnimIndex++;
    }
};
Sprite.globalAnimIndex = 0;
Sprite = Sprite_1 = __decorate([
    serializable_1.Serializable('Sprite')
], Sprite);
exports.Sprite = Sprite;


/***/ }),

/***/ "./src/talent.ts":
/*!***********************!*\
  !*** ./src/talent.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const serializable_1 = __webpack_require__(/*! ./serializable */ "./src/serializable.ts");
let Talent = class Talent {
    constructor(actor, ability, rank) {
        this.actor = actor;
        this.ability = ability;
        this.rank = rank || 1;
        this.cooldown = 0;
    }
    use(target) {
        if (this.cooldown > 0) {
            // Ability still on cooldown
            return false;
        }
        this.actor.cast(this.ability, target, () => {
            this.cooldown = this.ability.cooldown;
        });
        return true;
    }
};
Talent = __decorate([
    serializable_1.Serializable('Talent')
], Talent);
exports.Talent = Talent;


/***/ }),

/***/ "./src/tilemap/tilemap.ts":
/*!********************************!*\
  !*** ./src/tilemap/tilemap.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tilemapcell_1 = __webpack_require__(/*! ./tilemapcell */ "./src/tilemap/tilemapcell.ts");
const rect_1 = __webpack_require__(/*! ../rect */ "./src/rect.ts");
const tilemaplayer_1 = __webpack_require__(/*! ./tilemaplayer */ "./src/tilemap/tilemaplayer.ts");
/**
 * Returns the numeric tile ID for a given tile.
 * The underlying format is based on Tiled, an open source tilemap editor.
 * Tile 0 (zero) is a special null tile that is not rendered.
 * Tile 1 and beyond represent the tiles in left-to-right and then top-to-bottom order.
 * The arguments should be specified in tile coordinates, not pixel coordinates.
 * For example, if using 16 pixel x 16 pixel tiles, the tile at x=64, y=32 would be (4, 2).
 * @param tileX The x-coordinate of the tile in the sprite sheet.
 * @param tileY The y-coordinate of the tile in the sprite sheet.
 */
function getTileId(tileX, tileY) {
    return tileY * 64 + tileX;
}
exports.getTileId = getTileId;
/**
 * @constructor
 * @param {number} width
 * @param {number} height
 * @param {number} layerCount
 */
class TileMap {
    constructor(width, height, layerCount, tileSize) {
        this.width = width;
        this.height = height;
        this.depth = layerCount;
        this.tileSize = tileSize;
        this.grid = new Array(height);
        this.layers = new Array(layerCount);
        this.dirty = true;
        // Field-of-view state
        // By default, everything is visible
        this.originX = 0;
        this.originY = 0;
        this.visibleRect = new rect_1.Rect(0, 0, width, height);
        this.prevVisibleRect = new rect_1.Rect(0, 0, width, height);
        for (let y = 0; y < height; y++) {
            this.grid[y] = new Array(width);
            for (let x = 0; x < width; x++) {
                this.grid[y][x] = new tilemapcell_1.TileMapCell(x, y);
            }
        }
        for (let i = 0; i < layerCount; i++) {
            this.layers[i] = new tilemaplayer_1.TileMapLayer(width, height);
        }
    }
    isOutOfRange(x, y, z) {
        return x < 0 || x >= this.width ||
            y < 0 || y >= this.height ||
            z < 0 || z >= this.depth;
    }
    clear() {
        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i].clear();
        }
    }
    getTile(x, y, z) {
        if (this.isOutOfRange(x, y, z)) {
            return 0;
        }
        return this.layers[z].getTile(x, y);
    }
    setTile(x, y, z, tile) {
        if (this.isOutOfRange(x, y, z)) {
            return;
        }
        this.layers[z].setTile(x, y, tile);
    }
    isBlocked(x, y) {
        if (this.isOutOfRange(x, y, 0)) {
            return true;
        }
        return this.grid[y][x].blocked;
    }
    setBlocked(x, y, blocked, blockedSight) {
        if (this.isOutOfRange(x, y, 0)) {
            return;
        }
        this.grid[y][x].blocked = blocked;
        this.grid[y][x].blockedSight = (blockedSight !== undefined) ? blockedSight : blocked;
    }
    getCell(x, y) {
        if (this.isOutOfRange(x, y, 0)) {
            return null;
        }
        return this.grid[y][x];
    }
    isVisible(x, y) {
        if (x < this.visibleRect.x1 || x >= this.visibleRect.x2 || y < this.visibleRect.y1 || y >= this.visibleRect.y2) {
            return false;
        }
        return this.grid[y][x].visible;
    }
    isSeen(x, y) {
        const cell = this.getCell(x, y);
        return cell && cell.seen;
    }
    setSeen(x, y, seen) {
        const cell = this.getCell(x, y);
        if (cell) {
            cell.seen = seen;
        }
    }
    isAnimated(x, y, z) {
        if (this.isOutOfRange(x, y, z)) {
            return false;
        }
        return this.layers[z].isAnimated(x, y);
    }
    setAnimated(x, y, z, animated) {
        if (this.isOutOfRange(x, y, z)) {
            return;
        }
        this.layers[z].setAnimated(x, y, animated);
    }
    resetFov() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x].seen = false;
                this.grid[y][x].visible = false;
            }
        }
    }
    computeFov(originX, originY, radius, vradius) {
        this.originX = originX;
        this.originY = originY;
        this.prevVisibleRect.copy(this.visibleRect);
        const dx = radius;
        const dy = vradius || radius;
        this.visibleRect.x = Math.max(0, originX - dx);
        this.visibleRect.y = Math.max(0, originY - dy);
        this.visibleRect.width = Math.min(this.width - 1, originX + dx) - this.visibleRect.x + 1;
        this.visibleRect.height = Math.min(this.height - 1, originY + dy) - this.visibleRect.y + 1;
        for (let y = this.visibleRect.y1; y < this.visibleRect.y2; y++) {
            for (let x = this.visibleRect.x1; x < this.visibleRect.x2; x++) {
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
        this.dirty = true;
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
        for (y = this.originY + deltaY; y >= this.visibleRect.y1 && y < this.visibleRect.y2; y += deltaY, obstaclesInLastLine = totalObstacles, ++iteration) {
            halfSlope = 0.5 / iteration;
            previousEndSlope = -1;
            for (processedCell = Math.floor(minSlope * iteration + 0.5), x = this.originX + (processedCell * deltaX); processedCell <= iteration && x >= this.visibleRect.x1 && x < this.visibleRect.x2; x += deltaX, ++processedCell, previousEndSlope = endSlope) {
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
                    this.grid[y][x].seen = true;
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
        for (x = this.originX + deltaX; x >= this.visibleRect.x1 && x < this.visibleRect.x2; x += deltaX, obstaclesInLastLine = totalObstacles, ++iteration) {
            halfSlope = 0.5 / iteration;
            previousEndSlope = -1;
            for (processedCell = Math.floor(minSlope * iteration + 0.5), y = this.originY + (processedCell * deltaY); processedCell <= iteration && y >= this.visibleRect.y1 && y < this.visibleRect.y2; y += deltaY, ++processedCell, previousEndSlope = endSlope) {
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
                    this.grid[y][x].seen = true;
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
}
exports.TileMap = TileMap;


/***/ }),

/***/ "./src/tilemap/tilemapcell.ts":
/*!************************************!*\
  !*** ./src/tilemap/tilemapcell.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vec2_1 = __webpack_require__(/*! ../vec2 */ "./src/vec2.ts");
class TileMapCell extends vec2_1.Vec2 {
    constructor(x, y) {
        super(x, y);
        this.blocked = true;
        this.blockedSight = true;
        this.visible = false;
        this.seen = false;
        this.g = 0;
        this.h = 0;
        this.prev = null;
    }
}
exports.TileMapCell = TileMapCell;


/***/ }),

/***/ "./src/tilemap/tilemaplayer.ts":
/*!*************************************!*\
  !*** ./src/tilemap/tilemaplayer.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tilemap_1 = __webpack_require__(/*! ./tilemap */ "./src/tilemap/tilemap.ts");
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
        this.clear();
    }
    clear() {
        let i = 0;
        while (i < this.imageData.length) {
            this.imageData[i++] = 0;
        }
    }
    getIndex(x, y) {
        return 4 * (y * this.width + x);
    }
    setTile(x, y, tile) {
        const index = this.getIndex(x, y);
        this.imageData[index] = (tile % 64) | 0;
        this.imageData[index + 1] = (tile / 64) | 0;
    }
    getTile(x, y) {
        const index = this.getIndex(x, y);
        return tilemap_1.getTileId(this.imageData[index], this.imageData[index + 1]);
    }
    isAnimated(x, y) {
        const index = this.getIndex(x, y);
        return !!this.imageData[index + 2];
    }
    setAnimated(x, y, animated) {
        const index = this.getIndex(x, y);
        this.imageData[index + 2] = animated ? 1 : 0;
    }
    getAlpha(x, y) {
        const index = this.getIndex(x, y);
        return this.imageData[index + 3];
    }
    setAlpha(x, y, alpha) {
        const index = this.getIndex(x, y);
        this.imageData[index + 3] = alpha;
    }
}
exports.TileMapLayer = TileMapLayer;


/***/ }),

/***/ "./src/tilemap/tilemaprenderer.ts":
/*!****************************************!*\
  !*** ./src/tilemap/tilemaprenderer.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const glutils_1 = __webpack_require__(/*! ../glutils */ "./src/glutils.ts");
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
    'uniform float animFrame;' +
    'uniform sampler2D tiles;' +
    'uniform sampler2D sprites;' +
    'void main(void) {' +
    '   vec4 tile = texture2D(tiles, texCoord);' +
    '   if(tile.x == 0.0 && tile.y == 0.0) { discard; }' +
    '   vec2 spriteOffset = floor(tile.xy * 256.0) * tileSize;' +
    '   if(tile.z != 0.0) spriteOffset.x += animFrame * tileSize.x;' +
    '   vec2 spriteCoord = mod(pixelCoord, tileSize);' +
    '   gl_FragColor = texture2D(sprites, (spriteOffset + spriteCoord) / ' + TEXTURE_SIZE + '.0);' +
    '   if (gl_FragColor.a == 0.0) discard;' +
    '   gl_FragColor.a *= tile.a;' +
    '}';
/**
 * @constructor
 * @param {number} width
 * @param {number} height
 * @param {number} layerCount
 */
class TileMapRenderer {
    constructor(gl, tileMap) {
        this.gl = gl;
        this.tileMap = tileMap;
        const quadVerts = [
            // x   y   u  v
            -1, -1, 0, 1,
            1, -1, 1, 1,
            1, 1, 1, 0,
            -1, -1, 0, 1,
            1, 1, 1, 0,
            -1, 1, 0, 0
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
        this.animFrameUniform = gl.getUniformLocation(this.tilemapShader, 'animFrame');
        this.tileSamplerUniform = gl.getUniformLocation(this.tilemapShader, 'tiles');
        this.spriteSamplerUniform = gl.getUniformLocation(this.tilemapShader, 'sprites');
        this.layerTextures = new Array(tileMap.depth);
        for (let i = 0; i < tileMap.depth; i++) {
            const texture = gl.createTexture();
            const imageData = tileMap.layers[i].imageData;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tileMap.width, tileMap.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
            // MUST be filtered with NEAREST or tile lookup fails
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            this.layerTextures[i] = texture;
        }
    }
    draw(x, y, width, height, animFrame) {
        const gl = this.gl;
        const tileMap = this.tileMap;
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
        gl.uniform2f(this.tileSizeUniform, tileMap.tileSize.width, tileMap.tileSize.height);
        gl.uniform1f(this.animFrameUniform, animFrame || 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(this.spriteSamplerUniform, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.uniform1i(this.tileSamplerUniform, 1);
        const minX = Math.min(tileMap.visibleRect.x1, tileMap.prevVisibleRect.x1);
        const minY = Math.min(tileMap.visibleRect.y1, tileMap.prevVisibleRect.y1);
        const maxX = Math.max(tileMap.visibleRect.x2, tileMap.prevVisibleRect.x2);
        const maxY = Math.max(tileMap.visibleRect.y2, tileMap.prevVisibleRect.y2);
        // Draw each layer of the map
        for (let i = 0; i < tileMap.depth; i++) {
            const layer = tileMap.layers[i];
            const texture = this.layerTextures[i];
            gl.uniform2f(this.mapSizeUniform, tileMap.width, tileMap.height);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            if (tileMap.dirty) {
                for (let y = minY; y < maxY; y++) {
                    for (let x = minX; x < maxX; x++) {
                        const alpha = tileMap.isVisible(x, y) ? 255 : tileMap.isSeen(x, y) ? 144 : 0;
                        layer.setAlpha(x, y, alpha);
                    }
                }
                gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, layer.width, layer.height, gl.RGBA, gl.UNSIGNED_BYTE, layer.imageData);
            }
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        tileMap.dirty = false;
    }
}
exports.TileMapRenderer = TileMapRenderer;


/***/ }),

/***/ "./src/vec2.ts":
/*!*********************!*\
  !*** ./src/vec2.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const serializable_1 = __webpack_require__(/*! ./serializable */ "./src/serializable.ts");
let Vec2 = class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(delta) {
        this.x += delta.x;
        this.y += delta.y;
    }
};
Vec2 = __decorate([
    serializable_1.Serializable('Vec2')
], Vec2);
exports.Vec2 = Vec2;


/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map