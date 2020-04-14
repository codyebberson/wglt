import {Colors} from '../../src/colors.js';
import {Chars} from '../../src/chars.js';
import {createPrimLevel} from '../../src/prim.js';
import { GameState } from './gamestate.js';
import {Constants} from './constants.js';
import {BlockTypes} from './blocktypes.js';
import {Tiles} from './tiles.js';
import {EntityTypes} from './entitytypes.js';
import {EntityStates} from './entitystates.js';
import { fixBoxCells } from '../../src/boxutils.js';
import { TileMap } from '../../src/tilemap.js';

const state = new GameState();

export function initWorld() {
    // Create factions
    const FACTION_COLORS = [
        Colors.WHITE,
        Colors.LIGHT_BLUE,
        Colors.LIGHT_GREEN,
        Colors.LIGHT_CYAN,
        Colors.LIGHT_RED,
        Colors.YELLOW,
        Colors.LIGHT_BLUE,
        Colors.LIGHT_GREEN,
        Colors.LIGHT_CYAN,
        Colors.LIGHT_RED,
    ];
    for (var i = 0; i < 10; i++) {
        var name = null;
        var rep = 0;
        if (i === 0) {
            name = 'Unaffiliated';
            rep = 1;
        } else if (i === 1) {
            name = 'Justice';
            rep = 1;
        } else if (i >= 2 && i <= 4) {
            name = generateFactionName();
            rep = 0;
        } else {
            name = generateGangName();
            rep = -1;
        }
        state.factions.push({
            id: i,
            justice: i === 1,
            name: name,
            color: FACTION_COLORS[i],
            playerReputation: rep
        });
    }

    state.worldMap = new Array(Constants.MAP_HEIGHT_BLOCKS);
    for (var y = 0; y < Constants.MAP_HEIGHT_BLOCKS; y++) {
        state.worldMap[y] = new Array(Constants.MAP_WIDTH_BLOCKS);
        for (var x = 0; x < Constants.MAP_WIDTH_BLOCKS; x++) {
            state.worldMap[y][x] = {
                blockType: BlockTypes.BLOCK_TYPE_NORMAL_BLOCK,
                faction: chooseItem(state.factions)
            };
        }
    }

    createBlocks(BlockTypes.BLOCK_TYPE_MEGA_BUILDING, 4);
    createBlocks(BlockTypes.BLOCK_TYPE_PARK, 8);
    createBlocks(BlockTypes.BLOCK_TYPE_PRISON, 4);
    createBlocks(BlockTypes.BLOCK_TYPE_TRASH, 3);

    state.map = new TileMap(Constants.MAP_WIDTH, Constants.MAP_HEIGHT);
    state.map.fillRect(0, 0, state.map.width, state.map.height, Tiles.TILE_GRASS);

    for (var i = 0; i < 3; i++) {
        state.map.drawHLine(0, i, state.map.width, Tiles.TILE_TREE);
        state.map.drawHLine(0, Constants.MAP_HEIGHT - 1 - i, state.map.width, Tiles.TILE_TREE);
        state.map.drawVLine(i, 0, state.map.height, Tiles.TILE_TREE);
        state.map.drawVLine(Constants.MAP_WIDTH - 1 - i, 0, state.map.height, Tiles.TILE_TREE);
    }

    state.map.fillRect(Constants.MAP_BUFFER, Constants.MAP_BUFFER, state.map.width - 2 * Constants.MAP_BUFFER, state.map.height - 2 * Constants.MAP_BUFFER, Tiles.TILE_STREET);

    for (var y = Constants.MAP_BUFFER; y < state.map.height - 2 * Constants.MAP_BUFFER; y++) {
        for (var x = Constants.MAP_BUFFER; x < state.map.width - 2 * Constants.MAP_BUFFER; x++) {
            var r = Math.random();
            if (r < 0.0005) {
                state.map.drawCell(x, y, Tiles.TILE_MANHOLE);
            } else if (r < 0.05) {
                state.map.drawCell(x, y, Tiles.TILE_POTHOLE);
            }
        }
    }

    for (var y = Constants.MAP_BUFFER; y < state.map.height - 2 * Constants.MAP_BUFFER; y += 100) {
        for (var x = Constants.MAP_BUFFER; x < state.map.width - 2 * Constants.MAP_BUFFER; x += 100) {
            initBlock(x, y);
        }
    }

    // convertWallTiles(state.map);
    fixBoxCells(state.map);

    // TODO
    for (let y = 0; y < state.map.height; y++) {
        for (let x = 0; x < state.map.width; x++) {
            const tile = state.map.grid[y][x];
            if (tile.meta.door) {
                tile.blocked = false;
                tile.blockSight = true;
            } else if (tile.meta.impassable) {
                tile.blocked = true;
                tile.blockSight = true;
            } else {
                tile.blocked = false;
                tile.blockSight = false;
            }
        }
    }

    return state;
}

