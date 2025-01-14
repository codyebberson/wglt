import {
  AppState,
  ArrayList,
  Color,
  Component,
  GUI,
  Message,
  MessageLog,
  Point,
  RNG,
  Rect,
  Sprite,
  TileMap,
  TileMapCell,
  TileMapRenderer,
  computePath,
} from 'wglt';
import { Ability, TargetType } from './ability';
import { Actor } from './actor';
import { Animation } from './animations/animation';
import { App } from './app';
import { Entity } from './entity';
import { Item } from './item';
import { Palette } from './palette';
import { Sprites } from './sprites';

const DEFAULT_MAP_SIZE = new Rect(0, 0, 256, 256);
const DEFAULT_MAP_LAYERS = 1;
const DEFAULT_TILE_WIDTH = 16;
const DEFAULT_TILE_HEIGHT = 16;
const DEFAULT_VIEW_DISTANCE = 13;

export class Game extends AppState<App> {
  readonly viewport: Rect;
  readonly viewportFocus: Point;
  readonly focusMargins: Point;
  readonly animations: Animation[];
  readonly entities: ArrayList<Entity>;
  readonly cursor: Point;
  readonly rng: RNG;
  readonly damageColor: Color;
  readonly healColor: Color;
  turnIndex: number;
  blocked: boolean;
  messageLog?: MessageLog;
  targetAbility?: Ability;
  targetCallback?: () => void;
  targetTile?: TileMapCell;
  path?: TileMapCell[];
  pathIndex: number;
  onUpdate?: () => void;
  tileMap: TileMap;
  tileMapRenderer: TileMapRenderer;
  player?: Actor;
  tooltipElement?: Component;
  horizontalViewDistance: number;
  verticalViewDistance: number;
  zoom: number;

  constructor(
    app: App,
    readonly gui: GUI<App>
  ) {
    const options = {
      tileSize: new Rect(0, 0, 16, 16),
      mapSize: new Rect(0, 0, 60, 40),
      mapLayers: 3,
      horizontalViewDistance: 8,
      verticalViewDistance: 4,
      focusMargins: new Point(32, 32),
    };

    super(app);
    this.viewport = new Rect(0, 0, app.size.width, app.size.height);
    this.viewportFocus = new Point(0, 0);
    this.focusMargins = options.focusMargins || new Point(0, 0);
    this.animations = [];
    this.entities = new ArrayList<Entity>();
    this.turnIndex = 0;
    this.blocked = false;
    this.cursor = new Point(-1, -1);
    this.rng = new RNG();
    this.pathIndex = 0;
    this.horizontalViewDistance = DEFAULT_VIEW_DISTANCE;
    this.verticalViewDistance = DEFAULT_VIEW_DISTANCE;
    this.zoom = 1.0;
    this.damageColor = Palette.RED;
    this.healColor = Palette.GREEN;

    if (options.horizontalViewDistance) {
      this.horizontalViewDistance = options.horizontalViewDistance;
    }
    if (options.verticalViewDistance) {
      this.verticalViewDistance = options.verticalViewDistance;
    }

    const mapSize = options.mapSize || DEFAULT_MAP_SIZE;
    const mapLayers = options.mapLayers || DEFAULT_MAP_LAYERS;
    const tileSize = options.tileSize || new Rect(0, 0, DEFAULT_TILE_WIDTH, DEFAULT_TILE_HEIGHT);
    this.tileMap = new TileMap(mapSize.width, mapSize.height, mapLayers, tileSize);
    this.tileMapRenderer = new TileMapRenderer(app.gl, this.tileMap);
  }

  get tileSize() {
    return this.tileMap.tileSize;
  }

  log(message: string | Message, color?: Color) {
    if (this.messageLog) {
      this.messageLog.addMessage(message, color);
    }
  }

  addAnimation(animation: Animation): Animation {
    this.animations.push(animation);
    return animation;
  }

