import { Colors } from '../../src/colors.js';
import { computePath } from '../../src/path.js';
import { Console } from '../../src/console.js';
import { Terminal } from '../../src/terminal.js';
import { Keys } from '../../src/keys.js';

import { initWorld } from './procgen.js';
import { GameModes } from './gamemodes.js';
import { EntityTypes } from './entitytypes.js';
import { EntityStates } from './entitystates.js';
import { Constants } from './constants.js';
import { BlockTypes } from './blocktypes.js';
import { Tiles } from './tiles.js';
import { BRUSH_CLEAR, angleDist, dist, getDirectionsKey } from './utils.js';
import { Point } from '../../src/point.js';

const term = new Terminal(document.querySelector('canvas'), 80, 45, {frameDelay: 5});
const state = initWorld();
const gameArea = new Console(Constants.GAME_AREA_WIDTH, Constants.GAME_AREA_HEIGHT);

function getEntityAt(x, y) {
    let cell = state.map.getCell(x, y);
    return cell ? cell.entity : null;
}

function setGameMode(newGameMode) {
    state.gameMode = newGameMode;
    term.fillRect(0, 0, Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT, BRUSH_CLEAR);
}

function handleInput() {
    switch (state.gameMode) {
        case GameModes.MODE_PLAYER:
            handlePlayerModeInput();
            break;
        case GameModes.MODE_CURSOR:
            handleCursorModeInput();
            break;
        case GameModes.MODE_CHARACTER:
            if (term.isKeyPressed(Keys.VK_C)) {
                setGameMode(GameModes.MODE_PLAYER);
            }
            break;
        case GameModes.MODE_MAP:
            if (term.isKeyPressed(Keys.VK_M)) {
                setGameMode(GameModes.MODE_PLAYER);
            }
            break;
        case GameModes.MODE_DIALOG:
            if (term.isKeyPressed(Keys.VK_ESCAPE)) {
                setGameMode(GameModes.MODE_PLAYER);
            }
            break;
        case GameModes.MODE_TRADE:
            if (term.isKeyPressed(Keys.VK_ESCAPE)) {
                setGameMode(GameModes.MODE_PLAYER);
            }
            break;
        case GameModes.MODE_DEBUG:
            if (term.isKeyPressed(Keys.VK_D)) {
                setGameMode(GameModes.MODE_PLAYER);
            }
            break;
    }
}

function handlePlayerModeInput() {
    if ((term.mouse.dx !== 0 || term.mouse.dy !== 0) && Constants.GAME_AREA.contains(term.mouse)) {
        state.cursor.x = term.mouse.x - Constants.GAME_AREA.x + state.viewport.x;
        state.cursor.y = term.mouse.y - Constants.GAME_AREA.y + state.viewport.y;
    }

    if (Constants.GAME_AREA.contains(term.mouse) && term.mouse.buttons[0].isClicked()) {
        const entity = getEntityAt(state.cursor.x, state.cursor.y);
        if (entity) {
            // Select the entity under the cursor
            state.selectedEntity = entity;
        } else {
            // Update player destination
            state.player.dest = new Point(state.cursor.x, state.cursor.y);
        }

        // Hide the cursor
        state.cursor.x = -1;
        state.cursor.y = -1;
        return;
    }

    const dir = getDirectionsKey(term);
    if (dir) {
        // Update player destination
        // state.player.dest.x = state.player.x + dir.dx;
        // state.player.dest.y = state.player.y + dir.dy;
        state.player.dest = new Point(state.player.x + dir.dx, state.player.y + dir.dy);

        // Hide the cursor
        state.cursor.x = -1;
        state.cursor.y = -1;
        return;
    }

    if (term.isKeyPressed(Keys.VK_NUMPAD5) || term.isKeyPressed(Keys.VK_SPACE)) {
        state.player.ap--;
        return;
    }

    if (term.isKeyPressed(Keys.VK_ENTER)) {
        state.cursor.x = state.player.x;
        state.cursor.y = state.player.y;
        state.selectedEntity = null;
        setGameMode(GameModes.MODE_CURSOR);
        return;
    }

    if (term.isKeyPressed(Keys.VK_1)) {
        if (state.selectedEntity) {
            tryAttack(state.player, state.selectedEntity);
        }
        return;
    }

    if (term.isKeyPressed(Keys.VK_5)) {
        if (state.selectedEntity && state.selectedEntity.pwned) {
            state.followed = state.selectedEntity;
        }
        return;
    }

    if (term.isKeyPressed(Keys.VK_C)) {
        setGameMode(GameModes.MODE_CHARACTER);
        return;
    }

    if (term.isKeyPressed(Keys.VK_D)) {
        setGameMode(GameModes.MODE_DEBUG);
        return;
    }

    if (term.isKeyPressed(Keys.VK_M)) {
        setGameMode(GameModes.MODE_MAP);
        return;
    }

    if (term.isKeyPressed(Keys.VK_TAB)) {
        handleTab();
        return;
    }
}

