import {App} from './app';
import {AppState} from './appstate';
import {Effect} from './effects/effect';
import {Entity} from './entity';
import {GameOptions} from './gameoptions';
import {Keys} from './keys';
import {computePath} from './path';
import {Rect} from './rect';
import {Sprite} from './sprite';
import {TileMap, TileMapCell} from './tilemap';
import {Vec2} from './vec2';

const DEFAULT_TILE_WIDTH = 16;
const DEFAULT_TILE_HEIGHT = 16;

export class Game extends AppState {
  readonly tileSize: Rect;
  readonly viewport: Rect;
  readonly effects: Effect[];
  readonly entities: Entity[];
  readonly cursor: Vec2;
  turnIndex: number;
  blocked: boolean;
  targetCallback?: Function;
  targetSprite?: Sprite;
  targetTile?: TileMapCell;
  targetEntity?: Entity;
  path?: TileMapCell[];
  pathIndex: number;
  onUpdate?: Function;
  tileMap?: TileMap;
  player?: Entity;

  constructor(app: App, options: GameOptions) {
    super(app);
    this.tileSize = options.tileSize || new Rect(0, 0, DEFAULT_TILE_WIDTH, DEFAULT_TILE_HEIGHT);
    this.viewport = new Rect(0, 0, app.size.width, app.size.height);
    this.effects = [];
    this.entities = [];
    this.turnIndex = 0;
    this.blocked = false;
    this.cursor = new Vec2(-1, -1);
    this.pathIndex = 0;
  }

  update() {
    Sprite.updateGlobalAnimations();

    if (!this.gui.handleInput()) {
      this.updateEffects();
      this.updateEntities();

      if (this.onUpdate) {
        this.onUpdate();
      }

      this.updateViewport();
    }

    this.drawTileMap();
    this.drawTargeting();
    this.drawEntities();
    this.drawEffects();
    this.gui.draw();
  }

  private updateEffects() {
    // Reset blocked
    this.blocked = false;

    // Update effects
    for (let i = 0; i < this.effects.length; i++) {
      const effect = this.effects[i];
      if (!effect.blocking || !this.blocked) {
        effect.update();
        if (effect.blocking) {
          this.blocked = true;
        }
      }
    }

    // Remove completed effects
    for (let i = this.effects.length - 1; i >= 0; i--) {
      if (this.effects[i].isDone()) {
        this.effects.splice(i, 1);
      }
    }
  }

  private updateEntities() {
    // If not blocked on any animations,
    // then try to do enemy AI
    // const startTurnIndex = this.turnIndex;
    let turnCount = 0;
    while (true) {
      if (this.turnIndex < 0 || this.turnIndex >= this.entities.length) {
        // Turn index out of range
        break;
      }

      if (turnCount > this.entities.length * 2) {
        // Looped back to original entity
        // In that case, quit to next frame to avoid infinite loops
        break;
      }

      const currEntity = this.entities[this.turnIndex];
      if (currEntity.actionPoints > 0) {
        if (currEntity === this.player) {
          this.handlePlayerInput();
          break;
        } else {
          this.doAi(currEntity);
        }
      }
      if (!this.blocked && currEntity.actionPoints <= 0) {
        // Turn is over
        currEntity.actionPoints = 0;
        this.nextTurn();
      }
      if (this.blocked) {
        // Waiting for animations
        break;
      }

      turnCount++;
    }
  }

