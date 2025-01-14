import { Game } from '../game';

export abstract class Animation {
  countdown: number;
  blocking: boolean;
  callback?: () => void;

  constructor(countdown: number, blocking: boolean) {
    this.countdown = countdown;
    this.blocking = blocking;
  }

  onDone(callback: () => void): void {
    this.callback = callback;
  }

  isDone(): boolean {
    return this.countdown <= 0;
  }

  update(): void {
    this.countdown--;
  }

  draw(_game: Game): void {}
}
