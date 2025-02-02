import { Engine } from './engine';
import { GameMap } from './gamemap';

export abstract class BaseComponent {
  parent?: BaseComponent;

  constructor(parent?: BaseComponent) {
    this.parent = parent;
  }

  get engine(): Engine {
    if (!this.parent) {
      throw new Error('Component has no parent');
    }
    return this.parent.engine;
  }

  get gameMap(): GameMap {
    if (!this.parent) {
      throw new Error('Component has no parent');
    }
    return this.parent.gameMap;
  }
}
