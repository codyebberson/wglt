import {
  AnimationFunction,
  AutoRectRenderer,
  BaseGame,
  Button,
  ButtonSlot,
  Container,
  Dialog,
  FadeInAnimation,
  FadeOutAnimation,
  GraphicsButtonRenderer,
  GraphicsLabelRenderer,
  GraphicsMessageLogRenderer,
  ItemButton,
  ItemContainerButtonSlot,
  ItemContainerDialog,
  Label,
  Message,
  MessageLog,
  Panel,
  Pico8Palette,
  Point,
  Rect,
  ShortcutBar,
  ShortcutBarRenderer,
  ShortcutButtonSlot,
  Sprite,
  TalentButton,
  TalentsDialog,
} from 'wglt';
import { App } from './app';
import { Player } from './entities/player';
import { BottomPanel, BottomPanelRenderer } from './gui/bottompanel';
import { CharacterDialog } from './gui/characterdialog';
import { EntityFrames, EntityFramesRenderer } from './gui/entityframes';
import { LevelUpDialog } from './gui/levelupdialog';
import { HealthPotion } from './items/healthpotion';
import { Scroll } from './items/scroll';
import { MapGenerator } from './mapgen/mapgen';

const dialogSourceRect = new Rect(0, 32, 48, 48);
const fillSourceRect = new Rect(1008, 0, 16, 16);

export class Game extends BaseGame {
  private readonly mapGen: MapGenerator;
  inventoryDialog: ItemContainerDialog;
  talentsDialog: TalentsDialog;
  characterDialog: CharacterDialog;
  levelUpDialog: LevelUpDialog;

  constructor(app: App, seed: number) {
    super(app, seed);

    this.gui.renderers.set(BottomPanel, new BottomPanelRenderer());
    this.gui.renderers.set(EntityFrames, new EntityFramesRenderer());
    this.gui.renderers.set(Dialog, new AutoRectRenderer(dialogSourceRect));
    this.gui.renderers.set(ButtonSlot, new AutoRectRenderer(dialogSourceRect));
    this.gui.renderers.set(Panel, new AutoRectRenderer(dialogSourceRect));
    this.gui.renderers.set(Label, new GraphicsLabelRenderer());
    this.gui.renderers.set(Button, new GraphicsButtonRenderer());
    this.gui.renderers.set(TalentButton, new GraphicsButtonRenderer());
    this.gui.renderers.set(ShortcutBar, new ShortcutBarRenderer());
    this.gui.renderers.set(ShortcutButtonSlot, new AutoRectRenderer(dialogSourceRect));
    this.gui.renderers.set(MessageLog, new GraphicsMessageLogRenderer());
    this.gui.renderers.set(ItemContainerDialog, new AutoRectRenderer(dialogSourceRect));
    this.gui.renderers.set(ItemContainerButtonSlot, new AutoRectRenderer(dialogSourceRect));
    this.gui.renderers.set(ItemButton, new GraphicsButtonRenderer());

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
    inventoryButton.tooltip = Container.fromMessages([
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
    characterButton.tooltip = Container.fromMessages([
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
    talentsButton.tooltip = Container.fromMessages([
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
    inspectButton.tooltip = Container.fromMessages([new Message('Inspect', Pico8Palette.WHITE)]);
    bottomPanel.inspectSlot.addChild(inspectButton);

    const menuButton = new Button(
      new Rect(0, 0, 20, 28),
      new Sprite(352, 672, 16, 16),
      undefined,
      () => {
        window.location.hash = 'menu';
      }
    );
    menuButton.tooltip = Container.fromMessages([new Message('Main Menu', Pico8Palette.WHITE)]);
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
      onAdd: (_, item) => {
        if (!(item instanceof HealthPotion) && !(item instanceof Scroll)) {
          // Only add health potions and scrolls
          return;
        }
        bottomPanel.shortcutBar.addItem(player.inventory, item, true);
      },
      onRemove: () => undefined,
    });

    player.talents.addListener({
      onAdd: (_, talent) => {
        bottomPanel.shortcutBar.addTalent(talent);
      },
      onRemove: () => undefined,
    });

    // Generate the map
    this.mapGen.createMap();
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
