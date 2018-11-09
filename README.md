# WGLT - WebGL Terminal

* Fast, lightweight, terminal emulator using WebGL
* 100% TypeScript
* MIT license
* ~10kb minified JS, ~5kb gzipped
* No external dependencies

## What is it?

WGLT is a JavaScript/TypeScript library for creating ASCII games in the browser.

WGLT is absurdly overoptimized for performance, using WebGL for minimal CPU usage.

WGLT is modelled after libtcod and rot.js.

## Usage

Add dependency:

```bash
npm i -D wglt
```

Import library:

```typescript
import * as wglt from 'wglt';
```

Or, simply use the prebuilt:

```html
<script src="https://unpkg.com/wglt@0.0.1/dist/index.umd.js"></script>
```

Use it:

```typescript
const term = new wglt.Terminal(document.querySelector('canvas'), 80, 50);
term.fillBackgroundRect(0, 0, 80, 50, wglt.COLOR_DARK_BLUE);
term.fillForegroundRect(0, 0, 80, 50, wglt.COLOR_YELLOW);

let x = 10;
let y = 10;

term.update = function () {
    if (term.isKeyDown(wglt.VK_UP)) {
        y--;
    }
    if (term.isKeyDown(wglt.VK_LEFT)) {
        x--;
    }
    if (term.isKeyDown(wglt.VK_RIGHT)) {
        x++;
    }
    if (term.isKeyDown(wglt.VK_DOWN)) {
        y++;
    }

    term.clear();
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(x, y, '@');
};
```
