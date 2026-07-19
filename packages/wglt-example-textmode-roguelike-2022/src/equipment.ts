import { type Color, registerSerializable } from 'wglt';
import type { Action } from './actions';
import { Item } from './item';

export const EquipmentType = {
  WEAPON: 1,
  ARMOR: 2,
};

export class Equipment extends Item {
  static {
    registerSerializable(Equipment);
  }

  readonly equipmentType: number;
  readonly powerBonus: number;
  readonly defenseBonus: number;

  constructor(
    char: string,
    color: Color,
    name: string,
    equipmentType: number,
    powerBonus: number,
    defenseBonus: number
  ) {
    super(char, color, name);
    this.equipmentType = equipmentType;
    this.powerBonus = powerBonus;
    this.defenseBonus = defenseBonus;
  }

  activate(action: Action): void {
    action.actor.toggleEquip(this);
  }
}
