import {Game} from '../game';

export abstract class Effect {
  countdown: number;
  blocking: boolean;
  onDone?: Function;

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
