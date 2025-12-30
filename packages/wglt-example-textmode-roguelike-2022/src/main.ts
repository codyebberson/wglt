import {
  DefaultTerminalTheme,
  Dialog,
  GUI,
  Key,
  Label,
  Rect,
  SelectInput,
  type SelectOption,
  Terminal,
  zzfx,
} from 'wglt';
import { Actor } from './actor';
import { Colors } from './color';
import { Engine } from './engine';
import { loadGame, newGame, renderMainMenu, saveGame } from './menu';
import { levelUpSound, menuBlipSound } from './sounds';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

const maxFps = 30;

const term = Terminal.init(SCREEN_WIDTH, SCREEN_HEIGHT, { maxFps });

const gui = new GUI(term);
gui.setTheme(new DefaultTerminalTheme());

let engine: Engine | undefined;

openMainMenu();

term.update = (): void => {
  if (!gui.handleInput()) {
    if (engine) {
      if (term.keyboard.isKeyPressed(Key.VK_I)) {
        openUseMenu(engine);
      } else if (term.keyboard.isKeyPressed(Key.VK_D)) {
        openDropMenu(engine);
      } else if (term.keyboard.isKeyPressed(Key.VK_V)) {
        openMessageLog(engine);
      } else if (term.keyboard.isKeyPressed(Key.VK_C)) {
        openCharacterScreen(engine);
      } else {
        engine.handleEvents(term);
      }
    }
    if (term.keyboard.isEscapeKeyPressed()) {
      openMainMenu();
    }
  }

  if (engine) {
    engine.render(term);
  } else {
    renderMainMenu(term);
  }

  gui.draw();
};

function openMainMenu(): void {
  addSelectDialog(
    'Main Menu',
    ['New Game', 'Continue', 'Save Game', 'Load Game'],
    (_name, index) => {
      switch (index) {
        case 0:
          setEngine(newGame());
          zzfx(...menuBlipSound);
          break;
        case 1:
          // Just close the menu
          zzfx(...menuBlipSound);
          break;
        case 2:
          saveGame(engine as Engine);
          zzfx(...menuBlipSound);
          break;
        case 3:
          try {
            setEngine(loadGame());
            zzfx(...menuBlipSound);
          } catch (_err) {
            gui.addChild(
              new Dialog(
                new Rect(10, 10, 20, 10),
                'Error',
                new Label(new Rect(1, 1, 20, 1), 'Could not load saved game')
              )
            );
          }
          break;
      }
    }
  );
}

function setEngine(newEngine: Engine): void {
  engine = newEngine;
  term.console.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 0, Colors.WHITE, Colors.BLACK);
}

function openUseMenu(engine: Engine): void {
  const player = engine.player;
  addSelectDialog(
    'Select an item to use',
    player.inventory.map((i) => i.name + (player.isEquipped(i) ? ' (equipped)' : '')),
    (_name, selected) => {
      engine.handleAction(player.inventory[selected].getAction(player));
      zzfx(...menuBlipSound);
    }
  );
  zzfx(...menuBlipSound);
}

function openDropMenu(engine: Engine): void {
  const player = engine.player;
  addSelectDialog(
    'Select an item to drop',
    player.inventory.map((i) => i.name),
    (_name, selected) => {
      player.inventory.splice(selected, 1);
      zzfx(...menuBlipSound);
    }
  );
  zzfx(...menuBlipSound);
}

function openMessageLog(_engine: Engine): void {
  // gui.addChild(
  //   new ScrollableMessageDialog(
  //     new Rect(2, 2, SCREEN_WIDTH - 4, SCREEN_HEIGHT - 4),
  //     'Message Log',
  //     new Message(undefined, undefined, undefined, engine.messageLog.messages)
  //     // Message.
  //   )
  // );
  zzfx(...menuBlipSound);
}

export function openLevelUpMenu(player: Actor): void {
  addSelectDialog(
    'Level up! Select an attribute to increase.',
    [
      `Constitution (+20 HP, from ${player.maxHp})`,
      `Strength (+1 attack, from ${player.power})`,
      `Agility (+1 defense, from ${player.defense})`,
    ],
    (_name, selected) => {
      switch (selected) {
        case 0:
          player.increaseMaxHp();
          break;
        case 1:
          player.increasePower();
          break;
        case 2:
          player.increaseDefense();
          break;
      }
      zzfx(...levelUpSound);
    }
  );
  zzfx(...menuBlipSound);
}

function openCharacterScreen(_engine: Engine): void {
  // const player = engine.player;
  // gui.addChild(
  //   new MessageDialog(
  //     new Rect(10, 10, 40, 20),
  //     'Character',
  //     new Message(`Level:            ${player.level}`, Colors.WHITE, undefined, [
  //       new Message(`XP:               ${player.xp}`),
  //       new Message(`XP to next level: ${player.experienceToNextLevel}`),
  //       new Message(`Max HP:           ${player.maxHp}`),
  //       new Message(`HP:               ${player.hp}`),
  //       new Message(`Attack:           ${player.power}`),
  //       new Message(`Defense:          ${player.defense}`),
  //     ])
  //   )
  // );
  zzfx(...menuBlipSound);
}

/**
 * Adds a dialog with a message and an OK button.
 * @param title - The title of the dialog.
 * @param options - The options to display in the dialog.
 * @param callback - The callback to call when an option is selected.
 */
function addSelectDialog(
  title: string,
  options: string[],
  callback: (option: SelectOption, index: number) => void
): void {
  let width = title.length;
  for (let i = 0; i < options.length; i++) {
    width = Math.max(width, options[i].length + 8);
  }

  const height = options.length + 4;
  const rect = new Rect(
    Math.floor((SCREEN_WIDTH - width) / 2),
    Math.floor((SCREEN_HEIGHT - height) / 2),
    width,
    height
  );

  const dialog = new Dialog(rect, title);

  const callbackWrapper = (option: SelectOption, index: number): void => {
    dialog.visible = false;
    dialog.parent?.removeChild(dialog);
    term.keyboard.clear();
    term.mouse.buttons.clear();
    callback(option, index);
  };

  const selectItems = options.map((name) => ({ name }));
  const selectInput = new SelectInput(new Rect(2, 2, width, height), selectItems, callbackWrapper);
  dialog.addChild(selectInput);

  gui.addChild(dialog);
}
