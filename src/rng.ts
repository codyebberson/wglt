
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
  constructor(seed?: number) {
    // LCG using GCC's constants
    this.m = 0x80000000;  // 2**31;
    this.a = 1103515245;
    this.c = 12345;
    this.state = seed || 1;
  }

  nextInt(): number {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
  }

  /**
   * Returns a floating point number between 0.0 and 1.0.
   */
  nextFloat(): number {
    // returns in range [0,1]
    return this.nextInt() / (this.m - 1);
  }

  /**
   * Returns an integer in the range start (inclusive) to end (exclusive).
   * @param start Lower bound, inclusive.
   * @param end Upper bound, exclusive.
   */
  nextRange(start: number, end: number): number {
    // returns in range [start, end): including start, excluding end
    // can't modulu nextInt because of weak randomness in lower bits
    const rangeSize = end - start;
    const randomUnder1 = this.nextInt() / this.m;
    const result = start + ((randomUnder1 * rangeSize) | 0);
    if (isNaN(result)) {
      throw new Error('rand nan');
    }
    return result;
  }

  chooseIndex(chances: any[]) {
    const total = chances.reduce((a, b) => a + b);
    const roll = this.nextRange(1, total + 1);
    let runningTotal = 0;

    for (let i = 0; i < chances.length; i++) {
      runningTotal += chances[i];
      if (roll <= runningTotal) {
        return i;
      }
    }

    return chances.length - 1;
  }

  chooseKey(chancesMap: any) {
    const values = [];
    const chances = [];

    for (const property in chancesMap) {
      if (chancesMap.hasOwnProperty(property)) {
        values.push(property);
        chances.push(chancesMap[property]);
      }
    }

    return values[this.chooseIndex(chances)];
  }
}
