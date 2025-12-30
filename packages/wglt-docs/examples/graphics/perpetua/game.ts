import type { Color } from 'wglt';
import {
  AppState,
  ArrayList,
  AutoRectRenderer,
  Button,
  ButtonSlot,
  computePath,
  Dialog,
  FONT_04B03,
  GraphicsButtonRenderer,
  GraphicsLabelRenderer,
  GraphicsMessageLogRenderer,
  GUI,
  Key,
  Label,
  Message,
  MessageLog,
  Panel,
  Pico8Palette,
  Point,
  Rect,
  RNG,
  SimplePalette,
  Sprite,
  TileMap,
  TileMapCell,
  TileMapRenderer,
} from 'wglt';
import type { Ability } from './ability';
import { TargetType } from './ability';
import { Actor } from './actor';
import type { AnimationFunction } from './animations/animation';
import { Animation } from './animations/animation';
import { FadeInAnimation } from './animations/fadeinanimation';
import { FadeOutAnimation } from './animations/fadeoutanimation';
import type { App } from './app';
import { Player } from './entities/player';
import { Entity } from './entity';
import { BottomPanel, BottomPanelRenderer } from './gui/bottompanel';
import { CharacterDialog } from './gui/characterdialog';
import { EntityFrames, EntityFramesRenderer } from './gui/entityframes';
import { ItemButton } from './gui/itembutton';
import { ItemContainerButtonSlot } from './gui/itemcontainerbuttonslot';
import { ItemContainerDialog } from './gui/itemcontainerdialog';
import { LevelUpDialog } from './gui/levelupdialog';
import { ShortcutBar, ShortcutBarRenderer } from './gui/shortcutbar';
import { ShortcutButtonSlot } from './gui/shortcutbuttonslot';
import { TalentButton } from './gui/talentbutton';
import { TalentsDialog } from './gui/talentsdialog';
import { Item } from './item';
import { HealthPotion } from './items/healthpotion';
import { Scroll } from './items/scroll';
import { MapGenerator } from './mapgen/mapgen';

const MAP_SIZE = new Rect(0, 0, 512, 512);
const MAP_LAYERS = 4;
const TILE_WIDTH = 16;
const TILE_HEIGHT = 16;
const VIEW_DISTANCE = 8;

const SPRITE_WIDTH = 16;
const SPRITE_HEIGHT = 16;

const TARGET_SPRITE = new Sprite(16, 40, SPRITE_WIDTH, SPRITE_HEIGHT);

const dialogSourceRect = new Rect(0, 32, 48, 48);
const fillSourceRect = new Rect(1008, 0, 16, 16);

export class Game extends AppState<App> {
  readonly gui: GUI;
  readonly viewport: Rect;
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
  targetSprite?: Sprite;
  targetTile?: TileMapCell;
  path?: TileMapCell[];
  pathIndex: number;
  onUpdate?: () => void;
  tileMap: TileMap;
  tileMapRenderer: TileMapRenderer;
  player?: Actor;
  cooldownSprite?: Sprite;
  horizontalViewDistance: number;
  verticalViewDistance: number;
  zoom: number;
  readonly screenShakeOffset: Point;
  screenShakeCountdown: number;

  private readonly mapGen: MapGenerator;
  inventoryDialog: ItemContainerDialog;
  talentsDialog: TalentsDialog;
  characterDialog: CharacterDialog;
  levelUpDialog: LevelUpDialog;

