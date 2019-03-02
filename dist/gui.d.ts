import { App } from './app';
import { DialogRenderer } from './gui/dialogrenderer';
import { Panel } from './gui/panel';
import { Mouse } from './mouse';
import { Vec2 } from './vec2';
export declare class GUI {
    readonly app: App;
    readonly renderer: DialogRenderer;
    readonly rootPanel: Panel;
    dragElement?: Panel;
    dragOffset?: Vec2;
    constructor(app: App);
    add(panel: Panel): void;
    remove(panel: Panel): void;
    getPanelAt(point: Vec2 | Mouse): Panel | undefined;
    handleInput(): boolean;
    draw(): void;
    startDragging(panel: Panel): void;
    private updateDragging;
}