function handleCursorModeInput() {
    const dir = getDirectionsKey(term);
    if (dir) {
        state.cursor.x += dir.dx;
        state.cursor.y += dir.dy;
        return;
    }

    if (term.isKeyPressed(Keys.VK_NUMPAD5) || term.isKeyPressed(Keys.VK_SPACE)) {
        state.player.ap--;
        return;
    }

    if (term.isKeyPressed(Keys.VK_ENTER)) {
        state.selectedEntity = getEntityAt(state.cursor.x, state.cursor.y);
        state.cursor.x = -1;
        state.cursor.y = -1;
        setGameMode(GameModes.MODE_PLAYER);
        return;
    }

    if (term.isKeyPressed(Keys.VK_ESCAPE)) {
        state.cursor.x = -1;
        state.cursor.y = -1;
        setGameMode(GameModes.MODE_PLAYER);
        return;
    }
}

function getEntitiesOnScreen() {
    // Build list of all state.entities on the screen
    let entitiesOnScreen = [];
    for (var i = 1; i < state.entities.length; i++) {
        let x2 = state.entities[i].x - state.viewport.x;
        let y2 = state.entities[i].y - state.viewport.y;
        if (x2 >= 0 && x2 < Constants.GAME_AREA_WIDTH && y2 >= 0 && y2 < Constants.GAME_AREA_HEIGHT) {
            let cell = state.map.getCell(state.entities[i].x, state.entities[i].y);
            if (cell && cell.visible) {
                entitiesOnScreen.push(state.entities[i]);
            }
        }
    }

    // Sort the list by distance from the state.player
    entitiesOnScreen.sort(function (e1, e2) {
        let d1 = dist(state.player.x, state.player.y, e1.x, e1.y);
        let d2 = dist(state.player.x, state.player.y, e2.x, e2.y);
        return d1 - d2;
    });

    return entitiesOnScreen;
}

function handleTab() {
    const entitiesOnScreen = getEntitiesOnScreen();
    let currentIndex = entitiesOnScreen.indexOf(state.selectedEntity);
    if (currentIndex >= 0) {
        // If have selected entity, move to next
        let nextIndex = (currentIndex + 1) % entitiesOnScreen.length;
        state.selectedEntity = entitiesOnScreen[nextIndex];
    } else {
        // Otherwise, select first
        state.selectedEntity = entitiesOnScreen[0];
    }
}

function tryAttack(src, dest) {
    if (!canSee(src, dest.x, dest.y)) {
        return false;
    }

    let damage = Math.floor(Math.random() * 20.0);
    dest.hp = Math.max(0, dest.hp - damage);
    dest.state = EntityStates.STATE_ATTACKING;
    src.ap--;

    if (src === state.player) {
        dest.faction.playerReputation = -1;
    }

    if (dest.hp <= 0) {
        destroyEntity(dest);
        state.messages.push({ color: Colors.DARK_MAGENTA, text: getAttackMessageName(src) + ' killed ' + getAttackMessageName(dest) });
        if (dest === state.player) {
            state.messages.push({ color: Colors.LIGHT_MAGENTA, text: 'GAME OVER' });
        }
    } else {
        state.messages.push({ color: Colors.DARK_GRAY, text: getAttackMessageName(src) + ' attacked ' + getAttackMessageName(dest) + ' ' + damage + ' dmg' })
    }

    return true;
}

