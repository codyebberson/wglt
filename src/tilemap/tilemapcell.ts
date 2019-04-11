import { Vec2 } from "../vec2";

export class TileMapCell extends Vec2 {
  blocked: boolean;
  blockedSight: boolean;
  visible: boolean;
  seen: boolean;
  g: number;
  h: number;
  prev: TileMapCell | null;

  constructor(x: number, y: number) {
    super(x, y);
    this.blocked = true;
    this.blockedSight = true;
    this.visible = false;
    this.seen = false;
    this.g = 0;
    this.h = 0;
    this.prev = null;
  }
}
