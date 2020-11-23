"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rng_1 = require("./rng");
test('nextFloat with seed', function () {
    // When providing a seed, should always get the same value
    var rng = new rng_1.RNG(1);
    expect(rng.nextFloat()).toBeCloseTo(0.51387);
});
test('nextRange with seed', function () {
    // When providing a seed, should always get the same value
    var rng = new rng_1.RNG(1);
    expect(rng.nextRange(0, 10)).toBe(5);
});
test('chooseIndex with equal chances', function () {
    var rng = new rng_1.RNG(1);
    var chances = [1, 1];
    var counts = [0, 0];
    for (var i = 0; i < 1000; i++) {
        counts[rng.chooseIndex(chances)]++;
    }
    expect(counts[0]).toBe(505);
    expect(counts[1]).toBe(495);
});
test('chooseIndex with different chances', function () {
    var rng = new rng_1.RNG(1);
    var chances = [3, 1];
    var counts = [0, 0];
    for (var i = 0; i < 1000; i++) {
        counts[rng.chooseIndex(chances)]++;
    }
    expect(counts[0]).toBe(729);
    expect(counts[1]).toBe(271);
});
test('chooseKey', function () {
    var rng = new rng_1.RNG(1);
    var chancesMap = { 'foo': 3, 'bar': 1 };
    var counts = { 'foo': 0, 'bar': 0 };
    for (var i = 0; i < 1000; i++) {
        counts[rng.chooseKey(chancesMap)]++;
    }
    expect(counts['foo']).toBe(729);
    expect(counts['bar']).toBe(271);
});
