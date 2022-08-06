import { Color } from '../../src/color';
import { Entity } from './entity';
import { Game } from './game';
export declare class Item extends Entity {
    powerBonus: number;
    defenseBonus: number;
    maxHpBonus: number;
    slot: string;
    equipped: boolean;
    useFunction?: (item: Item) => void;
    constructor(game: Game, x: number, y: number, char: string, name: string, color: Color);
}
