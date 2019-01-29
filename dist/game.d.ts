import { App } from './app';
import { AppState } from './appstate';
import { Effect } from './effects/effect';
import { Entity } from './entity';
import { GameOptions } from './gameoptions';
import { Rect } from './rect';
import { Sprite } from './sprite';
import { TileMap, TileMapCell } from './tilemap';
import { Vec2 } from './vec2';
export declare class Game extends AppState {
    readonly tileWidth: number;
    readonly tileHeight: number;
    readonly viewport: Rect;
    readonly effects: Effect[];
    readonly entities: Entity[];
    readonly cursor: Vec2;
    turnIndex: number;
    blocked: boolean;
    targetCallback?: Function;
    targetSprite?: Sprite;
    targetTile?: TileMapCell;
    targetEntity?: Entity;
    path?: TileMapCell[];
    pathIndex: number;
    onUpdate?: Function;
    tileMap?: TileMap;
    player?: Entity;
    constructor(app: App, options: GameOptions);
    update(): void;
    private updateEffects;
    private updateEntities;
    private updateViewport;
    private drawTileMap;
    private drawTargeting;
    private drawEntities;
    private drawEffects;
    isTargeting(): boolean;
    startTargeting(callback: Function): void;
    private endTargeting;
    cancelTargeting(): void;
    private handlePlayerInput;
    private doAi;
    private nextTurn;
    getEnemyAt(x: number, y: number): Entity | undefined;
}
