import { App } from './app';
import { DialogRenderer } from './gui/dialogrenderer';
import { Panel } from './gui/panel';
export declare class GUI {
    readonly app: App;
    readonly panels: Panel[];
    readonly renderer: DialogRenderer;
    constructor(app: App);
    add(panel: Panel): void;
    handleInput(): boolean;
    draw(): void;
}
