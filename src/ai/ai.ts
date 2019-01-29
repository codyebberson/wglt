import {Entity} from '../entity';

export abstract class AI {
  readonly entity: Entity;
  activatedCount: number;

  constructor(entity: Entity) {
    this.entity = entity;
    this.activatedCount = -1;
  }

  abstract doAi(): void;
}