function createBlocks(blockType, count) {
    var i = 0;
    while (i < count) {
        let x = Math.floor(Math.random() * Constants.MAP_WIDTH_BLOCKS);
        let y = Math.floor(Math.random() * Constants.MAP_HEIGHT_BLOCKS);
        if (state.worldMap[y][x].blockType === BlockTypes.BLOCK_TYPE_NORMAL_BLOCK) {
            state.worldMap[y][x].blockType = blockType;
            i++;
        }
    }
}

function initBlock(x, y) {
    initBaseBlock(x, y);

    let worldMapBlock = state.worldMap[Math.floor(y / Constants.BLOCK_SIZE)][Math.floor(x / Constants.BLOCK_SIZE)];

    switch (worldMapBlock.blockType) {
        case BlockTypes.BLOCK_TYPE_NORMAL_BLOCK:
            init4BuildingBlock(worldMapBlock.faction, x, y);
            break;
        case BlockTypes.BLOCK_TYPE_MEGA_BUILDING:
            initMegaBuildingBlock(worldMapBlock.faction, x, y);
            break;
        case BlockTypes.BLOCK_TYPE_PARK:
            initParkBlock(worldMapBlock.faction, x, y);
            break;
        case BlockTypes.BLOCK_TYPE_PRISON:
            initPrisonBlock(worldMapBlock.faction, x, y);
            break;
        case BlockTypes.BLOCK_TYPE_TRASH:
            initTrashBlock(worldMapBlock.faction, x, y);
            break;
    }
}

