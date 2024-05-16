import { Key, Pico8Palette, Rect } from 'wglt';
import { Button, ButtonSlot, Dialog, Message, Sprite } from 'wglt';
import { Player } from '../entities/player';

const MARGIN = 5;
const BUTTON_SPACING = 2;

const CONSTITUTION_SPRITE = new Sprite(688, 144, 16, 16);
const DEXTERITY_SPRITE = new Sprite(640, 144, 16, 16);
const INTELLIGENCE_SPRITE = new Sprite(688, 168, 16, 16);
const STRENGTH_SPRITE = new Sprite(608, 312, 16, 16);

const DESCRIPTIONS = [
  [
    new Message('Constitution', Pico8Palette.YELLOW),
    new Message('Health, staminal,', Pico8Palette.WHITE),
    new Message('and vital force', Pico8Palette.WHITE),
  ],
  [
    new Message('Dexterity', Pico8Palette.YELLOW),
    new Message('Physical agility, reflexes,', Pico8Palette.WHITE),
    new Message('balance, and poise', Pico8Palette.WHITE),
  ],
  [
    new Message('Intelligence', Pico8Palette.YELLOW),
    new Message('Mental acuity, recall,', Pico8Palette.WHITE),
    new Message('and analytical skill', Pico8Palette.WHITE),
  ],
  [
    new Message('Strength', Pico8Palette.YELLOW),
    new Message('Natural athleticism,', Pico8Palette.WHITE),
    new Message('and bodily power', Pico8Palette.WHITE),
  ],
];

export class LevelUpDialog extends Dialog {
  readonly player: Player;

  constructor(rect: Rect, player: Player) {
    super(rect);
    this.player = player;
    this.modal = true;

    const constitutionSlot = new ButtonSlot(new Rect(0, 0, 24, 24), Key.VK_1);
    const constitutionBtn = new Button(new Rect(0, 0, 16, 24), CONSTITUTION_SPRITE, undefined, () =>
      this.incConstitution()
    );
    constitutionSlot.addChild(constitutionBtn);
    this.addChild(constitutionSlot);

    const dexteritySlot = new ButtonSlot(new Rect(0, 0, 24, 24), Key.VK_2);
    const dexterityBtn = new Button(new Rect(0, 0, 16, 24), DEXTERITY_SPRITE, undefined, () =>
      this.incDexterity()
    );
    dexteritySlot.addChild(dexterityBtn);
    this.addChild(dexteritySlot);

    const intelligenceSlot = new ButtonSlot(new Rect(0, 0, 24, 24), Key.VK_3);
    const intelligenceBtn = new Button(new Rect(0, 0, 16, 24), INTELLIGENCE_SPRITE, undefined, () =>
      this.incIntelligence()
    );
    intelligenceSlot.addChild(intelligenceBtn);
    this.addChild(intelligenceSlot);

    const strengthSlot = new ButtonSlot(new Rect(0, 0, 24, 24), Key.VK_4);
    const strengthBtn = new Button(new Rect(0, 0, 16, 24), STRENGTH_SPRITE, undefined, () =>
      this.incStrength()
    );
    strengthSlot.addChild(strengthBtn);
    this.addChild(strengthSlot);
  }

  private incConstitution(): void {
    this.increaseStat(1, 0, 0, 0);
  }

  private incDexterity(): void {
    this.increaseStat(0, 1, 0, 0);
  }

  private incIntelligence(): void {
    this.increaseStat(0, 0, 1, 0);
  }

  private incStrength(): void {
    this.increaseStat(0, 0, 0, 1);
  }

  private increaseStat(con: number, dex: number, int: number, str: number): void {
    this.player.constitution += con;
    this.player.dexterity += dex;
    this.player.intelligence += int;
    this.player.strength += str;
    this.player.remainingAbilityPoints--;
    this.player.recalculateMaxHp();
    if (this.player.remainingAbilityPoints === 0) {
      this.visible = false;
    }
  }

  drawContents(): void {
    super.drawContents();

    if (!this.gui || !this.gui.renderer.buttonSlotRect) {
      return;
    }

    // Update positions of button slots
    const containerRect = this.rect;
    const buttonRect = this.gui.renderer.buttonSlotRect;
    const x = containerRect.x + MARGIN;
    let y = containerRect.y + MARGIN;

    this.gui.app.drawString('Leveled up!', x, y, Pico8Palette.WHITE);
    y += 10;

    this.gui.app.drawString(
      `Choose ${this.player.remainingAbilityPoints} stats to increase:`,
      x,
      y,
      Pico8Palette.WHITE
    );
    y += 10;

    for (let i = 0; i < 4; i++) {
      const desc = DESCRIPTIONS[i];
      for (let j = 0; j < desc.length; j++) {
        this.gui.app.drawString(desc[j].text, x + 25, y + 1 + j * 8, desc[j].color);
      }

      const child = this.children.get(i);
      child.rect.x = x;
      child.rect.y = y;
      child.rect.width = buttonRect.width;
      child.rect.height = buttonRect.height;
      y += buttonRect.height + BUTTON_SPACING;
    }

    this.rect.height = y + MARGIN - containerRect.y;
    this.drawChildren();
  }
}
