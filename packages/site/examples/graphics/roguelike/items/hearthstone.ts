import { Pico8Palette } from 'wglt';
import { Message, Sprite } from 'wglt';
import { Item } from 'wglt';
import { Player } from '../entities/player';
import { Game } from '../game';

const SPRITE = new Sprite(848, 168, 16, 16, 1, true);

const TOOLTIPS = [
  new Message('Hearthstone', Pico8Palette.WHITE),
  new Message('Item Level 1', Pico8Palette.YELLOW),
  new Message('Use: Returns you to your home.', Pico8Palette.GREEN),
  new Message('Speak to an Innkeeper in a different', Pico8Palette.GREEN),
  new Message('place to change your home location.', Pico8Palette.GREEN),
];

export class Hearthstone extends Item {
  constructor(game: Game, x?: number, y?: number) {
    super(game, 'Hearthstone', SPRITE);
    this.x = x || 0;
    this.y = y || 0;
    this.tooltipMessages = TOOLTIPS;
  }

  onUse(player: Player): boolean {
    const game = player.game as Game;
    game.hideAllDialogs();
    game.warpToPoint(player.home);
    return true;
  }
}