function initBaseBlock(x, y) {
    // Streets:  0-12, 88-100
    // Potholes
    // Sidwalks:  12-15, 85-88
    state.map.fillRect(x + 12, y + 12, 76, 76, Tiles.TILE_SIDEWALK);

    // 4 Yellow lines:  outer border
    state.map.drawHLine(x + 17, y, Constants.BLOCK_SIZE - 34, Tiles.TILE_STREET_YELLOW_HLINE);
    state.map.drawHLine(x + 17, y + Constants.BLOCK_SIZE - 1, Constants.BLOCK_SIZE - 34, Tiles.TILE_STREET_YELLOW_HLINE);

    state.map.drawVLine(x, y + 17, Constants.BLOCK_SIZE - 34, Tiles.TILE_STREET_YELLOW_VLINE);
    state.map.drawVLine(x + Constants.BLOCK_SIZE - 1, y + 17, Constants.BLOCK_SIZE - 34, Tiles.TILE_STREET_YELLOW_VLINE);

    // 4 White lines
    state.map.drawHLine(x + 17, y + 6, Constants.BLOCK_SIZE - 34, Tiles.TILE_STREET_WHITE_HLINE);
    state.map.drawHLine(x + 17, y + Constants.BLOCK_SIZE - 7, Constants.BLOCK_SIZE - 34, Tiles.TILE_STREET_WHITE_HLINE);

    state.map.drawVLine(x + 6, y + 17, Constants.BLOCK_SIZE - 34, Tiles.TILE_STREET_WHITE_VLINE);
    state.map.drawVLine(x + Constants.BLOCK_SIZE - 7, y + 17, Constants.BLOCK_SIZE - 34, Tiles.TILE_STREET_WHITE_VLINE);

    // 4 Cross walks, 8 crosswalk lines
    state.map.drawHLine(x, y + 12, 12, Tiles.TILE_STREET_WHITE_HLINE);
    state.map.drawHLine(x, y + 16, 12, Tiles.TILE_STREET_WHITE_HLINE);
    state.map.drawHLine(x + Constants.BLOCK_SIZE - 12, y + 12, 12, Tiles.TILE_STREET_WHITE_HLINE);
    state.map.drawHLine(x + Constants.BLOCK_SIZE - 12, y + 16, 12, Tiles.TILE_STREET_WHITE_HLINE);
    state.map.drawHLine(x, y + Constants.BLOCK_SIZE - 13, 12, Tiles.TILE_STREET_WHITE_HLINE);
    state.map.drawHLine(x, y + Constants.BLOCK_SIZE - 17, 12, Tiles.TILE_STREET_WHITE_HLINE);
    state.map.drawHLine(x + Constants.BLOCK_SIZE - 12, y + Constants.BLOCK_SIZE - 13, 12, Tiles.TILE_STREET_WHITE_HLINE);
    state.map.drawHLine(x + Constants.BLOCK_SIZE - 12, y + Constants.BLOCK_SIZE - 17, 12, Tiles.TILE_STREET_WHITE_HLINE);

    state.map.drawVLine(x + 12, y, 12, Tiles.TILE_STREET_WHITE_VLINE);
    state.map.drawVLine(x + 16, y, 12, Tiles.TILE_STREET_WHITE_VLINE);
    state.map.drawVLine(x + 12, y + Constants.BLOCK_SIZE - 12, 12, Tiles.TILE_STREET_WHITE_VLINE);
    state.map.drawVLine(x + 16, y + Constants.BLOCK_SIZE - 12, 12, Tiles.TILE_STREET_WHITE_VLINE);
    state.map.drawVLine(x + Constants.BLOCK_SIZE - 13, y, 12, Tiles.TILE_STREET_WHITE_VLINE);
    state.map.drawVLine(x + Constants.BLOCK_SIZE - 17, y, 12, Tiles.TILE_STREET_WHITE_VLINE);
    state.map.drawVLine(x + Constants.BLOCK_SIZE - 13, y + Constants.BLOCK_SIZE - 12, 12, Tiles.TILE_STREET_WHITE_VLINE);
    state.map.drawVLine(x + Constants.BLOCK_SIZE - 17, y + Constants.BLOCK_SIZE - 12, 12, Tiles.TILE_STREET_WHITE_VLINE);

    // Law enforcement patrolling on top of white lines (cars?)
    for (var i = 0; i < 4; i++) {
        createGuard(state.factions[1], x + 6, y + 5, 88, 88, i);
        createGuard(state.factions[1], x + 5, y + 6, 88, 88, i);
        createGuard(state.factions[1], x + 7, y + 6, 88, 88, i);
        createGuard(state.factions[1], x + 6, y + 7, 88, 88, i);
    }
}

function init4BuildingBlock(faction, x, y) {
    let r = Math.random();
    if (r < 0.2) {
        initHotel(x + 15, y + 15);
    } else if (r < 0.3) {
        initArena(x + 15, y + 15);
    } else {
        initBuilding(faction, x + 15, y + 15, 32, 32);
    }

    initBuilding(faction, x + 53, y + 15, 32, 32);
    initBuilding(faction, x + 15, y + 53, 32, 32);
    initBuilding(faction, x + 53, y + 53, 32, 32);
}