function getAttackMessageName(entity) {
    return entity === state.player ? 'You' : entity.name;
}

function updateEntity(entity) {
    if (entity.hp <= 0 || entity.ap <= 0) {
        return;
    }

    if (dist(state.player.x, state.player.y, entity.x, entity.y) > 80) {
        return;
    }

    entity.seen = true;

    if (entity.entityType === EntityTypes.ENTITY_TYPE_GUARD || entity.entityType === EntityTypes.ENTITY_TYPE_STAFF) {
        let canSeePlayer = canSee(entity, state.player.x, state.player.y);

        if (entity.entityType === EntityTypes.ENTITY_TYPE_GUARD && canSeePlayer && entity.faction.playerReputation < 0) {
            entity.state = EntityStates.STATE_ATTACKING;
        }

        if (entity.state === EntityStates.STATE_ATTACKING) {
            if (canSeePlayer) {
                entity.lastSeen.x = state.player.x;
                entity.lastSeen.y = state.player.y;

                if (dist(entity.x, entity.y, state.player.x, state.player.y) <= 5) {
                    entity.dest.x = -1;
                    entity.dest.y = -1;
                    tryAttack(entity, state.player);
                } else {
                    entity.dest.x = state.player.x;
                    entity.dest.y = state.player.y;
                }
            } else {
                entity.dest.x = entity.lastSeen.x;
                entity.dest.y = entity.lastSeen.y;
            }

        } else if (entity.state === EntityStates.STATE_WAITING) {
            entity.waitCount--;
            if (entity.waitCount <= 0) {
                entity.state = EntityStates.STATE_WALKING;
                entity.dest = entity.waypoints[entity.waypointIndex];
            }

        } else if (entity.state == EntityStates.STATE_WALKING) {
            if (entity.x === entity.dest.x && entity.y === entity.dest.y) {
                entity.waypointIndex = (entity.waypointIndex + 1) % entity.waypoints.length;
                entity.state = EntityStates.STATE_WAITING;
                if (entity.faction.justice) {
                    entity.waitCount = 5;
                } else {
                    entity.waitCount = 3 + Math.floor(Math.random() * 20);
                }
            }
        }
    }

    if (entity.entityType === EntityTypes.ENTITY_TYPE_CAMERA) {
        entity.theta += entity.deltaTheta;
        if (entity.theta < entity.minTheta) {
            entity.theta = entity.minTheta;
            entity.deltaTheta = -entity.deltaTheta;
        }
        if (entity.theta > entity.maxTheta) {
            entity.theta = entity.maxTheta;
            entity.deltaTheta = -entity.deltaTheta;
        }
    }

    if (entity.dest.x !== -1 && entity.dest.y !== -1 && (entity.dest.x !== entity.x || entity.dest.y !== entity.y)) {
        // Entity has a destination and entity is not there yet.

        if (!entity.path ||
                entity.path.length === 0 ||
                entity.path[entity.path.length - 1].x !== entity.dest.x ||
                entity.path[entity.path.length - 1].y !== entity.dest.y) {
            // Entity has a destination, but no path
            // Compute the path.
            // Use max distance because path can be obstructed.
            // This is especially common when multiple entities are chasing the state.player.
            entity.path = computePath(state.map, entity, entity.dest, 200);

            // 0 is current position, 1 is next position.
            entity.pathIndex = 0;
        }

        if (entity.path && entity.pathIndex < entity.path.length) {
            if (entity.pathIndex < 0 || entity.pathIndex >= entity.path.length) {
                throw new Error('Entity path index out of range');
            }
            const currStep = entity.path[entity.pathIndex];
            if (!currStep) {
                throw new Error('Missing step in path');
            }
            if (entity.x !== currStep.x || entity.y !== currStep.y) {
                throw new Error('Entity not at current step in path');
            }

            const nextStep = entity.path[entity.pathIndex + 1];
            if (nextStep && isEmpty(nextStep.x, nextStep.y)) {
                const dx = nextStep.x - entity.x;
                const dy = nextStep.y - entity.y;

                state.map.grid[entity.y][entity.x].entity = null;
                entity.x = nextStep.x;
                entity.y = nextStep.y;
                state.map.grid[entity.y][entity.x].entity = entity;
                entity.theta = Math.atan2(dy, dx);
                entity.ap--;
                entity.pathIndex++;

                if (state.map.grid[entity.y][entity.x].meta.door) {
                    state.map.grid[entity.y][entity.x].open = true;
                    state.map.grid[entity.y][entity.x].blocked = false;
                    state.map.grid[entity.y][entity.x].blockSight = false;
                }
            }
        }
    }
}

