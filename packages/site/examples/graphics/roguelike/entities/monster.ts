import { Sprite } from '@wglt/graphics';
import { Actor } from '@wglt/roguelike';
import { BasicMonster } from '@wglt/roguelike';
import { EquipmentBuilder } from '../equipment/equipmentbuilder';
import { Game } from '../game';
import { Gold } from '../items/gold';
import { HealthPotion } from '../items/healthpotion';
import { Sentiment, StatsActor } from './statsactor';

export abstract class Monster extends StatsActor {
  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite, level: number) {
    super(game, x, y, name, sprite);
    this.ai = new BasicMonster(this, this.calculateDamage);
    this.sentiment = Sentiment.HOSTILE;
    this.level = level;
    this.strength = 10 + 3 * level;
    this.maxHp = 10 + 3 * level;
    this.hp = this.maxHp;
    this.armor = 4 * level;
    this.buildLoot();
  }

  private calculateDamage(attacker: Actor, _target: Actor): number {
    return (attacker as StatsActor).getDamage();
  }

  private buildLoot(): void {
    const game = this.game as Game;

    if (this.game.rng.nextRange(0, 6) <= 2) {
      this.inventory.add(new Gold(game, this.x, this.y));
    }
    if (this.game.rng.nextRange(0, 6) <= 2) {
      this.inventory.add(new HealthPotion(game));
    }
    if (this.game.rng.nextRange(0, 6) <= 1) {
      this.inventory.add(new EquipmentBuilder(game).withRandomDrop(this.level).build());
    }
  }
}
