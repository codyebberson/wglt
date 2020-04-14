
import {Colors} from '../../src/colors.js';
import {GameModes} from './gamemodes.js';
import { Constants } from './constants.js';

export class GameState {
    constructor() {
        this.worldMap = null;
        this.map = null;
        this.gameClock = 0;
        this.gameMode = GameModes.MODE_PLAYER;
        this.player = { x: 40, y: 90, ap: 1, hp: 100, dest: { x: 40, y: 90 }, c: '@', color: Colors.WHITE, gender: 'male', name: 'Player', level: 1, viewDistance: Constants.PLAYER_VIEW_DISTANCE };
        this.cursor = { x: -1, y: -1 };
        this.vehicle = { x: 40, y: 100, dx: 4, dy: 0 };
        this.viewport = { x: 0, y: 0 };

        this.factions = [];
        this.entities = [this.player];
        this.pwned = [];
        this.followed = null;
        this.messages = [{ color: Colors.WHITE, text: 'Welcome to Stacio' }];
        this.selectedEntity = null;
        this.hackPuzzle = null;
    }

    setGameMode(newGameMode) {
        this.gameMode = newGameMode;
    }
}
