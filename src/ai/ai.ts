import {Actor} from '../actor';

export abstract class AI {
  readonly actor: Actor;

  constructor(actor: Actor) {
    this.actor = actor;
  }

  abstract doAi(): void;
}