function updateEntities() {
    updateEntity(state.player);

    if (state.player.ap > 0) {
        // Waiting on state.player input
        return;
    }

    state.gameClock++;

    state.vehicle.x += state.vehicle.dx;
    if (state.vehicle.x > 500) {
        state.vehicle.x = 500;
        state.vehicle.dx = -4;
    }
    if (state.vehicle.x < 0) {
        state.vehicle.x = 0;
        state.vehicle.dx = 4;
    }

    state.player.ap = 1;

    for (var i = 1; i < state.entities.length; i++) {
        updateEntity(state.entities[i]);
        state.entities[i].ap = 1;
    }
}

function destroyEntity(entity) {
    state.entities.splice(state.entities.indexOf(entity), 1);
    if (entity === state.selectedEntity) {
        state.selectedEntity = null;
    }
    state.map.grid[entity.y][entity.x].entity = null;
}

function isEmpty(x, y) {
    var cell = state.map.grid[y][x];
    return !cell.meta.impassable && !cell.entity;
}

term.update = function () {
    term.clear();
    handleInput();
    updateEntities();
    draw();
};

function draw() {
    switch (state.gameMode) {
        case GameModes.MODE_PLAYER:
        case GameModes.MODE_CURSOR:
            drawNormalMode();
            break;

        case GameModes.MODE_CHARACTER:
            drawCharacterScreen();
            break;

        case GameModes.MODE_MAP:
            drawMapScreen();
            break;

        case GameModes.MODE_DIALOG:
            drawDialog();
            break;

        case GameModes.MODE_TRADE:
            drawTrade();
            break;
    }
}

function updateViewport() {
    var targetX = state.player.x;
    var targetY = state.player.y;

    if (state.followed) {
        targetX = state.followed.x;
        targetY = state.followed.y;
    }

    state.viewport.x = targetX - Math.floor(Constants.GAME_AREA_WIDTH / 2);
    state.viewport.y = targetY - Math.floor(Constants.GAME_AREA_HEIGHT / 2);

    if (state.gameMode === GameModes.MODE_CURSOR) {
        let leftMargin = state.cursor.x - state.viewport.x;
        if (leftMargin < 10) {
            state.viewport.x = state.cursor.x - 10;
        }

        let topMargin = state.cursor.y - state.viewport.y;
        if (topMargin < 8) {
            state.viewport.y = state.cursor.y - 8;
        }

        let rightMargin = (state.viewport.x + Constants.GAME_AREA_WIDTH) - state.cursor.x;
        if (rightMargin < 10) {
            state.viewport.x = state.cursor.x + 10 - Constants.GAME_AREA_WIDTH;
        }

        let bottomMargin = (state.viewport.y + Constants.GAME_AREA_HEIGHT) - state.cursor.y;
        if (bottomMargin < 8) {
            state.viewport.y = state.cursor.y + 8 - Constants.GAME_AREA_HEIGHT;
        }
    }

    if (state.viewport.x < 0) {
        state.viewport.x = 0;
    }
    if (state.viewport.y < 0) {
        state.viewport.y = 0;
    }
    if (state.viewport.x > Constants.MAP_WIDTH - Constants.GAME_AREA_WIDTH) {
        state.viewport.x = Constants.MAP_WIDTH - Constants.GAME_AREA_WIDTH;
    }
    if (state.viewport.y > Constants.MAP_HEIGHT - Constants.GAME_AREA_HEIGHT) {
        state.viewport.y = Constants.MAP_HEIGHT - Constants.GAME_AREA_HEIGHT;
    }

    if (Constants.GAME_AREA.contains(term.mouse)) {
        state.cursor.x = term.mouse.x - Constants.GAME_AREA.x + state.viewport.x;
        state.cursor.y = term.mouse.y - Constants.GAME_AREA.y + state.viewport.y;
    }
}