  constructor(app: App, seed: number) {
    // super(app, seed);

    super(app);
    this.gui = new GUI(app);
    this.viewport = new Rect(0, 0, app.width, app.height);
    this.animations = [];
    this.entities = new ArrayList<Entity>();
    this.turnIndex = 0;
    this.blocked = false;
    this.cursor = new Point(-1, -1);
    this.rng = new RNG();
    this.pathIndex = 0;
    this.horizontalViewDistance = VIEW_DISTANCE;
    this.verticalViewDistance = VIEW_DISTANCE;
    this.zoom = 1.0;
    this.damageColor = SimplePalette.RED;
    this.healColor = SimplePalette.GREEN;
    this.screenShakeOffset = new Point(0, 0);
    this.screenShakeCountdown = 0;

    const mapSize = MAP_SIZE;
    const mapLayers = MAP_LAYERS;
    const tileSize = new Rect(0, 0, TILE_WIDTH, TILE_HEIGHT);
    this.tileMap = new TileMap(mapSize.width, mapSize.height, mapLayers, tileSize);
    this.tileMapRenderer = new TileMapRenderer(app.gl, this.tileMap);

    this.rng.setSeed(seed);

    this.targetSprite = TARGET_SPRITE;
    this.cooldownSprite = new Sprite(192, 16, 16, 16, 24);

    const font = FONT_04B03;

    this.gui.renderers.set(BottomPanel, new BottomPanelRenderer());
    this.gui.renderers.set(EntityFrames, new EntityFramesRenderer());
    this.gui.renderers.set(Dialog, new AutoRectRenderer(dialogSourceRect));
    this.gui.renderers.set(ButtonSlot, new AutoRectRenderer(dialogSourceRect));
    this.gui.renderers.set(Panel, new AutoRectRenderer(dialogSourceRect));
    this.gui.renderers.set(Label, new GraphicsLabelRenderer(font));
    this.gui.renderers.set(Button, new GraphicsButtonRenderer(font));
    this.gui.renderers.set(TalentButton, new GraphicsButtonRenderer(font));
    this.gui.renderers.set(ShortcutBar, new ShortcutBarRenderer());
    this.gui.renderers.set(ShortcutButtonSlot, new AutoRectRenderer(dialogSourceRect));
    this.gui.renderers.set(MessageLog, new GraphicsMessageLogRenderer(2, font));
    this.gui.renderers.set(ItemContainerDialog, new AutoRectRenderer(dialogSourceRect));
    this.gui.renderers.set(ItemContainerButtonSlot, new AutoRectRenderer(dialogSourceRect));
    this.gui.renderers.set(ItemButton, new GraphicsButtonRenderer(font));

    this.mapGen = new MapGenerator(this);

    const player = new Player(this, 30, 20);
    this.player = player;
    this.entities.add(player);

    this.messageLog = new MessageLog(new Rect(1, 360 - 84, 100, 50));
    this.gui.addChild(this.messageLog);
    this.log('Welcome stranger! Prepare to perish!', Pico8Palette.DARK_RED);

    const bottomPanel = new BottomPanel();
    this.gui.addChild(bottomPanel);

    this.gui.addChild(new EntityFrames(this));

    const inventoryButton = new Button(
      new Rect(0, 0, 20, 28),
      new Sprite(832, 168, 16, 16),
      undefined,
      () => {
        this.hideAllDialogs();
        this.inventoryDialog.visible = true;
      }
    );
    inventoryButton.tooltip = this.gui.fromMessages([
      new Message("Traveler's Backpack", Pico8Palette.GREEN),
      new Message('Item Level 55', Pico8Palette.YELLOW),
      new Message('16 Slot Bag', Pico8Palette.WHITE),
      new Message('Sell Price: 87 coins', Pico8Palette.WHITE),
    ]);
    bottomPanel.inventorySlot.addChild(inventoryButton);

    const characterButton = new Button(
      new Rect(0, 0, 20, 28),
      new Sprite(640, 240, 16, 16),
      undefined,
      () => {
        this.hideAllDialogs();
        this.characterDialog.visible = true;
      }
    );
    characterButton.tooltip = this.gui.fromMessages([
      new Message('Character', Pico8Palette.WHITE),
      new Message('Currently equipped items,', Pico8Palette.YELLOW),
      new Message('stats and abilities.', Pico8Palette.YELLOW),
    ]);
    bottomPanel.characterSlot.addChild(characterButton);

    const talentsButton = new Button(
      new Rect(0, 0, 20, 28),
      new Sprite(656, 360, 16, 16),
      undefined,
      () => {
        this.hideAllDialogs();
        this.talentsDialog.visible = true;
      }
    );
    talentsButton.tooltip = this.gui.fromMessages([
      new Message('Talents', Pico8Palette.WHITE),
      new Message('A list of all of your', Pico8Palette.YELLOW),
      new Message("character's talents.", Pico8Palette.YELLOW),
    ]);
    bottomPanel.talentsSlot.addChild(talentsButton);

    const inspectButton = new Button(
      new Rect(0, 0, 20, 28),
      new Sprite(656, 360, 16, 16),
      undefined,
      () => {
        this.hideAllDialogs();
      }
    );
    inspectButton.tooltip = this.gui.fromMessages([new Message('Inspect', Pico8Palette.WHITE)]);
    bottomPanel.inspectSlot.addChild(inspectButton);

    const menuButton = new Button(
      new Rect(0, 0, 20, 28),
      new Sprite(352, 672, 16, 16),
      undefined,
      () => {
        window.location.hash = 'menu';
      }
    );
    menuButton.tooltip = this.gui.fromMessages([new Message('Main Menu', Pico8Palette.WHITE)]);
    bottomPanel.menuSlot.addChild(menuButton);

    this.inventoryDialog = new ItemContainerDialog(
      new Rect(8, 64, 128, 132),
      [
        new Message("Traveler's Backpack", Pico8Palette.GREEN),
        new Message('Click an item to use', Pico8Palette.LIGHT_GRAY),
        new Message('Drag for shortcut', Pico8Palette.LIGHT_GRAY),
      ],
      16,
      player.inventory
    );
    this.inventoryDialog.visible = false;
    this.gui.addChild(this.inventoryDialog);

    this.characterDialog = new CharacterDialog(new Rect(8, 64, 128, 144), player);
    this.characterDialog.visible = false;
    this.gui.addChild(this.characterDialog);

    this.talentsDialog = new TalentsDialog(
      new Rect(8, 48, 110, 132),
      [
        new Message('Talents', Pico8Palette.GREEN),
        new Message('Click an ability to use', Pico8Palette.LIGHT_GRAY),
        new Message('Drag for shortcut', Pico8Palette.LIGHT_GRAY),
      ],
      16,
      player.talents
    );
    this.talentsDialog.visible = false;
    this.gui.addChild(this.talentsDialog);

    const levelUpDialog = new LevelUpDialog(new Rect(8, 64, 160, 126), player);
    levelUpDialog.visible = false;
    this.gui.addChild(levelUpDialog);
    this.levelUpDialog = levelUpDialog;

    player.inventory.addListener({
      onAdd: (_, item): void => {
        if (!(item instanceof HealthPotion) && !(item instanceof Scroll)) {
          // Only add health potions and scrolls
          return;
        }
        bottomPanel.shortcutBar.addItem(player.inventory, item, true);
      },
      onRemove: (): void => undefined,
    });

    player.talents.addListener({
      onAdd: (_, talent): void => {
        bottomPanel.shortcutBar.addTalent(talent);
      },
      onRemove: (): void => undefined,
    });

    // Generate the map
    this.mapGen.createMap();
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

  private updateZoom(): void {
    if (this.app.mouse.wheelDeltaY !== 0) {
      const center = this.viewport.getCenter();

      if (this.app.mouse.wheelDeltaY > 0) {
        this.zoom *= 0.5;
      } else {
        this.zoom *= 2.0;
      }

      this.viewport.width = (this.zoom * this.app.width) | 0;
      this.viewport.height = (this.zoom * this.app.height) | 0;
      this.viewport.x = center.x - ((this.app.width / this.zoom / 2) | 0);
      this.viewport.y = center.y - ((this.app.height / this.zoom / 2) | 0);
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
    this.viewport.x = this.player.centerPixelX - ((this.app.width / this.zoom / 2) | 0);
    this.viewport.y = this.player.centerPixelY - ((this.app.height / this.zoom / 2) | 0);
  }

  private updateViewport(): void {
    this.viewport.width = this.app.width / this.zoom;
    this.viewport.height = this.app.height / this.zoom;

    const mouse = this.app.mouse;
    if (mouse.isDragging()) {
      this.viewport.x -= mouse.dx / this.zoom;
      this.viewport.y -= mouse.dy / this.zoom;
    } else if (
      !this.app.keyboard.isKeyDown(Key.VK_CONTROL_LEFT) &&
      !this.app.keyboard.isKeyDown(Key.VK_CONTROL_RIGHT)
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
    const x = ((this.viewport.x / this.zoom) | 0) * this.zoom - this.screenShakeOffset.x;
    const y = ((this.viewport.y / this.zoom) | 0) * this.zoom - this.screenShakeOffset.y;
    const animFrame = ((Sprite.globalAnimIndex / 30) | 0) % 2;
    this.tileMapRenderer.draw(x, y, this.viewport.width, this.viewport.height, animFrame);
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

    const moveKey = this.app.keyboard.getMovementKey();

    if (this.app.keyboard.isShiftKeyPressed() && moveKey) {
      this.viewport.x += moveKey.x * this.tileMap.tileSize.height;
      this.viewport.y += moveKey.y * this.tileMap.tileSize.height;
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
      const target = this.tileMap.getCell(tx, ty);
      if (target && target !== this.targetTile) {
        this.targetTile = target;
        this.path = computePath(this.tileMap, this.player, this.targetTile);
        this.pathIndex = 0;
      }
    }

    if (this.app.keyboard.isKeyPressed(Key.VK_X)) {
      // Explore
      this.path = computePath(this.tileMap, this.player, new Point(256, 0), 1000);
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

  recomputeFov(): void {
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

  findFreeTile(x0: number, y0: number, maxDistance: number): Point | undefined {
    for (let r = 0; r <= maxDistance; r += 0.5) {
      const r2 = Math.ceil(r);
      for (let y = y0 - r2; y <= y0 + r2; y++) {
        for (let x = x0 - r2; x <= x0 + r2; x++) {
          if (Math.hypot(x - x0, y - y0) <= r) {
            if (!this.isBlocked(x, y) && !this.getEntityAt(x, y)) {
              return new Point(x, y);
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

  fadeOut(onDone?: AnimationFunction): void {
    this.addAnimation(new FadeOutAnimation(30, fillSourceRect, onDone));
  }

  fadeIn(onDone?: AnimationFunction): void {
    this.addAnimation(new FadeInAnimation(30, fillSourceRect, onDone));
  }

  warpToPoint(point: Point): void {
    this.fadeOut(() => {
      if (this.player) {
        this.player.x = point.x;
        this.player.y = point.y;
      }
      this.stopAutoWalk();
      this.resetViewport();
      this.recomputeFov();
      this.fadeIn();
    });
  }
}
