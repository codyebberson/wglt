import { Point } from '../core/point';
import { serializable } from '../core/serialize';

@serializable
export class TileMapCell extends Point {
  blocked: boolean;
  blockedSight: boolean;
  visible: boolean;
  explored: boolean;
  pathId: number;
  g: number;
  h: number;
  prev: TileMapCell | null;

  constructor(x: number, y: number) {
    super(x, y);
    this.blocked = true;
    this.blockedSight = true;
    this.visible = false;
    this.explored = false;
    this.pathId = -1;
    this.g = 0;
    this.h = 0;
    this.prev = null;
  }
}