function initHotel(x, y) {
    initBuilding(state.factions[0], x, y, 32, 32);

    // Top center
    state.map.drawRect(x + 9, y, 13, 10, Tiles.TILE_WALL);
    state.map.drawCell(x + 15, y + 9, Tiles.TILE_DOOR);

    // Top left
    state.map.drawRect(x, y, 10, 14, Tiles.TILE_WALL);
    state.map.drawCell(x + 9, y + 11, Tiles.TILE_DOOR);

    // Top right
    state.map.drawRect(x + 21, y, 11, 14, Tiles.TILE_WALL);
    state.map.drawCell(x + 21, y + 11, Tiles.TILE_DOOR);

    // Middle left
    state.map.drawRect(x, y + 13, 10, 14, Tiles.TILE_WALL);
    state.map.drawCell(x + 9, y + 20, Tiles.TILE_DOOR);

    // Middle right
    state.map.drawRect(x + 21, y + 13, 11, 14, Tiles.TILE_WALL);
    state.map.drawCell(x + 21, y + 20, Tiles.TILE_DOOR);

    state.player.x = x + 16;
    state.player.y = y + 16;
    state.player.dest.x = state.player.x;
    state.player.dest.y = state.player.y;

    createStaff(state.factions[0], x + 12, y + 18, 8, 8);
}

function initArena(x, y) {
    initBuilding(state.factions[0], x, y, 32, 32);

    // Centerbox
    state.map.drawRect(x + 10, y + 10, 12, 12, Tiles.TILE_FENCE);
}

function initMegaBuildingBlock(faction, x, y) {
    initBuilding(faction, x + 15, y + 15, 70, 70);

    for (var i = 0; i < 20; i++) {
        createStaff(faction, x + 20, y + 20, 60, 60);
    }
}

function initParkBlock(faction, x, y) {
    state.map.fillRect(x + 15, y + 15, 70, 70, Tiles.TILE_GRASS);

    for (var i = 0; i < 500; i++) {
        let wx = x + 15 + Math.floor(Math.random() * 70);
        let wy = y + 15 + Math.floor(Math.random() * 70);
        state.map.drawCell(wx, wy, Tiles.TILE_WEEDS);
    }
}

function initPrisonBlock(faction, x, y) {
    // Outer wall
    initBuildingHWall(x + 15, y + 15, 70, Tiles.TILE_FENCE);
    initBuildingHWall(x + 15, y + 84, 70, Tiles.TILE_FENCE);
    initBuildingVWall(x + 15, y + 15, 70, Tiles.TILE_FENCE);
    initBuildingVWall(x + 84, y + 15, 70, Tiles.TILE_FENCE);

    // Inner wall
    initBuildingHWall(x + 18, y + 18, 64, Tiles.TILE_FENCE);
    initBuildingHWall(x + 18, y + 81, 64, Tiles.TILE_FENCE);
    initBuildingVWall(x + 18, y + 18, 64, Tiles.TILE_FENCE);
    initBuildingVWall(x + 81, y + 18, 64, Tiles.TILE_FENCE);

    // Main building
    // (100 - 32) / 2 = 34
    initBuilding(faction, x + 34, y + 34, 33, 33);
    for (var y2 = 34; y2 < 34 + 32; y2 += 4) {
        initBuildingWalls(x + 34, y + y2, 13, 5);
        initBuildingWalls(x + 54, y + y2, 13, 5);
    }
}

