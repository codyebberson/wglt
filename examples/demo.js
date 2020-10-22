
import { Terminal } from '../src/terminal.js';
import { Colors } from '../src/colors.js';
import { Keys } from '../src/keys.js';
import { Point } from '../src/point.js';
import { RNG } from '../src/rng.js';

const WIDTH = 80;
const HEIGHT = 45;
const TITLE = `
 __      __   ________  ____   ___________
/  \\    /  \\ /  _____/ |    |  \\__    ___/
\\   \\/\\/   //   \\  ___ |    |    |    |
 \\        / \\    \\_\\  \\|    |__  |    |
  \\__/\\  /   \\______  /|_______ \\|____|
       \\/           \\/         \\/`;

/**
 * MainMenu is the default state.
 * It renders the WGLT title animation,
 * and a menu of available demos.
 */
class MainMenu {
    constructor() {
        this.selected = 0;
        this.options = [
            ['Hello World', HelloWorld],
            ['Matrix Rain', MatrixRain],
        ];
    }

    update() {
        term.fillRect(0, 0, WIDTH, HEIGHT, 0, Colors.WHITE, Colors.BLACK);
        if (term.isKeyPressed(Keys.VK_UP)) {
            this.selected = Math.max(0, this.selected - 1);
        }
        if (term.isKeyPressed(Keys.VK_DOWN)) {
            this.selected = Math.min(this.options.length - 1, this.selected + 1);
        }
        if (term.isKeyPressed(Keys.VK_ENTER)) {
            term.state = new (this.options[this.selected][1])();
            return;
        }

        term.fillRect(0, 0, WIDTH, HEIGHT, 0, Colors.WHITE, Colors.BLACK);
        term.drawString(1, 1, TITLE);
        term.drawString(3, 10 + this.selected, '*');
        for (let i = 0; i < this.options.length; i++) {
            term.drawString(5, 10 + i, this.options[i][0]);
        }
    }
}

/**
 * HelloWorld is one of the simplest demos.
 * There is a simple "player" represented by the "@" character,
 * that can move around using the arrow keys.
 */
class HelloWorld {
    constructor() {
        this.player = new Point(10, 10);
    }

    update() {
        if (term.isKeyPressed(Keys.VK_ESCAPE)) {
            term.state = mainMenu;
        }
        if (term.isKeyDown(Keys.VK_UP)) {
            this.player.y--;
        }
        if (term.isKeyDown(Keys.VK_LEFT)) {
            this.player.x--;
        }
        if (term.isKeyDown(Keys.VK_RIGHT)) {
            this.player.x++;
        }
        if (term.isKeyDown(Keys.VK_DOWN)) {
            this.player.y++;
        }

        term.fillRect(0, 0, WIDTH, HEIGHT, 0, Colors.LIGHT_GREEN, Colors.DARK_GREEN);
        term.drawString(1, 1, 'Hello world!');
        term.drawString(1, 3, 'Use arrow keys to move');
        term.drawString(this.player.x, this.player.y, '@');
    }
}

class MatrixRain {
    constructor() {
        this.rain = new Array(HEIGHT);
        for (let y = 0; y < HEIGHT; y++) {
            this.rain[y] = new Array(WIDTH);
            for (let x = 0; x < WIDTH; x++) {
                this.rain[y][x] = 0;
            }
        }
    }

    update() {
        if (term.isKeyPressed(Keys.VK_ESCAPE)) {
            term.state = mainMenu;
        }

        // Update bottom rows
        for (let y = HEIGHT - 1; y >= 1; y--) {
            for (let x = 0; x < WIDTH; x++) {
                // Move rain down
                this.rain[y][x] = this.rain[y - 1][x];
                if (this.rain[y][x] === 255) {
                    // Head of streak, new character
                    term.drawChar(x, y, rng.nextRange(0, 255));
                }
            }
        }

        // Update the top row
        for (let x = 0; x < WIDTH; x++) {
            if (rng.nextFloat() > 0.99) {
                // 1% chance to start a new row
                this.rain[0][x] = 255;
                term.drawChar(x, 0, rng.nextRange(0, 255));
            } else {
                // Otherwise cooldown
                this.rain[0][x] = Math.max(0, this.rain[0][x] - 8);
            }
        }

        // Draw the rain to the screen
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                const color = this.rain[y][x] === 255 ? Colors.WHITE :
                                this.rain[y][x] > 128 ? Colors.LIGHT_GREEN :
                                this.rain[y][x] > 0 ? Colors.DARK_GREEN :
                                Colors.BLACK;
                term.getCell(x, y).setForeground(color);
            }
        }
    }
}

const rng = new RNG();

const mainMenu = new MainMenu();

const term = new Terminal(document.querySelector('canvas'), WIDTH, HEIGHT);
term.state = mainMenu;
