import { AppState, Dialog, GUI, Rect, SelectInput } from 'wglt';
import { App } from './app';

export class MainMenu extends AppState<App> {
  constructor(
    app: App,
    readonly gui: GUI<App>,
    onNewGame: () => void
  ) {
    super(app);

    const dialog = new Dialog(new Rect(270, 100, 100, 50), 'Main Menu');

    const selectInput = new SelectInput(
      new Rect(5, 5, 100, 50),
      [
        { id: 'new', name: 'NEW GAME' },
        { id: 'continue', name: 'CONTINUE' },
      ],
      (choice) => {
        if (choice.id === 'new') {
          dialog.visible = false;
          onNewGame();
        }
      }
    );
    dialog.addChild(selectInput);

    gui.addChild(dialog);
  }

  update(): void {
    this.gui.handleInput();
    this.gui.draw();
  }
}
