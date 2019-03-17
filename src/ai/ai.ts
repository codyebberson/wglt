import {Actor} from '../actor';

export abstract class AI {
  readonly actor: Actor;
  alwaysActive: boolean;

  constructor(actor: Actor) {
    this.actor = actor;
    this.alwaysActive = false;
  }

  abstract doAi(): void;
}