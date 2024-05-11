import { Pico8Palette } from '@wglt/core';
import { Message, Sprite } from '@wglt/graphics';
import { Actor } from '@wglt/roguelike';
import { Item } from '@wglt/roguelike';
import { Game } from '../game';

const SPRITE = new Sprite(896, 168, 16, 16, 1, true);

const TOOLTIPS = [
  new Message('Gold', Pico8Palette.WHITE),
  new Message('The coin of the realm.', Pico8Palette.WHITE),
];

export class Gold extends Item {
  constructor(game: Game, x?: number, y?: number) {
    super(game, 'gold', SPRITE, undefined, undefined, undefined, undefined, 1);
    this.tooltipMessages = TOOLTIPS;
    this.x = x || 0;
    this.y = y || 0;
  }

  onPickup(entity: Actor): void {
    this.game.log(`${entity.name} picked up gold coins`, Pico8Palette.WHITE);
  }
}
