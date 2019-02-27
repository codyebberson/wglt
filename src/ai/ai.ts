import {Actor} from '../actor';

export abstract class AI {
  readonly actor: Actor;
  activatedCount: number;

  constructor(actor: Actor) {
    this.actor = actor;
    this.activatedCount = -1;
  }

  abstract doAi(): void;
}