import { getTileId } from '@wglt/tilemap';

export const Tiles = {
  EMPTY: 0,

  WALL_ISLAND: getTileId(6, 50),
  WALL_INTERSECTION: getTileId(3, 50),

  WALL_VERTICAL: getTileId(2, 48),
  WALL_HORIZONTAL: getTileId(4, 50),

  WALL_SOUTH_END: getTileId(2, 49),
  WALL_NORTH_END: getTileId(3, 48),
  WALL_WEST_END: getTileId(2, 50),
  WALL_EAST_END: getTileId(5, 50),

  WALL_NORTH_WEST_CORNER: getTileId(4, 48),
  WALL_NORTH_EAST_CORNER: getTileId(5, 48),
  WALL_SOUTH_WEST_CORNER: getTileId(4, 49),
  WALL_SOUTH_EAST_CORNER: getTileId(5, 49),

  WALL_NORTH_T: getTileId(6, 49),
  WALL_SOUTH_T: getTileId(7, 49),
  WALL_WEST_T: getTileId(6, 48),
  WALL_EAST_T: getTileId(7, 48),

  // Old
  SHADOW: getTileId(0, 1), // (0, 3),
  // WALL: getTileId(0, 48), // (0, 19),
  // HALF_WALL: getTileId(0, 48), // (0, 20),
  // HALF_WALL2: getTileId(0, 48), // (1, 20),
  // HALF_WALL3: getTileId(0, 48), // (2, 20),
  FLOOR: getTileId(0, 48), // (13, 17),
  WATER: getTileId(0, 57), // (0, 18),
  BRIDGE: getTileId(0, 48), // (15, 27),
  COBWEB_NORTHWEST: getTileId(0, 48), // (28, 22),
  COBWEB_NORTHEAST: getTileId(0, 48), // (29, 22),
  COBWEB_SOUTHWEST: getTileId(0, 48), // (30, 22),
  COBWEB_SOUTHEAST: getTileId(0, 48), // (31, 22),
  CLOSED_DOOR: getTileId(0, 48), // (7, 19),
  STAIRS_DOWN: getTileId(0, 48), // (14, 18),
  STAIRS_UP: getTileId(0, 48), // (15, 18),
  BARREL: getTileId(0, 48), // (24, 19),
  STATUE: getTileId(0, 48), // (16, 20),
  GRASS: getTileId(0, 48), // (0, 17),
  TREE1: getTileId(0, 48), // (20, 23),
  TREE2: getTileId(0, 48), // (22, 23),
  PATH: getTileId(0, 48), // (18, 17),
  FENCE1: getTileId(0, 48), // (16, 22),
  FENCE2: getTileId(0, 48), // (17, 22),
  FENCE3: getTileId(0, 48), // (18, 22),
  FENCE4: getTileId(0, 48), // (19, 22),
  FENCE5: getTileId(0, 48), // (20, 22),
  FENCE6: getTileId(0, 48), // (21, 22),
  FENCE7: getTileId(0, 48), // (22, 22),
  FENCE8: getTileId(0, 48), // (23, 22),
  FENCE9: getTileId(0, 48), // (24, 22),
  FENCE10: getTileId(0, 48), // (25, 22),
};
