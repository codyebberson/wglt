import { Rect } from '../rect';
import { Talent } from '../talent';
import { Button } from './button';
export declare class TalentButton extends Button {
    readonly talent: Talent;
    constructor(rect: Rect, talent: Talent);
    click(): void;
}