function calculateVisible() {
    state.map.computeFov(state.player.x, state.player.y, state.player.viewDistance | 0);

    // for (var i = 0; i < state.pwned.length; i++) {
    //     calculateVisibleForEntity(state.pwned[i]);
    // }
}

function updateFogOfWar() {
    // Move all previously visible to "seen"
    state.map.updateExplored();

    // Calculate state.player line of sight
    calculateVisible();
}

function drawMap() {
    for (var y = 0; y < Constants.GAME_AREA_HEIGHT; y++) {
        let y2 = state.viewport.y + y;
        for (var x = 0; x < Constants.GAME_AREA_WIDTH; x++) {
            let x2 = state.viewport.x + x;
            let cell = state.map.getCell(x2, y2);
            if (!cell) {
                gameArea.drawCell(x, y, BRUSH_CLEAR);
            } else if (cell.visible) {
                gameArea.drawCell(x, y, cell);
            } else if (cell.explored) {
                gameArea.drawChar(x, y, cell.charCode, Colors.DARK_GRAY, Colors.BLACK);
            } else {
                gameArea.drawCell(x, y, BRUSH_CLEAR);
            }
        }
    }
}

function drawNormalMode() {
    updateViewport();
    updateFogOfWar();
    drawMap();

    const entitiesOnScreen = getEntitiesOnScreen();

    // Draw player
    // TODO: Should getEntitiesOnScreen include the player?
    gameArea.drawChar(state.player.x - state.viewport.x, state.player.y - state.viewport.y, '@', Colors.WHITE);

    // Draw state.entities
    for (let i = 0; i < entitiesOnScreen.length; i++) {
        const e = entitiesOnScreen[i];
        const cell = state.map.getCell(e.x, e.y);
        if (cell.visible) {
            const color = e.pwned ? Colors.LIGHT_CYAN : Colors.WHITE;
            gameArea.drawChar(e.x - state.viewport.x, e.y - state.viewport.y, e.c, color);
        }

        const buffer = Math.ceil(e.viewDistance);
        const minX = Math.max(e.x - buffer, state.viewport.x);
        const minY = Math.max(e.y - buffer, state.viewport.y);
        const maxX = Math.min(e.x + buffer, state.viewport.x + Constants.GAME_AREA_WIDTH - 1);
        const maxY = Math.min(e.y + buffer, state.viewport.y + Constants.GAME_AREA_HEIGHT - 1);
        let newBg = Colors.DARK_GRAY;
        if (e.pwned) {
            newBg = Colors.DARK_CYAN;
        } else if (e.faction.playerReputation < 0) {
            newBg = Colors.DARK_MAGENTA;
        }

        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const cell = state.map.getCell(x, y);
                if (!cell || !cell.visible) {
                    continue;
                }
                if (canSee(e, x, y)) {
                    const x2 = x - state.viewport.x;
                    const y2 = y - state.viewport.y;
                    const gameAreaCell = gameArea.getCell(x2, y2);
                    const currBg = gameAreaCell.bg;

                    if (newBg === Colors.DARK_MAGENTA) {
                        if (currBg !== Colors.DARK_MAGENTA) {
                            gameAreaCell.setBackground(Colors.DARK_MAGENTA);
                        }

                    } else if (newBg === Colors.DARK_CYAN) {
                        if (currBg !== Colors.DARK_MAGENTA && currBg !== Colors.DARK_CYAN) {
                            gameAreaCell.setBackground(Colors.DARK_CYAN);
                        }

                    } else if (newBg === Colors.DARK_GRAY) {
                        if (currBg !== Colors.DARK_MAGENTA && currBg !== Colors.DARK_CYAN && currBg !== Colors.DARK_GRAY) {
                            gameAreaCell.setBackground(Colors.DARK_GRAY);
                        }
                    }
                }
            }
        }
    }

    // Highlight the selected unit
    if (state.selectedEntity &&
            state.selectedEntity !== state.player &&
            state.map.getCell(state.selectedEntity.x, state.selectedEntity.y).visible) {

        const x2 = state.selectedEntity.x - state.viewport.x;
        const y2 = state.selectedEntity.y - state.viewport.y;
        const cell = gameArea.getCell(x2, y2);
        if (cell) {
            cell.setForeground(Colors.BLACK);
            cell.setBackground(Colors.WHITE);
        }
    }

    // Draw the state.cursor highlight
    let cx2 = state.cursor.x - state.viewport.x;
    let cy2 = state.cursor.y - state.viewport.y;
    let cursorVisible = cx2 >= 0 && cx2 < Constants.GAME_AREA_WIDTH && cy2 >= 0 && cy2 < Constants.GAME_AREA_HEIGHT;
    if (cursorVisible) {
        let cursorCell = gameArea.getCell(state.cursor.x - state.viewport.x, state.cursor.y - state.viewport.y);
        if (cursorCell) {
            cursorCell.setBackground(Colors.WHITE);
        }

        const entity = getEntityAt(state.cursor.x, state.cursor.y);
        if (!entity) {
            const path = computePath(state.map, state.player, state.cursor, 100);
            if (path) {
                for (let i = 1; i < path.length; i++) {
                    const step = path[i];
                    const cell = gameArea.getCell(step.x - state.viewport.x, step.y - state.viewport.y);
                    if (cell) {
                        cell.setBackground(Colors.WHITE);
                    }
                }
            }
        }
    }

    // Draw the game area on the term
    term.drawConsole(
        Constants.GAME_AREA_X,
        Constants.GAME_AREA_Y,
        gameArea,
        0,
        0,
        Constants.GAME_AREA_WIDTH,
        Constants.GAME_AREA_HEIGHT);

    // // Draw top/bottom UI
    // term.fillRect(0, 0, Constants.LEFT_CONSOLE_WIDTH, Constants.SCREEN_HEIGHT, BRUSH_CLEAR);

    // // Draw player stats summary
    // term.drawString(0, 0, '@: You, Level 12', Colors.WHITE, Colors.BLACK);
    // term.drawHLine(0, 1, 20, ' ', Colors.LIGHT_CYAN, Colors.BLACK);
    // term.drawHLine(0, 1, Math.round(state.player.hp / 100.0 * 18.0), ' ', Colors.LIGHT_CYAN, Colors.DARK_CYAN);
    // term.drawString(1, 1, 'Health (' + state.player.hp + ')', Colors.LIGHT_CYAN, null);

    // {
    //     let y = 4;
    //     for (let i = 0; i < entitiesOnScreen.length; i++) {
    //         const entity = entitiesOnScreen[i];
    //         let color = Colors.WHITE;
    //         if (entity.pwned) {
    //             color = entity === state.selectedEntity ? Colors.LIGHT_CYAN : Colors.DARK_CYAN;
    //         } else {
    //             color = entity === state.selectedEntity ? Colors.WHITE : Colors.LIGHT_GRAY;
    //         }
    //         term.drawHLine(0, y, 20, ' ', color);
    //         term.drawChar(0, y, entity.c, color);
    //         term.drawString(1, y, ': ' + entity.name, color);
    //         term.drawHLine(0, y + 1, 20, ' ', Colors.LIGHT_CYAN, Colors.BLACK);
    //         term.drawHLine(0, y + 1, Math.round(entity.hp / 100.0 * 18.0), ' ', Colors.LIGHT_CYAN, Colors.DARK_CYAN);
    //         term.drawString(3, y + 1, 'Health (' + entity.hp + ')', Colors.LIGHT_CYAN, null);
    //         switch (entity.state) {
    //             case EntityStates.STATE_WALKING:
    //                 term.drawString(3, y + 2, 'Walking', Colors.DARK_GRAY, null);
    //                 break;
    //             case EntityStates.STATE_WAITING:
    //                 term.drawString(3, y + 2, 'Waiting', Colors.DARK_GRAY, null);
    //                 break;
    //             case EntityStates.STATE_ATTACKING:
    //                 term.drawString(3, y + 2, 'Attacking', Colors.DARK_MAGENTA, null);
    //                 break;
    //         }
    //         y += 5;
    //     }
    // }

    // // Draw top message history
    // {
    //     for (let i = Math.max(0, state.messages.length - 3), y = 0; i < state.messages.length; i++ , y++) {
    //         term.drawString(Constants.LEFT_CONSOLE_WIDTH, y, state.messages[i].text, state.messages[i].color);
    //     }
    // }

    // // Draw current tile summary
    // if (cursorVisible) {
    //     let hoverEntity = getEntityAt(state.cursor.x, state.cursor.y);
    //     let hoverCell = state.map.getCell(state.cursor.x, state.cursor.y);
    //     var hoverMessage = null;
    //     if (hoverEntity === state.player) {
    //         hoverMessage = 'This is you';
    //     } else if (hoverEntity) {
    //         hoverMessage = 'You see ' + hoverEntity.name + ' (' + hoverEntity.desc + ')';
    //     } else if (hoverCell && hoverCell.meta && hoverCell.meta.desc) {
    //         hoverMessage = 'You see ' + hoverCell.meta.desc;
    //     }
    //     term.drawString(Constants.LEFT_CONSOLE_WIDTH, Constants.SCREEN_HEIGHT - 2, hoverMessage, Colors.MAGENTA);
    // }

    // // Draw bottom menu
    // term.drawString(
    //     Constants.LEFT_CONSOLE_WIDTH,
    //     Constants.SCREEN_HEIGHT - 1,
    //     //'Explore    Rest    Search    Menu',
    //     //  0123456789012345678901234567890123456789
    //     'Character     Inventory     Map     Menu',
    //     Colors.LIGHT_GRAY,
    //     null);
}

