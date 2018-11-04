export declare class FovMap {
    private width;
    private height;
    private blocked;
    private visible;
    private originX;
    private originY;
    private minX;
    private maxX;
    private minY;
    private maxY;
    private radius;
    /**
     * Creates a new FOV map.
     * @constructor
     * @param width
     * @param height
     * @param blockedFunc
     */
    constructor(width: number, height: number, blockedFunc?: Function);
    setBlocked(x: number, y: number, blocked: boolean): void;
    isVisible(x: number, y: number): boolean;
    /**
     * Compute the FOV in an octant adjacent to the Y axis
     */
    private computeOctantY;
    /**
     * Compute the FOV in an octant adjacent to the X axis
     */
    private computeOctantX;
    computeFov(originX: number, originY: number, radius: number): void;
}
