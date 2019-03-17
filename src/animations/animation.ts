import {Game} from '../game';
import {AnimationPromise} from './animationpromise';

export abstract class Animation {
  readonly promise: AnimationPromise;
  countdown: number;
  blocking: boolean;

  constructor(countdown: number, blocking: boolean) {
    this.promise = new AnimationPromise();
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
