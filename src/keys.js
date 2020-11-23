"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keys = exports.Keyboard = void 0;
var input_1 = require("./input");
/**
 * Number of keys to track.
 */
var KEY_COUNT = 256;
var Keyboard = /** @class */ (function () {
    /**
     * Creates a new keyboard module.
     *
     * @param el DOM el to attach listeners.
     */
    function Keyboard(el) {
        var _this = this;
        this.keys = new Array(KEY_COUNT);
        for (var i = 0; i < KEY_COUNT; i++) {
            this.keys[i] = new input_1.Input();
        }
        el.addEventListener('keydown', function (e) { return _this.setKey(e, true); });
        el.addEventListener('keyup', function (e) { return _this.setKey(e, false); });
    }
    Keyboard.prototype.setKey = function (e, state) {
        var keyCode = e.keyCode;
        if (keyCode === Keys.VK_F11) {
            // Allow fullscreen requests to go through
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        if (keyCode >= 0 && keyCode < KEY_COUNT) {
            this.keys[keyCode].down = state;
        }
    };
    Keyboard.prototype.updateKeys = function () {
        for (var i = 0; i < KEY_COUNT; i++) {
            this.keys[i].update();
        }
    };
    Keyboard.prototype.getKey = function (keyCode) {
        return keyCode >= 0 && keyCode < KEY_COUNT ? this.keys[keyCode] : null;
    };
    return Keyboard;
}());
exports.Keyboard = Keyboard;
var Keys;
(function (Keys) {
    Keys[Keys["VK_CANCEL"] = 3] = "VK_CANCEL";
    Keys[Keys["VK_HELP"] = 6] = "VK_HELP";
    Keys[Keys["VK_BACK_SPACE"] = 8] = "VK_BACK_SPACE";
    Keys[Keys["VK_TAB"] = 9] = "VK_TAB";
    Keys[Keys["VK_CLEAR"] = 12] = "VK_CLEAR";
    Keys[Keys["VK_ENTER"] = 13] = "VK_ENTER";
    Keys[Keys["VK_SHIFT"] = 16] = "VK_SHIFT";
    Keys[Keys["VK_CONTROL"] = 17] = "VK_CONTROL";
    Keys[Keys["VK_ALT"] = 18] = "VK_ALT";
    Keys[Keys["VK_PAUSE"] = 19] = "VK_PAUSE";
    Keys[Keys["VK_CAPS_LOCK"] = 20] = "VK_CAPS_LOCK";
    Keys[Keys["VK_ESCAPE"] = 27] = "VK_ESCAPE";
    Keys[Keys["VK_SPACE"] = 32] = "VK_SPACE";
    Keys[Keys["VK_PAGE_UP"] = 33] = "VK_PAGE_UP";
    Keys[Keys["VK_PAGE_DOWN"] = 34] = "VK_PAGE_DOWN";
    Keys[Keys["VK_END"] = 35] = "VK_END";
    Keys[Keys["VK_HOME"] = 36] = "VK_HOME";
    Keys[Keys["VK_LEFT"] = 37] = "VK_LEFT";
    Keys[Keys["VK_UP"] = 38] = "VK_UP";
    Keys[Keys["VK_RIGHT"] = 39] = "VK_RIGHT";
    Keys[Keys["VK_DOWN"] = 40] = "VK_DOWN";
    Keys[Keys["VK_PRINTSCREEN"] = 44] = "VK_PRINTSCREEN";
    Keys[Keys["VK_INSERT"] = 45] = "VK_INSERT";
    Keys[Keys["VK_DELETE"] = 46] = "VK_DELETE";
    Keys[Keys["VK_0"] = 48] = "VK_0";
    Keys[Keys["VK_1"] = 49] = "VK_1";
    Keys[Keys["VK_2"] = 50] = "VK_2";
    Keys[Keys["VK_3"] = 51] = "VK_3";
    Keys[Keys["VK_4"] = 52] = "VK_4";
    Keys[Keys["VK_5"] = 53] = "VK_5";
    Keys[Keys["VK_6"] = 54] = "VK_6";
    Keys[Keys["VK_7"] = 55] = "VK_7";
    Keys[Keys["VK_8"] = 56] = "VK_8";
    Keys[Keys["VK_9"] = 57] = "VK_9";
    Keys[Keys["VK_COLON"] = 58] = "VK_COLON";
    Keys[Keys["VK_SEMICOLON"] = 59] = "VK_SEMICOLON";
    Keys[Keys["VK_LESS_THAN"] = 60] = "VK_LESS_THAN";
    Keys[Keys["VK_EQUALS"] = 61] = "VK_EQUALS";
    Keys[Keys["VK_GREATER_THAN"] = 62] = "VK_GREATER_THAN";
    Keys[Keys["VK_QUESTION_MARK"] = 63] = "VK_QUESTION_MARK";
    Keys[Keys["VK_AT"] = 64] = "VK_AT";
    Keys[Keys["VK_A"] = 65] = "VK_A";
    Keys[Keys["VK_B"] = 66] = "VK_B";
    Keys[Keys["VK_C"] = 67] = "VK_C";
    Keys[Keys["VK_D"] = 68] = "VK_D";
    Keys[Keys["VK_E"] = 69] = "VK_E";
    Keys[Keys["VK_F"] = 70] = "VK_F";
    Keys[Keys["VK_G"] = 71] = "VK_G";
    Keys[Keys["VK_H"] = 72] = "VK_H";
    Keys[Keys["VK_I"] = 73] = "VK_I";
    Keys[Keys["VK_J"] = 74] = "VK_J";
    Keys[Keys["VK_K"] = 75] = "VK_K";
    Keys[Keys["VK_L"] = 76] = "VK_L";
    Keys[Keys["VK_M"] = 77] = "VK_M";
    Keys[Keys["VK_N"] = 78] = "VK_N";
    Keys[Keys["VK_O"] = 79] = "VK_O";
    Keys[Keys["VK_P"] = 80] = "VK_P";
    Keys[Keys["VK_Q"] = 81] = "VK_Q";
    Keys[Keys["VK_R"] = 82] = "VK_R";
    Keys[Keys["VK_S"] = 83] = "VK_S";
    Keys[Keys["VK_T"] = 84] = "VK_T";
    Keys[Keys["VK_U"] = 85] = "VK_U";
    Keys[Keys["VK_V"] = 86] = "VK_V";
    Keys[Keys["VK_W"] = 87] = "VK_W";
    Keys[Keys["VK_X"] = 88] = "VK_X";
    Keys[Keys["VK_Y"] = 89] = "VK_Y";
    Keys[Keys["VK_Z"] = 90] = "VK_Z";
    Keys[Keys["VK_CONTEXT_MENU"] = 93] = "VK_CONTEXT_MENU";
    Keys[Keys["VK_NUMPAD0"] = 96] = "VK_NUMPAD0";
    Keys[Keys["VK_NUMPAD1"] = 97] = "VK_NUMPAD1";
    Keys[Keys["VK_NUMPAD2"] = 98] = "VK_NUMPAD2";
    Keys[Keys["VK_NUMPAD3"] = 99] = "VK_NUMPAD3";
    Keys[Keys["VK_NUMPAD4"] = 100] = "VK_NUMPAD4";
    Keys[Keys["VK_NUMPAD5"] = 101] = "VK_NUMPAD5";
    Keys[Keys["VK_NUMPAD6"] = 102] = "VK_NUMPAD6";
    Keys[Keys["VK_NUMPAD7"] = 103] = "VK_NUMPAD7";
    Keys[Keys["VK_NUMPAD8"] = 104] = "VK_NUMPAD8";
    Keys[Keys["VK_NUMPAD9"] = 105] = "VK_NUMPAD9";
    Keys[Keys["VK_MULTIPLY"] = 106] = "VK_MULTIPLY";
    Keys[Keys["VK_ADD"] = 107] = "VK_ADD";
    Keys[Keys["VK_SEPARATOR"] = 108] = "VK_SEPARATOR";
    Keys[Keys["VK_SUBTRACT"] = 109] = "VK_SUBTRACT";
    Keys[Keys["VK_DECIMAL"] = 110] = "VK_DECIMAL";
    Keys[Keys["VK_DIVIDE"] = 111] = "VK_DIVIDE";
    Keys[Keys["VK_F1"] = 112] = "VK_F1";
    Keys[Keys["VK_F2"] = 113] = "VK_F2";
    Keys[Keys["VK_F3"] = 114] = "VK_F3";
    Keys[Keys["VK_F4"] = 115] = "VK_F4";
    Keys[Keys["VK_F5"] = 116] = "VK_F5";
    Keys[Keys["VK_F6"] = 117] = "VK_F6";
    Keys[Keys["VK_F7"] = 118] = "VK_F7";
    Keys[Keys["VK_F8"] = 119] = "VK_F8";
    Keys[Keys["VK_F9"] = 120] = "VK_F9";
    Keys[Keys["VK_F10"] = 121] = "VK_F10";
    Keys[Keys["VK_F11"] = 122] = "VK_F11";
    Keys[Keys["VK_F12"] = 123] = "VK_F12";
    Keys[Keys["VK_F13"] = 124] = "VK_F13";
    Keys[Keys["VK_F14"] = 125] = "VK_F14";
    Keys[Keys["VK_F15"] = 126] = "VK_F15";
    Keys[Keys["VK_F16"] = 127] = "VK_F16";
    Keys[Keys["VK_F17"] = 128] = "VK_F17";
    Keys[Keys["VK_F18"] = 129] = "VK_F18";
    Keys[Keys["VK_F19"] = 130] = "VK_F19";
    Keys[Keys["VK_F20"] = 131] = "VK_F20";
    Keys[Keys["VK_F21"] = 132] = "VK_F21";
    Keys[Keys["VK_F22"] = 133] = "VK_F22";
    Keys[Keys["VK_F23"] = 134] = "VK_F23";
    Keys[Keys["VK_F24"] = 135] = "VK_F24";
    Keys[Keys["VK_NUM_LOCK"] = 144] = "VK_NUM_LOCK";
    Keys[Keys["VK_SCROLL_LOCK"] = 145] = "VK_SCROLL_LOCK";
    Keys[Keys["VK_CIRCUMFLEX"] = 160] = "VK_CIRCUMFLEX";
    Keys[Keys["VK_EXCLAMATION"] = 161] = "VK_EXCLAMATION";
    Keys[Keys["VK_DOUBLE_QUOTE"] = 162] = "VK_DOUBLE_QUOTE";
    Keys[Keys["VK_HASH"] = 163] = "VK_HASH";
    Keys[Keys["VK_DOLLAR"] = 164] = "VK_DOLLAR";
    Keys[Keys["VK_PERCENT"] = 165] = "VK_PERCENT";
    Keys[Keys["VK_AMPERSAND"] = 166] = "VK_AMPERSAND";
    Keys[Keys["VK_UNDERSCORE"] = 167] = "VK_UNDERSCORE";
    Keys[Keys["VK_OPEN_PAREN"] = 168] = "VK_OPEN_PAREN";
    Keys[Keys["VK_CLOSE_PAREN"] = 169] = "VK_CLOSE_PAREN";
    Keys[Keys["VK_ASTERISK"] = 170] = "VK_ASTERISK";
    Keys[Keys["VK_PLUS"] = 171] = "VK_PLUS";
    Keys[Keys["VK_PIPE"] = 172] = "VK_PIPE";
    Keys[Keys["VK_HYPHEN_MINUS"] = 173] = "VK_HYPHEN_MINUS";
    Keys[Keys["VK_OPEN_CURLY_BRACKET"] = 174] = "VK_OPEN_CURLY_BRACKET";
    Keys[Keys["VK_CLOSE_CURLY_BRACKET"] = 175] = "VK_CLOSE_CURLY_BRACKET";
    Keys[Keys["VK_TILDE"] = 176] = "VK_TILDE";
    Keys[Keys["VK_COMMA"] = 188] = "VK_COMMA";
    Keys[Keys["VK_PERIOD"] = 190] = "VK_PERIOD";
    Keys[Keys["VK_SLASH"] = 191] = "VK_SLASH";
    Keys[Keys["VK_BACK_QUOTE"] = 192] = "VK_BACK_QUOTE";
    Keys[Keys["VK_OPEN_BRACKET"] = 219] = "VK_OPEN_BRACKET";
    Keys[Keys["VK_BACK_SLASH"] = 220] = "VK_BACK_SLASH";
    Keys[Keys["VK_CLOSE_BRACKET"] = 221] = "VK_CLOSE_BRACKET";
    Keys[Keys["VK_QUOTE"] = 222] = "VK_QUOTE";
    Keys[Keys["VK_META"] = 224] = "VK_META";
    Keys[Keys["VK_ALTGR"] = 225] = "VK_ALTGR";
    Keys[Keys["VK_WIN"] = 91] = "VK_WIN";
    Keys[Keys["VK_KANA"] = 21] = "VK_KANA";
    Keys[Keys["VK_HANGUL"] = 21] = "VK_HANGUL";
    Keys[Keys["VK_EISU"] = 22] = "VK_EISU";
    Keys[Keys["VK_JUNJA"] = 23] = "VK_JUNJA";
    Keys[Keys["VK_FINAL"] = 24] = "VK_FINAL";
    Keys[Keys["VK_HANJA"] = 25] = "VK_HANJA";
    Keys[Keys["VK_KANJI"] = 25] = "VK_KANJI";
    Keys[Keys["VK_CONVERT"] = 28] = "VK_CONVERT";
    Keys[Keys["VK_NONCONVERT"] = 29] = "VK_NONCONVERT";
    Keys[Keys["VK_ACCEPT"] = 30] = "VK_ACCEPT";
    Keys[Keys["VK_MODECHANGE"] = 31] = "VK_MODECHANGE";
    Keys[Keys["VK_SELECT"] = 41] = "VK_SELECT";
    Keys[Keys["VK_PRINT"] = 42] = "VK_PRINT";
    Keys[Keys["VK_EXECUTE"] = 43] = "VK_EXECUTE";
    Keys[Keys["VK_SLEEP"] = 95] = "VK_SLEEP";
})(Keys = exports.Keys || (exports.Keys = {}));
;
