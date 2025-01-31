import {
  AutoRectRenderer,
  Button,
  ButtonSlot,
  Container,
  Dialog,
  FONT_04B03,
  GUI,
  GraphicsButtonRenderer,
  GraphicsButtonSlotRenderer,
  GraphicsLabelRenderer,
  GraphicsMessageLogRenderer,
  GraphicsSelectInputRenderer,
  Key,
  Label,
  Message,
  MessageLog,
  Panel,
  Rect,
  SelectInput,
} from 'wglt';
import { FireballAbility } from './abilities/fireball';
import { LightningAbility } from './abilities/lightning';
import { Player } from './actors/player';
import { App } from './app';
import { CompoundMessage } from './compoundmessage';
import { Game } from './game';
import { ItemButton, ItemButtonRenderer } from './gui/itembutton';
import { ItemContainerButtonSlot } from './gui/itemcontainerbuttonslot';
import { ItemContainerDialog } from './gui/itemcontainerdialog';
import { ItemShortcutButton, ItemShortcutButtonRenderer } from './gui/itemshortcutbutton';
import { ShortcutBar, ShortcutBarRenderer } from './gui/shortcutbar';
import { ShortcutButtonSlot } from './gui/shortcutbuttonslot';
import { TalentButton, TalentButtonRenderer } from './gui/talentbutton';
import { MainMenu } from './mainmenu';
import { createMap } from './mapgen';
import { Palette } from './palette';
import { Sprites } from './sprites';
import { Talent } from './talent';

const WIDTH = 640;
const HEIGHT = 360;

const app = new App({
  size: new Rect(0, 0, WIDTH, HEIGHT),
  font: FONT_04B03,
});

const dialogSourceRect = new Rect(0, 64, 24, 24);
const buttonSlotRect = new Rect(0, 88, 24, 24);

const gui = new GUI(app);

// Standard components
gui.renderers.set(Dialog, new AutoRectRenderer(dialogSourceRect));
gui.renderers.set(ButtonSlot, new GraphicsButtonSlotRenderer(buttonSlotRect));
gui.renderers.set(Panel, new AutoRectRenderer(buttonSlotRect));
gui.renderers.set(Label, new GraphicsLabelRenderer());
gui.renderers.set(Button, new GraphicsButtonRenderer());
gui.renderers.set(SelectInput, new GraphicsSelectInputRenderer());
gui.renderers.set(MessageLog, new GraphicsMessageLogRenderer());

// Custom components
gui.renderers.set(TalentButton, new TalentButtonRenderer());
gui.renderers.set(ShortcutBar, new ShortcutBarRenderer());
gui.renderers.set(ShortcutButtonSlot, new GraphicsButtonSlotRenderer(buttonSlotRect));
gui.renderers.set(ItemContainerDialog, new AutoRectRenderer(dialogSourceRect));
gui.renderers.set(ItemContainerButtonSlot, new GraphicsButtonSlotRenderer(buttonSlotRect));
gui.renderers.set(ItemButton, new ItemButtonRenderer());
gui.renderers.set(ItemShortcutButton, new ItemShortcutButtonRenderer());

function newGame(): Game {
  const game = new Game(app, gui);

  const player = new Player(game, 30, 20);
  game.player = player;

  game.messageLog = new MessageLog(new Rect(1, HEIGHT - 78, 100, 50));
  gui.addChild(game.messageLog);
  game.log(
    new CompoundMessage(
      new Message('Welcome stranger! ', Palette.DARK_PURPLE),
      new Message('Prepare to perish!', Palette.RED)
    )
  );

  const playerStats = new Panel(new Rect(1, 1, 100, 20));
  playerStats.render = (): void => {
    const frameY = 0;
    app.drawString(1, frameY, player.name);

    const hpPercent = player.hp / player.maxHp;
    app.drawImage(0, frameY + 7, 32, 64, 40, 12);
    app.drawImage(2, frameY + 9, 32, 80, 8, 8, undefined, Math.round(hpPercent * 36));
    app.drawString(3, frameY + 10, `${player.hp}/${player.maxHp}`);

    const xpPercent = player.xp / player.maxXp;
    app.drawImage(40, frameY + 7, 32, 64, 40, 12);
    app.drawImage(42, frameY + 9, 32, 80, 8, 8, undefined, Math.round(xpPercent * 36));
    app.drawString(43, frameY + 10, `${player.xp}/${player.maxXp}`);
  };
  gui.addChild(playerStats);

  const shortcutBar = new ShortcutBar(new Rect(1, HEIGHT - 26, 26 * 6, 26), buttonSlotRect, 6);
  gui.addChild(shortcutBar);

  const inventoryButtonSlot = new ButtonSlot(
    new Rect(WIDTH - 8 - 26, HEIGHT - 26, 24, 24),
    Key.VK_I
  );
  gui.addChild(inventoryButtonSlot);

  const inventoryButton = new Button(new Rect(0, 0, 24, 24), Sprites.BAG, undefined, () => {
    inventoryDialog.visible = !inventoryDialog.visible;
  });
  inventoryButton.tooltip = Container.fromMessages([
    new Message("Traveler's Backpack", Palette.GREEN),
    new Message('Item Level 55', Palette.YELLOW),
    new Message('16 Slot Bag', Palette.WHITE),
    new Message('Sell Price: 87 coins', Palette.WHITE),
  ]);
  inventoryButtonSlot.addChild(inventoryButton);

  const inventoryDialog = new ItemContainerDialog(
    new Rect(10, 25, 110, 110),
    [
      new Message("Traveler's Backpack", Palette.GREEN),
      new Message('Click to use', Palette.LIGHT_GRAY),
      new Message('Drag for shortcut', Palette.LIGHT_GRAY),
    ],
    16,
    player.inventory
  );
  inventoryDialog.visible = false;
  gui.addChild(inventoryDialog);

  player.inventory.addListener({
    onAdd: (_, item): void => {
      shortcutBar.addItem(player.inventory, item, true);
    },
    onRemove: (_, _talent): void => {},
  });

  player.talents.addListener({
    onAdd: (_, talent): void => {
      shortcutBar.addTalent(talent);
    },
    onRemove: (_, _talent): void => {},
  });

  player.talents.add(new Talent(player, new FireballAbility(game)));
  player.talents.add(new Talent(player, new LightningAbility(game)));

  // Generate the map
  createMap(game);

  return game;
}

const mainMenu = new MainMenu(app, gui, () => {
  app.state = newGame();
});

app.state = mainMenu;
