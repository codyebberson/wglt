import { ColodorePalette } from 'wglt';
import { Actor } from './actor';
import { HostileEnemy } from './ai';
import { Equipment, EquipmentType } from './equipment';
import { ConfusionItem, FireballDamageItem, HealingItem, LightningDamageItem } from './item';

export const orc = new Actor(
  'o', // character
  ColodorePalette.LIGHT_GREEN, // color
  'orc', // name
  true, // blocks
  10, // max hp
  10, // hp
  0, // defense
  3, // power
  35, // xp
  new HostileEnemy()
);

export const troll = new Actor(
  'T', // character
  ColodorePalette.GREEN, // color
  'troll', // name
  true, // blocks
  16, // max hp
  16, // hp
  1, // defense
  4, // power
  100, // xp
  new HostileEnemy()
);

export const healingItem = new HealingItem(
  '!', // character
  ColodorePalette.VIOLET, // color
  'Health Potion', // name
  4 // amount
);

export const lightningScroll = new LightningDamageItem(
  '~', // character
  ColodorePalette.YELLOW, // color
  'Lightning Scroll', // name
  20, // damage
  5 // max range
);

export const confusionScroll = new ConfusionItem(
  '~', // character
  ColodorePalette.VIOLET, // color
  'Confusion Scroll', // name
  10 // number of turns
);

export const fireballScroll = new FireballDamageItem(
  '~', // character
  ColodorePalette.RED, // color
  'Fireball Scroll', // name
  12, // damage
  3 // radius
);

export const dagger = new Equipment(
  '/', // character
  ColodorePalette.CYAN, // color
  'Dagger', // name
  EquipmentType.WEAPON, // equipment type
  2, // power
  0 // defense
);

export const sword = new Equipment(
  '/', // character
  ColodorePalette.CYAN, // color
  'Sword', // name
  EquipmentType.WEAPON, // equipment type
  4, // power
  0 // defense
);

export const leatherArmor = new Equipment(
  '[', // character
  ColodorePalette.BROWN, // color
  'Leather Armor', // name
  EquipmentType.ARMOR, // equipment type
  0, // power
  1 // defense
);

export const chainMailArmor = new Equipment(
  '[', // character
  ColodorePalette.BROWN, // color
  'Chain Mail', // name
  EquipmentType.ARMOR, // equipment type
  0, // power
  3 // defense
);
