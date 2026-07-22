import { registerSerializable } from '../core/serialize.ts';
import { Vec2 } from '../core/vec2.ts';

export class TileMapCell extends Vec2 {
  static {
    registerSerializable('wglt.TileMapCell', TileMapCell);
  }

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
