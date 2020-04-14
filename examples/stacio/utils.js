
import {Cell} from '../../src/cell.js';
import {Colors} from '../../src/colors.js';
import {Keys} from '../../src/keys.js';

export const BRUSH_CLEAR = new Cell(' ', Colors.WHITE, Colors.BLACK);

const DIRECTION_NORTHWEST = {dx: -1, dy: -1};
const DIRECTION_NORTH = {dx: 0, dy: -1};
const DIRECTION_NORTHEAST = {dx: 1, dy: -1};
const DIRECTION_WEST = {dx: -1, dy: 0};
const DIRECTION_EAST = {dx: 1, dy: 0};
const DIRECTION_SOUTHWEST = {dx: -1, dy: 1};
const DIRECTION_SOUTH = {dx: 0, dy: 1};
const DIRECTION_SOUTHEAST = {dx: 1, dy: 1};

export function dist(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
}

export function angleDist(theta1, theta2) {
    return normalizeAngle(theta1 - theta2);
}

export function normalizeAngle(theta) {
    while (theta > Math.PI) {
        theta -= Math.PI * 2.0;
    }
    while (theta < -Math.PI) {
        theta += Math.PI * 2.0;
    }
    return theta;
}

export function getDirectionsKey(term) {
    if (term.isKeyPressed(Keys.VK_NUMPAD1)) {
        return DIRECTION_SOUTHWEST;
    }
    if (term.isKeyPressed(Keys.VK_NUMPAD2) || term.isKeyPressed(Keys.VK_DOWN)) {
        return DIRECTION_SOUTH;
    }
    if (term.isKeyPressed(Keys.VK_NUMPAD3)) {
        return DIRECTION_SOUTHEAST;
    }
    if (term.isKeyPressed(Keys.VK_NUMPAD4) || term.isKeyPressed(Keys.VK_LEFT)) {
        return DIRECTION_WEST;
    }
    if (term.isKeyPressed(Keys.VK_NUMPAD6) || term.isKeyPressed(Keys.VK_RIGHT)) {
        return DIRECTION_EAST;
    }
    if (term.isKeyPressed(Keys.VK_NUMPAD7)) {
        return DIRECTION_NORTHWEST;
    }
    if (term.isKeyPressed(Keys.VK_NUMPAD8) || term.isKeyPressed(Keys.VK_UP)) {
        return DIRECTION_NORTH;
    }
    if (term.isKeyPressed(Keys.VK_NUMPAD9)) {
        return DIRECTION_NORTHEAST;
    }
    return null;
}
