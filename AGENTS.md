# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

WGLT is a WebGL2-based game engine for TypeScript/JavaScript, optimized for roguelikes and turn-based games. It provides both ASCII terminal emulation and modern tile-based graphics through two main rendering modes.

## Architecture

The codebase follows a modular architecture with three main rendering systems:

### Core Systems (`packages/wglt/src/core/`)

- **BaseApp**: Foundation class for all applications
- **GUI System**: Component-based UI with buttons, panels, dialogs, and containers
- **Input Handling**: Keyboard, mouse, and input abstraction layers
- **Utilities**: Color palettes, fonts, serialization, RNG, FOV, pathfinding

### Rendering Modes

1. **TextMode** (`packages/wglt/src/textmode/`): Terminal class for ASCII-based games using WebGL2 shaders
2. **Graphics** (`packages/wglt/src/graphics/`): GraphicsApp for sprite-based tile games with DrawList batching
3. **Tilemap** (`packages/wglt/src/tilemap/`): Specialized tilemap rendering system

### Key Classes

- `Terminal`: Main class for text-mode applications (extends BaseApp)
- `GraphicsApp`: Main class for sprite-based applications (extends BaseApp)
- `Console`: Text buffer management for terminal rendering
- `DrawList`: Efficient sprite batching system for graphics mode

## Development Commands

### Building

```bash
npm run build          # Build all packages using Turbo
turbo run build        # Alternative turbo command
```

### Development Server

```bash
npm run dev            # Start docs development server (Vite)
```

### Linting and Formatting

```bash
npm run lint           # Check code with Biome
npm run fix            # Auto-fix issues with Biome --write --unsafe
```

### Testing

```bash
npm run test           # Run tests across all packages
```

### Package Management

This is a monorepo using npm workspaces:

- `packages/wglt/`: Main engine library
- `packages/wglt-docs/`: Documentation and examples site
- `packages/create-wglt/`: CLI tool for creating new projects
- `packages/wglt-hello-world/`: Template project

## Code Style

The project uses Biome for formatting and linting with these key settings:

- 2-space indentation
- 100 character line width
- Single quotes for strings
- ES5 trailing commas
- `useExplicitType` rule enforced (must specify return types)
- `useBlockStatements` enforced

## Examples and Documentation

Comprehensive examples are located in `packages/wglt-docs/examples/`:

- `graphics/hello.ts`: Basic graphics mode usage
- `graphics/perpetua/`: Full roguelike game example
- `graphics/roguelike/`: Roguelike tutorial implementation

Each example includes both `.ts` and `.html` files for complete working demos.

## TypeScript Configuration

- All packages use TypeScript 5.7.3
- Target ES modules with `.d.ts` type definitions
- No external runtime dependencies in the main wglt package
