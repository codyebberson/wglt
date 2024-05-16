import { Pico8Palette, Rect } from 'wglt';
import { Button, Message, MessageLog, Sprite } from 'wglt';
import { BaseGame, ItemContainerDialog, TalentsDialog } from 'wglt';
import { App } from './app';
import { Player } from './entities/player';
import { BottomPanel } from './gui/bottompanel';
import { CharacterDialog } from './gui/characterdialog';
import { EntityFrames } from './gui/entityframes';
import { LevelUpDialog } from './gui/levelupdialog';
import { HealthPotion } from './items/healthpotion';
import { Scroll } from './items/scroll';
import { MapGenerator } from './mapgen/mapgen';

export class Game extends BaseGame {
  private readonly mapGen: MapGenerator;
  inventoryDialog: ItemContainerDialog;
  talentsDialog: TalentsDialog;
  characterDialog: CharacterDialog;
  levelUpDialog: LevelUpDialog;

  constructor(app: App, seed: number) {
    super(app, seed);

    this.mapGen = new MapGenerator(this);

    const player = new Player(this, 30, 20);
    this.player = player;
    this.entities.add(player);
    this.messageLog = new MessageLog(new Rect(1, -84, 100, 50));
    this.gui.add(this.messageLog);
    this.log('Welcome stranger! Prepare to perish!', Pico8Palette.DARK_RED);

    const bottomPanel = new BottomPanel();
    this.gui.add(bottomPanel);

    this.gui.add(new EntityFrames(this));

    const inventoryButton = new Button(
      new Rect(0, 0, 20, 28),
      new Sprite(832, 168, 16, 16, 1, true, 30),
      undefined,
      () => {
        this.hideAllDialogs();
        this.inventoryDialog.visible = true;
      }
    );
    inventoryButton.tooltipMessages = [
      new Message("Traveler's Backpack", Pico8Palette.GREEN),
      new Message('Item Level 55', Pico8Palette.YELLOW),
      new Message('16 Slot Bag', Pico8Palette.WHITE),
      new Message('Sell Price: 87 coins', Pico8Palette.WHITE),
    ];
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
    characterButton.tooltipMessages = [
      new Message('Character', Pico8Palette.WHITE),
      new Message('Currently equipped items,', Pico8Palette.YELLOW),
      new Message('stats and abilities.', Pico8Palette.YELLOW),
    ];
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
    talentsButton.tooltipMessages = [
      new Message('Talents', Pico8Palette.WHITE),
      new Message('A list of all of your', Pico8Palette.YELLOW),
      new Message("character's talents.", Pico8Palette.YELLOW),
    ];
    bottomPanel.talentsSlot.addChild(talentsButton);

    const menuButton = new Button(
      new Rect(0, 0, 20, 28),
      new Sprite(352, 672, 16, 16),
      undefined,
      () => {
        window.location.hash = 'menu';
      }
    );
    menuButton.tooltipMessages = [new Message('Main Menu', Pico8Palette.WHITE)];
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
    this.gui.add(this.inventoryDialog);

    this.characterDialog = new CharacterDialog(new Rect(8, 64, 128, 144), player);
    this.characterDialog.visible = false;
    this.gui.add(this.characterDialog);

    this.talentsDialog = new TalentsDialog(
      new Rect(8, 48, 96, 132),
      [
        new Message('Talents', Pico8Palette.GREEN),
        new Message('Click an ability to use', Pico8Palette.LIGHT_GRAY),
        new Message('Drag for shortcut', Pico8Palette.LIGHT_GRAY),
      ],
      16,
      player.talents
    );
    this.talentsDialog.visible = false;
    this.gui.add(this.talentsDialog);

    const levelUpDialog = new LevelUpDialog(new Rect(8, 64, 160, 126), player);
    levelUpDialog.visible = false;
    this.gui.add(levelUpDialog);
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
}
