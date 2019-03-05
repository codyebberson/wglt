import {Ability, TargetType} from './ability';
import {Actor} from './actor';
import {App} from './app';
import {AppState} from './appstate';
import {Color} from './color';
import {Colors} from './colors';
import {Effect} from './effects/effect';
import {Entity} from './entity';
import {GameOptions} from './gameoptions';
import {MessageLog} from './gui/messagelog';
import {Panel} from './gui/panel';
import {TooltipDialog} from './gui/tooltipdialog';
import {Key, Keys} from './keys';
import {computePath} from './path';
import {Rect} from './rect';
import {RNG} from './rng';
import {Sprite} from './sprite';
import {TileMap, TileMapCell} from './tilemap';
import {Vec2} from './vec2';

const DEFAULT_TILE_WIDTH = 16;
const DEFAULT_TILE_HEIGHT = 16;
const DEFAULT_VIEW_DISTANCE = 13;

// Arrow keys, numpad, vi, WASD, or ZQSD
const UP_KEYS = [Keys.VK_UP, Keys.VK_NUMPAD8, Keys.VK_K, Keys.VK_W, Keys.VK_Z];
const LEFT_KEYS = [Keys.VK_LEFT, Keys.VK_NUMPAD4, Keys.VK_H, Keys.VK_A, Keys.VK_Q];
const DOWN_KEYS = [Keys.VK_DOWN, Keys.VK_NUMPAD2, Keys.VK_J, Keys.VK_S];
const RIGHT_KEYS = [Keys.VK_RIGHT, Keys.VK_NUMPAD6, Keys.VK_L, Keys.VK_D];
const WAIT_KEYS = [Keys.VK_SPACE, Keys.VK_NUMPAD5];

export class Game extends AppState {
  readonly tileSize: Rect;
  readonly viewport: Rect;
  readonly viewportFocus: Vec2;
  readonly effects: Effect[];
  readonly entities: Entity[];
  readonly cursor: Vec2;
  readonly tooltip: TooltipDialog;
  readonly rng: RNG;
  turnIndex: number;
  blocked: boolean;
  messageLog?: MessageLog;
  targetAbility?: Ability;
  targetCallback?: Function;
  targetSprite?: Sprite;
  targetTile?: TileMapCell;
  path?: TileMapCell[];
  pathIndex: number;
  onUpdate?: Function;
  tileMap?: TileMap;
  player?: Actor;
  cooldownSprite?: Sprite;
  tooltipElement?: Panel;
  blackoutRect?: Rect;
  viewDistance: number;

  constructor(app: App, options: GameOptions) {
    super(app);
    this.tileSize = options.tileSize || new Rect(0, 0, DEFAULT_TILE_WIDTH, DEFAULT_TILE_HEIGHT);
    this.viewport = new Rect(0, 0, app.size.width, app.size.height);
    this.viewportFocus = new Vec2(0, 0);
    this.effects = [];
    this.entities = [];
    this.turnIndex = 0;
    this.blocked = false;
    this.cursor = new Vec2(-1, -1);
    this.tooltip = new TooltipDialog();
    this.rng = new RNG();
    this.pathIndex = 0;
    this.viewDistance = options.viewDistance || DEFAULT_VIEW_DISTANCE;
  }

  log(text: string, color?: Color) {
    if (this.messageLog) {
      this.messageLog.add(text, color);
    }
  }

