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
import { TileMap, TileMapCell } from './tilemap';
import { Vec2 } from './vec2';
export declare class Game extends AppState {
    readonly tileSize: Rect;
    readonly viewport: Rect;
    readonly viewportFocus: Vec2;
    readonly animations: Animation[];
    readonly entities: Entity[];
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
    tileMap?: TileMap;
    player?: Actor;
    cooldownSprite?: Sprite;
    tooltipElement?: Panel;
    blackoutRect?: Rect;
    viewDistance: number;
    constructor(app: App, options: GameOptions);
    log(text: string, color?: Color): void;
    addAnimation(animation: Animation): import("./animations/animationpromise").AnimationPromise;
    update(): void;
    private updateTooltip;
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
    private isKeyPressed;
    tryMoveOrAttack(dx: number, dy: number): boolean | undefined;
    private recalculateViewportFocus;
    private doAi;
    private nextTurn;
    stopAutoWalk(): void;
    isBlocked(x: number, y: number): boolean;
    getEntityAt(x: number, y: number): Entity | undefined;
    getActorAt(x: number, y: number): Actor | undefined;
    recomputeFov(): void;
}