function initTrashBlock(faction, x, y) {
    let prim = createPrimLevel(37, 37, Tiles.TILE_TRASH_WALL, Tiles.TILE_TRASH_FLOOR);

    for (var i = 0; i < 35; i++) {
        for (var j = 0; j < 35; j++) {
            let tx = x + 15 + j * 2;
            let ty = y + 15 + i * 2;
            let brush = undefined;

            if (prim.getCell(j + 1, i + 1).meta.impassable) {
                brush = Tiles.TILE_TRASH_WALL;
            } else {
                brush = Tiles.TILE_TRASH_FLOOR;
                let r = Math.random();
                if (r < 0.02) {
                    createGuard(faction, tx, ty, 2, 2, 0);
                } else if (r < 0.04) {
                    createEntity({
                        entityType: EntityTypes.ENTITY_TYPE_HEALTHKIT,
                        name: 'HealthKit',
                        hp: 100,
                        x: tx,
                        y: ty,
                        c: '+',
                        desc: 'HealthKit',
                        level: 1 + Math.floor(Math.random() * 3),
                        faction: state.factions[0],
                        color: Colors.LIGHT_RED
                    });
                }
            }
            state.map.fillRect(x + 15 + j * 2, y + 15 + i * 2, 2, 2, brush);
        }
    }

    // Rather than using '#' for walls, use extended chars for more random look
    // Char codes 128-160 are accented characters
    for (var i = y + 15; i < y + 85; i++) {
        for (var j = x + 15; j < x + 85; j++) {
            let cell = state.map.getCell(j, i);
            if (cell.meta.impassable) {
                cell.charCode = Math.floor(128 + Math.random() * 32);
            }
        }
    }
}

function createEntity(entity) {
    entity.dest = { x: entity.x, y: entity.y };
    entity.lastSeen = { x: -1, y: -1 };
    if (entity.theta === undefined) {
        entity.theta = 0.0;
    }
    state.entities.push(entity);
    state.map.grid[entity.y][entity.x].entity = entity;
}

function createGuard(faction, x, y, width, height, corner) {
    // var gender = null;
    // var name = null;
    // if (Math.random() > 0.5) {
    //     gender = 'female';
    //     name = generatePersonName(femaleFirstNames, surnames, 16);
    // } else {
    //     gender = 'male';
    //     name = generatePersonName(maleFirstNames, surnames, 16);
    // }
    // const name = 'GUARD';

    var c = null;
    var desc = null;
    if (faction.id === 0) {
        c = 'C';
        desc = 'Citizen';
    } else if (faction.id === 1) {
        c = 'J';
        desc = 'Judge';
    } else if (faction.id >= 2 && faction.id <= 4) {
        c = 'G';
        desc = 'Guard';
    } else {
        c = 'p';
        desc = 'Punk';
    }

    let waypoints = [
        { x: x, y: y },
        { x: x + width - 1, y: y },
        { x: x + width - 1, y: y + height - 1 },
        { x: x, y: y + height - 1 }
    ];

    let waitCount = faction.justice ? 0 : Math.floor(Math.random() * 10);

    createEntity({
        entityType: EntityTypes.ENTITY_TYPE_GUARD,
        // gender: gender,
        name: desc,
        hp: 100,
        x: waypoints[corner].x,
        y: waypoints[corner].y,
        c: c,
        desc: desc,
        level: 1 + Math.floor(Math.random() * 3),
        viewDistance: Constants.DEFAULT_VIEW_DISTANCE,
        faction: faction,
        color: faction.color,
        state: EntityStates.STATE_WAITING,
        waitCount: waitCount,
        waypointIndex: ((corner + 1) % 4),
        waypoints: waypoints
    });
}

function createStaff(faction, x, y, width, height) {
    // var gender = null;
    // var name = null;
    // if (Math.random() > 0.5) {
    //     gender = 'female';
    //     name = generatePersonName(femaleFirstNames, surnames, 16);
    // } else {
    //     gender = 'male';
    //     name = generatePersonName(maleFirstNames, surnames, 16);
    // }

    createEntity({
        entityType: EntityTypes.ENTITY_TYPE_STAFF,
        // gender: gender,
        name: 'Staff',
        hp: 100,
        x: (x + Math.floor(Math.random() * width)),
        y: (y + Math.floor(Math.random() * height)),
        c: 'S',
        desc: 'Staff',
        level: 1 + Math.floor(Math.random() * 3),
        viewDistance: Constants.DEFAULT_VIEW_DISTANCE,
        faction: faction,
        color: faction.color,
        state: EntityStates.STATE_WAITING,
        waitCount: Math.floor(Math.random() * 10),
        waypointIndex: 0,
        waypoints: [
            { x: (x + Math.floor(Math.random() * width)), y: (y + Math.floor(Math.random() * height)) },
            { x: (x + Math.floor(Math.random() * width)), y: (y + Math.floor(Math.random() * height)) },
            { x: (x + Math.floor(Math.random() * width)), y: (y + Math.floor(Math.random() * height)) },
        ]
    });
}