  private updateViewport() {
    if (this.player) {
      const horizontalMargin = (this.app.size.width * 0.4) | 0;
      const verticalMargin = (this.app.size.height * 0.4) | 0;

      if (this.player.pixelX - this.viewport.x < horizontalMargin) {
        this.viewport.x = this.player.pixelX - horizontalMargin;
      }

      if (this.viewport.x + this.viewport.width - (this.player.pixelX + this.tileSize.width) < horizontalMargin) {
        this.viewport.x = this.player.pixelX + this.tileSize.width + horizontalMargin - this.viewport.width;
      }

      if (this.player.pixelY - this.viewport.y < verticalMargin) {
        this.viewport.y = this.player.pixelY - verticalMargin;
      }

      if (this.viewport.y + this.viewport.height - (this.player.pixelY + this.tileSize.height) < verticalMargin) {
        this.viewport.y = this.player.pixelY + this.tileSize.height + verticalMargin - this.viewport.height;
      }

      this.viewport.width = this.app.size.width;
      this.viewport.height = this.app.size.height;
    }
  }

  private drawTileMap() {
    if (this.app.renderSet.spriteTexture.loaded && this.tileMap) {
      this.tileMap.draw(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
    }
  }

  private drawTargeting() {
    if (this.isTargeting() && this.targetSprite) {
      const x = this.cursor.x * this.tileSize.width - this.viewport.x;
      const y = this.cursor.y * this.tileSize.height - this.viewport.y;
      this.targetSprite.draw(this.app, x, y);
    }
  }

  private drawEntities() {
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      if (!this.tileMap || this.tileMap.isVisible(entity.x, entity.y)) {
        entity.draw();
      }
    }
  }

  private drawEffects() {
    let blockingCount = 0;
    for (let i = 0; i < this.effects.length; i++) {
      const effect = this.effects[i];
      if (blockingCount === 0 || !effect.blocking) {
        effect.draw(this);
      }
      if (effect.blocking) {
        blockingCount++;
      }
    }
  }

  isTargeting() {
    return !!this.targetCallback;
  }

  startTargeting(callback: Function) {
    this.targetCallback = callback;
    if (this.player) {
      this.cursor.x = this.player.x;
      this.cursor.y = this.player.y;
    }
  }

  private endTargeting() {
    if (this.targetCallback) {
      this.targetCallback(this.cursor.x, this.cursor.y);
    }
    this.cancelTargeting();
  }

  cancelTargeting() {
    this.targetCallback = undefined;
  }

