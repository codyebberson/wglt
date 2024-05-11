import { Sprite } from '@wglt/graphics';
import { Item } from '@wglt/roguelike';
import { getTileId } from '@wglt/tilemap';
import { Game } from '../game';

const TILE_OPEN_DOOR = getTileId(7, 20);
const SPRITE = new Sprite(256, 432, 16, 16, 1, true);

export abstract class Door extends Item {
  constructor(game: Game, x: number, y: number) {
    super(game, 'door', SPRITE);
    this.x = x;
    this.y = y;
    this.zIndex = 0;
    this.blocks = true;
  }

  openDoor(): void {
    const game = this.game;
    const map = game.tileMap;
    game.entities.remove(this);
    map.setTile(this.x, this.y, 0, TILE_OPEN_DOOR);
    map.setBlocked(this.x, this.y, false);
  }
}
