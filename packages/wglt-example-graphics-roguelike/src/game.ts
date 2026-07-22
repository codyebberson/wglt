import {
  AppState,
  ArrayList,
  type Color,
  Component,
  computePath,
  GraphicsApp,
  GUI,
  Message,
  MessageLog,
  Rect,
  RNG,
  Sprite,
  TileMap,
  TileMapCell,
  TileMapRenderer,
  Vec2,
} from 'wglt';
import { type Ability, TargetType } from './ability';
import { Actor } from './actor';
import { Player } from './actors/player';
import { Animation } from './animations/animation';
import { Entity } from './entity';
import { Item } from './item';
import { Palette } from './palette';
import { Sprites } from './sprites';

const MAP_WIDTH = 60;
const MAP_HEIGHT = 40;
const TILE_SIZE = 16;
const VIEW_DISTANCE = 16;

export class Game extends AppState<GraphicsApp> {
  readonly gui: GUI<GraphicsApp>;
  readonly viewport: Rect;
  readonly animations: Animation[];
  readonly entities: ArrayList<Entity>;
  readonly cursor: Vec2;
  readonly rng: RNG;
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
  player?: Player;
  tooltipElement?: Component;

  constructor(app: GraphicsApp, gui: GUI<GraphicsApp>) {
    super(app);
    this.gui = gui;
    this.viewport = new Rect(0, 0, app.width, app.height);
    this.animations = [];
    this.entities = new ArrayList<Entity>();
    this.turnIndex = 0;
    this.blocked = false;
    this.cursor = new Vec2(-1, -1);
    this.rng = new RNG();
    this.pathIndex = 0;
    this.tileMap = new TileMap(MAP_WIDTH, MAP_HEIGHT, 3, new Rect(0, 0, TILE_SIZE, TILE_SIZE));
    this.tileMapRenderer = new TileMapRenderer(app, this.tileMap);
  }

  get tileSize(): Rect {
    return this.tileMap.tileSize;
  }

  isPlayer(entity: Entity): boolean {
    return entity === this.player;
  }

  log(message: string | Message, color?: Color): void {
    if (this.messageLog) {
      this.messageLog.addMessage(message, color);
    }
  }

  addAnimation(animation: Animation): Animation {
    this.animations.push(animation);
    return animation;
  }

  update(): void {
    if (!this.gui.handleInput()) {
      this.updateAnimations();
      this.updateEntities();

      if (this.onUpdate) {
        this.onUpdate();
      }

      this.updateViewport();
    }

    this.drawTileMap();
    this.drawTargeting();
    this.drawEntities();
    this.drawAnimations();
    this.gui.draw();
  }

  private updateAnimations(): void {
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

  private updateEntities(): void {
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

  resetViewport(): void {
    if (!this.player) {
      return;
    }
    this.viewport.x = this.player.x * TILE_SIZE - ((this.app.width / 2) | 0);
    this.viewport.y = this.player.y * TILE_SIZE - ((this.app.height / 2) | 0);
  }

  private updateViewport(): void {
    this.viewport.width = this.app.width;
    this.viewport.height = this.app.height;

    const mouse = this.app.mouse;
    if (mouse.isDragging()) {
      this.viewport.x -= mouse.dx;
      this.viewport.y -= mouse.dy;
    } else if (this.player) {
      // Convert player position to pixel position
      const px = this.player.centerPixelX;
      const py = this.player.centerPixelY;

      // Calculate margins, 1/4 of the screen size
      const mx = Math.round(this.viewport.width / 4);
      const my = Math.round(this.viewport.height / 4);

      if (px - mx < this.viewport.x) {
        this.viewport.x = px - mx;
      }

      if (py - my < this.viewport.y) {
        this.viewport.y = py - my;
      }

      if (px + mx > this.viewport.x + this.viewport.width) {
        this.viewport.x = px + mx - this.viewport.width;
      }

      if (py + my > this.viewport.y + this.viewport.height) {
        this.viewport.y = py + my - this.viewport.height;
      }
    }
  }

  private drawTileMap(): void {
    const x = this.viewport.x | 0;
    const y = this.viewport.y | 0;
    const animFrame = ((Sprite.globalAnimIndex / 30) | 0) % 2;
    this.tileMapRenderer.draw(x, y, this.viewport.width, this.viewport.height, animFrame);
  }

  private drawTargeting(): void {
    if (this.isTargeting()) {
      const x = this.cursor.x * this.tileMap.tileSize.width - this.viewport.x;
      const y = this.cursor.y * this.tileMap.tileSize.height - this.viewport.y;
      Sprites.TARGET.draw(this.app, x, y);
    }
  }

  private drawEntities(): void {
    for (let z = 0; z < 3; z++) {
      for (let i = 0; i < this.entities.length; i++) {
        const entity = this.entities.get(i);
        if (entity.zIndex === z && this.tileMap.isVisible(entity.x, entity.y)) {
          entity.draw();
        }
      }
    }
  }

  private drawAnimations(): void {
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

  isTargeting(): boolean {
    return !!this.targetAbility;
  }

  startTargeting(ability: Ability, callback?: () => void): void {
    this.targetAbility = ability;
    this.targetCallback = callback;
    if (this.player) {
      this.cursor.x = this.player.x;
      this.cursor.y = this.player.y;
    }
  }

  private endTargeting(): void {
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

  cancelTargeting(): void {
    this.targetAbility = undefined;
    this.targetCallback = undefined;
  }

  private handlePlayerInput(): void {
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
      this.viewport.x -= moveKey.x * this.tileMap.tileSize.height;
      this.viewport.y -= moveKey.y * this.tileMap.tileSize.height;
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

  private doAi(entity: Actor): void {
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

  private nextTurn(): void {
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
    }
  }

  stopAutoWalk(): void {
    this.path = undefined;
    this.targetTile = undefined;
  }

  isBlocked(x: number, y: number): boolean {
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

  getEntityAt(x: number, y: number): Entity | undefined {
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities.get(i);
      if (entity.x === x && entity.y === y) {
        return entity;
      }
    }
    return undefined;
  }

  getActorAt(x: number, y: number): Actor | undefined {
    for (let i = 0; i < this.entities.length; i++) {
      const other = this.entities.get(i);
      if (other instanceof Actor && other.x === x && other.y === y) {
        return other;
      }
    }
    return undefined;
  }

  getClosestMonster(x: number, y: number, range: number): Actor | undefined {
    let minDist = range + 1;
    let result: Actor | undefined;
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

  recomputeFov(): void {
    if (!this.player) {
      // FOV requires a player and a tile map
      return;
    }

    this.tileMap.computeFov(this.player.x, this.player.y, VIEW_DISTANCE);
    this.tileMap.updateExplored();

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
        }
        entity.visibleDuration++;
      } else {
        entity.visibleDuration = -1;
      }
    }
  }
}
