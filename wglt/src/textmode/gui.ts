// import { DefaultDialogRenderer } from './gui/defaultdialogrenderer';
// import { Dialog } from './gui/dialog';
// import { DialogRenderer } from './gui/dialogrenderer';
// import { DialogState } from './gui/dialogstate';
// import { Terminal } from './terminal';

// export class GUI {
//   constructor(
//     readonly terminal: Terminal,
//     readonly renderer: DialogRenderer = new DefaultDialogRenderer(),
//     readonly dialogs: DialogState[] = []
//   ) {}

//   add(dialog: Dialog): void {
//     this.dialogs.push(this.renderer.getState(this.terminal, dialog));
//   }

//   /**
//    * Handles input for currently active dialog.
//    * Returns true if the input was handled.
//    * Returns false otherwise.
//    */
//   handleInput(app: BaseApp): boolean {
//     if (this.dialogs.length === 0) {
//       return false;
//     }

//     const activeIndex = this.dialogs.length - 1;
//     const activeState = this.dialogs[this.dialogs.length - 1];
//     const activeDialog = activeState.dialog;
//     if (activeDialog.handleInput(this.terminal, activeState.contentsOffset)) {
//       this.dialogs.splice(activeIndex, 1);
//     }

//     return true;
//   }

//   draw(): void {
//     for (let i = 0; i < this.dialogs.length; i++) {
//       this.renderer.draw(this.terminal, this.dialogs[i]);
//     }
//   }
// }