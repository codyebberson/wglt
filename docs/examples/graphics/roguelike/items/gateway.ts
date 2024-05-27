import { Sprite } from 'wglt';
import { Item } from 'wglt';
import { Player } from '../entities/player';
import { StatsActor } from '../entities/statsactor';
import { Game } from '../game';

const SPRITE = new Sprite(432, 408, 16, 16, 1, true);

export class Gateway extends Item {
  readonly owner: StatsActor;
  other?: Gateway;

  constructor(game: Game, x: number, y: number, owner: StatsActor) {
    super(game, 'Gateway', SPRITE);
    this.owner = owner;
    this.x = x;
    this.y = y;
    this.zIndex = 0;
    this.blocks = true;
  }

  onBump(player: Player): boolean {
    const exit = this.other;
    if (!exit) {
      return false;
    }
    player.blocks = false;
    player.move(exit.x - player.x, exit.y - player.y, 8);
    player.blocks = true;
    return true;
  }
}
