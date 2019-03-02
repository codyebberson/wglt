import { Rect } from '../rect';
import { Talent } from '../talent';
import { Button } from './button';
export declare class TalentButton extends Button {
    readonly talent: Talent;
    readonly shortcut: boolean;
    constructor(rect: Rect, talent: Talent, shortcut?: boolean);
    click(): void;
    drawContents(): void;
}
