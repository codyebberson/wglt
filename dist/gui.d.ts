import { App } from './app';
import { DialogRenderer } from './gui/dialogrenderer';
import { Panel } from './gui/panel';
import { Vec2 } from './vec2';
export declare class GUI {
    readonly app: App;
    readonly renderer: DialogRenderer;
    readonly rootPanel: Panel;
    dragElement?: Panel;
    dragOffset?: Vec2;
    onDrop?: Function;
    constructor(app: App);
    add(panel: Panel): void;
    remove(panel: Panel): void;
    handleInput(): boolean;
    draw(): void;
    startDragging(panel: Panel): void;
    private updateDragging;
    private tryDrop;
}
