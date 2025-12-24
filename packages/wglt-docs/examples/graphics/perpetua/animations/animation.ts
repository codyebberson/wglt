import { Game } from '../game';

export type AnimationFunction = () => void;

export abstract class Animation {
  countdown: number;
  blocking: boolean;
  onDone?: AnimationFunction;

  constructor(countdown: number, blocking: boolean, onDone?: AnimationFunction) {
    this.countdown = countdown;
    this.blocking = blocking;
    this.onDone = onDone;
  }

  isDone(): boolean {
    return this.countdown <= 0;
  }

  update(): void {
    this.countdown--;
  }

  draw(_game: Game): void {
    // Subclasses should override this.
  }
}
