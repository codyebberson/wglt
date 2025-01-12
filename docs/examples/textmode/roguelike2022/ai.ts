import { PointLike, serializable } from 'wglt';
import { BumpAction, MeleeAction, MovementAction } from './actions';
import { Actor } from './actor';

export abstract class BaseAI {
  abstract perform(actor: Actor): void;

  walkToward(actor: Actor, dest: PointLike): void {
    const path = actor.gameMap.computePath(actor, dest);
    if (path) {
      const next = path[1];
      const nextDx = next.x - actor.x;
      const nextDy = next.y - actor.y;
      new MovementAction(actor, nextDx, nextDy).perform();
    }
  }
}

@serializable
export class HostileEnemy extends BaseAI {
  perform(actor: Actor): void {
    const target = actor.engine.player;
    const dx = target.x - actor.x;
    const dy = target.y - actor.y;
    const distance = Math.max(Math.abs(dx), Math.abs(dy));

    if (!actor.gameMap.isVisible(actor.x, actor.y)) {
      // Do nothing if the actor is not visible.
      return;
    }

    if (distance <= 1) {
      // Attack the player if they are adjacent.
      new MeleeAction(actor, dx, dy).perform();
      return;
    }

    // Move towards the player.
    this.walkToward(actor, target);
  }
}

/**
 * A confused enemy will stumble around aimlessly for a given number of turns, then revert back to its previous AI.
 * If an actor occupies a tile it is randomly moving into, it will attack.
 */
@serializable
export class ConfusedEnemy extends BaseAI {
  constructor(readonly previousAi: BaseAI, public turnsRemaining: number) {
    super();
  }

  perform(actor: Actor): void {
    if (this.turnsRemaining <= 0) {
      // Revert the AI back to the original state if the effect has run its course.
      actor.engine.log(`The ${actor.name} is no longer confused.`);
      actor.ai = this.previousAi;
    } else {
      // Pick a random direction
      const dx = Math.floor(Math.random() * 3) - 1;
      const dy = Math.floor(Math.random() * 3) - 1;

      this.turnsRemaining--;

      // The actor will either try to move or attack in the chosen random direction.
      // Its possible the actor will just bump into the wall, wasting a turn.
      try {
        new BumpAction(actor, dx, dy).perform();
      } catch (err) {}
    }
  }
}
