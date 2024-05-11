import { Player } from '../entities/player';
import { Game } from '../game';
import { Door } from './door';

export class LockedDoor extends Door {
  readonly keyId: number;

  constructor(game: Game, x: number, y: number, keyId: number) {
    super(game, x, y);
    this.keyId = keyId;
    this.zIndex = 0;
  }

  onBump(player: Player): boolean {
    if (player.keys[this.keyId]) {
      this.openDoor();
      player.moveTo(this.x, this.y);
      return true;
    }

    // Otherwise, door is locked
    return false;
  }
}