function drawCharacterScreen() {
    term.drawString(2, 1, 'Player', Colors.LIGHT_GREEN);

    term.drawString(2, 4, 'ATTRIBUTES', Colors.GRAY);
    term.drawString(3, 6, 'Strength     4', Colors.GREEN);
    term.drawString(3, 7, 'Speed        4', Colors.GREEN);
    term.drawString(3, 8, 'Intelligence 4', Colors.GREEN);
    term.drawString(3, 9, 'Charisma     4', Colors.GREEN);

    term.drawString(21, 4, 'SKILLS', Colors.GRAY);
    term.drawString(22, 6, 'Strength     4', Colors.GREEN);
    term.drawString(22, 7, 'Speed        4', Colors.GREEN);
    term.drawString(22, 8, 'Intelligence 4', Colors.GREEN);
    term.drawString(22, 9, 'Charisma     4', Colors.GREEN);

    term.drawString(40, 4, 'REPUTATION', Colors.GRAY);
    for (var i = 1; i < state.factions.length; i++) {
        term.drawString(41, 5 + i, state.factions[i].name, Colors.GREEN);
        term.drawString(56, 5 + i, state.factions[i].playerReputation.toString().padStart(2), Colors.GREEN);
    }
}

function drawMapScreen() {
    term.drawString(2, 1, 'Map', Colors.LIGHT_GREEN);

    let offsetX = 5;
    let offsetY = 3;

    for (var y = 0; y < Constants.MAP_HEIGHT_BLOCKS; y++) {
        for (var x = 0; x < Constants.MAP_WIDTH_BLOCKS; x++) {
            for (var y2 = 0; y2 < 5; y2++) {
                for (var x2 = 0; x2 < 5; x2++) {
                    var tile = null;
                    switch (state.worldMap[y][x].blockType) {
                        case BlockTypes.BLOCK_TYPE_NORMAL_BLOCK:
                            if ((x2 === 1 || x2 === 3) && (y2 === 1 || y2 === 3)) {
                                tile = Tiles.TILE_INTERIOR;
                            } else {
                                tile = Tiles.TILE_STREET;
                            }
                            break;
                        case BlockTypes.BLOCK_TYPE_MEGA_BUILDING:
                            if (x2 >= 1 && x2 <= 3 && y2 >= 1 && y2 <= 3) {
                                tile = Tiles.TILE_INTERIOR;
                            } else {
                                tile = Tiles.TILE_STREET;
                            }
                            break;
                        case BlockTypes.BLOCK_TYPE_PARK:
                            tile = Tiles.TILE_GRASS;
                            break;
                        case BlockTypes.BLOCK_TYPE_PRISON:
                            if (x2 === 0 || x2 === 4 || y2 === 0 || y2 === 4) {
                                tile = Tiles.TILE_SIDEWALK;
                            } else {
                                tile = Tiles.TILE_STREET;
                            }
                            break;
                        case BlockTypes.BLOCK_TYPE_TRASH:
                            tile = Tiles.TILE_TRASH_FLOOR;
                            break;
                    }
                    term.drawCell(offsetX + x * 5 + x2, offsetY + y * 5 + y2, tile);
                }
            }
        }
    }

    // 100->5 => divide by 20
    let playerMiniX = Math.floor(state.player.x / 20);
    let playerMiniY = Math.floor(state.player.y / 20);
    term.drawChar(offsetX + playerMiniX, offsetY + playerMiniY, state.player.c, state.player.color);
}

