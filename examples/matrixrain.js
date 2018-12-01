
const w = 80;
const h = 50;

const rain = new Array(h);
for (let y = 0; y < h; y++) {
    rain[y] = new Array(w);
    for (let x = 0; x < w; x++) {
        rain[y][x] = 0;
    }
}

const term = new wglt.Terminal(document.querySelector('canvas'), w, h);

const rng = new wglt.RNG();

term.update = function () {
    // Update bottom rows
    for (let y = h - 1; y >= 1; y--) {
        for (let x = 0; x < w; x++) {
            // Move rain down
            rain[y][x] = rain[y - 1][x];
            if (rain[y][x] === 255) {
                // Head of streak, new character
                term.drawChar(x, y, rng.nextRange(0, 255));
            }
        }
    }

    // Update the top row
    for (let x = 0; x < w; x++) {
        if (rng.nextFloat() > 0.99) {
            // 1% chance to start a new row
            rain[0][x] = 255;
            term.drawChar(x, 0, rng.nextRange(0, 255));
        } else {
            // Otherwise cooldown
            rain[0][x] = Math.max(0, rain[0][x] - 8);
        }
    }

    // Draw the rain to the screen
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            color = rain[y][x] === 255 ?
                            wglt.Colors.WHITE :
                            wglt.fromRgb(0, rain[y][x], 0);
            term.getCell(x, y).setForeground(color);
        }
    }
};
