import {Actor} from '../actor';

export abstract class AI {
  readonly actor: Actor;
  activatedCount: number;
  seen: boolean;

  constructor(actor: Actor) {
    this.actor = actor;
    this.activatedCount = -1;
    this.seen = false;
  }

  abstract doAi(): void;
}