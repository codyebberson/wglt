export const EquipmentSlot = {
  HEAD: 'Head',
  NECK: 'Neck',
  BACK: 'Back',
  CHEST: 'Chest',
  HANDS: 'Hands',
  LEGS: 'Legs',
  FEET: 'Feet',
  RING: 'Ring',
  MAINHAND: 'Main Hand',
  OFFHAND: 'Off Hand',
};
export type EquipmentSlot = (typeof EquipmentSlot)[keyof typeof EquipmentSlot];
