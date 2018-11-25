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
    constructor(seed?: number);
    private nextInt;
    /**
     * Returns a floating point number between 0.0 and 1.0.
     */
    nextFloat(): number;
    /**
     * Returns an integer in the range start (inclusive) to end (exclusive).
     * @param start Lower bound, inclusive.
     * @param end Upper bound, exclusive.
     */
    nextRange(start: number, end: number): number;
    chooseIndex(chances: number[]): number;
    chooseKey(chancesMap: {
        [key: string]: number;
    }): string;
}
