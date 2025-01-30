// Collection of sprites from graphics.png

import { Rect, Sprite } from 'wglt';

export const BLACKOUT = new Rect(0, 32, 16, 16);

export const Sprites = {
  // User interface
  TARGET: new Sprite(0, 48, 16, 16),
  COOLDOWN: new Sprite(0, 160, 16, 16, 24),
  BAG: new Sprite(192, 16, 16, 16),
  STAIRS: new Sprite(32, 32, 16, 16, 1),

  // Abilities
  CONFUSE_ICON: new Sprite(128, 32, 16, 16, 3),
  FIREBALL_ICON: new Sprite(128, 32, 16, 16, 3),
  FIREBALL_ANIMATION: new Sprite(128, 32, 16, 16, 3, false),
  EXPLOSION_ANIMATION: new Sprite(176, 32, 16, 16, 4, false, 4),
  HEALTH_POTION: new Sprite(128, 16, 16, 16, 1),
  LIGHTNING_ICON: new Sprite(128, 32, 16, 16, 3),

  // Actors
  PLAYER: new Sprite(0, 16, 16, 16, 2, true),
  ORC: new Sprite(32, 16, 16, 16, 2, true),
  TROLL: new Sprite(64, 16, 16, 16, 2, true),
};
