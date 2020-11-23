"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blendmode_1 = require("../src/blendmode");
var colors_1 = require("../src/colors");
var console_1 = require("../src/console");
var color_1 = require("../src/color");
var keys_1 = require("../src/keys");
var rng_1 = require("../src/rng");
var terminal_1 = require("../src/terminal");
var SCREEN_WIDTH = 80;
var SCREEN_HEIGHT = 45;
var RADIUS = 30;
var SIZE = 1 + 2 * RADIUS;
var CENTER = RADIUS;
var BRIGHTNESS = 0.35;
function createLightConsole(h, s, v) {
    var c = new console_1.Console(SIZE, SIZE);
    for (var y = 0; y < SIZE; y++) {
        for (var x = 0; x < SIZE; x++) {
            var distance = Math.hypot(x - CENTER, y - CENTER);
            var inverseDistance = Math.max(0.0, Math.min(1.0, 1.0 - distance / RADIUS));
            var alpha = BRIGHTNESS * inverseDistance * inverseDistance;
            var bg = color_1.fromHsv(h, s, v, alpha);
            c.drawChar(x, y, 0, 0, bg);
        }
    }
    c.drawChar(CENTER, CENTER, '*'.charCodeAt(0), color_1.fromHsv(h, s, v));
    return c;
}
var term = new terminal_1.Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT, { requestFullscreen: true });
var rng = new rng_1.RNG();
var lights = [{
        x: 10,
        y: 10,
        console: createLightConsole(0.0, 0.0, 1.0)
    }];
for (var i = 0; i < 6; i++) {
    lights.push({
        x: 15 + i * 10,
        y: 22,
        console: createLightConsole(i / 6.0, 1.0, 1.0)
    });
}
var rain = [];
for (var i = 0; i < 500; i++) {
    rain.push({
        x: rng.nextRange(0, SCREEN_WIDTH * 2),
        y: rng.nextRange(-SCREEN_HEIGHT, SCREEN_HEIGHT),
        speed: rng.nextRange(5, 10) / 5.0
    });
}
term.update = function () {
    if (term.isKeyPressed(keys_1.Keys.VK_UP)) {
        lights[0].y--;
    }
    if (term.isKeyPressed(keys_1.Keys.VK_LEFT)) {
        lights[0].x--;
    }
    if (term.isKeyPressed(keys_1.Keys.VK_RIGHT)) {
        lights[0].x++;
    }
    if (term.isKeyPressed(keys_1.Keys.VK_DOWN)) {
        lights[0].y++;
    }
    if (term.mouse.dx !== 0 || term.mouse.dy !== 0) {
        lights[0].x = term.mouse.x;
        lights[0].y = term.mouse.y;
    }
    term.fillRect(0, 0, 80, 45, 0, colors_1.Colors.BLACK, colors_1.Colors.BLACK);
    for (var i = 0; i < rain.length; i++) {
        var raindrop = rain[i];
        term.drawString(Math.round(raindrop.x), Math.round(raindrop.y), '/', colors_1.Colors.DARK_GRAY);
        raindrop.x -= raindrop.speed;
        raindrop.y += raindrop.speed;
        if (raindrop.x < 0 || raindrop.y > SCREEN_HEIGHT) {
            raindrop.x += SCREEN_WIDTH;
            raindrop.y -= SCREEN_WIDTH;
        }
    }
    for (var i = lights.length - 1; i >= 0; i--) {
        var light = lights[i];
        term.drawConsole(light.x - RADIUS, light.y - RADIUS, light.console, 0, 0, SIZE, SIZE, blendmode_1.BlendMode.Add);
    }
    term.drawString(1, 1, 'Hello world!', colors_1.Colors.YELLOW);
    term.drawString(1, 3, 'Use arrow keys to move', colors_1.Colors.YELLOW);
};
