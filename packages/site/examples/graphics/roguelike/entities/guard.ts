import { Pico8Palette, Vec2 } from 'wglt';
import { Sprite } from 'wglt';
import { AI, Actor } from 'wglt';
import { Game } from '../game';
import { Monster } from './monster';
import { Player } from './player';
import { Sentiment } from './statsactor';

const SPRITE = new Sprite(96, 272, 16, 16, 2, true);

class GuardAI extends AI {
  readonly waypoints: Vec2[];
  waypointIndex: number;
  waitCount: number;
  aggroTarget?: Actor;
  aggroCount: number;

  constructor(actor: Guard, waypoints: Vec2[]) {
    super(actor);
    this.waypoints = waypoints;
    this.waypointIndex = 0;
    this.waitCount = 0;
    this.aggroCount = 0;
  }

  doAi(): void {
    const guard = this.actor as Guard;
    const game = guard.game as Game;
    const player = game.player as Player;

    if (this.aggroTarget) {
      if (this.aggroTarget.hp <= 0) {
        // Target is dead, so go back to normal
        this.aggroTarget = undefined;
        this.aggroCount = 0;
        return;
      }

      this.aggroCount++;

      if (this.aggroCount === 1) {
        // First attack
        const game = guard.game as Game;
        game.log('Guard shouts for help!', Pico8Palette.BLUE);
        for (let i = 0; i < game.entities.length; i++) {
          const entity = game.entities.get(i);
          if (entity instanceof Guard) {
            const otherGuard = entity as Guard;
            if (guard.distanceTo(otherGuard) < 6) {
              otherGuard.sentiment = guard.sentiment;
              (otherGuard.ai as GuardAI).aggroTarget = this.aggroTarget;
            }
          }
        }
      } else {
        if (guard.distanceTo(this.aggroTarget) > 1.0) {
          // Move towards target if far away
          guard.moveToward(this.aggroTarget.x, this.aggroTarget.y);
        } else {
          // Close enough, attack!
          const damage = 10;
          guard.attack(this.aggroTarget, damage);
        }
      }

      return;
    }

    // Not currently targeting anything
    this.aggroCount = 0;

    // If hostile against player, then target the player
    if (guard.sentiment === Sentiment.HOSTILE) {
      this.aggroTarget = player;
      return;
    }

    // If an enemy is visible, then target that enemy
    for (let i = 0; i < game.entities.length; i++) {
      const entity = game.entities.get(i);
      if (
        entity instanceof Monster &&
        !(entity instanceof Guard) &&
        game.tileMap.isVisible(entity.x, entity.y)
      ) {
        this.aggroTarget = entity;
        return;
      }
    }

    if (this.waitCount > 0) {
      this.waitCount--;
      return;
    }

    const waypoint = this.waypoints[this.waypointIndex];
    if (guard.x === waypoint.x && guard.y === waypoint.y) {
      this.waypointIndex = (this.waypointIndex + 1) % this.waypoints.length;
      this.waitCount = guard.game.rng.nextRange(5, 15);
      return;
    }

    guard.moveToward(waypoint.x, waypoint.y);
  }
}

export class Guard extends Monster {
  constructor(game: Game, x: number, y: number, waypoints: Vec2[]) {
    super(game, x, y, 'Guard', SPRITE, 10);
    this.ai = new GuardAI(this, waypoints);
    this.seen = true;
    this.sentiment = Sentiment.FRIENDLY;
  }
}
