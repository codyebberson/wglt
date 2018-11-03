
/**
 * Random number generator.
 *
 * LCG
 * https://stackoverflow.com/a/424445/2051724
 */
export class RNG {
    private m: number;
    private a: number;
    private c: number;
    private state: number;

    /**
     * Creates a new random number generator.
     *
     * @param seed The integer seed.
     */
    constructor(seed: number) {
        // LCG using GCC's constants
        this.m = 0x80000000; // 2**31;
        this.a = 1103515245;
        this.c = 12345;
        this.state = seed || 1;
    }

    nextInt() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state;
    }

    nextFloat() {
        // returns in range [0,1]
        return this.nextInt() / (this.m - 1);
    }

    nextRange(start, end) {
        // returns in range [start, end): including start, excluding end
        // can't modulu nextInt because of weak randomness in lower bits
        var rangeSize = end - start;
        var randomUnder1 = this['nextInt']() / this.m;
        return start + ((randomUnder1 * rangeSize) | 0);
    }
}