/**
 * Calculates a line using Bresenham's algorithm.
 *
 * See: https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
 *
 * @param {!number} x0 The starting x-coord.
 * @param {!number} y0 The starting y-coord.
 * @param {!number} x1 The goal x-coord.
 * @param {!number} y1 The goal y-coord.
 * @param {!number=} opt_maxDist Optional maximum distance.
 * @param {!Function=} opt_callback Optional callback function at each step.
 * @return {!boolean} True on successfully reaching the goal position.
 */
function drawLine(x0, y0, x1, y1, opt_maxDist, opt_callback) {
    var x = x0;
    var y = y0;
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;

    while (true) {
        if (opt_maxDist !== undefined && dist(x0, y0, x, y) > opt_maxDist) {
            return false;
        }

        if (opt_callback) {
            opt_callback.call(null, x, y);
        }

        if (x === x1 && y === y1) {
            // Found destination
            return true;
        }

        if (x !== x0 || y !== y0) {
            // You can *see* the wall
            // You cannot see *past* the wall
            if (state.map.grid[y][x].blockSight) {
                return false;
            }
        }

        var e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
        }
    }
}

function canSee(unit, x, y) {
    if (unit.hp <= 0) {
        return false;
    }

    if (x < 0 || y < 0 || x >= Constants.MAP_WIDTH || y >= Constants.MAP_HEIGHT) {
        return false;
    }

    if (dist(unit.x, unit.y, x, y) > unit.viewDistance) {
        return false;
    }

    if (unit.x === x && unit.y === y) {
        return true;
    }

    //        -PI/2
    //          -y
    //           |
    // PI  -x  --+--  +x  0
    //           |
    //          +y
    //        +PI/2
    if (unit !== state.player && unit.theta !== undefined) {
        var theta = Math.atan2(y - unit.y, x - unit.x);
        var thetaDist = Math.abs(angleDist(theta, unit.theta));
        if (thetaDist > 0.25 * Math.PI) {
            return false;
        }
    }

    return drawLine(unit.x, unit.y, x, y, unit.viewDistance) || drawLine(x, y, unit.x, unit.y, unit.viewDistance);
}
