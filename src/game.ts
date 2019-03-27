import {Ability, TargetType} from './ability';
import {Actor} from './actor';
import {Animation} from './animations/animation';
import {App} from './app';
import {AppState} from './appstate';
import {Color} from './color';
import {Colors} from './colors';
import {Entity} from './entity';
import {GameOptions} from './gameoptions';
import {MessageLog} from './gui/messagelog';
import {Panel} from './gui/panel';
import {TooltipDialog} from './gui/tooltipdialog';
import {Keys} from './keys';
import {computePath} from './path';
import {Rect} from './rect';
import {RNG} from './rng';
import {Sprite} from './sprite';
import {TileMap, TileMapCell} from './tilemap';
import {Vec2} from './vec2';
import { ArrayList } from './arraylist';

const DEFAULT_TILE_WIDTH = 16;
const DEFAULT_TILE_HEIGHT = 16;
const DEFAULT_VIEW_DISTANCE = 13;

export class Game extends AppState {
  readonly tileSize: Rect;
  readonly viewport: Rect;
  readonly viewportFocus: Vec2;
  readonly animations: Animation[];
  readonly entities: ArrayList<Entity>;
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
  horizontalViewDistance: number;
  verticalViewDistance: number;
  zoom: number;

  constructor(app: App, options: GameOptions) {
    super(app);
    this.tileSize = options.tileSize || new Rect(0, 0, DEFAULT_TILE_WIDTH, DEFAULT_TILE_HEIGHT);
    this.viewport = new Rect(0, 0, app.size.width, app.size.height);
    this.viewportFocus = new Vec2(0, 0);
    this.animations = [];
    this.entities = new ArrayList<Entity>();
    this.turnIndex = 0;
    this.blocked = false;
    this.cursor = new Vec2(-1, -1);
    this.tooltip = new TooltipDialog();
    this.rng = new RNG();
    this.pathIndex = 0;
    this.horizontalViewDistance = options.viewDistance || DEFAULT_VIEW_DISTANCE;
    this.verticalViewDistance = options.viewDistance || DEFAULT_VIEW_DISTANCE;
    this.zoom = 1.0;

    if (options.horizontalViewDistance) {
      this.horizontalViewDistance = options.horizontalViewDistance;
    }
    if (options.verticalViewDistance) {
      this.verticalViewDistance = options.verticalViewDistance;
    }
  }

  log(text: string, color?: Color) {
    if (this.messageLog) {
      this.messageLog.add(text, color);
    }
  }

  addAnimation(animation: Animation) {
    this.animations.push(animation);
    return animation.promise;
  }

