import {Cell} from '../../src/cell.js';
import {Colors} from '../../src/colors.js';
import {Chars} from '../../src/chars.js';

export const Tiles = {
    TILE_WALL: new Cell(Chars.BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL, Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'a wall', boxChar: true, impassable: true, opaque: true }),
    TILE_FENCE: new Cell(Chars.BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL, Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'a fence', boxChar: true, impassable: true, opaque: false }),
    TILE_SIDEWALK: new Cell(Chars.DARK_SHADE, Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'the sidewalk' }),
    TILE_STREET: new Cell(Chars.LIGHT_SHADE, Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'a dirty street' }),
    TILE_POTHOLE: new Cell(Chars.MEDIUM_SHADE, Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'an ugly pothole' }),
    TILE_MANHOLE: new Cell('O', Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'a manhole to the sewer' }),
    TILE_INTERIOR: new Cell(Chars.LIGHT_SHADE, Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'the building interior' }),
    TILE_YELLOW_CHECKER: new Cell(Chars.CHECKER, Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'hazard warnings' }),
    TILE_DOOR: new Cell('+', Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'a door', door: true }),
    TILE_ATM: new Cell('$', Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'an ATM' }),
    TILE_STREET_WHITE_HLINE: new Cell('-', Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'a painted white line' }),
    TILE_STREET_WHITE_VLINE: new Cell('|', Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'a painted white line' }),
    TILE_STREET_YELLOW_HLINE: new Cell('-', Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'a painted yellow line' }),
    TILE_STREET_YELLOW_VLINE: new Cell('|', Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'a painted yellow line' }),
    TILE_TRASH_BIN: new Cell('O', Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'a trash bin', impassable: true }),
    TILE_TREE: new Cell('#', Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'a tree', impassable: true, opaque: true }),
    TILE_GRASS: new Cell(Chars.LIGHT_SHADE, Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'open grass' }),
    TILE_WEEDS: new Cell(Chars.MEDIUM_SHADE, Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'weedy grass' }),
    TILE_TRASH_WALL: new Cell('#', Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'a trash heap', impassable: true, opaque: true }),
    TILE_TRASH_FLOOR: new Cell(Chars.LIGHT_SHADE, Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'trash littered ground' }),

    TILE_HACK_VOID: new Cell(' ', Colors.BLACK, Colors.BLACK, { desc: 'void space', impassable: true, opaque: true }),
    TILE_HACK_PATH: new Cell(Chars.BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL, Colors.LIGHT_CYAN, Colors.BLACK, { desc: 'conduit', boxChar: true }),
    TILE_HACK_ENTRANCE: new Cell('*', Colors.LIGHT_CYAN, Colors.BLACK, { desc: 'the hack access point' }),
    TILE_HACK_EXIT: new Cell('*', Colors.LIGHT_GREEN, Colors.BLACK, { desc: 'the hack exit', hackExit: true }),
    TILE_HACK_NODE: new Cell('*', Colors.LIGHT_RED, Colors.BLACK, { desc: 'a hack node', hackNode: true }),
    TILE_HACK_STORE: new Cell('?', Colors.LIGHT_GRAY, Colors.BLACK, { desc: 'a data store' }),
};
