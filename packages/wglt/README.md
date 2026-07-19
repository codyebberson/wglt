# WGLT - WebGL Toolkit

WGLT is a fast, lightweight WebGL2 game engine for JavaScript and TypeScript, with support for
both ASCII terminal games and modern tile-based graphics.

## Install

```bash
npm install wglt
```

To create a new project instead:

```bash
npm init wglt
```

## Usage

```typescript
import { CgaPalette, Terminal } from 'wglt';

const term = Terminal.init(80, 45);

term.update = () => {
  term.clear();
  term.drawString(1, 1, 'Hello world!', CgaPalette.YELLOW);
};
```

See the [WGLT repository](https://github.com/codyebberson/wglt) for documentation and examples.

## License

MIT
