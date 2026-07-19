import { Key, registerSerializable, Terminal } from 'wglt';
import { Action, BumpAction, PickupAction, TakeStairsAction } from './actions';
import { BaseComponent } from './base';
import { Colors } from './color';

export abstract class EventHandler extends BaseComponent {
  abstract handleEvents(term: Terminal): void;

  onRender(_term: Terminal): void {
    // By default, do nothing
    // Override in subclasses
  }
}

export class MainGameEventHandler extends EventHandler {
  static {
    registerSerializable(MainGameEventHandler);
  }

  handleEvents(term: Terminal): void {
    const { player, path } = this.engine;
    const moveKey = term.keyboard.getMovementKey();
    let action: Action | undefined;

    if (term.keyboard.isKeyDown(Key.VK_SHIFT_LEFT) && term.keyboard.isKeyPressed(Key.VK_PERIOD)) {
      action = new TakeStairsAction(player);
    } else if (moveKey) {
      action = new BumpAction(this.engine.player, moveKey.x, moveKey.y);
    } else if (term.keyboard.isKeyPressed(Key.VK_G)) {
      action = new PickupAction(player);
    } else if (term.keyboard.isKeyPressed(Key.VK_SLASH)) {
      this.engine.eventHandler = new LookHandler(this.engine);
    } else if (
      term.mouse.x === player.x &&
      term.mouse.y === player.y &&
      term.mouse.buttons.get(0).isClicked()
    ) {
      action = new BumpAction(player, 0, 0);
    }

    if (path) {
      while (
        this.engine.pathIndex < path.length &&
        player.x === path[this.engine.pathIndex].x &&
        player.y === path[this.engine.pathIndex].y
      ) {
        this.engine.pathIndex++;
      }
      if (this.engine.pathIndex < path.length) {
        action = new BumpAction(
          this.engine.player,
          path[this.engine.pathIndex].x - player.x,
          path[this.engine.pathIndex].y - player.y
        );
      }
    }

    if (action) {
      this.engine.handleAction(action);
    }
  }

  onRender(term: Terminal): void {
    const dest = { x: term.mouse.x, y: term.mouse.y };
    const mousePath = this.gameMap.computePath(this.engine.player, dest);
    if (mousePath) {
      this.gameMap.renderPath(term.console, mousePath);
      if (term.mouse.buttons.get(0).isClicked()) {
        this.engine.path = mousePath;
        this.engine.pathIndex = 0;
      }
    }
  }
}

export abstract class TargetingHandler extends EventHandler {
  x: number;
  y: number;

  constructor(parent: BaseComponent) {
    super(parent);
    this.x = parent.engine.player.x;
    this.y = parent.engine.player.y;
  }

  handleEvents(term: Terminal): void {
    const moveKey = term.keyboard.getMovementKey();
    if (moveKey) {
      this.x += moveKey.x;
      this.y += moveKey.y;
    } else if (term.keyboard.isEnterKeyPressed()) {
      this.onSelect(this.x, this.y);
    } else if (term.keyboard.isEscapeKeyPressed()) {
      this.engine.eventHandler = new MainGameEventHandler(this.engine);
    }
  }

  onRender(term: Terminal): void {
    term.drawChar(this.x, this.y, 0, Colors.WHITE, Colors.WHITE);
  }

  abstract onSelect(x: number, y: number): void;
}

export class LookHandler extends TargetingHandler {
  static {
    registerSerializable(LookHandler);
  }

  onSelect(): void {
    this.engine.eventHandler = new MainGameEventHandler(this.engine);
  }
}

export class SingleRangedAttackHandler extends TargetingHandler {
  static {
    registerSerializable(SingleRangedAttackHandler);
  }

  readonly action: Action;
  constructor(action: Action) {
    super(action);
    this.action = action;
  }

  onSelect(x: number, y: number): void {
    this.action.target = { x, y };
    this.engine.handleAction(this.action);
    this.engine.eventHandler = new MainGameEventHandler(this.engine);
  }
}

export class AreaRangedAttackHandler extends TargetingHandler {
  static {
    registerSerializable(AreaRangedAttackHandler);
  }

  readonly radius: number;
  readonly action: Action;
  constructor(radius: number, action: Action) {
    super(action);
    this.radius = radius;
    this.action = action;
  }

  onRender(term: Terminal): void {
    term.console.drawSingleBox(
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2 + 1,
      this.radius * 2 + 1,
      Colors.RED
    );
  }

  onSelect(x: number, y: number): void {
    this.action.target = { x, y };
    this.engine.handleAction(this.action);
    this.engine.eventHandler = new MainGameEventHandler(this.engine);
  }
}
