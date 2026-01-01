/*

Adapted ZzFX for wglt
Last updated December 2025
ZzFX continues to receive updates, but ZzFXM does not.
Therefore, we need to carefully adapt any necessary changes manually.
Note that this means the ZzFXM tracker may sound differently.

*/
/*

ZzFX - Zuper Zmall Zound Zynth v1.3.2 by Frank Force
https://github.com/KilledByAPixel/ZzFX

ZzFX Features

- Tiny synth engine with 20 controllable parameters.
- Play sounds via code, no need for sound assed files!
- Compatible with most modern web browsers.
- Small code footprint, the micro version is under 1 kilobyte.
- Can produce a huge variety of sound effect types.
- Sounds can be played with a short call. zzfx(...[,,,,.1,,,,9])
- A small bit of randomness appied to sounds when played.
- Use ZZFX.GetNote to get frequencies on a standard diatonic scale.
- Sounds can be saved out as wav files for offline playback.
- No additional libraries or dependencies are required.

*/
/*

  ZzFX MIT License

  Copyright (c) 2019 - Frank Force

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

*/

/**
 * Master volume scale.
 * `ZZFX.volume`
 */
export const zzfxV = 0.3;

/**
 * Sample rate for audio.
 * `ZZFX.sampleRate`
 */
export const zzfxR = 44100;

/**
 * Create shared audio context.
 * `ZZFX.audioContext`
 */
export const zzfxX = new AudioContext();

/**
 * Play a sound from zzfx paramerters.
 * `ZZFX.play`
 */
export function zzfx(
  ...parameters: (number | undefined)[]
): AudioBufferSourceNode {
  return zzfxP([zzfxG(...parameters)]);
}

/**
 * Play an array of samples.
 * `ZZFX.playSamples`
 */
export function zzfxP(sampleChannels: number[][], volumeScale=1, rate=1, pan=0, loop=false): AudioBufferSourceNode {
  // create buffer and source
  const channelCount = sampleChannels.length;
  const sampleLength = sampleChannels[0].length;
  const buffer = zzfxX.createBuffer(channelCount, sampleLength, zzfxR);
  const source = zzfxX.createBufferSource();

  // copy samples to buffer and setup source
  sampleChannels.forEach((c,i)=> buffer.getChannelData(i).set(c));
  source.buffer = buffer;
  source.playbackRate.value = rate;
  source.loop = loop;

  // create and connect gain node
  const gainNode = zzfxX.createGain();
  gainNode.gain.value = zzfxV*volumeScale;
  gainNode.connect(zzfxX.destination);

  // connect source to stereo panner and gain
  const pannerNode = new StereoPannerNode(zzfxX, {'pan':pan});
  source.connect(pannerNode).connect(gainNode);
  source.start();

  // return sound
  return source;
}

/**
 * Build an array of samples.
 * `ZZFX.buildSamples`
 */
