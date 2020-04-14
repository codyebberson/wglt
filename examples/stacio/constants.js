import { Rect } from "../../src/rect";

const SCREEN_WIDTH_PIXELS = 640;
const SCREEN_HEIGHT_PIXELS = 360;
const SCREEN_WIDTH = SCREEN_WIDTH_PIXELS / 8;
const SCREEN_HEIGHT = SCREEN_HEIGHT_PIXELS / 8;
const LEFT_CONSOLE_WIDTH = 20;
const TOP_CONSOLE_HEIGHT = 3;
const BOTTOM_CONSOLE_HEIGHT = 2;

// const GAME_AREA_X = LEFT_CONSOLE_WIDTH;
// const GAME_AREA_Y = TOP_CONSOLE_HEIGHT;
// const GAME_AREA_WIDTH = SCREEN_WIDTH - LEFT_CONSOLE_WIDTH;
// const GAME_AREA_HEIGHT = SCREEN_HEIGHT - TOP_CONSOLE_HEIGHT - BOTTOM_CONSOLE_HEIGHT;
const GAME_AREA_X = 0;
const GAME_AREA_Y = 0;
const GAME_AREA_WIDTH = SCREEN_WIDTH;
const GAME_AREA_HEIGHT = SCREEN_HEIGHT;

const DEFAULT_VIEW_DISTANCE = 14.5;
const PLAYER_VIEW_DISTANCE = 19.5;

const BLOCK_SIZE = 100;
const MAP_WIDTH_BLOCKS = 10;
const MAP_HEIGHT_BLOCKS = 5;
const MAP_BUFFER = 12;
const MAP_WIDTH = MAP_WIDTH_BLOCKS * BLOCK_SIZE + 2 * MAP_BUFFER;
const MAP_HEIGHT = MAP_HEIGHT_BLOCKS * BLOCK_SIZE + 2 * MAP_BUFFER;

export const Constants = {
    SCREEN_WIDTH_PIXELS: SCREEN_WIDTH_PIXELS,
    SCREEN_HEIGHT_PIXELS: SCREEN_HEIGHT_PIXELS,
    SCREEN_WIDTH: SCREEN_WIDTH,
    SCREEN_HEIGHT: SCREEN_HEIGHT,
    LEFT_CONSOLE_WIDTH: LEFT_CONSOLE_WIDTH,
    TOP_CONSOLE_HEIGHT: TOP_CONSOLE_HEIGHT,
    BOTTOM_CONSOLE_HEIGHT: BOTTOM_CONSOLE_HEIGHT,

    GAME_AREA_X: GAME_AREA_X,
    GAME_AREA_Y: GAME_AREA_Y,
    GAME_AREA_WIDTH: GAME_AREA_WIDTH,
    GAME_AREA_HEIGHT: GAME_AREA_HEIGHT,
    GAME_AREA: new Rect(GAME_AREA_X, GAME_AREA_Y, GAME_AREA_WIDTH, GAME_AREA_HEIGHT),

    DEFAULT_VIEW_DISTANCE: DEFAULT_VIEW_DISTANCE,
    PLAYER_VIEW_DISTANCE: PLAYER_VIEW_DISTANCE,

    BLOCK_SIZE: BLOCK_SIZE,
    MAP_WIDTH_BLOCKS: MAP_WIDTH_BLOCKS,
    MAP_HEIGHT_BLOCKS: MAP_HEIGHT_BLOCKS,
    MAP_BUFFER: MAP_BUFFER,
    MAP_WIDTH: MAP_WIDTH,
    MAP_HEIGHT: MAP_HEIGHT,
};