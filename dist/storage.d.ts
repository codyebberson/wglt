export declare class Storage {
    static isArray(object: any): boolean;
    static isString(object: object): boolean;
    static isBoolean(object: object): boolean;
    static isNumber(object: object): boolean;
    static isFunction(object: object): boolean;
    static isObject(object: object): boolean;
    static decorate(object: any): any;
    static fixPrototype(object: any): any;
    static stringify(object: any): string;
    private static parse;
    static save(variable: string, value: any): string;
    static load(variable: string): any;
    static exists(variable: string): boolean;
    static clear(variable: string): void;
}
