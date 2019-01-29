import { App } from './app';
import { GUI } from './gui';
export declare class AppState {
    readonly app: App;
    readonly gui: GUI;
    constructor(app: App);
    update(): void;
}
