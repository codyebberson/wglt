import { BaseApp } from '../baseapp.ts';
import { Container } from './container.ts';

export class Panel extends Container {
  showAt(app: BaseApp, x: number, y: number): void {
    if (x < app.pixelWidth / 2) {
      this.rect.x = x + 2;
    } else {
      this.rect.x = x - this.rect.width - 1;
    }

    if (y < app.pixelHeight / 2) {
      this.rect.y = y + 2;
    } else {
      this.rect.y = y - this.rect.height - 1;
    }

    this.visible = true;
    this.recalculateLayout();
  }
}
