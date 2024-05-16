import { ArrayList } from '../core/arraylist';
import { AppState } from '../core/baseapp';
import { Color } from '../core/color';
import { GUI } from '../core/gui/gui';
import { Panel } from '../core/gui/panel';
import { TooltipDialog } from '../core/gui/tooltipdialog';
import { Key } from '../core/keys';
import { Message } from '../core/message';
import { SimplePalette } from '../core/palettes/simple';
import { Rect } from '../core/rect';
import { RNG } from '../core/rng';
import { Vec2 } from '../core/vec2';
import { GraphicsApp } from '../graphics/graphicsapp';
import { GraphicsDialogRenderer } from '../graphics/gui/dialogrenderer';
import { MessageLog } from '../graphics/gui/messagelog';
import { Sprite } from '../graphics/sprite';
import { Ability, TargetType } from './ability';
import { Actor } from './actor';
import { Animation } from './animations/animation';
import { FadeInAnimation } from './animations/fadeinanimation';
import { FadeOutAnimation } from './animations/fadeoutanimation';
import { Entity } from './entity';
import { Item } from './item';
import { computePath } from './tilemap/path';
import { TileMap } from './tilemap/tilemap';
import { TileMapCell } from './tilemap/tilemapcell';
import { TileMapRenderer } from './tilemap/tilemaprenderer';

const MAP_SIZE = new Rect(0, 0, 512, 512);
const MAP_LAYERS = 4;
const TILE_WIDTH = 16;
const TILE_HEIGHT = 16;
const VIEW_DISTANCE = 8;

const SPRITE_WIDTH = 16;
const SPRITE_HEIGHT = 16;

const TARGET_SPRITE = new Sprite(16, 40, SPRITE_WIDTH, SPRITE_HEIGHT);

export abstract class BaseGame extends AppState {
  readonly gui: GUI;
  readonly viewport: Rect;
  readonly animations: Animation[];
  readonly entities: ArrayList<Entity>;
  readonly cursor: Vec2;
  readonly tooltip: TooltipDialog;
  readonly rng: RNG;
  readonly damageColor: Color;
  readonly healColor: Color;
  turnIndex: number;
  blocked: boolean;
  messageLog?: MessageLog;
  targetAbility?: Ability;
  targetCallback?: () => void;
  targetSprite?: Sprite;
  targetTile?: TileMapCell;
  path?: TileMapCell[];
  pathIndex: number;
  onUpdate?: () => void;
  tileMap: TileMap;
  tileMapRenderer: TileMapRenderer;
  player?: Actor;
  cooldownSprite?: Sprite;
  tooltipElement?: Panel;
  horizontalViewDistance: number;
  verticalViewDistance: number;
  zoom: number;
  readonly screenShakeOffset: Vec2;
  screenShakeCountdown: number;

  constructor(app: GraphicsApp, seed: number) {
    super(app);
    this.gui = new GUI(
      app,
      new GraphicsDialogRenderer(
        new Rect(0, 32, 48, 48),
        new Rect(0, 32, 48, 48),
        new Rect(48, 32, 24, 24)
      )
    );
    this.viewport = new Rect(0, 0, app.size.width, app.size.height);
    this.animations = [];
    this.entities = new ArrayList<Entity>();
    this.turnIndex = 0;
    this.blocked = false;
    this.cursor = new Vec2(-1, -1);
    this.tooltip = new TooltipDialog();
    this.rng = new RNG();
    this.pathIndex = 0;
    this.horizontalViewDistance = VIEW_DISTANCE;
    this.verticalViewDistance = VIEW_DISTANCE;
    this.zoom = 1.0;
    this.damageColor = SimplePalette.RED;
    this.healColor = SimplePalette.GREEN;
    this.screenShakeOffset = new Vec2(0, 0);
    this.screenShakeCountdown = 0;

    const mapSize = MAP_SIZE;
    const mapLayers = MAP_LAYERS;
    const tileSize = new Rect(0, 0, TILE_WIDTH, TILE_HEIGHT);
    this.tileMap = new TileMap(mapSize.width, mapSize.height, mapLayers, tileSize);
    this.tileMapRenderer = new TileMapRenderer(app.gl, this.tileMap);

    this.rng.setSeed(seed);

    this.targetSprite = TARGET_SPRITE;
    this.cooldownSprite = new Sprite(192, 16, 16, 16, 24);
    // this.gui.renderer.baseRect = new Rect(0, 32, 48, 48);
    // this.gui.renderer.buttonSlotRect = new Rect(48, 32, 24, 24);
  }

