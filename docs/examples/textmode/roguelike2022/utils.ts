import { Console, capitalize } from 'wglt';
import { Colors } from './color';
import { GameMap } from './gamemap';

export function renderBar(console: Console, value: number, max: number, width: number): void {
  const barWidth = Math.round((value / max) * width);
  console.fillRect(0, 40, width, 1, ' ', Colors.BAR_TEXT, Colors.BAR_EMPTY);
  console.fillRect(0, 40, barWidth, 1, ' ', Colors.BAR_TEXT, Colors.BAR_FILLED);
  console.drawString(0, 40, `HP: ${value}/${max}`, Colors.BAR_TEXT);
}

export function renderDungeonLevel(console: Console, level: number, x: number, y: number): void {
  console.drawString(x, y, `Dungeon level: ${level}`, Colors.WHITE);
}

export function renderNames(console: Console, gameMap: GameMap, x: number, y: number): void {
  console.drawString(
    21,
    39,
    capitalize(
      gameMap.entities
        .filter((e) => e.x === x && e.y === y)
        .map((e) => e.name)
        .join(', ')
    ),
    Colors.WHITE
  );
}

export function removeFromArray<T>(array: T[], element: T): void {
  const index = array.indexOf(element);
  if (index >= 0) {
    array.splice(index, 1);
  }
}