  update() {
    Sprite.updateGlobalAnimations();
    this.updateTooltip();

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

  private updateTooltip() {
    if (this.gui.dragElement) {
      // No tooltips while drag/drop
      this.tooltip.visible = false;
      return;
    }

    if (!this.tooltip.visible) {
      this.tooltipElement = undefined;
    }

    const mouse = this.app.mouse;
    const longPress = mouse.isLongPress();

    if ((!mouse.down && (mouse.dx !== 0 || mouse.dy !== 0)) || longPress) {
      const hoverPanel = this.gui.getPanelAt(mouse);
      if (this.tooltipElement !== hoverPanel) {
        // Hover element has changed
        this.tooltipElement = hoverPanel;
        if (hoverPanel) {
          hoverPanel.updateTooltip(this.tooltip);
          if (longPress) {
            window.navigator.vibrate(100);
          }
        }
      }

      if (this.tooltip.visible) {
        if (!this.tooltip.gui) {
          // If this is the first time we're showing the tooltip,
          // make sure it is in the GUI system.
          this.gui.add(this.tooltip);
        }

        // Update the tooltip to be on the mouse
        // This is similar to WoW style tooltips.
        this.tooltip.showAt(mouse.x, mouse.y);

        // On mobile devices, the tooltip is modal
        this.tooltip.modal = this.app.mobile;
      }
    }
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
        const effect = this.effects[i];
        if (effect.onDone) {
          effect.onDone();
        }
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
        if (currEntity.ap > 0) {
          if (currEntity === this.player) {
            this.handlePlayerInput();
            break;
          } else {
            this.doAi(currEntity);
          }
        }
        if (!this.blocked && currEntity.ap <= 0) {
          // Turn is over
          currEntity.ap = 0;
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

  resetViewport() {
    if (!this.player) {
      return;
    }
    this.viewportFocus.x = this.player.centerPixelX;
    this.viewportFocus.y = this.player.centerPixelY;
    this.viewport.x = this.viewportFocus.x - ((this.app.size.width / 2) | 0);
    this.viewport.y = this.viewportFocus.y - ((this.app.size.height / 2) | 0);
  }

  private updateViewport() {
    this.viewport.width = this.app.size.width;
    this.viewport.height = this.app.size.height;

    const mouse = this.app.mouse;
    if (mouse.isDragging()) {
      this.viewport.x -= mouse.dx;
      this.viewport.y -= mouse.dy;
      this.viewportFocus.x = this.viewport.x + ((this.viewport.width / 2) | 0);
      this.viewportFocus.y = this.viewport.y + ((this.viewport.height / 2) | 0);
    } else {
      // Drift viewport toward focus
      const focusLeftX = this.viewportFocus.x - ((this.app.size.width / 2) | 0);
      if (focusLeftX !== this.viewport.x) {
        let dx = 0.1 * focusLeftX - 0.1 * this.viewport.x;
        if (dx < 0) {
          dx = Math.floor(dx);
        } else {
          dx = Math.ceil(dx);
        }
        this.viewport.x += dx;
      }

      const focusTopY = this.viewportFocus.y - ((this.app.size.height / 2) | 0);
      if (focusTopY !== this.viewport.y) {
        let dy = 0.1 * focusTopY - 0.1 * this.viewport.y;
        if (dy < 0) {
          dy = Math.floor(dy);
        } else {
          dy = Math.ceil(dy);
        }
        this.viewport.y += dy;
      }
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
        target = this.getActorAt(this.cursor.x, this.cursor.y);
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
    if (mouse.down || mouse.dx !== 0 || mouse.dy !== 0) {
      this.cursor.x = ((this.viewport.x + mouse.x) / this.tileSize.width) | 0;
      this.cursor.y = ((this.viewport.y + mouse.y) / this.tileSize.height) | 0;
    }

    if (this.app.isKeyDown(Keys.VK_SHIFT)) {
      if (this.isKeyPressed(UP_KEYS)) {
        this.viewportFocus.y -= 2 * this.tileSize.height;
      }
      if (this.isKeyPressed(LEFT_KEYS)) {
        this.viewportFocus.x -= 2 * this.tileSize.width;
      }
      if (this.isKeyPressed(RIGHT_KEYS)) {
        this.viewportFocus.x += 2 * this.tileSize.width;
      }
      if (this.isKeyPressed(DOWN_KEYS)) {
        this.viewportFocus.y += 2 * this.tileSize.height;
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
      if (this.isKeyPressed(UP_KEYS)) {
        this.cursor.y--;
      }
      if (this.isKeyPressed(LEFT_KEYS)) {
        this.cursor.x--;
      }
      if (this.isKeyPressed(RIGHT_KEYS)) {
        this.cursor.x++;
      }
      if (this.isKeyPressed(DOWN_KEYS)) {
        this.cursor.y++;
      }
      return;
    }

    if (mouse.isClicked()) {
      const tx = ((this.viewport.x + mouse.x) / this.tileSize.width) | 0;
      const ty = ((this.viewport.y + mouse.y) / this.tileSize.height) | 0;
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
      if (!nextStep) {
        this.stopAutoWalk();
      }
    }

    const down = this.isKeyPressed(DOWN_KEYS) || (nextStep && nextStep.y > this.player.y);
    const left = this.isKeyPressed(LEFT_KEYS) || (nextStep && nextStep.x < this.player.x);
    const right = this.isKeyPressed(RIGHT_KEYS) || (nextStep && nextStep.x > this.player.x);
    const up = this.isKeyPressed(UP_KEYS) || (nextStep && nextStep.y < this.player.y);
    const wait = this.isKeyPressed(WAIT_KEYS);

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
      this.player.ap = 0;
    }
  }

  private isKeyPressed(keys: Key[]) {
    for (let i = 0; i < keys.length; i++) {
      if (this.app.isKeyPressed(keys[i])) {
        return true;
      }
    }
    return false;
  }

  tryMoveOrAttack(dx: number, dy: number) {
    const player = this.player;
    if (!player) {
      return;
    }

    const destX = player.x + dx;
    const destY = player.y + dy;

    for (let i = 0; i < this.entities.length; i++) {
      const other = this.entities[i];
      if (player !== other && other.x === destX && other.y === destY) {
        if (player.onBump) {
          player.onBump(other);
        }
        this.stopAutoWalk();
        return true;
      }
    }

    return player.move(dx, dy);
  }

  private recalculateViewportFocus() {
    const player = this.player;
    if (!player) {
      return;
    }

    // Find the bounds of desired area
    let minX = player.pixelX;
    let minY = player.pixelY;
    let maxX = minX + player.sprite.width;
    let maxY = minY + player.sprite.height;

    if (this.path) {
      // If there is an auto-walk path, use that
      for (let i = this.pathIndex; i < this.path.length; i++) {
        const pathTile = this.path[i];
        minX = Math.min(minX, pathTile.x * this.tileSize.width);
        minY = Math.min(minY, pathTile.y * this.tileSize.height);
        maxX = Math.max(maxX, (pathTile.x + 1) * this.tileSize.width);
        maxY = Math.max(maxY, (pathTile.y + 1) * this.tileSize.height);
      }
    } else {
      // Otherwise, use all visible entities.
      for (let i = 0; i < this.entities.length; i++) {
        const entity = this.entities[i];
        if (entity instanceof Actor && this.tileMap && this.tileMap.isVisible(entity.x, entity.y)) {
          minX = Math.min(minX, entity.pixelX);
          minY = Math.min(minY, entity.pixelY);
          maxX = Math.max(maxX, entity.pixelX + entity.sprite.width);
          maxY = Math.max(maxY, entity.pixelY + entity.sprite.height);
        }
      }
    }

    // Find the center of the bounds of all visible actors
    this.viewportFocus.x = Math.round((minX + maxX) / 2.0);
    this.viewportFocus.y = Math.round((minY + maxY) / 2.0);
  }

  private doAi(entity: Actor) {
    if (entity.ai) {
      if (!this.tileMap || (this.tileMap.isVisible(entity.x, entity.y) && entity.activatedCount > 0)) {
        entity.ai.doAi();
      }
    }

    entity.ap = 0;
  }

  private nextTurn() {
    if (this.player && this.entities[this.turnIndex] === this.player) {
      // Player just finished turn

      // Update FOV
      if (this.player && this.tileMap) {
        this.recomputeFov();
        this.recalculateViewportFocus();
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
          entity.ap = entity.maxAp;
          for (let j = 0; j < entity.talents.length; j++) {
            const talent = entity.talents.get(j);
            if (talent.cooldown > 0) {
              talent.cooldown--;
            }
          }
        }
      }
    }
  }

  stopAutoWalk() {
    this.path = undefined;
    this.targetTile = undefined;
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

  getEntityAt(x: number, y: number) {
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      if (entity.x === x && entity.y === y) {
        return entity;
      }
    }
    return undefined;
  }

  getActorAt(x: number, y: number) {
    for (let i = 0; i < this.entities.length; i++) {
      const other = this.entities[i];
      if (other instanceof Actor && other.x === x && other.y === y) {
        return other;
      }
    }
    return undefined;
  }

  recomputeFov() {
    if (this.player && this.tileMap) {
      this.tileMap.computeFov(this.player.x, this.player.y, this.viewDistance);

      // Determine which entities are activated
      for (let i = 0; i < this.entities.length; i++) {
        const entity = this.entities[i];
        if (entity === this.player) {
          continue;
        }
        if (entity instanceof Actor) {
          if (this.tileMap.isVisible(entity.x, entity.y)) {
            if (!entity.seen) {
              // Spotted a new entity, stop auto walking
              entity.seen = true;
              this.player.addFloatingText('!', Colors.WHITE);
              this.stopAutoWalk();

              this.viewportFocus.x = ((this.player.centerPixelX + entity.centerPixelX) / 2) | 0;
              this.viewportFocus.y = ((this.player.centerPixelY + entity.centerPixelY) / 2) | 0;
            }
            entity.activatedCount++;
          } else {
            entity.activatedCount = -1;
          }
        }
      }
    }
  }
}
