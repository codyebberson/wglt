import { Sprite } from '@wglt/graphics';
import { Item } from '@wglt/roguelike';
import { Player } from '../entities/player';
import { Game } from '../game';

export class Portal extends Item {
  other?: Portal;
  fade: boolean;

  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite) {
    super(game, name, sprite);
    this.x = x;
    this.y = y;
    this.zIndex = 0;
    this.fade = false;
    this.blocks = true;
  }

  onBump(_: Player): boolean {
    const exit = this.other;
    if (!exit) {
      return false;
    }

    this.game.warpToPoint(exit);
    return true;
  }
}
