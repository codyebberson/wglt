import { ButtonSlot, Container, GUI, Key, Rect, Renderer, ShortcutBar } from 'wglt';
import { App } from '../app';

export class BottomPanel extends Container {
  readonly shortcutBar: ShortcutBar;
  readonly characterSlot: ButtonSlot;
  readonly talentsSlot: ButtonSlot;
  readonly inspectSlot: ButtonSlot;
  readonly menuSlot: ButtonSlot;
  readonly inventorySlot: ButtonSlot;

  constructor() {
    super(new Rect(0, 360 - 26, 400, 43));

    this.shortcutBar = new ShortcutBar(new Rect(4, 0, 6 * 24, 28), new Rect(0, 0, 24, 24), 6);
    this.addChild(this.shortcutBar);

    this.characterSlot = new ButtonSlot(new Rect(640 - 200, 0, 24, 24), Key.VK_C);
    this.addChild(this.characterSlot);

    this.talentsSlot = new ButtonSlot(new Rect(640 - 200 + 26, 0, 24, 24), Key.VK_T);
    this.addChild(this.talentsSlot);

    this.inspectSlot = new ButtonSlot(new Rect(640 - 200 + 26 * 2, 0, 24, 24), Key.VK_SLASH);
    this.addChild(this.inspectSlot);

    this.menuSlot = new ButtonSlot(new Rect(640 - 200 + 26 * 3, 0, 24, 24), Key.VK_Q);
    this.addChild(this.menuSlot);

    this.inventorySlot = new ButtonSlot(new Rect(640 - 200 + 26 * 4, 0, 24, 24), Key.VK_I);
    this.addChild(this.inventorySlot);
  }
}

export class BottomPanelRenderer implements Renderer<App, BottomPanel> {
  render(gui: GUI<App>, component: BottomPanel): void {
    gui.drawChildren(component);
  }
}