export function zzfxG(
  volume = 1,
  randomness = 0.05,
  frequency = 220,
  attack = 0,
  sustain = 0,
  release = 0.1,
  shape = 0,
  shapeCurve = 1,
  slide = 0,
  deltaSlide = 0,
  pitchJump = 0,
  pitchJumpTime = 0,
  repeatTime = 0,
  noise = 0,
  modulation = 0,
  bitCrush = 0,
  delay = 0,
  sustainVolume = 1,
  decay = 0,
  tremolo = 0,
  filter = 0
): number[] {
  // init parameters
  let sampleRate = zzfxR,
    PI2 = Math.PI * 2,
    abs = Math.abs,
    sign = (v: number): number => (v < 0 ? -1 : 1),
    startSlide = (slide *= (500 * PI2) / sampleRate / sampleRate),
    startFrequency = (frequency *=
      ((1 + randomness * 2 * Math.random() - randomness) * PI2) / sampleRate),
    modOffset = 0, // modulation offset
    repeat = 0, // repeat offset
    crush = 0, // bit crush offset
    jump = 1, // pitch jump timer
    length, // sample length
    b = [], // sample buffer
    t = 0, // sample time
    i = 0, // sample index
    s = 0, // sample value
    f, // wave frequency
    // biquad LP/HP filter
    quality = 2,
    w = (PI2 * abs(filter) * 2) / sampleRate,
    cos = Math.cos(w),
    alpha = Math.sin(w) / 2 / quality,
    a0 = 1 + alpha,
    a1 = (-2 * cos) / a0,
    a2 = (1 - alpha) / a0,
    b0 = (1 + sign(filter) * cos) / 2 / a0,
    b1 = -(sign(filter) + cos) / a0,
    b2 = b0,
    x2 = 0,
    x1 = 0,
    y2 = 0,
    y1 = 0;

  // scale by sample rate
  const minAttack = 9; // prevent pop if attack is 0
  attack = attack * sampleRate || minAttack;
  decay *= sampleRate;
  sustain *= sampleRate;
  release *= sampleRate;
  delay *= sampleRate;
  deltaSlide *= (500 * PI2) / sampleRate ** 3;
  modulation *= PI2 / sampleRate;
  pitchJump *= PI2 / sampleRate;
  pitchJumpTime *= sampleRate;
  repeatTime = (repeatTime * sampleRate) | 0;
  volume *= zzfxV;

  // generate waveform
  for (
    length = (attack + decay + sustain + release + delay) | 0;
    i < length;
    b[i++] = s * volume // sample
  ) {
    if (!(++crush % ((bitCrush * 100) | 0))) {
      // bit crush
      s = shape
        ? shape > 1
          ? shape > 2
            ? shape > 3
              ? shape > 4 // wave shape
                ? (t / PI2) % 1 < shapeCurve / 2
                  ? 1
                  : -1 // 5 square duty
                : Math.sin(t ** 3) // 4 noise
              : Math.max(Math.min(Math.tan(t), 1), -1) // 3 tan
            : 1 - (((((2 * t) / PI2) % 2) + 2) % 2) // 2 saw
          : 1 - 4 * abs(Math.round(t / PI2) - t / PI2) // 1 triangle
        : Math.sin(t); // 0 sin

      s =
        (repeatTime
          ? 1 - tremolo + tremolo * Math.sin((PI2 * i) / repeatTime) // tremolo
          : 1) *
        (shape > 4 ? s : sign(s) * abs(s) ** shapeCurve) * // shape curve
        (i < attack
          ? i / attack // attack
          : i < attack + decay // decay
          ? 1 - ((i - attack) / decay) * (1 - sustainVolume) // decay falloff
          : i < attack + decay + sustain // sustain
          ? sustainVolume // sustain volume
          : i < length - delay // release
          ? ((length - i - delay) / release) * // release falloff
            sustainVolume // release volume
          : 0); // post release

      s = delay
        ? s / 2 +
          (delay > i
            ? 0 // delay
            : ((i < length - delay ? 1 : (length - i) / delay) * // release delay
                b[(i - delay) | 0]) /
              2 /
              volume)
        : s; // sample delay

      if (filter)
        // apply filter
        s = y1 =
          b2 * x2 + b1 * (x2 = x1) + b0 * (x1 = s) - a2 * y2 - a1 * (y2 = y1);
    }

    f =
      (frequency += slide += deltaSlide) * // frequency
      Math.cos(modulation * modOffset++); // modulation
    t += f + f * noise * Math.sin(i ** 5); // noise

    if (jump && ++jump > pitchJumpTime) {
      // pitch jump
      frequency += pitchJump; // apply pitch jump
      startFrequency += pitchJump; // also apply to start
      jump = 0; // stop pitch jump time
    }

    if (repeatTime && !(++repeat % repeatTime)) {
      // repeat
      frequency = startFrequency; // reset frequency
      slide = startSlide; // reset slide
      jump ||= 1; // reset pitch jump time
    }
  }

  return b; // return sample buffer
}

/**
 * Sound object that can precache and play ZZFX sounds
 */
export class Sound {
  readonly zzfxSound: (number | undefined)[];
  readonly randomness: number;
  readonly samples: number[];
  source?: AudioBufferSourceNode;

  constructor(zzfxSound: (number | undefined)[]) {
    this.zzfxSound = zzfxSound;

    // extract randomness parameter from zzfxSound
    this.randomness = zzfxSound[1] != undefined ? zzfxSound[1] : .05;
    zzfxSound[1] = 0; // generate without frequency randomness

    // cache the sound samples
    this.samples = zzfxG(...zzfxSound);
  }

  play(volume=1, pitch=1, randomnessScale=1, pan=0, loop=false) {
    // play the sound
    const playbackRate = pitch + pitch * this.randomness*randomnessScale*(Math.random()*2-1);
    this.source = zzfxP([this.samples], volume, playbackRate, pan, loop);
    return this.source;
  }
}
