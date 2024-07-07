import { Rect } from 'wglt';
import { Dialog, Sprite } from 'wglt';
import { AI, VendorDialog } from 'wglt';
import { Game } from '../game';
import { Player } from './player';
import { Sentiment, StatsActor } from './statsactor';

const SPRITE = new Sprite(96, 272, 16, 16, 2);

class VendorAI extends AI {
  doAi(): void {
    const vendor = this.actor as Vendor;
    const player = vendor.game.player as Player;
    if (!player) {
      return;
    }

    if (vendor.sentiment !== Sentiment.HOSTILE) {
      // Not hostile, do nothing
      return;
    }

    if (vendor.distanceTo(player) > 1.5) {
      // Move towards player if far away
      vendor.moveToward(player.x, player.y);
    } else if (player.hp > 0) {
      // Close enough, attack! (if the player is still alive.)
      vendor.attack(player, vendor.getDamage());
    }
  }
}

export class Vendor extends StatsActor {
  dialog: Dialog;

  constructor(game: Game, x: number, y: number, level: number) {
    super(game, x, y, 'Vendor', SPRITE);
    this.ai = new VendorAI(this);
    this.level = level;
    this.maxHp = 10 + this.level * 2;
    this.hp = this.maxHp;
    this.strength = 10 + this.level * 2;
    this.dialog = new VendorDialog(new Rect(10, 40, 125, 175), this);
    this.dialog.visible = false;
    this.game.gui.add(this.dialog);
  }

  onBump(player: Player): boolean {
    if (this.sentiment === Sentiment.HOSTILE) {
      return super.onBump(player);
    }

    this.dialog.visible = true;
    return true;
  }

  takeDamage(attacker: StatsActor, damage: number): void {
    super.takeDamage(attacker, damage);
    this.sentiment = Sentiment.HOSTILE;
  }
}
