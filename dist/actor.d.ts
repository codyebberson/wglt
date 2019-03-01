import { Ability } from './ability';
import { AI } from './ai/ai';
import { Entity } from './entity';
import { Game } from './game';
import { Item } from './item';
import { Sprite } from './sprite';
import { Talent } from './talent';
import { XArray } from './xarray';
export declare class Actor extends Entity {
    hp: number;
    maxHp: number;
    ap: number;
    maxAp: number;
    inventory: XArray<Item>;
    talents: XArray<Talent>;
    ai?: AI;
    constructor(game: Game, x: number, y: number, name: string, sprite: Sprite, blocks: boolean);
    move(dx: number, dy: number): boolean;
    moveToward(targetX: number, targetY: number): void;
    attack(target: Actor): void;
    takeHeal(heal: number): void;
    takeDamage(damage: number): void;
    pickup(item: Item): void;
    use(item: Item): boolean;
    cast(ability: Ability, callback?: Function): void;
    onAttack(attacker: Actor, damage: number): void;
    onDeath(): void;
}
