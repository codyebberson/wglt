import { Color } from "../../src/color";
import { Game } from "./game";
import { Entity } from './entity';

export class Item extends Entity {
  powerBonus: number;
  defenseBonus: number;
  maxHpBonus: number;
  slot: string;
  equipped: boolean;
  useFunction?: (item: Item) => void;

  constructor(game: Game, x: number, y: number, char: string, name: string, color: Color) {
    super(game, x, y, char, name, color, false);
    this.powerBonus = 0;
    this.defenseBonus = 0;
    this.maxHpBonus = 0;
    this.slot = '';
    this.equipped = false;
  }
}
