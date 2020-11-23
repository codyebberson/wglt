"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RNG = void 0;
/**
 * Random number generator.
 *
 * LCG
 * https://stackoverflow.com/a/424445/2051724
 */
var RNG = /** @class */ (function () {
    /**
     * Creates a new random number generator.
     *
     * @param seed The integer seed.
     */
    function RNG(seed) {
        // LCG using GCC's constants
        this.m = 0x80000000; // 2**31;
        this.a = 1103515245;
        this.c = 12345;
        this.state = seed || 1;
    }
    RNG.prototype.nextInt = function () {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state;
    };
    /**
     * Returns a floating point number between 0.0 and 1.0.
     */
    RNG.prototype.nextFloat = function () {
        // returns in range [0,1]
        return this.nextInt() / (this.m - 1);
    };
    /**
     * Returns an integer in the range start (inclusive) to end (exclusive).
     * @param start Lower bound, inclusive.
     * @param end Upper bound, exclusive.
     */
    RNG.prototype.nextRange = function (start, end) {
        // returns in range [start, end): including start, excluding end
        // can't modulu nextInt because of weak randomness in lower bits
        var rangeSize = end - start;
        var randomUnder1 = this.nextInt() / this.m;
        var result = start + ((randomUnder1 * rangeSize) | 0);
        if (isNaN(result)) {
            throw new Error('rand nan');
        }
        return result;
    };
    RNG.prototype.chooseIndex = function (chances) {
        var total = chances.reduce(function (a, b) { return a + b; });
        var roll = this.nextRange(1, total + 1);
        var runningTotal = 0;
        for (var i = 0; i < chances.length; i++) {
            runningTotal += chances[i];
            if (roll <= runningTotal) {
                return i;
            }
        }
        return chances.length - 1;
    };
    RNG.prototype.chooseKey = function (chancesMap) {
        var values = [];
        var chances = [];
        for (var property in chancesMap) {
            if (chancesMap.hasOwnProperty(property)) {
                values.push(property);
                chances.push(chancesMap[property]);
            }
        }
        return values[this.chooseIndex(chances)];
    };
    return RNG;
}());
exports.RNG = RNG;
