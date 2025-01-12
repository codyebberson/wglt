import { Cell } from 'wglt';
import { Colors } from './color';

export interface Tile {
  walkable: boolean;
  transparent: boolean;
  dark: Cell;
  light: Cell;
}

export const floor = {
  walkable: true,
  transparent: true,
  dark: new Cell(0, 0, '.', Colors.DARK_GRAY, Colors.BLACK),
  light: new Cell(0, 0, '.', Colors.LIGHT_GRAY, Colors.BLACK),
};

export const wall = {
  walkable: false,
  transparent: false,
  dark: new Cell(0, 0, '#', Colors.DARK_GRAY, Colors.BLACK),
  light: new Cell(0, 0, '#', Colors.LIGHT_GRAY, Colors.BLACK),
};

export const stairs = {
  walkable: false,
  transparent: false,
  dark: new Cell(0, 0, '>', Colors.DARK_GRAY, Colors.BLACK),
  light: new Cell(0, 0, '>', Colors.WHITE, Colors.BLACK),
};
