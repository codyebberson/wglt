export declare class RNG {
    private readonly mt;
    private mti;
    /**
     * Creates a new random number generator.
     *
     * @param seed The integer seed.
     */
    constructor(seed?: number);
    setSeed(s: number): void;
    nextInt(): number;
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
