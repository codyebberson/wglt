# WGLT - WebGL Toolkit

- Fast, lightweight game engine using WebGL2
- Support for both ASCII and tile-based games
- 100% TypeScript with full type definitions
- MIT license open source
- No external dependencies

## What is it?

WGLT is a JavaScript/TypeScript library for creating games in the browser, with special focus on roguelikes and turn-based games.

WGLT offers two modes:

- Traditional ASCII games using a high-performance terminal emulator
- Modern tile-based games with sprite support and animation

WGLT is absurdly overoptimized for performance, using WebGL2 for minimal CPU usage:

- Blazing fast sprite rendering with instanced draw calls
- Efficient tilemap rendering with specialized shaders
- Smart batching for both text and graphics

WGLT draws inspiration from libtcod and rot.js while providing modern features:

- Built-in GUI system with drag-and-drop support
- Sophisticated state serialization
- Flexible component architecture
- Rich set of roguelike utilities (FOV, pathfinding, etc)

## Install

Create a new project:

```bash
npm init wglt
```

Or, add dependency to existing project:

```bash
npm i -D wglt
```

## Usage

Use it:

```typescript
import { Colors, Terminal } from "wglt";

const term = new Terminal("canvas", 80, 45);
term.fillRect(0, 0, 80, 45, 0, Colors.YELLOW, Colors.DARK_BLUE);

let x = 10;
let y = 10;

term.update = () => {
  const moveKey = term.keyboard.getMovementKey();
  if (moveKey) {
    x += moveKey.x;
    y += moveKey.y;
  }

  term.clear();
  term.drawString(1, 1, "Hello world!");
  term.drawString(1, 3, "Use arrow keys to move");
  term.drawString(x, y, "@");
};
```