  update() {
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
        this.animations[i].callback?.();
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
          }
          this.doAi(currEntity);
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
    if (this.app.renderSet.spriteTexture.loaded) {
      const x = ((this.viewport.x / this.zoom) | 0) * this.zoom;
      const y = ((this.viewport.y / this.zoom) | 0) * this.zoom;
      const animFrame = ((Sprite.globalAnimIndex / 30) | 0) % 2;
      this.tileMapRenderer.draw(x, y, this.viewport.width, this.viewport.height, animFrame);
    }
  }

  private drawTargeting() {
    if (this.isTargeting()) {
      const x = this.cursor.x * this.tileMap.tileSize.width - this.viewport.x;
      const y = this.cursor.y * this.tileMap.tileSize.height - this.viewport.y;
      Sprites.TARGET.draw(this.app, x, y);
    }
  }

  private drawEntities() {
    for (let z = 0; z < 3; z++) {
      for (let i = 0; i < this.entities.length; i++) {
        const entity = this.entities.get(i);
        if (entity.zIndex === z && this.tileMap.isVisible(entity.x, entity.y)) {
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

  startTargeting(ability: Ability, callback?: () => void) {
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
      } else if (targetType === TargetType.TILE) {
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
    if (mouse.buttons.get(0).down || mouse.dx !== 0 || mouse.dy !== 0) {
      this.cursor.x = ((this.viewport.x + mouse.x) / this.tileMap.tileSize.width) | 0;
      this.cursor.y = ((this.viewport.y + mouse.y) / this.tileMap.tileSize.height) | 0;
    }

    const moveKey = this.app.keyboard.getMovementKey();

    if (this.app.keyboard.isShiftKeyPressed() && moveKey) {
      this.viewportFocus.x -= moveKey.x * this.tileMap.tileSize.height;
      this.viewportFocus.y -= moveKey.y * this.tileMap.tileSize.height;
      return;
    }

    if (this.isTargeting()) {
      if (this.app.keyboard.isEnterKeyPressed() || this.app.mouse.isClicked()) {
        this.endTargeting();
      }
      if (this.app.keyboard.isEscapeKeyPressed()) {
        this.cancelTargeting();
      }
      if (moveKey) {
        this.cursor.x += moveKey.x;
        this.cursor.y += moveKey.y;
      }
      return;
    }

    if (mouse.isClicked()) {
      const tx = ((this.viewport.x + mouse.x) / this.tileMap.tileSize.width) | 0;
      const ty = ((this.viewport.y + mouse.y) / this.tileMap.tileSize.height) | 0;
      if (this.player.x === tx && this.player.y === ty) {
        this.player.ap = 0;
        return;
      }
      const target = this.tileMap.getCell(tx, ty);
      if (target && target !== this.targetTile) {
        this.targetTile = target;
        this.path = computePath(this.tileMap, this.player, this.targetTile, 100);
        this.pathIndex = 0;
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

    if (moveKey) {
      this.tryMoveOrAttack(moveKey.x, moveKey.y);
    }
  }

  /**
   * Tries to move or attack in the specified direction.
   * Returns true on success (the player moved or attacked).
   * Returns false on failure (unable to move or attack).
   * @param dx The x direction to move.
   * @param dy The y direction to move.
   * @returns True if the player moved or attacked, false otherwise.
   */
  tryMoveOrAttack(dx: number, dy: number): boolean {
    const player = this.player;
    if (!player) {
      return false;
    }

    if (dx === 0 && dy === 0) {
      player.ap = 0;
      return false;
    }

    const destX = player.x + dx;
    const destY = player.y + dy;

    // Check for blocking actors
    // If there is a blocking actor, either bump or stop
    for (let i = 0; i < this.entities.length; i++) {
      const other = this.entities.get(i);
      if (other.blocks && player !== other && other.x === destX && other.y === destY) {
        if (this.path) {
          // Autowalking...
          if (this.pathIndex === 1) {
            // If this is the first stop, go ahead and bump
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

    // Check for items
    // There may be multiple items on a tile
    // If there are items, pick them up
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const other = this.entities.get(i);
      if (other instanceof Item && !other.blocks && other.x === destX && other.y === destY) {
        player.pickup(other);
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
    const tileWidth = map.tileSize.width;
    const tileHeight = map.tileSize.height;

    let visibleMinX = player.x * tileWidth;
    let visibleMinY = player.y * tileHeight;
    let visibleMaxX = (player.x + 1) * tileWidth;
    let visibleMaxY = (player.y + 1) * tileHeight;

    // Find the bounds of the visible area.
    for (
      let y = player.y - this.verticalViewDistance;
      y <= player.y + this.verticalViewDistance;
      y++
    ) {
      for (
        let x = player.x - this.horizontalViewDistance;
        x <= player.x + this.horizontalViewDistance;
        x++
      ) {
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

    if (visibleMaxX - visibleMinX <= this.viewport.width - 2 * this.focusMargins.x) {
      // The entire visible range fits in the viewport, so center it
      this.viewportFocus.x = Math.round((visibleMinX + visibleMaxX) / 2.0);
    } else {
      // The visible range goes beyond, so focus on entities or path
      this.viewportFocus.x = Math.round((minX + maxX) / 2.0);
    }

    if (visibleMaxY - visibleMinY <= this.viewport.height - 2 * this.focusMargins.y) {
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
    if (this.tileMap.isBlocked(x, y)) {
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

  getClosestMonster(x: number, y: number, range: number) {
    let minDist = range + 1;
    let result = undefined;
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities.get(i);
      if (entity instanceof Actor && entity !== this.player) {
        const dist = entity.distance(x, y);
        if (dist < minDist) {
          minDist = dist;
          result = entity;
        }
      }
    }
    return result;
  }

  recomputeFov() {
    if (!this.player) {
      // FOV requires a player and a tile map
      return;
    }

    this.tileMap.computeFov(this.player.x, this.player.y, this.horizontalViewDistance);
    this.tileMap.updateExplored();
    this.tileMap.dirty = true;

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
          this.player.addFloatingText('!', Palette.WHITE);
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
