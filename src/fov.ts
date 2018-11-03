
// MRPAS
// Mingos' Restrictive Precise Angle Shadowcasting
// (Precise Angle Shadowcasting for short)
// https://bitbucket.org/mingos/mrpas/overview

function createBoolMatrix(width, height) {
    const result = new Array(height);
    for (let y = 0; y < height; y++) {
        result[y] = new Array(width);
    }
    return result;
}

export class FovMap {
    private width: number;
    private height: number;
    private blocked: Array<Array<boolean>>;
    private visible: Array<Array<boolean>>;
    private originX: number;
    private originY: number;
    private minX: number;
    private maxX: number;
    private minY: number;
    private maxY: number;
    private radius: number;

    /**
     * Creates a new FOV map.
     * @constructor
     * @param {number} width
     * @param {number} height
     * @param {Function=} opt_blockedFunc
     */
    constructor(width, height, opt_blockedFunc) {
        this.width = width;
        this.height = height;
        this.blocked = createBoolMatrix(width, height);
        this.visible = createBoolMatrix(width, height);

        if (opt_blockedFunc) {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    this.blocked[y][x] = opt_blockedFunc(x, y);
                }
            }
        }
    }

    setBlocked(x, y, blocked) {
        this.blocked[y][x] = blocked;
    }

    isVisible(x, y) {
        return this.visible[y][x];
    }

    /**
     * Compute the FOV in an octant adjacent to the Y axis
     * @param {number} deltaX
     * @param {number} deltaY
     * @private
     */
    private computeOctantY(deltaX, deltaY) {
        /**
         * @type {Array.<number>}
         */
        var startSlopes = [];

        /**
         * @type {Array.<number>}
         */
        var endSlopes = [];

        /**
         * @type {number}
         */
        var iteration = 1;

        /**
         * @type {number}
         */
        var totalObstacles = 0;

        /**
         * @type {number}
         */
        var obstaclesInLastLine = 0;

        /**
         * @type {number}
         */
        var minSlope = 0;

        /**
         * @type {number}
         */
        var x;

        /**
         * @type {number}
         */
        var y;

        /**
         * @type {number}
         */
        var halfSlope;

        /**
         * @type {number}
         */
        var processedCell;

        /**
         * @type {boolean}
         */
        var visible;

        /**
         * @type {boolean}
         */
        var extended;

        /**
         * @type {number}
         */
        var centreSlope;

        /**
         * @type {number}
         */
        var startSlope;

        /**
         * @type {number}
         */
        var endSlope;

        /**
         * @type {number}
         */
        var previousEndSlope;

        for (
            y = this.originY + deltaY;
            y >= this.minY && y <= this.maxY;
            y += deltaY, obstaclesInLastLine = totalObstacles, ++iteration
        ) {
            halfSlope = 0.5 / iteration;
            previousEndSlope = -1;
            for (
                processedCell = Math.floor(minSlope * iteration + 0.5), x = this.originX + (processedCell * deltaX);
                processedCell <= iteration && x >= this.minX && x <= this.maxX;
                x += deltaX, ++processedCell, previousEndSlope = endSlope
            ) {
                visible = true;
                extended = false;
                centreSlope = processedCell / iteration;
                startSlope = previousEndSlope;
                endSlope = centreSlope + halfSlope;

                if (obstaclesInLastLine > 0) {
                    if (
                        !(
                            this.visible[y - deltaY][x] &&
                            !this.blocked[y - deltaY][x]
                        ) &&
                        !(
                            this.visible[y - deltaY][x - deltaX] &&
                            !this.blocked[y - deltaY][x - deltaX]
                        )
                    ) {
                        visible = false;
                    } else {
                        for (var idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
                            if (startSlope <= endSlopes[idx] && endSlope >= startSlopes[idx]) {
                                if (!this.blocked[y][x]) {
                                    if (centreSlope > startSlopes[idx] && centreSlope < endSlopes[idx]) {
                                        visible = false;
                                        break;
                                    }
                                } else {
                                    if (startSlope >= startSlopes[idx] && endSlope <= endSlopes[idx]) {
                                        visible = false;
                                        break;
                                    } else {
                                        startSlopes[idx] = Math.min(startSlopes[idx], startSlope);
                                        endSlopes[idx] = Math.max(endSlopes[idx], endSlope);
                                        extended = true;
                                    }
                                }
                            }
                        }
                    }
                }
                if (visible) {
                    this.visible[y][x] = true;
                    if (this.blocked[y][x]) {
                        if (minSlope >= startSlope) {
                            minSlope = endSlope;
                        } else if (!extended) {
                            startSlopes[totalObstacles] = startSlope;
                            endSlopes[totalObstacles++] = endSlope;
                        }
                    }
                }
            }
        }
    };

    /**
     * Compute the FOV in an octant adjacent to the X axis
     * @param {number} deltaX
     * @param {number} deltaY
     * @private
     */
    private computeOctantX(deltaX, deltaY) {
        /**
         * @type {Array.<number>}
         */
        var startSlopes = [];

        /**
         * @type {Array.<number>}
         */
        var endSlopes = [];

        /**
         * @type {number}
         */
        var iteration = 1;

        /**
         * @type {number}
         */
        var totalObstacles = 0;

        /**
         * @type {number}
         */
        var obstaclesInLastLine = 0;

        /**
         * @type {number}
         */
        var minSlope = 0;

        /**
         * @type {number}
         */
        var x;

        /**
         * @type {number}
         */
        var y;

        /**
         * @type {number}
         */
        var halfSlope;

        /**
         * @type {number}
         */
        var processedCell;

        /**
         * @type {boolean}
         */
        var visible;

        /**
         * @type {boolean}
         */
        var extended;

        /**
         * @type {number}
         */
        var centreSlope;

        /**
         * @type {number}
         */
        var startSlope;

        /**
         * @type {number}
         */
        var endSlope;

        /**
         * @type {number}
         */
        var previousEndSlope;

        for (
            x = this.originX + deltaX;
            x >= this.minX && x <= this.maxX;
            x += deltaX, obstaclesInLastLine = totalObstacles, ++iteration
        ) {
            halfSlope = 0.5 / iteration;
            previousEndSlope = -1;
            for (
                processedCell = Math.floor(minSlope * iteration + 0.5), y = this.originY + (processedCell * deltaY);
                processedCell <= iteration && y >= this.minY && y <= this.maxY;
                y += deltaY, ++processedCell, previousEndSlope = endSlope
            ) {
                visible = true;
                extended = false;
                centreSlope = processedCell / iteration;
                startSlope = previousEndSlope;
                endSlope = centreSlope + halfSlope;

                if (obstaclesInLastLine > 0) {
                    if (
                        !(
                            this.visible[y][x - deltaX] &&
                            !this.blocked[y][x - deltaX]
                        ) &&
                        !(
                            this.visible[y - deltaY][x - deltaX] &&
                            !this.blocked[y - deltaY][x - deltaX]
                        )
                    ) {
                        visible = false;
                    } else {
                        for (var idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
                            if (startSlope <= endSlopes[idx] && endSlope >= startSlopes[idx]) {
                                if (!this.blocked[y][x]) {
                                    if (centreSlope > startSlopes[idx] && centreSlope < endSlopes[idx]) {
                                        visible = false;
                                        break;
                                    }
                                } else {
                                    if (startSlope >= startSlopes[idx] && endSlope <= endSlopes[idx]) {
                                        visible = false;
                                        break;
                                    } else {
                                        startSlopes[idx] = Math.min(startSlopes[idx], startSlope);
                                        endSlopes[idx] = Math.max(endSlopes[idx], endSlope);
                                        extended = true;
                                    }
                                }
                            }
                        }
                    }
                }
                if (visible) {
                    this.visible[y][x] = true;
                    if (this.blocked[y][x]) {
                        if (minSlope >= startSlope) {
                            minSlope = endSlope;
                        } else if (!extended) {
                            startSlopes[totalObstacles] = startSlope;
                            endSlopes[totalObstacles++] = endSlope;
                        }
                    }
                }
            }
        }
    };

    /**
     * @param {number} originX
     * @param {number} originY
     * @param {number} radius
     */
    computeFov(originX, originY, radius) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.visible[y][x] = false;
            }
        }

        this.visible[originY][originX] = true;
        this.originX = originX;
        this.originY = originY;
        this.radius = radius;
        this.minX = Math.max(0, originX - radius);
        this.minY = Math.max(0, originY - radius);
        this.maxX = Math.min(this.width - 1, originX + radius);
        this.maxY = Math.min(this.height - 1, originY + radius);

        this.computeOctantY(1, 1);
        this.computeOctantX(1, 1);
        this.computeOctantY(1, -1);
        this.computeOctantX(1, -1);
        this.computeOctantY(-1, 1);
        this.computeOctantX(-1, 1);
        this.computeOctantY(-1, -1);
        this.computeOctantX(-1, -1);
    }
}
