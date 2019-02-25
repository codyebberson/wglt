import { GUI } from '../gui';
import { Mouse } from '../mouse';
import { Rect } from '../rect';
import { Vec2 } from '../vec2';
import { XArray } from '../xarray';
export declare class Panel {
    gui: GUI | null;
    readonly rect: Rect;
    readonly modal: boolean;
    readonly children: XArray<Panel>;
    parent?: Panel;
    constructor(rect: Rect, modal?: boolean);
    setGui(gui: GUI): void;
    add(panel: Panel): void;
    remove(panel: Panel): void;
    move(newParent: Panel): void;
    getPanelAt(point: Mouse | Vec2): Panel | undefined;
    drawContents(): void;
    drawChildren(): void;
    handleInput(): boolean;
    handleChildrenInput(): boolean;
}
