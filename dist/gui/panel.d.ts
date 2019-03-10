import { ArrayList } from '../arraylist';
import { GUI } from '../gui';
import { Mouse } from '../mouse';
import { Rect } from '../rect';
import { Vec2 } from '../vec2';
import { TooltipDialog } from './tooltipdialog';
export declare class Panel {
    gui: GUI | null;
    readonly rect: Rect;
    readonly children: ArrayList<Panel>;
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
    updateTooltip(tooltip: TooltipDialog): void;
}
