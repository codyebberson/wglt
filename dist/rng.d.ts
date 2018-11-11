/**
 * Random number generator.
 *
 * LCG
 * https://stackoverflow.com/a/424445/2051724
 */
export declare class RNG {
    private readonly m;
    private readonly a;
    private readonly c;
    private state;
    /**
     * Creates a new random number generator.
     *
     * @param seed The integer seed.
     */
    constructor(seed: number);
    private nextInt;
    nextFloat(): number;
    nextRange(start: number, end: number): number;
}