  update() {
    Sprite.updateGlobalAnimations();
    this.updateTooltip();
    this.updateZoom();

    if (!this.gui.handleInput()) {
      this.updateAnimations();
      this.updateEntities();

      if (this.onUpdate) {
        this.onUpdate();
      }

      this.updateViewport();
    }

    this.drawTileMap();

    if (this.zoom === 1.0) {
      this.drawTargeting();
      this.drawEntities();
      this.drawAnimations();
    }

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

  private updateZoom() {
    if (this.app.mouse.wheelDelta !== 0) {
      const center = this.viewport.getCenter();
      this.viewportFocus.x = center.x;
      this.viewportFocus.y = center.y;

      if (this.app.mouse.wheelDelta > 0) {
        this.zoom *= 0.5;
      } else {
        this.zoom *= 2.0;
      }

      this.viewport.width = (this.zoom * this.app.size.width) | 0;
      this.viewport.height = (this.zoom * this.app.size.height) | 0;
      this.viewport.x = center.x - ((this.app.size.width / this.zoom / 2) | 0);
      this.viewport.y = center.y - ((this.app.size.height / this.zoom / 2) | 0);
    }
  }

  private updateAnimations() {
    // Reset blocked
    this.blocked = false;

    // Update animations
    for (let i = 0; i < this.animations.length; i++) {
      const animation = this.animations[i];
      animation.update();
      if (animation.blocking) {
        this.blocked = true;
      }
    }

    // Remove completed animations
    for (let i = this.animations.length - 1; i >= 0; i--) {
      if (this.animations[i].isDone()) {
        this.animations[i].promise.resolve();
        this.animations.splice(i, 1);
      }
    }
  }

  private updateEntities() {
    if (this.player && this.player.hp <= 0) {
      // Player is dead.  Do nothing.
      return;
    }

    // If not blocked on any animations,
    // then try to do enemy AI
    // const startTurnIndex = this.turnIndex;
    let turnCount = 0;
    while (true) {
      if (this.entities.length === 0) {
        // No entities
        break;
      }

      if (this.turnIndex >= this.entities.length) {
        // Turn index out of range.  Entities list must have changed.
        // Restart back to first entity.
        this.turnIndex = 0;
      }

      if (turnCount > this.entities.length * 2) {
        // Looped back to original entity
        // In that case, quit to next frame to avoid infinite loops
        break;
      }

      const currEntity = this.entities.get(this.turnIndex);
      if (currEntity instanceof Actor) {
        if (currEntity.ap > 0) {
          if (currEntity === this.player) {
            if (!this.blocked) {
              this.handlePlayerInput();
            }
            break;
          } else {
            this.doAi(currEntity);
          }
        }
        if (currEntity.ap <= 0) {
          // Turn is over
          currEntity.ap = 0;
          this.nextTurn();
        }
      } else {
        this.nextTurn();
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
    this.viewport.x = this.viewportFocus.x - ((this.app.size.width / this.zoom / 2) | 0);
    this.viewport.y = this.viewportFocus.y - ((this.app.size.height / this.zoom / 2) | 0);
  }

  private updateViewport() {
    this.viewport.width = this.app.size.width / this.zoom;
    this.viewport.height = this.app.size.height / this.zoom;

    const mouse = this.app.mouse;
    if (mouse.isDragging()) {
      this.viewport.x -= mouse.dx / this.zoom;
      this.viewport.y -= mouse.dy / this.zoom;
      this.viewportFocus.x = this.viewport.x + ((this.viewport.width / 2) | 0);
      this.viewportFocus.y = this.viewport.y + ((this.viewport.height / 2) | 0);
    } else {
      // Drift viewport toward focus
      const driftRate = 0.05;
      const focusLeftX = this.viewportFocus.x - ((this.app.size.width / this.zoom / 2) | 0);
      if (focusLeftX !== this.viewport.x) {
        let dx = driftRate * focusLeftX - driftRate * this.viewport.x;
        if (dx < 0) {
          dx = Math.floor(dx);
        } else {
          dx = Math.ceil(dx);
        }
        this.viewport.x += dx;
      }

      const focusTopY = this.viewportFocus.y - ((this.app.size.height / this.zoom / 2) | 0);
      if (focusTopY !== this.viewport.y) {
        let dy = driftRate * focusTopY - driftRate * this.viewport.y;
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
      const x = ((this.viewport.x / this.zoom) | 0) * this.zoom;
      const y = ((this.viewport.y / this.zoom) | 0) * this.zoom;
      const animFrame = ((Sprite.globalAnimIndex / 30) | 0) % 2;
      this.tileMap.draw(x, y, this.viewport.width, this.viewport.height, animFrame);
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
    for (let z = 0; z < 3; z++) {
      for (let i = 0; i < this.entities.length; i++) {
        const entity = this.entities.get(i);
        if (entity.zIndex === z && (!this.tileMap || this.tileMap.isVisible(entity.x, entity.y))) {
          entity.draw();
        }
      }
    }
  }

  private drawAnimations() {
    let blockingCount = 0;
    for (let i = 0; i < this.animations.length; i++) {
      const animation = this.animations[i];
      if (blockingCount === 0 || !animation.blocking) {
        animation.draw(this);
      }
      if (animation.blocking) {
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

    if (this.player.ai) {
      this.player.ai.doAi();
      this.player.ap = 0;
      return;
    }

    const mouse = this.app.mouse;
    if (mouse.down || mouse.dx !== 0 || mouse.dy !== 0) {
      this.cursor.x = ((this.viewport.x + mouse.x) / this.tileSize.width) | 0;
      this.cursor.y = ((this.viewport.y + mouse.y) / this.tileSize.height) | 0;
    }

    if (this.app.isKeyDown(Keys.VK_SHIFT)) {
      let dx = 0;
      let dy = 0;
      if (this.app.isDownLeftKeyPressed()) {
        dx = -1;
        dy = 1
      }
      if (this.app.isDownKeyPressed()) {
        dy = 1;
      }
      if (this.app.isDownRightKeyPressed()) {
        dx = 1;
        dy = 1;
      }
      if (this.app.isLeftKeyPressed()) {
        dx = -1;
      }
      if (this.app.isRightKeyPressed()) {
        dx = 1;
      }
      if (this.app.isUpLeftKeyPressed()) {
        dx = -1;
        dy = -1;
      }
      if (this.app.isUpKeyPressed()) {
        dy = -1;
      }
      if (this.app.isUpRightKeyPressed()) {
        dx = 1;
        dy = -1;
      }
      this.viewportFocus.x -= dx * this.tileSize.height;
      this.viewportFocus.y -= dy * this.tileSize.height;
      return;
    }

    if (this.isTargeting()) {
      if (this.app.isKeyPressed(Keys.VK_ENTER) || this.app.mouse.isClicked()) {
        this.endTargeting();
      }
      if (this.app.isKeyPressed(Keys.VK_ESCAPE)) {
        this.cancelTargeting();
      }
      if (this.app.isDownLeftKeyPressed()) {
        this.cursor.x--;
        this.cursor.y++;
      }
      if (this.app.isDownKeyPressed()) {
        this.cursor.y++;
      }
      if (this.app.isDownRightKeyPressed()) {
        this.cursor.x++;
        this.cursor.y++;
      }
      if (this.app.isLeftKeyPressed()) {
        this.cursor.x--;
      }
      if (this.app.isRightKeyPressed()) {
        this.cursor.x++;
      }
      if (this.app.isUpLeftKeyPressed()) {
        this.cursor.x--;
        this.cursor.y--;
      }
      if (this.app.isUpKeyPressed()) {
        this.cursor.y--;
      }
      if (this.app.isUpRightKeyPressed()) {
        this.cursor.x++;
        this.cursor.y--;
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

    if (nextStep) {
      const dx = nextStep.x - this.player.x;
      const dy = nextStep.y - this.player.y;
      if (!this.tryMoveOrAttack(dx, dy)) {
        this.stopAutoWalk();
      }
      return;
    }

    if (this.app.isDownLeftKeyPressed() && this.tryMoveOrAttack(-1, 1)) {
      return;
    }
    if (this.app.isDownKeyPressed() && this.tryMoveOrAttack(0, 1)) {
      return;
    }
    if (this.app.isDownRightKeyPressed() && this.tryMoveOrAttack(1, 1)) {
      return;
    }
    if (this.app.isLeftKeyPressed() && this.tryMoveOrAttack(-1, 0)) {
      return;
    }
    if (this.app.isRightKeyPressed() && this.tryMoveOrAttack(1, 0)) {
      return;
    }
    if (this.app.isUpLeftKeyPressed() && this.tryMoveOrAttack(-1, -1)) {
      return;
    }
    if (this.app.isUpKeyPressed() && this.tryMoveOrAttack(0, -1)) {
      return;
    }
    if (this.app.isUpRightKeyPressed() && this.tryMoveOrAttack(1, -1)) {
      return;
    }
    if (this.app.isWaitKeyPressed()) {
      this.player.ap = 0;
    }
  }

  /**
   * Tries to move or attack in the specified direction.
   * Returns true on success (the player moved or attacked).
   * Returns false on failure (unable to move or attack).
   * @param dx The x direction to move.
   * @param dy The y direction to move.
   */
  tryMoveOrAttack(dx: number, dy: number) {
    const player = this.player;
    if (!player) {
      return false;
    }

    const destX = player.x + dx;
    const destY = player.y + dy;

    for (let i = 0; i < this.entities.length; i++) {
      const other = this.entities.get(i);
      if (player !== other && other.x === destX && other.y === destY) {
        if (this.path) {
          // Autowalking...
          if (!(other instanceof Actor)) {
            // If it's not an actor (i.e., item or stairs), pick it up and carry on
            return other.onBump(player);
          }
          if (this.pathIndex === 1) {
            this.stopAutoWalk();
            return other.onBump(player);
          }
          // Otherwise stop and make player confirm
          this.stopAutoWalk();
          return true;
        }

        // Otherwise, this is keyboard input, so go ahead and bump
        return other.onBump(player);
      }
    }

    return player.move(dx, dy);
  }

  private recalculateViewportFocus() {
    const player = this.player;
    if (!player) {
      return;
    }

    const map = this.tileMap;
    if (!map) {
      return;
    }

    const tileWidth = this.tileSize.width;
    const tileHeight = this.tileSize.height;

    let visibleMinX = player.x * tileWidth;
    let visibleMinY = player.y * tileHeight;
    let visibleMaxX = (player.x + 1) * tileWidth;
    let visibleMaxY = (player.y + 1) * tileHeight;

    // Find the bounds of the visible area.
    for (let y = player.y - this.verticalViewDistance; y <= player.y + this.verticalViewDistance; y++) {
      for (let x = player.x - this.horizontalViewDistance; x <= player.x + this.horizontalViewDistance; x++) {
        if (map.isVisible(x, y)) {
          visibleMinX = Math.min(visibleMinX, x * tileWidth);
          visibleMinY = Math.min(visibleMinY, y * tileHeight);
          visibleMaxX = Math.max(visibleMaxX, (x + 1) * tileWidth);
          visibleMaxY = Math.max(visibleMaxY, (y + 1) * tileHeight);
        }
      }
    }

    // Find the bounds of desired area
    // Ignore Actor.offset, because we're jumping to the destination.
    let minX = player.x * tileWidth;
    let minY = player.y * tileHeight;
    let maxX = minX + tileWidth;
    let maxY = minY + tileHeight;

    if (this.path) {
      // If there is an auto-walk path, use that
      for (let i = this.pathIndex; i < this.path.length; i++) {
        const pathTile = this.path[i];
        minX = Math.min(minX, pathTile.x * tileWidth);
        minY = Math.min(minY, pathTile.y * tileHeight);
        maxX = Math.max(maxX, (pathTile.x + 1) * tileWidth);
        maxY = Math.max(maxY, (pathTile.y + 1) * tileHeight);
      }
    } else {
      // Otherwise, use all visible entities.
      for (let i = 0; i < this.entities.length; i++) {
        const entity = this.entities.get(i);
        if (entity instanceof Actor && map.isVisible(entity.x, entity.y)) {
          minX = Math.min(minX, entity.x * tileWidth);
          minY = Math.min(minY, entity.y * tileHeight);
          maxX = Math.max(maxX, (entity.x + 1) * tileWidth);
          maxY = Math.max(maxY, (entity.y + 1) * tileHeight);
        }
      }
    }

    // Find the center of the bounds of all visible actors

    if ((visibleMaxX - visibleMinX) <= this.viewport.width) {
      // The entire visible range fits in the viewport, so center it
      this.viewportFocus.x = Math.round((visibleMinX + visibleMaxX) / 2.0);
    } else {
      // The visible range goes beyond, so focus on entities or path
      this.viewportFocus.x = Math.round((minX + maxX) / 2.0);
    }

    if ((visibleMaxY - visibleMinY) <= this.viewport.height) {
      // The entire visible range fits in the viewport, so center it
      this.viewportFocus.y = Math.round((visibleMinY + visibleMaxY) / 2.0);
    } else {
      // The visible range goes beyond, so focus on entities or path
      this.viewportFocus.y = Math.round((minY + maxY) / 2.0);
    }
  }

  private doAi(entity: Actor) {
    if (!entity.ai) {
      // No AI - do nothing
      entity.ap = 0;
      return;
    }

    if (entity.visibleDuration > 0 || entity.ai.alwaysActive) {
      entity.ai.doAi();
    }

    entity.ap = 0;
  }

  private nextTurn() {
    if (this.turnIndex < this.entities.length) {
      const currEntity = this.entities.get(this.turnIndex);
      currEntity.endTurn();

      if (this.player === currEntity) {
        this.recomputeFov();
      }
    }

    this.turnIndex++;
    if (this.turnIndex >= this.entities.length) {
      this.turnIndex = 0;
    }

    if (this.turnIndex >= 0 && this.turnIndex < this.entities.length) {
      const nextEntity = this.entities.get(this.turnIndex);
      nextEntity.startTurn();

      if (this.player === nextEntity) {
        this.recalculateViewportFocus();
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
      const other = this.entities.get(i);
      if (other.blocks && other.x === x && other.y === y) {
        return true;
      }
    }
    return false;
  }

  getEntityAt(x: number, y: number) {
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities.get(i);
      if (entity.x === x && entity.y === y) {
        return entity;
      }
    }
    return undefined;
  }

  getActorAt(x: number, y: number) {
    for (let i = 0; i < this.entities.length; i++) {
      const other = this.entities.get(i);
      if (other instanceof Actor && other.x === x && other.y === y) {
        return other;
      }
    }
    return undefined;
  }

  recomputeFov() {
    if (!this.player || !this.tileMap) {
      // FOV requires a player and a tile map
      return;
    }

    this.tileMap.computeFov(this.player.x, this.player.y, this.horizontalViewDistance, this.verticalViewDistance);

    // Determine which entities are visible
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities.get(i);
      if (entity === this.player) {
        continue;
      }
      if (!(entity instanceof Actor)) {
        continue;
      }
      if (this.tileMap.isVisible(entity.x, entity.y)) {
        if (!entity.seen) {
          // Spotted a new entity, stop auto walking
          entity.seen = true;
          this.player.addFloatingText('!', Colors.WHITE);
          this.stopAutoWalk();

          this.viewportFocus.x = ((this.player.centerPixelX + entity.centerPixelX) / 2) | 0;
          this.viewportFocus.y = ((this.player.centerPixelY + entity.centerPixelY) / 2) | 0;
        }
        entity.visibleDuration++;
      } else {
        entity.visibleDuration = -1;
      }
    }
  }
}
