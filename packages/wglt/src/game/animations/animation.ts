import { BaseGame } from '../basegame';

export type AnimationFunction = () => void;

export abstract class Animation {
  constructor(
    public countdown: number,
    public blocking: boolean,
    public onDone?: AnimationFunction
  ) {}

  isDone(): boolean {
    return this.countdown <= 0;
  }

  update(): void {
    this.countdown--;
  }

  draw(_game: BaseGame): void {
    // Subclasses should override this.
  }
}
