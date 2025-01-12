/*
 * Random number generator.
 *
 * Currently using a Mersenne Twister based on:
 * https://gist.github.com/banksean/300494
 *
 * Old version used LCG
 * https://stackoverflow.com/a/424445/2051724
 * but had precision issues which led to cycle issues.
 */

/* Period parameters */
const N = 624;
const M = 397;
const MATRIX_A = 0x9908b0df;   /* constant vector a */
const UPPER_MASK = 0x80000000; /* most significant w-r bits */
const LOWER_MASK = 0x7fffffff; /* least significant r bits */

export class RNG {
  private readonly mt: number[];
  private mti: number;

  /**
   * Creates a new random number generator.
   *
   * @param seed The integer seed.
   */
  constructor(seed?: number) {
    this.mt = new Array(N); /* the array for the state vector */
    this.mti = N + 1; /* mti==N+1 means mt[N] is not initialized */
    this.setSeed(seed || 1);
  }

  setSeed(s: number) {
    // this.state = seed;
    this.mt[0] = s >>> 0;
    for (this.mti = 1; this.mti < N; this.mti++) {
      const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
      this.mt[this.mti] =
        (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
          (s & 0x0000ffff) * 1812433253) + this.mti;
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      this.mt[this.mti] >>>= 0;
      /* for >32 bit machines */
    }
  }

  nextInt() {
    let y = 0;
    const mag01 = new Array(0x0, MATRIX_A);
    /* mag01[x] = x * MATRIX_A  for x=0,1 */

    if (this.mti >= N) { /* generate N words at one time */
      var kk;

      // if (this.mti == N+1)   /* if init_genrand() has not been called, */
      //   this.setSeed(5489); /* a default initial seed is used */

      for (kk = 0; kk < N - M; kk++) {
        y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
        this.mt[kk] = this.mt[kk + M] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      for (; kk < N - 1; kk++) {
        y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
        this.mt[kk] = this.mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      y = (this.mt[N - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK);
      this.mt[N - 1] = this.mt[M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

      this.mti = 0;
    }

    y = this.mt[this.mti++];

    /* Tempering */
    y ^= (y >>> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >>> 18);

    return y >>> 0;
  }

  /**
   * Returns a floating point number between 0.0 and 1.0.
   */
  nextFloat() {
    return this.nextInt() * (1.0 / 4294967296.0);
    /* divided by 2^32 */
  }

  /**
   * Returns an integer in the range start (inclusive) to end (exclusive).
   * @param start Lower bound, inclusive.
   * @param end Upper bound, exclusive.
   */
  nextRange(start: number, end: number) {
    return start + ((this.nextFloat() * (end - start)) | 0);
  }

  chooseIndex(chances: number[]) {
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

  chooseKey(chancesMap: { [key: string]: number }) {
    const values: string[] = [];
    const chances: number[] = [];

    for (const property in chancesMap) {
      if (chancesMap.hasOwnProperty(property)) {
        values.push(property);
        chances.push(chancesMap[property]);
      }
    }

    return values[this.chooseIndex(chances)];
  }
}
