import { ArrayListListener } from './arraylistlistener';
export declare class ArrayList<T> {
    private readonly elements;
    private listeners?;
    constructor();
    readonly length: number;
    clear(): void;
    get(index: number): T;
    add(el: T): void;
    remove(el: T): void;
    contains(el: T): boolean;
    addListener(listener: ArrayListListener<T>): void;
}
