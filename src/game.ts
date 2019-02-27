import {Ability, TargetType} from './ability';
import {Actor} from './actor';
import {App} from './app';
import {AppState} from './appstate';
import {Color} from './color';
import {Effect} from './effects/effect';
import {ScrollEffect} from './effects/scrolleffect';
import {Entity} from './entity';
import {GameOptions} from './gameoptions';
import {MessageLog} from './gui/messagelog';
import {Keys} from './keys';
import {computePath} from './path';
import {Rect} from './rect';
import {Sprite} from './sprite';
import {TileMap, TileMapCell} from './tilemap';
import {Vec2} from './vec2';

const DEFAULT_TILE_WIDTH = 16;
const DEFAULT_TILE_HEIGHT = 16;
const DEFAULT_VIEW_DISTANCE = 13;

export class Game extends AppState {
  readonly tileSize: Rect;
  readonly viewport: Rect;
  readonly effects: Effect[];
  readonly entities: Entity[];
  readonly cursor: Vec2;
  turnIndex: number;
  blocked: boolean;
  messageLog?: MessageLog;
  targetAbility?: Ability;
  targetCallback?: Function;
  targetSprite?: Sprite;
  targetTile?: TileMapCell;
  targetEntity?: Actor;
  path?: TileMapCell[];
  pathIndex: number;
  onUpdate?: Function;
  tileMap?: TileMap;
  player?: Actor;
  followPlayer: boolean;

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
    this.followPlayer = true;
  }

  log(text: string, color?: Color) {
    if (this.messageLog) {
      this.messageLog.add(text, color);
    }
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
      if (currEntity instanceof Actor) {
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
      } else {
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
    const mouse = this.app.mouse;
    if (mouse.isDragging()) {
      this.viewport.x -= mouse.dx;
      this.viewport.y -= mouse.dy;
      this.followPlayer = false;
    } else if (this.player && this.followPlayer) {
      const horizontalMargin = ((this.app.size.width - this.player.sprite.width) / 2) | 0;
      const verticalMargin = ((this.app.size.height - this.player.sprite.height) / 2) | 0;
      this.viewport.x = this.player.pixelX - horizontalMargin;
      this.viewport.y = this.player.pixelY - verticalMargin;
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
    return !!this.targetAbility;
  }

  startTargeting(ability: Ability, callback?: Function) {
    this.targetAbility = ability;
    this.targetCallback = callback;
    if (this.player) {
      this.cursor.x = this.player.x;
      this.cursor.y = this.player.y;
    }
  }

  private endTargeting() {
    if (this.player && this.targetAbility) {
      const targetType = this.targetAbility.targetType;
      let target = null;
      if (targetType === TargetType.ENTITY) {
        target = this.getEnemyAt(this.cursor.x, this.cursor.y);
      } else if (targetType === TargetType.TILE && this.tileMap) {
        target = this.tileMap.getCell(this.cursor.x, this.cursor.y);
      }
      if (target) {
        if (this.targetAbility.cast(this.player, target)) {
          if (this.targetCallback) {
            this.targetCallback();
          }
        }
      }
    }
    this.cancelTargeting();
  }

  cancelTargeting() {
    this.targetAbility = undefined;
    this.targetCallback = undefined;
  }

  private handlePlayerInput() {
    if (!this.player || this.blocked) {
      return;
    }

    const mouse = this.app.mouse;
    if (mouse.dx !== 0 || mouse.dy !== 0) {
      this.cursor.x = ((this.viewport.x + mouse.x) / this.tileSize.width) | 0;
      this.cursor.y = ((this.viewport.y + mouse.y) / this.tileSize.height) | 0;
    }

    if (this.app.isKeyDown(Keys.VK_SHIFT)) {
      this.followPlayer = false;

      const scrollFrameCount = 4;
      const scrollDx = 2 * this.tileSize.width / scrollFrameCount;
      const scrollDy = 2 * this.tileSize.height / scrollFrameCount;

      if (this.app.isKeyPressed(Keys.VK_UP)) {
        this.effects.push(new ScrollEffect(this.viewport, 0, -scrollDy, scrollFrameCount));
      }
      if (this.app.isKeyPressed(Keys.VK_LEFT)) {
        this.effects.push(new ScrollEffect(this.viewport, -scrollDx, 0, scrollFrameCount));
      }
      if (this.app.isKeyPressed(Keys.VK_RIGHT)) {
        this.effects.push(new ScrollEffect(this.viewport, scrollDx, 0, scrollFrameCount));
      }
      if (this.app.isKeyPressed(Keys.VK_DOWN)) {
        this.effects.push(new ScrollEffect(this.viewport, 0, scrollDy, scrollFrameCount));
      }
      return;
    }

    if (this.isTargeting()) {
      if (this.app.isKeyPressed(Keys.VK_ENTER) || this.app.mouse.isClicked()) {
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

    if (mouse.isClicked()) {
      const tx = ((this.viewport.x + mouse.x) / this.tileSize.width) | 0;
      const ty = ((this.viewport.y + mouse.y) / this.tileSize.height) | 0;

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
      this.tryMoveOrAttack(0, -1);
    }
    if (left) {
      this.tryMoveOrAttack(-1, 0);
    }
    if (right) {
      this.tryMoveOrAttack(1, 0);
    }
    if (down) {
      this.tryMoveOrAttack(0, 1);
    }
    if (wait) {
      this.player.actionPoints = 0;
    }
  }

  tryMoveOrAttack(dx: number, dy: number) {
    const player = this.player;
    if (!player) {
      return;
    }

    // Start following the player again
    this.followPlayer = true;

    const destX = player.x + dx;
    const destY = player.y + dy;

    for (let i = 0; i < this.entities.length; i++) {
      const other = this.entities[i];
      if (player !== other && other.x === destX && other.y === destY) {
        if (player.onBump) {
          player.onBump(other);
        }
        return true;
      }
    }

    return player.move(dx, dy);
  }

  private doAi(entity: Actor) {
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
        this.recomputeFov();

        // Determine which entities are activated
        for (let i = 0; i < this.entities.length; i++) {
          const entity = this.entities[i];
          if (entity instanceof Actor && entity.ai) {
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
        const entity = this.entities[i];
        if (entity instanceof Actor) {
          entity.actionPoints = 1;
        }
      }
    }
  }

  isBlocked(x: number, y: number) {
    if (this.tileMap && this.tileMap.isBlocked(x, y)) {
      return true;
    }
    for (let i = 0; i < this.entities.length; i++) {
      const other = this.entities[i];
      if (other.blocks && other.x === x && other.y === y) {
        return true;
      }
    }
    return false;
  }

  getEnemyAt(x: number, y: number) {
    for (let i = 0; i < this.entities.length; i++) {
      const other = this.entities[i];
      if (!(other instanceof Actor)) {
        continue;
      }
      if (!other.canAttack || other.health <= 0) {
        // Dead, ignore
        continue;
      }
      if (other instanceof Actor && other.x === x && other.y === y) {
        return other;
      }
    }
    return undefined;
  }

  recomputeFov() {
    if (this.player && this.tileMap) {
      this.tileMap.computeFov(this.player.x, this.player.y, DEFAULT_VIEW_DISTANCE);
    }
  }
}
