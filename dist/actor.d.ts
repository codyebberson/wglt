import { AI } from './ai/ai';
import { Entity } from './entity';
import { Game } from './game';
import { Item } from './item';
import { Sprite } from './sprite';
import { XArray } from './xarray';
export declare class Actor extends Entity {
    health: number;
    maxHealth: number;
    actionPoints: number;
    inventory: XArray<Item>;
    ai?: AI;
    constructor(game: Game, x: number, y: number, name: string, sprite: Sprite, blocks: boolean);
    move(dx: number, dy: number): boolean;
    moveToward(targetX: number, targetY: number): void;
    attack(target: Actor): void;
    takeDamage(damage: number): void;
    pickup(item: Item): void;
    use(item: Item): boolean;
    onAttack(attacker: Actor, damage: number): void;
    onDeath(): void;
}
