import { type Color, deserialize, serialize } from 'wglt';
import { BaseComponent } from './base';
import { GameMap } from './gamemap';

export const RenderOrder = {
  CORPSE: 0,
  ITEM: 1,
  ACTOR: 2,
};

export abstract class Entity extends BaseComponent {
  x: number;
  y: number;
  char: string;
  color: Color;
  name: string;
  blocks: boolean;
  renderOrder: number;

  constructor(
    x: number,
    y: number,
    char: string,
    color: Color,
    name: string,
    blocks = false,
    renderOrder = 0
  ) {
    super();
    this.x = x;
    this.y = y;
    this.char = char;
    this.color = color;
    this.name = name;
    this.blocks = blocks;
    this.renderOrder = renderOrder;
  }

  spawn(gameMap: GameMap, x: number, y: number): Entity {
    const clone = deserialize(serialize(this)) as Entity;
    clone.parent = gameMap;
    clone.x = x;
    clone.y = y;
    gameMap.entities.push(clone);
    return clone;
  }

  distance(x: number, y: number): number {
    return Math.hypot(this.x - x, this.y - y);
  }

  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }
}
