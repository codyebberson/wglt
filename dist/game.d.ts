import { Ability } from './ability';
import { Actor } from './actor';
import { Animation } from './animations/animation';
import { App } from './app';
import { AppState } from './appstate';
import { Color } from './color';
import { Entity } from './entity';
import { GameOptions } from './gameoptions';
import { MessageLog } from './gui/messagelog';
import { Panel } from './gui/panel';
import { TooltipDialog } from './gui/tooltipdialog';
import { Rect } from './rect';
import { RNG } from './rng';
import { Sprite } from './sprite';
import { Vec2 } from './vec2';
import { ArrayList } from './arraylist';
import { TileMapCell } from './tilemap/tilemapcell';
import { TileMap } from './tilemap/tilemap';
import { TileMapRenderer } from './tilemap/tilemaprenderer';
import { Message } from './message';
export declare class Game extends AppState {
    readonly viewport: Rect;
    readonly viewportFocus: Vec2;
    readonly animations: Animation[];
    readonly entities: ArrayList<Entity>;
    readonly cursor: Vec2;
    readonly tooltip: TooltipDialog;
    readonly rng: RNG;
    turnIndex: number;
    blocked: boolean;
    messageLog?: MessageLog;
    targetAbility?: Ability;
    targetCallback?: Function;
    targetSprite?: Sprite;
    targetTile?: TileMapCell;
    path?: TileMapCell[];
    pathIndex: number;
    onUpdate?: Function;
    tileMap: TileMap;
    tileMapRenderer: TileMapRenderer;
    player?: Actor;
    cooldownSprite?: Sprite;
    tooltipElement?: Panel;
    blackoutRect?: Rect;
    horizontalViewDistance: number;
    verticalViewDistance: number;
    zoom: number;
    constructor(app: App, options: GameOptions);
    readonly tileSize: Rect;
    log(message: string | Message, color?: Color): void;
    addAnimation(animation: Animation): import("./animations/animationpromise").AnimationPromise;
    update(): void;
    private updateTooltip;
    private updateZoom;
    private updateAnimations;
    private updateEntities;
    resetViewport(): void;
    private updateViewport;
    private drawTileMap;
    private drawTargeting;
    private drawEntities;
    private drawAnimations;
    isTargeting(): boolean;
    startTargeting(ability: Ability, callback?: Function): void;
    private endTargeting;
    cancelTargeting(): void;
    private handlePlayerInput;
    /**
     * Tries to move or attack in the specified direction.
     * Returns true on success (the player moved or attacked).
     * Returns false on failure (unable to move or attack).
     * @param dx The x direction to move.
     * @param dy The y direction to move.
     */
    tryMoveOrAttack(dx: number, dy: number): boolean;
    private recalculateViewportFocus;
    private doAi;
    private nextTurn;
    stopAutoWalk(): void;
    isBlocked(x: number, y: number): boolean;
    getEntityAt(x: number, y: number): Entity | undefined;
    getActorAt(x: number, y: number): Actor | undefined;
    recomputeFov(): void;
}
