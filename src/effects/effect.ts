import {App} from '../app';
import {Game} from '../game';

export abstract class Effect {
  countdown: number;
  blocking: boolean;

  constructor(countdown: number, blocking: boolean) {
    this.countdown = countdown;
    this.blocking = blocking;
  }

  isDone() {
    return this.countdown <= 0;
  }

  update() {
    this.countdown--;
  }

  draw(game: Game) {}
}
