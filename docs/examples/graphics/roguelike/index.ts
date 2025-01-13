import {
  AppState,
  AutoRectRenderer,
  Button,
  ButtonSlot,
  Container,
  Dialog,
  FONT_04B03,
  GUI,
  GraphicsButtonRenderer,
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
  Sprite,
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
import { TalentsDialog } from './gui/talentsdialog';
import { createMap } from './mapgen';
import { Palette } from './palette';
import { Talent } from './talent';

const WIDTH = 640;
const HEIGHT = 360;

const app = new App({
  imageUrl: '/graphics2.png',
  size: new Rect(0, 0, WIDTH, HEIGHT),
  font: FONT_04B03,
});

const dialogSourceRect = new Rect(0, 64, 24, 24);
const buttonSlotRect = new Rect(0, 88, 24, 24);

const gui = new GUI(app);

// Standard components
gui.renderers.set(Dialog, new AutoRectRenderer(dialogSourceRect));
gui.renderers.set(ButtonSlot, new AutoRectRenderer(buttonSlotRect));
gui.renderers.set(Panel, new AutoRectRenderer(dialogSourceRect));
gui.renderers.set(Label, new GraphicsLabelRenderer());
gui.renderers.set(Button, new GraphicsButtonRenderer());
gui.renderers.set(SelectInput, new GraphicsSelectInputRenderer());
gui.renderers.set(MessageLog, new GraphicsMessageLogRenderer());

// Custom components
gui.renderers.set(TalentButton, new TalentButtonRenderer());
gui.renderers.set(ShortcutBar, new ShortcutBarRenderer());
gui.renderers.set(ShortcutButtonSlot, new AutoRectRenderer(buttonSlotRect));
gui.renderers.set(ItemContainerDialog, new AutoRectRenderer(dialogSourceRect));
gui.renderers.set(ItemContainerButtonSlot, new AutoRectRenderer(buttonSlotRect));
gui.renderers.set(ItemButton, new ItemButtonRenderer());
gui.renderers.set(ItemShortcutButton, new ItemShortcutButtonRenderer());

const game = new Game(app, gui);

game.targetSprite = new Sprite(0, 48, 16, 16);
game.cooldownSprite = new Sprite(0, 160, 16, 16, 24);
game.blackoutRect = new Rect(0, 32, 16, 16);

const player = new Player(game, 30, 20);
game.player = player;
game.entities.add(player);

game.messageLog = new MessageLog(new Rect(1, HEIGHT - 78, 100, 50));
gui.addChild(game.messageLog);
game.log(
  new CompoundMessage(
    new Message('Welcome stranger! ', Palette.DARK_PURPLE),
    new Message('Prepare to perish!', Palette.RED)
  )
);

const playerStats = new Panel(new Rect(1, 1, 100, 20));
playerStats.render = () => {
  const frameY = 0;
  app.drawString(1, frameY, player.name);

  const hpPercent = player.hp / player.maxHp;
  app.drawImage(0, frameY + 7, 32, 64, 32, 12);
  app.drawImage(2, frameY + 9, 32, 80, 8, 8, undefined, Math.round(hpPercent * 28));
  app.drawString(3, frameY + 10, `${player.hp}/${player.maxHp}`);

  const xpPercent = player.xp / player.maxXp;
  app.drawImage(32, frameY + 7, 32, 64, 32, 12);
  app.drawImage(34, frameY + 9, 32, 80, 8, 8, undefined, Math.round(xpPercent * 28));
  app.drawString(35, frameY + 10, `${player.xp}/${player.maxXp}`);
};
gui.addChild(playerStats);

const shortcutBar = new ShortcutBar(new Rect(1, HEIGHT - 26, 26 * 6, 26), buttonSlotRect, 6);
gui.addChild(shortcutBar);

const inventoryButton = new Button(
  new Rect(WIDTH - 24, HEIGHT - 24, 24, 24),
  new Sprite(192, 16, 16, 16),
  Key.VK_I,
  () => {
    inventoryDialog.visible = !inventoryDialog.visible;
    talentsDialog.visible = false;
  }
);
inventoryButton.tooltip = Container.fromMessages([
  new Message("Traveler's Backpack", Palette.GREEN),
  new Message('Item Level 55', Palette.YELLOW),
  new Message('16 Slot Bag', Palette.WHITE),
  new Message('Sell Price: 87 coins', Palette.WHITE),
]);
gui.addChild(inventoryButton);

const talentsButton = new Button(
  new Rect(WIDTH - 48, HEIGHT - 24, 24, 24),
  new Sprite(192, 16, 16, 16),
  Key.VK_T,
  () => {
    talentsDialog.visible = !talentsDialog.visible;
    inventoryDialog.visible = false;
  }
);
talentsButton.tooltip = Container.fromMessages([
  new Message('Talents', Palette.WHITE),
  new Message('A list of all of your', Palette.YELLOW),
  new Message("character's talents.", Palette.YELLOW),
]);
gui.addChild(talentsButton);

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

const talentsDialog = new TalentsDialog(
  new Rect(10, 25, 110, 110),
  [
    new Message('Talents', Palette.GREEN),
    new Message('Click to use', Palette.LIGHT_GRAY),
    new Message('Drag for shortcut', Palette.LIGHT_GRAY),
  ],
  16,
  player.talents
);
talentsDialog.visible = false;
gui.addChild(talentsDialog);

player.inventory.addListener({
  onAdd: (_, item) => {
    shortcutBar.addItem(player.inventory, item, true);
  },
  onRemove: (_, _talent) => {},
});

player.talents.addListener({
  onAdd: (_, talent) => {
    shortcutBar.addTalent(talent);
  },
  onRemove: (_, _talent) => {},
});

player.talents.add(new Talent(player, new FireballAbility(game)));
player.talents.add(new Talent(player, new LightningAbility(game)));

// Generate the map
createMap(game);

class MainMenu extends AppState<App> {
  constructor(
    app: App,
    readonly gui: GUI<App>
  ) {
    super(app);
  }

  update(): void {
    this.gui.handleInput();
    this.gui.draw();
  }
}

const mainMenu = new MainMenu(app, gui);
// mainMenu.gui.renderer.baseRect = new Rect(0, 64, 24, 24);
// mainMenu.gui.add(new ImagePanel(new Rect(0, 768, 400, 224), new Rect(0, 0, 400, 224)));
mainMenu.gui.addChild(
  new Dialog(
    new Rect(150, 62, 100, 50),
    'Main Menu',
    new SelectInput(
      new Rect(150, 62, 100, 50),
      [
        { id: 'new', name: 'NEW GAME' },
        { id: 'continue', name: 'CONTINUE' },
      ],
      (choice) => {
        if (choice.id === 'new') {
          app.state = game;
        }
      }
    )
  )
);

app.state = mainMenu;