function initBuildingHWall(x, y, width, opt_tile) {
    const brush = opt_tile !== undefined ? opt_tile : Tiles.TILE_WALL;
    state.map.drawHLine(x, y, width, brush);
    state.map.drawCell(x + Math.floor(width / 2), y, Tiles.TILE_DOOR);
}

function initBuildingVWall(x, y, height, opt_tile) {
    const brush = opt_tile !== undefined ? opt_tile : Tiles.TILE_WALL;
    state.map.drawVLine(x, y, height, brush);
    state.map.drawCell(x, y + Math.floor(height / 2), Tiles.TILE_DOOR);
}

function initBuildingWalls(x, y, width, height) {
    initBuildingHWall(x, y, width);
    initBuildingHWall(x, y + height - 1, width);
    initBuildingVWall(x, y, height);
    initBuildingVWall(x + width - 1, y, height);
}

// function chooseAndRemove(options) {
//     return options.splice(Math.floor(Math.random() * options.length), 1)[0];
// }

function chooseItem(options) {
    return options[Math.floor(Math.random() * options.length)];
}

function generateFactionName() {
    // while (true) {
    //     let name = chooseAndRemove(corpPrefix) + ' ' + chooseAndRemove(corpSuffix);
    //     if (name.length < 16) {
    //         return name;
    //     }
    // }
    return 'CORP';
}

function generateGangName() {
    // while (true) {
    //     let name = chooseAndRemove(gangPrefix) + ' ' + chooseAndRemove(gangSuffix);
    //     if (name.length < 16) {
    //         return name;
    //     }
    // }
    return 'GANG';
}

// function generatePersonName(firstNames, surnames, maxLength) {
//     // while (true) {
//     //     let name = chooseItem(firstNames) + ' ' + chooseItem(surnames);
//     //     if (name.length < maxLength) {
//     //         return name;
//     //     }
//     // }
// }

function initBuilding(faction, x, y, width, height) {
    state.map.fillRect(x, y, width, height, Tiles.TILE_INTERIOR);

    initBuildingWalls(x, y, width, height);

    for (var i = 0; i < 8; i++) {
        var tile = null;
        var tile = Tiles.TILE_TRASH_BIN;
        var trashX = 0;
        var trashY = 0;
        var r = Math.random();
        if (r < 0.25) {
            trashX = x + Math.floor(Math.random() * width);
            trashY = y - 1;
        } else if (r < 0.5) {
            trashX = x + Math.floor(Math.random() * width);
            trashY = y + height;
        } else if (r < 0.75) {
            trashX = x - 1;
            trashY = y + Math.floor(Math.random() * height);
        } else {
            trashX = x + width;
            trashY = y + Math.floor(Math.random() * height);
        }
        state.map.drawCell(trashX, trashY, tile);
    }

    for (var corner = 0; corner < 4; corner++) {
        createGuard(faction, x - 2, y - 2, width + 4, height + 4, corner);
    }

    createEntity({
        entityType: EntityTypes.ENTITY_TYPE_CAMERA,
        name: 'Camera',
        hp: 100,
        x: x - 1,
        y: y + 4,
        c: Chars.INVERSE_BULLET,
        desc: 'Surveillance',
        viewDistance: Constants.DEFAULT_VIEW_DISTANCE,
        theta: Math.PI,
        minTheta: Math.PI - 0.25 * Math.PI,
        maxTheta: Math.PI + 0.25 * Math.PI,
        deltaTheta: Math.PI / 20.0,
        level: 1 + Math.floor(Math.random() * 3),
        faction: faction,
        color: faction.color,
        state: EntityStates.STATE_WAITING
    });
}
