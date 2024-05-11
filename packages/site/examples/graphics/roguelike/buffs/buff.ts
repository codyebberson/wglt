import { StatsActor } from '../entities/statsactor';

export abstract class Buff {
  readonly actor: StatsActor;

  constructor(actor: StatsActor) {
    this.actor = actor;
  }

  /**
   * Called once per turn.
   * For example, a curse might countdown over time.
   */
  update(): void {
    // Subclasses should override this.
  }

  /**
   * Modifies damage taken.
   * For example, a bubble might mitigate incoming damage.
   * @param damage Original damage taken.
   */
  modifyDamageTaken(damage: number): number {
    return damage;
  }

  /**
   * Modifies damage dealt.
   * For example, rage doubles output damage.
   * @param damage Original damage dealt.
   */
  modifyDamageDealt(damage: number): number {
    return damage;
  }

  /**
   * Optionally draw an overlay over the player.
   * For example, a bubble might draw a buble around the player.
   */
  draw(): void {
    // Subclasses should override this.
  }

  isDone(): boolean {
    return false;
  }
}
