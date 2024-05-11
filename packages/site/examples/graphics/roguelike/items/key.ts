import { Sprite } from '@wglt/graphics';
import { Item } from '@wglt/roguelike';
import { Player } from '../entities/player';
import { Game } from '../game';

const SPRITE = new Sprite(688, 168, 16, 16, 1, true);

export class Key extends Item {
  readonly keyId: number;

  constructor(game: Game, x: number, y: number, keyId: number) {
    super(game, 'key', SPRITE);
    this.x = x;
    this.y = y;
    this.keyId = keyId;
  }

  onPickup(player: Player): void {
    player.keys[this.keyId] = true;
  }
}
