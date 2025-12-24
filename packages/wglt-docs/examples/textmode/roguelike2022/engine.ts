import { Color, RNG, serializable, Terminal, TileMapCell } from 'wglt';
import { Action } from './actions';
import { Actor } from './actor';
import { BaseComponent } from './base';
import { Colors } from './color';
import { GameMap } from './gamemap';
import { EventHandler, MainGameEventHandler } from './handlers';
import { MessageLog } from './messagelog';
import { generateDungeon } from './procgen';
import { renderBar, renderDungeonLevel, renderNames } from './utils';

const MAP_WIDTH = 80;
const MAP_HEIGHT = 38;

const ROOM_MAX_SIZE = 10;
const ROOM_MIN_SIZE = 6;
const MAX_ROOMS = 30;

@serializable
export class Engine extends BaseComponent {
  readonly rng = new RNG();
  readonly player = new Actor('@', Colors.WHITE, 'Player', true, 30, 30, 1, 2);
  readonly messageLog = new MessageLog();
  eventHandler: EventHandler = new MainGameEventHandler(this);
  gameMap_: GameMap = new GameMap(this, 1, 1, []);
  path?: TileMapCell[];
  pathIndex = 0;

  get engine(): Engine {
    return this;
  }

  get gameMap(): GameMap {
    return this.gameMap_;
  }

  log(text: string, fg: Color = Colors.WHITE): void {
    this.messageLog.add(text, fg);
  }

  generateFloor(): void {
    this.gameMap_ = generateDungeon(
      this,
      this.gameMap.level + 1,
      MAX_ROOMS,
      ROOM_MIN_SIZE,
      ROOM_MAX_SIZE,
      MAP_WIDTH,
      MAP_HEIGHT
    );
    this.updateFov();
  }

  setPath(newPath: TileMapCell[] | undefined): void {
    this.path = newPath;
    this.pathIndex = 0;
  }

  handleEnemyTurns(): void {
    for (const actor of this.gameMap.actors) {
      try {
        actor.ai?.perform(actor);
      } catch (err) {
        console.error('Unhandled AI error:', err);
      }
    }
  }

  handleEvents(term: Terminal): void {
    if (this.player.hp > 0) {
      this.eventHandler.handleEvents(term);
    }
  }

  handleAction(action: Action | undefined): void {
    if (!action) {
      return;
    }

    try {
      action.perform();
    } catch (err) {
      this.log((err as Error).message, Colors.ERROR);
      this.setPath(undefined);
      return;
    }

    this.handleEnemyTurns();
    this.updateFov();
  }

  updateFov(): void {
    this.gameMap.updateFov(this.player.x, this.player.y);
  }

  render(term: Terminal): void {
    const console = term.console;

    // Clear the screen
    console.clear();

    // Draw the game map
    this.gameMap.render(console);

    // Draw overlay for input handler
    this.eventHandler.onRender(term);

    // Message log
    this.messageLog.render(console, 21, 40, 40, 5);

    // Health bar
    renderBar(console, this.player.hp, this.player.maxHp, 20);

    renderDungeonLevel(console, this.gameMap.level, 0, 42);

    // Names at mouse location
    renderNames(console, this.gameMap, term.mouse.x, term.mouse.y);
  }
}
