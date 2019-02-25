import {Entity} from '../entity';
import {Rect} from '../rect';

import {Button} from './button';

export class EntityButton extends Button {
  readonly entity: Entity;

  constructor(destRect: Rect, entity: Entity) {
    super(entity.sprite, destRect);
    this.entity = entity;
  }

  click() {
    this.entity.use();
  }
}