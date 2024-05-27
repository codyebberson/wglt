import { BaseApp, ButtonSlot, Key, Panel, Rect, ShortcutBar } from 'wglt';

export class BottomPanel extends Panel {
  readonly shortcutBar: ShortcutBar;
  readonly characterSlot: ButtonSlot;
  readonly talentsSlot: ButtonSlot;
  readonly inspectSlot: ButtonSlot;
  readonly menuSlot: ButtonSlot;
  readonly inventorySlot: ButtonSlot;

  constructor() {
    super(new Rect(0, -43, 400, 43));

    this.shortcutBar = new ShortcutBar(new Rect(4, 0, 6 * 24, 28), 6);
    this.addChild(this.shortcutBar);

    this.characterSlot = new ButtonSlot(new Rect(0, 3, 24, 24), Key.VK_C);
    this.addChild(this.characterSlot);

    this.talentsSlot = new ButtonSlot(new Rect(0, 3, 24, 24), Key.VK_T);
    this.addChild(this.talentsSlot);

    this.inspectSlot = new ButtonSlot(new Rect(0, 3, 24, 24), Key.VK_SLASH);
    this.addChild(this.inspectSlot);

    this.menuSlot = new ButtonSlot(new Rect(0, 3, 24, 24), Key.VK_Q);
    this.addChild(this.menuSlot);

    this.inventorySlot = new ButtonSlot(new Rect(100, 0, 24, 24), Key.VK_I);
    this.addChild(this.inventorySlot);
  }

  draw(app: BaseApp): void {
    // Update button y-positions
    // This will normally be a no-op
    for (let i = 0; i < this.children.length; i++) {
      this.children.get(i).rect.y = app.size.height - 28;

      if (i > 0) {
        this.children.get(i).rect.x = app.size.width - 2 - 26 * 6 + i * 26;
      }
    }

    this.drawChildren(app);
  }
}
