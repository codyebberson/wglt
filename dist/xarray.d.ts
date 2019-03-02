import { XArrayListener } from './xarraylistener';
export declare class XArray<T> {
    private readonly elements;
    private listeners?;
    constructor();
    readonly length: number;
    clear(): void;
    get(index: number): T;
    add(el: T): void;
    remove(el: T): void;
    contains(el: T): boolean;
    addListener(listener: XArrayListener<T>): void;
}
