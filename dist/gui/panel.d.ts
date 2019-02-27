import { GUI } from '../gui';
import { Mouse } from '../mouse';
import { Rect } from '../rect';
import { Vec2 } from '../vec2';
import { XArray } from '../xarray';
export declare class Panel {
    gui: GUI | null;
    readonly rect: Rect;
    readonly children: XArray<Panel>;
    modal: boolean;
    visible: boolean;
    parent?: Panel;
    constructor(rect: Rect);
    setGui(gui: GUI): void;
    add(panel: Panel): void;
    remove(panel: Panel): void;
    move(newParent: Panel): void;
    getPanelAt(point: Mouse | Vec2): Panel | undefined;
    drawContents(): void;
    drawChildren(): void;
    handleInput(): boolean;
    handleChildrenInput(): boolean;
    isDragging(): boolean | null;
    onDrop(panel: Panel): boolean;
}
