"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("../src/colors");
var color_1 = require("../src/color");
var keys_1 = require("../src/keys");
var rng_1 = require("../src/rng");
var terminal_1 = require("../src/terminal");
var WIDTH = 80;
var HEIGHT = 45;
var WAVE_WARMUP_TIME = 180;
var WAVE_GAP_TIME = 10;
var WAVE_ENEMY_COUNT = 15;
var term = new terminal_1.Terminal(document.querySelector('canvas'), WIDTH, HEIGHT, { frameRate: 60 });
var rng = new rng_1.RNG();
var player = {
    x: WIDTH / 2,
    y: HEIGHT - 5,
    cooldown: 0
};
var bullets = [];
var stars = [];
for (var i = 0; i < 100; i++) {
    var b = rng.nextRange(64, 192);
    stars.push({
        x: rng.nextRange(0, WIDTH),
        y: rng.nextRange(0, HEIGHT),
        color: color_1.fromRgb(b, b, b),
        dy: rng.nextRange(1, 4)
    });
}
var enemies = [];
var waypoints = [
    { x: 60, y: 40 },
    { x: 70, y: 30 },
    { x: 60, y: 20 },
    { x: 40, y: 40 },
    { x: 20, y: 20 },
    { x: 10, y: 30 },
    { x: 20, y: 40 },
];
var explosions = [];
var wave = {
    count: 0,
    startTime: 0,
    endTime: 0
};
var time = 0;
function scheduleWave() {
    wave.count++;
    wave.startTime = time + WAVE_WARMUP_TIME;
    wave.endTime = wave.startTime + WAVE_ENEMY_COUNT * WAVE_GAP_TIME;
}
scheduleWave();
term.update = function () {
    var waveTime = time - wave.startTime;
    if (term.isKeyDown(keys_1.Keys.VK_UP)) {
        player.y = Math.max(0, player.y - 1);
    }
    if (term.isKeyDown(keys_1.Keys.VK_LEFT)) {
        player.x = Math.max(1, player.x - 1);
    }
    if (term.isKeyDown(keys_1.Keys.VK_RIGHT)) {
        player.x = Math.min(WIDTH - 2, player.x + 1);
    }
    if (term.isKeyDown(keys_1.Keys.VK_DOWN)) {
        player.y = Math.min(HEIGHT - 2, player.y + 1);
    }
    if (player.cooldown > 0) {
        player.cooldown--;
    }
    if (player.cooldown === 0 && term.isKeyDown(keys_1.Keys.VK_Z)) {
        bullets.push({
            x: player.x,
            y: player.y
        });
        player.cooldown = 15;
    }
    if (time >= wave.startTime && time < wave.endTime) {
        if (waveTime % WAVE_GAP_TIME === 0) {
            enemies.push({
                id: waveTime / WAVE_GAP_TIME,
                x: 10,
                y: 2,
                state: 0,
            });
        }
    }
    // Enemy AI
    for (var i = enemies.length - 1; i >= 0; i--) {
        var enemy = enemies[i];
        var waypointX = 0;
        var waypointY = 0;
        if (enemy.state < 0) {
            waypointX = player.x;
            waypointY = player.y;
        }
        else if (enemy.state < waypoints.length) {
            waypointX = waypoints[enemy.state].x;
            waypointY = waypoints[enemy.state].y;
        }
        else {
            // The group is 20x20 pixels
            // Assume 5 pixel buffer on the side
            // 80 - 20 - 5 - 5 = 45
            var time2 = Math.round((time % 800) / 8);
            var centerX = (time2 < 45) ? (5 + time2) : (5 + 100 - time2);
            var offsetX = enemy.id % 5;
            var offsetY = (enemy.id / 5) | 0;
            var spacing = 5;
            waypointX = centerX + spacing * offsetX;
            waypointY = 5 + spacing * offsetY;
        }
        if (enemy.x === waypointX && enemy.y === waypointY) {
            enemy.state++;
        }
        else {
            if (enemy.x < waypointX) {
                enemy.x++;
            }
            else if (enemy.x > waypointX) {
                enemy.x--;
            }
            if (enemy.y < waypointY) {
                enemy.y++;
            }
            else if (enemy.y > waypointY) {
                enemy.y--;
            }
        }
        if (waveTime >= 240 && (waveTime - 240) % 60 === 0) {
            var bomberIndex = enemies.length - 1 - (waveTime - 240) / 60;
            if (bomberIndex >= 0) {
                enemies[bomberIndex].state = -1;
            }
        }
    }
    // Bullet collision detection
    for (var i = bullets.length - 1; i >= 0; i--) {
        var bullet = bullets[i];
        for (var j = enemies.length - 1; j >= 0; j--) {
            var enemy = enemies[j];
            if (Math.abs(bullet.x - enemy.x) <= 1 && Math.abs(bullet.y - enemy.y) <= 1) {
                enemies.splice(j, 1);
                for (var k = 0; k < 10; k++) {
                    explosions.push({
                        x: enemy.x,
                        y: enemy.y,
                        dx: rng.nextRange(-5, 5) / 10.0,
                        dy: rng.nextRange(-5, 5) / 10.0,
                        state: rng.nextRange(10, 20)
                    });
                }
                if (enemies.length === 0) {
                    scheduleWave();
                }
                break;
            }
        }
    }
    // Ship-to-ship collision detection
    term.clear();
    for (var i = 0; i < stars.length; i++) {
        var star = stars[i];
        term.drawString(star.x, star.y, '.', star.color);
        star.y += star.dy;
        if (star.y >= HEIGHT) {
            star.y -= HEIGHT;
            star.x = rng.nextRange(0, WIDTH);
        }
    }
    for (var i = bullets.length - 1; i >= 0; i--) {
        var bullet = bullets[i];
        term.drawString(bullet.x, bullet.y, '*', colors_1.Colors.YELLOW);
        bullet.y -= 2;
        if (bullet.y < 0) {
            bullets.splice(i, 1);
        }
    }
    for (var i = explosions.length - 1; i >= 0; i--) {
        var explosion = explosions[i];
        term.drawString(Math.round(explosion.x), Math.round(explosion.y), '%', colors_1.Colors.ORANGE);
        explosion.x += explosion.dx;
        explosion.y += explosion.dy;
        explosion.dx *= 0.9;
        explosion.dy *= 0.9;
        explosion.state--;
        if (explosion.state <= 0) {
            explosions.splice(i, 1);
        }
    }
    for (var i = enemies.length - 1; i >= 0; i--) {
        var enemy = enemies[i];
        term.drawString(enemy.x, enemy.y, '#', colors_1.Colors.LIGHT_GREEN);
        term.drawString(enemy.x - 1, enemy.y - 1, '@', colors_1.Colors.LIGHT_RED);
        term.drawString(enemy.x + 1, enemy.y - 1, '@', colors_1.Colors.LIGHT_RED);
        term.drawString(enemy.x - 1, enemy.y + 1, '@', colors_1.Colors.LIGHT_RED);
        term.drawString(enemy.x + 1, enemy.y + 1, '@', colors_1.Colors.LIGHT_RED);
    }
    term.drawString(player.x, player.y, '^', colors_1.Colors.LIGHT_GRAY);
    term.drawString(player.x - 1, player.y + 1, '/', colors_1.Colors.LIGHT_GRAY);
    term.drawString(player.x + 1, player.y + 1, '\\', colors_1.Colors.LIGHT_GRAY);
    term.drawString(player.x, player.y + 1, '|', colors_1.Colors.LIGHT_RED);
    if (waveTime < 0 && waveTime > -WAVE_WARMUP_TIME + 60) {
        term.drawCenteredString(WIDTH / 2, HEIGHT / 2, 'WAVE ' + wave.count, colors_1.Colors.WHITE);
    }
    term.drawString(1, HEIGHT - 2, 'Z - SHOOT', colors_1.Colors.WHITE);
    time++;
};
