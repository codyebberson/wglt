export const EquipmentType = {
  NONE: 'None',

  CLOTH: 'Cloth',
  LEATHER: 'Leather',
  MAIL: 'Mail',
  PLATE: 'Plate',
  SHIELD: 'Shield',

  AXE: 'Axe',
  SWORD: 'Sword',
  MACE: 'Mace',
  DAGGER: 'Dagger',
  BOW: 'Bow',
  CROSSBOW: 'Crossbow',
  STAFF: 'Staff',
  WAND: 'Wand',
} as const;

export type EquipmentType = (typeof EquipmentType)[keyof typeof EquipmentType];