  private handlePlayerInput() {
    if (!this.player || this.blocked) {
      return;
    }

    if (this.app.mouse.dx !== 0 || this.app.mouse.dy !== 0) {
      this.cursor.x = ((this.viewport.x + this.app.mouse.x) / this.tileSize.width) | 0;
      this.cursor.y = ((this.viewport.y + this.app.mouse.y) / this.tileSize.height) | 0;
    }

    if (this.isTargeting()) {
      if (this.app.isKeyPressed(Keys.VK_ENTER) || this.app.mouse.upCount === 1) {
        this.endTargeting();
      }
      if (this.app.isKeyPressed(Keys.VK_ESCAPE)) {
        this.cancelTargeting();
      }
      if (this.app.isKeyPressed(Keys.VK_UP)) {
        this.cursor.y--;
      }
      if (this.app.isKeyPressed(Keys.VK_LEFT)) {
        this.cursor.x--;
      }
      if (this.app.isKeyPressed(Keys.VK_RIGHT)) {
        this.cursor.x++;
      }
      if (this.app.isKeyPressed(Keys.VK_DOWN)) {
        this.cursor.y++;
      }
      return;
    }

    if (this.app.mouse.upCount === 1) {
      const tx = ((this.viewport.x + this.app.mouse.x) / this.tileSize.width) | 0;
      const ty = ((this.viewport.y + this.app.mouse.y) / this.tileSize.height) | 0;

      this.targetEntity = this.getEnemyAt(tx, ty);
      if (this.targetEntity) {
        this.targetTile = undefined;
        this.path = undefined;
        if (this.player.distance(this.targetEntity.x, this.targetEntity.y) <= 1.0) {
          this.player.attack(this.targetEntity);
        }
        return;
      }

      if (this.tileMap) {
        const target = this.tileMap.getCell(tx, ty);
        if (target && target !== this.targetTile) {
          this.targetTile = target;
          this.path = computePath(this.tileMap, this.player, this.targetTile, 100);
          this.pathIndex = 0;
        }
      }
    }

    let nextStep = null;
    if (this.path) {
      nextStep = this.path[this.pathIndex];
      while (nextStep && nextStep.x === this.player.x && nextStep.y === this.player.y) {
        this.pathIndex++;
        nextStep = this.pathIndex < this.path.length ? this.path[this.pathIndex] : null;
      }
      if (nextStep && this.getEnemyAt(nextStep.x, nextStep.y)) {
        // Entity in the way.  Cancel the path.
        nextStep = null;
      }
      if (!nextStep) {
        this.targetTile = undefined;
        this.path = undefined;
      }
    }

    const down = this.app.isKeyPressed(Keys.VK_NUMPAD2) || this.app.isKeyPressed(Keys.VK_DOWN) ||
        (nextStep && nextStep.y > this.player.y);

    const left = this.app.isKeyPressed(Keys.VK_NUMPAD4) || this.app.isKeyPressed(Keys.VK_LEFT) ||
        (nextStep && nextStep.x < this.player.x);

    const right = this.app.isKeyPressed(Keys.VK_NUMPAD6) || this.app.isKeyPressed(Keys.VK_RIGHT) ||
        (nextStep && nextStep.x > this.player.x);

    const up = this.app.isKeyPressed(Keys.VK_NUMPAD8) || this.app.isKeyPressed(Keys.VK_UP) ||
        (nextStep && nextStep.y < this.player.y);

    const wait = this.app.isKeyPressed(Keys.VK_NUMPAD5);

    if (up) {
      this.player.tryMoveOrAttack(0, -1);
    }
    if (left) {
      this.player.tryMoveOrAttack(-1, 0);
    }
    if (right) {
      this.player.tryMoveOrAttack(1, 0);
    }
    if (down) {
      this.player.tryMoveOrAttack(0, 1);
    }
    if (wait) {
      this.player.actionPoints = 0;
    }
  }

  private doAi(entity: Entity) {
    if (entity.ai) {
      if (!this.tileMap || (this.tileMap.isVisible(entity.x, entity.y) && entity.ai.activatedCount > 0)) {
        entity.ai.doAi();
      }
    }

    entity.actionPoints = 0;
  }

  private nextTurn() {
    if (this.player && this.entities[this.turnIndex] === this.player) {
      // Player just finished turn

      // Update FOV
      if (this.player && this.tileMap) {
        this.tileMap.computeFov(this.player.x, this.player.y, 13);

        // Determine which entities are activated
        for (let i = 0; i < this.entities.length; i++) {
          const entity = this.entities[i];
          if (entity.ai) {
            if (this.tileMap.isVisible(entity.x, entity.y)) {
              entity.ai.activatedCount++;
            } else {
              entity.ai.activatedCount = -1;
            }
          }
        }
      }

      // Sort entities by distance from player
      this.entities.sort((a, b) => {
        if (!this.player) {
          return 0;
        }
        const ad = Math.hypot(a.x - this.player.x, a.y - this.player.y);
        const bd = Math.hypot(b.x - this.player.x, b.y - this.player.y);
        return ad - bd;
      });
    }
    this.turnIndex++;
    if (this.turnIndex >= this.entities.length) {
      // Reached the end of the entities list.  Start at beginning.
      this.turnIndex = 0;
      for (let i = 0; i < this.entities.length; i++) {
        this.entities[i].actionPoints = 1;
      }
    }
  }

  getEnemyAt(x: number, y: number) {
    for (let i = 0; i < this.entities.length; i++) {
      const other = this.entities[i];
      if (!other.canAttack || other.health <= 0) {
        // Dead, ignore
        continue;
      }
      if (other.x === x && other.y === y) {
        return other;
      }
    }
    return undefined;
  }
}