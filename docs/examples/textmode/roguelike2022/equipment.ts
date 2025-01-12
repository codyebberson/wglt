import { Color, serializable } from 'wglt';
import { Action } from './actions';
import { Item } from './item';

export const EquipmentType = {
  WEAPON: 1,
  ARMOR: 2,
};

@serializable
export class Equipment extends Item {
  constructor(
    char: string,
    color: Color,
    name: string,
    readonly equipmentType: number,
    readonly powerBonus: number,
    readonly defenseBonus: number
  ) {
    super(char, color, name);
  }

  activate(action: Action): void {
    action.actor.toggleEquip(this);
  }
}
