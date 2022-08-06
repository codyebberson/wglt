# WGLT - WebGL Terminal

- Fast, lightweight, terminal emulator using WebGL
- MIT license
- ~30kb minified JS, ~10kb gzipped
- No external dependencies

## What is it?

WGLT is a JavaScript/TypeScript library for creating ASCII games in the browser.

WGLT is absurdly overoptimized for performance, using WebGL for minimal CPU.

WGLT is modelled after [libtcod](https://github.com/libtcod/libtcod) and [rot.js](https://ondras.github.io/rot.js/hp/).

## Install

### Install with npm

Add dependency to your package.json:

```bash
npm i -D wglt
```

Import library:

```typescript
import { Colors, Terminal } from 'wglt';
```

### Link directly with HTML

Add a script tag to your HTML file:

```html
<script src="https://unpkg.com/wglt@0.3.1/dist/cjs/index.js"></script>
```

## Usage

Use it:

```typescript
import { Colors, Terminal } from 'wglt';

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, 80, 45);
term.fillRect(0, 0, 80, 45, 0, Colors.YELLOW, Colors.DARK_BLUE);

let x = 10;
let y = 10;

term.update = function () {
  const moveKey = term.getMovementKey();
  if (moveKey) {
    x += moveKey.x;
    y += moveKey.y;
  }

  term.clear();
  term.drawString(1, 1, 'Hello world!');
  term.drawString(1, 3, 'Use arrow keys to move');
  term.drawString(x, y, '@');
};
```

## Limitations

WGLT is a minimalist library. It is intended to be small, lightweight, and fast. It serves the very narrow use case of minimalist ASCII or ANSI games in the web browser.

By default, WGLT uses the original IBM CGA Character set, thick variant, dumped from addresses 0x1800-0x1fff the 5788005 IBM Character Generator ROM.

I do not have intentions to include support for formatted text (i.e., bold or underline), extended character sets, emoji, etc. While I am flattered by those feature requests, I suggest you look at alternate libraries such as:

- [rot.js](https://ondras.github.io/rot.js/hp/)
- [Phaser](https://phaser.io/)
- [PixiJS](https://pixijs.com/)
- [Kontra.js](https://github.com/straker/kontra)
- [LittleJS](https://github.com/KilledByAPixel/LittleJS)
- [Kaboom](https://kaboomjs.com/)

## Fonts

- Original IBM CGA Character
- MS-DOS
- Commodore 64
- ZX Spectrum
- Amstrad CPC 464:

mode 0 - 160x200, or 20x25 characters, with a palette of 16 colours
mode 1 - 320x200, or 40x25 characters, with a palette of 4 colours
mode 2 - 640x200, or 80x25 characters, with a palette of 2 colours

https://fonts2u.com/amstrad-cpc464-regular.font
https://retrocomputing.stackexchange.com/questions/11913/how-was-text-handled-on-the-amstrad-cpc-464
https://neuro-sys.github.io/2019/10/01/amstrad-cpc-crtc.html

## CRT Filter

https://mrmotarius.itch.io/mrmocrt

https://github.com/mattiasgustavsson/dosbox-crt

MattiasCRT
https://www.shadertoy.com/view/Ms23DR