  get tileSize(): Rect {
    return this.tileMap.tileSize;
  }

  log(message: string | Message, color?: Color): void {
    if (this.messageLog) {
      this.messageLog.addMessage(message, color);
    }
  }

  addAnimation(animation: Animation): void {
    this.animations.push(animation);
  }

  update(): void {
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

    if (this.screenShakeCountdown > 0) {
      this.screenShakeOffset.x = this.rng.nextRange(-2, 2);
      this.screenShakeOffset.y = this.rng.nextRange(-2, 2);
      this.screenShakeCountdown--;
    } else {
      this.screenShakeOffset.x = 0;
      this.screenShakeOffset.y = 0;
    }

    this.drawTileMap();

    if (this.zoom === 1.0) {
      this.drawTargeting();
      this.drawEntities();
      this.drawAnimations();
    }

    this.gui.draw();
  }

  private updateTooltip(): void {
    if (this.gui.dragElement) {
      // No tooltips while drag/drop
      this.tooltip.visible = false;
      return;
    }

    if (!this.tooltip.visible) {
      this.tooltipElement = undefined;
    }

    const mouse = this.app.mouse;
    if (!mouse.buttons.get(0).down && (mouse.dx !== 0 || mouse.dy !== 0)) {
      const hoverPanel = this.gui.getPanelAt(mouse);
      if (this.tooltipElement !== hoverPanel) {
        // Hover element has changed
        this.tooltipElement = hoverPanel;
        if (hoverPanel) {
          hoverPanel.updateTooltip(this.tooltip);
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
      }
    }
  }

  private updateZoom(): void {
    if (this.app.mouse.wheelDeltaY !== 0) {
      const center = this.viewport.getCenter();

      if (this.app.mouse.wheelDeltaY > 0) {
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
        this.animations[i].onDone?.();
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
    for (let i = 0; i < this.entities.length; i++) {
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
    this.viewport.x = this.player.centerPixelX - ((this.app.size.width / this.zoom / 2) | 0);
    this.viewport.y = this.player.centerPixelY - ((this.app.size.height / this.zoom / 2) | 0);
  }

  private updateViewport(): void {
    this.viewport.width = this.app.size.width / this.zoom;
    this.viewport.height = this.app.size.height / this.zoom;

    const mouse = this.app.mouse;
    if (mouse.isDragging()) {
      this.viewport.x -= mouse.dx / this.zoom;
      this.viewport.y -= mouse.dy / this.zoom;
    } else if (
      !this.app.isKeyDown(Key.VK_CONTROL_LEFT) &&
      !this.app.isKeyDown(Key.VK_CONTROL_RIGHT)
    ) {
      const player = this.player as Actor;
      const viewportX_25 = this.viewport.x + ((this.viewport.width * 0.25) | 0);
      const viewportX_75 = this.viewport.x + ((this.viewport.width * 0.75) | 0);
      const viewportY_25 = this.viewport.y + ((this.viewport.height * 0.25) | 0);
      const viewportY_75 = this.viewport.y + ((this.viewport.height * 0.75) | 0);
      const scrollSpeed = 0.2;
      if (player.centerPixelX < viewportX_25) {
        this.viewport.x -= Math.round(scrollSpeed * (viewportX_25 - player.centerPixelX));
      }
      if (player.centerPixelX > viewportX_75) {
        this.viewport.x += Math.round(scrollSpeed * (player.centerPixelX - viewportX_75));
      }
      if (player.centerPixelY < viewportY_25) {
        this.viewport.y -= Math.round(scrollSpeed * (viewportY_25 - player.centerPixelY));
      }
      if (player.centerPixelY > viewportY_75) {
        this.viewport.y += Math.round(scrollSpeed * (player.centerPixelY - viewportY_75));
      }
    }
  }

  private drawTileMap(): void {
    if ((this.app as GraphicsApp).renderSet.spriteTexture.loaded) {
      const x = ((this.viewport.x / this.zoom) | 0) * this.zoom - this.screenShakeOffset.x;
      const y = ((this.viewport.y / this.zoom) | 0) * this.zoom - this.screenShakeOffset.y;
      const animFrame = ((Sprite.globalAnimIndex / 30) | 0) % 2;
      this.tileMapRenderer.draw(x, y, this.viewport.width, this.viewport.height, animFrame);
    }
  }

  private drawTargeting(): void {
    if (this.isTargeting() && this.targetSprite) {
      const x =
        this.cursor.x * this.tileMap.tileSize.width - this.viewport.x + this.screenShakeOffset.x;
      const y =
        this.cursor.y * this.tileMap.tileSize.height - this.viewport.y + this.screenShakeOffset.x;
      this.targetSprite.draw(this.app, x, y);
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

    if (this.app.isKeyDown(Key.VK_CONTROL_LEFT) || this.app.isKeyDown(Key.VK_CONTROL_RIGHT)) {
      let dx = 0;
      let dy = 0;
      if (this.app.isDownLeftKeyPressed()) {
        dx = -1;
        dy = 1;
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
      this.viewport.x += dx * this.tileMap.tileSize.height;
      this.viewport.y += dy * this.tileMap.tileSize.height;
      return;
    }

    if (this.isTargeting()) {
      if (
        this.app.isKeyPressed(Key.VK_ENTER) ||
        this.app.isKeyPressed(Key.VK_NUMPAD_ENTER) ||
        this.app.mouse.isClicked()
      ) {
        this.endTargeting();
      }
      if (this.app.isKeyPressed(Key.VK_ESCAPE)) {
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
      const tx = ((this.viewport.x + mouse.x) / this.tileMap.tileSize.width) | 0;
      const ty = ((this.viewport.y + mouse.y) / this.tileMap.tileSize.height) | 0;
      const target = this.tileMap.getCell(tx, ty);
      if (target && target !== this.targetTile) {
        this.targetTile = target;
        this.path = computePath(this.tileMap, this.player, this.targetTile);
        this.pathIndex = 0;
      }
    }

    if (this.app.isKeyPressed(Key.VK_X)) {
      // Explore
      this.path = computePath(this.tileMap, this.player, new Vec2(256, 0), 1000);
      this.pathIndex = 0;
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
  tryMoveOrAttack(dx: number, dy: number): boolean {
    const player = this.player;
    if (!player) {
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

  recomputeFov(): void {
    if (!this.player) {
      // FOV requires a player and a tile map
      return;
    }

    this.tileMap.computeFov(
      this.player.x,
      this.player.y,
      this.horizontalViewDistance,
      this.verticalViewDistance
    );

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
          this.player.addFloatingText('!', SimplePalette.WHITE);
          this.stopAutoWalk();
        }
        entity.visibleDuration++;
      } else {
        entity.visibleDuration = -1;
      }
    }
  }

  hideAllDialogs(): void {
    // this.inventoryDialog.visible = false;
    // this.characterDialog.visible = false;
    // this.talentsDialog.visible = false;
  }

  warpToPoint(point: Vec2): void {
    this.addAnimation(
      new FadeOutAnimation(30, () => {
        if (this.player) {
          this.player.x = point.x;
          this.player.y = point.y;
        }
        this.stopAutoWalk();
        this.resetViewport();
        this.recomputeFov();
        this.addAnimation(new FadeInAnimation(30));
      })
    );
  }

  findFreeTile(x0: number, y0: number, maxDistance: number): Vec2 | undefined {
    for (let r = 0; r <= maxDistance; r += 0.5) {
      const r2 = Math.ceil(r);
      for (let y = y0 - r2; y <= y0 + r2; y++) {
        for (let x = x0 - r2; x <= x0 + r2; x++) {
          if (Math.hypot(x - x0, y - y0) <= r) {
            if (!this.isBlocked(x, y) && !this.getEntityAt(x, y)) {
              return new Vec2(x, y);
            }
          }
        }
      }
    }
    return undefined;
  }

  save(): void {
    // TODO
  }
}
