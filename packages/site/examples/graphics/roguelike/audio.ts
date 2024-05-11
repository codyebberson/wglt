export const FX_NO_EFFECT = 0;
export const FX_SLIDE = 1;
export const FX_VIBRATO = 2;
export const FX_DROP = 3;
export const FX_FADE_IN = 4;
export const FX_FADE_OUT = 5;
export const FX_ARP_FAST = 6;
export const FX_ARP_SLOW = 7;
export const SAMPLE_RATE = 44100;
export const BASE_SPEED = 120;

// Celeste sounds
// 4 = powerup
// 5 = player hurt
// 6 = powerup
// 7 = checkpoint

// Sounds 0-18 are from nadir
// Sound 19 is the sword swing from "World Under"
// Sound 20 is the dash sound from Celeste (#3)
// Sound 21 is a powerup sound from Celeste (#8)
// Sound 22 is a powerup sound from Celeste (#13)
export const sfx = `0001000033670325702c460284601d250192501624015230103300932004320013102630027300273002430006300013000000000000000000000000000000000000000000000000000000000000000000000000
000100000c6501f640056100050000500005000050000500005000050000500005000050000500005000050000500005000050000500005000050000500005000050000500005000050000500005000050000500
000100000243003650046200361003650036500070000700007000070000700007000070000700007000070000700007000070000700007000070000700007000070000700007000070000700007000070000700
00010000000003f7703c770117703e7703f7703f770137703c7703a760197603a7503d7403f7403f7403c7503a760187503b740103500e3500d3500c3500a3500835007350053500435003350013500000000000
000400002c57024570365702e570000000000000000000002c52024520365202e520000000000000000000002c51024510365102e510000000000000000000000000000000000000000000000000000000000000
000100003e6303e5303d7303c7303a73037730357203472033720327203272031720307202f7202f7102f7102e7102e7102d7102d7102d7102d7102d7102c7102b7102b710020000100001000000000000000000
000100001a050387503b0503c3500e0503a3503a050367501a0503e0500f05007350063500635006350063500735008350093500a3500c3500d3500e350103501135011350043000330001300013000000000000
000100003f7503f7503e7503a75033750267500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000300000f4703f630000001d4703f630000002e4703f6303f6203f6103f6100f4300f4000f4001d4301d4001d4002e4302d5002d5000f400000000f4101d4001f4001d4102e4002f4002e410000000000000000
00030000223702267005600256003237032670326700a6000a6000c6000c60022320226200e6000e6003232032620326200e6000d6000c6000b60022310226100960008600323103261032610056000360001600
00020000300503505034050302502e2502b25027250242501f2401724012220227002770028700201001e10000000000000000000000000000000000000000000000000000000000000000000000000000000000
000300002777001700007001d7703f70000700347703f7003f7003f7003f700277300f7000f7001d7301d7001d700347302d7002d7000f70000700277101d7001f7001d7102e7002f70034710002000020000000
000a00003867028170166500f3400e6300c1200d6100c4100b610091100661004010036100111001600016000160001000010000200002000030000400005000050000600006000060000700009000090000a000
010e00003037101271002110127100271012000110001200303710127100211012710027101200011000000030371012710021101271002710120000000011003037101271002110127100271012000000000000
001600002161001630016301d610016301c6300163001630016301b6101c610016300163019610026300263002630196200263012610026301c62002630026301f620026300263002630026301d6100263002630
0018000004650046400364003640036400464004650046500465004650046500465004650056400464004640356402d640236401b6401764013640106400d6300c6300c6200b6200a62008620066100161001610
010c0000180733c6063c6363460318073186033c63624600180733c6063c6363460318073186033c63624600180733c6063c6363460318073186033c63624600180733c60618073180731807318603180733c636
010c00000036500265003550025500345002450033500235003250022500335002350034500245003550025501365012650135501255013450124501335012350034500245003550025500365002650c3650c265
011800000073000741007510075100751007410073100731007300074100751007510075100741007310073100730007410075100751007510074100731007310073000741007510075100751007410073100731
011800000041300413004230042300433004330044300443004430044300433004330042300423004130041300232007003c2022430200222007003c1020070000212241023c1020030500212002052030500205
011800000017500005001552800500135240050011524005007050000500705280050070524005000052400500005000050011528005001352400500155240050017500005001552800500135240050011524005
000100003d37039460343602f4602a36026450223501b4501935015450113500a4400734004430013300000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000300003f3603a360314502b450244401a4401043006430014200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000c0000283502735025350243502235021340203401f3301d3301b330183301733015330143301333012330113300f3200e32007650075400864007530066300552005620055200462001510016100151001610`;

export const music = `01 50515212
00 41514312
00 50515212
00 50511312
00 4d4e5412
02 41421412
00 41424344
00 41424344
03 10114344`;

/**
 * Global audio context.
 * Using a global will create a warning in Chrome, but appears to be fine.
 * @const {!AudioContext}
 */
export const audioCtx = new AudioContext();

export const sfxData = sfx.split('\n');
export const musicData = music.split('\n');

/**
 * Previous brown noise.
 * Need to track this to trim frequency ranges.
 * See the noise oscillator.
 * @type {number}
 */
let prevNoise = 0;

/**
 * Currently playing music.
 */
let currMusic: AudioBufferSourceNode | undefined = undefined;

/**
 * Parses a hex substring into a decimal number.
 * @param str
 * @param start
 * @param len
 * @return {number}
 * @noinline
 */
export const parseHex = (str: string, start: number, len: number): number =>
  Number.parseInt(str.substr(start, len) || '0', 16);

/**
 * Rounds a number.
 * This compresses better than Math.round.
 * Google Closure Compiler inlines the calls.
 * @param x Input number.
 * @returns Output number.
 */
export const round = (x: number): number => (x + 0.5) | 0;

/**
 * Triangle oscillator.
 * @param t
 * @return {number}
 */
export const triangleOscillator = (t: number): number => Math.abs(2 * t - 1) - 1.0;

/**
 * Tilted saw oscillator.
 * @param t
 * @return {number}
 */
export const tiltedSawOscillator = (t: number): number => {
  const a = 0.9;
  const ret = t < a ? (2.0 * t) / a - 1.0 : (2.0 * (1.0 - t)) / (1.0 - a) - 1.0;
  return ret * 0.5;
};

/**
 * Saw oscillator.
 * 0->1 ramp
 * @param t
 * @return {number}
 */
export const sawOscillator = (t: number): number => 0.6 * (t < 0.5 ? t : t - 1.0);

/**
 * Square oscillator.
 * 50% duty cycle square wave
 * @param t
 * @return {number}
 */
export const squareOscillator = (t: number): number => (t < 0.5 ? 0.5 : -0.5);

/**
 * Pulse oscillator.
 * 20% duty cycle square wave
 * @param t
 * @return {number}
 */
export const pulseOscillator = (t: number): number => (t < 0.3 ? 0.5 : -0.5);

/**
 * Organ oscillator.
 * tri-uneven: 100% tri 75% tri on loop
 * @param t
 * @return {number}
 */
export const organOscillator = (t: number): number =>
  (t < 0.5 ? 3.0 - Math.abs(24.0 * t - 6.0) : 1.0 - Math.abs(16.0 * t - 12.0)) / 9.0;

/**
 * Noise oscillator.
 * @return {number}
 */
export const noiseOscillator = (): number => {
  const white = Math.random() * 2 - 1;
  const brown = (prevNoise + 0.02 * white) / 1.02;
  prevNoise = brown;
  return brown * 3; // (roughly) compensate for gain
};

/**
 * Phaser oscillator.
 * @param t
 * @param value
 * @return {number}
 */
export const phaserOscillator = (t: number, value: number): number => {
  // This one has a subfrequency of freq/128 that appears
  // to modulate two signals using a triangle wave
  const k = Math.abs(2.0 * ((value / 128.0) % 1.0) - 1.0);
  const u = (t + 0.5 * k) % 1.0;
  const ret = Math.abs(4.0 * u - 2.0) - Math.abs(8.0 * t - 4.0);
  return ret / 6.0;
};

/**
 * Oscillators.
 * Order and indices are important!
 * @const {!Array.<function(number=, number=): number>}
 */
export const oscillators = [
  triangleOscillator,
  tiltedSawOscillator,
  sawOscillator,
  squareOscillator,
  pulseOscillator,
  organOscillator,
  noiseOscillator,
  phaserOscillator,
];

/**
 * Returns note frequency from pitch index (0-63).
 * From C-0 to D#-5 in chromatic scale.
 * @param pitch
 * @return {number}
 */
export const getFreq = (pitch: number): number => 65 * 2 ** (pitch / 12);

// /**
//  * Converts frequency to midi.
//  * @param frequency The note frequency.
//  * @returns The midi note.
//  */
// function frequencyToMidiNoteNumber(frequency) {
//   return Math.round(69 + 12 * Math.log2(frequency / 440));
// }

/**
 * Cache of pre-built sounds.
 * Key is `${sfxIndex}-${pitchOffset}
 * Value is a AudioBuffer.
 */
export const soundCache: Record<number, AudioBuffer> = {};

// export const codyOutput = {};

/**
 * Builds the sound from scratch.
 * @param sfxIndex
 * @param pitchOffset
 * @return {!AudioBuffer}
 */
export const buildSound = (sfxIndex: number): AudioBuffer => {
  const sfxRow = sfxData[sfxIndex];
  const speed = parseHex(sfxRow, 2, 2);
  const noteLength = speed / BASE_SPEED;
  const loopStart = parseHex(sfxRow, 4, 2);
  const loopEnd = parseHex(sfxRow, 6, 2) || 32;
  const length = loopEnd * noteLength * SAMPLE_RATE;
  const audioBuffer = audioCtx.createBuffer(1, length, SAMPLE_RATE);
  const data = audioBuffer.getChannelData(0);

  /**
   * Returns the next note index.
   * Handles loop start/end.
   * @param i The current note index.
   * @returns The next note index.
   */
  const getNextIndex = (i: number): number => (i + 1 >= loopEnd ? loopStart : i + 1);

  /**
   * Returns a data element from the sfx row.
   * @param index The note index. (0-32).
   * @param offset The element offset (0-4).
   * @param len The length in hex characters.
   * @returns The sfx value.
   */
  const getSfx = (index: number, offset: number, len: number): number =>
    parseHex(sfxRow, 8 + index * 5 + offset, len);

  let offset = 0;
  let phi = 0;
  let i = 0;

  let prevNote = 24;
  let prevFreq = getFreq(24);
  let prevWaveform = -1;
  let prevVolume = -1;
  let prevEffect = -1;

  let currNote: number;
  let currFreq: number;
  let currWaveform: number;
  let currVolume: number;
  let currEffect: number;

  while (offset < length) {
    currNote = getSfx(i, 0, 2);
    currFreq = getFreq(currNote);
    currWaveform = getSfx(i, 2, 1);
    currVolume = getSfx(i, 3, 1) / 8.0;
    currEffect = getSfx(i, 4, 1);

    const next = getNextIndex(i);
    const nextNote = getSfx(next, 0, 2);
    const nextWaveform = getSfx(next, 2, 1);
    const nextVolume = getSfx(next, 3, 1);
    const nextEffect = getSfx(next, 4, 1);

    let attack = 0.02;
    if (
      currEffect === FX_FADE_IN ||
      (currWaveform === prevWaveform &&
        (currNote === prevNote || currEffect === FX_SLIDE) &&
        prevVolume > 0 &&
        prevEffect !== FX_FADE_OUT)
    ) {
      attack = 0;
    }
    let release = 0.05;
    if (
      currEffect === FX_FADE_OUT ||
      (currWaveform === nextWaveform &&
        (currNote === nextNote || nextEffect === FX_SLIDE) &&
        nextVolume > 0 &&
        nextEffect !== FX_FADE_IN)
    ) {
      release = 0;
    }

    const samples = round(noteLength * SAMPLE_RATE);
    for (let j = offset; j < offset + samples; j++) {
      // Note factor is the percentage of completion of the note
      // 0.0 is the beginning
      // 1.0 is the end
      const noteFactor = (j - offset) / samples;

      let envelope = 1.0;
      if (noteFactor < attack) {
        envelope = noteFactor / attack;
      } else if (noteFactor > 1.0 - release) {
        envelope = (1.0 - noteFactor) / release;
      }

      let freq = currFreq;
      let volume = currVolume;

      if (currEffect === FX_SLIDE) {
        freq = (1 - noteFactor) * prevFreq + noteFactor * currFreq;
        if (prevVolume > 0) {
          volume = (1 - noteFactor) * prevVolume + noteFactor * currVolume;
        }
      }
      if (currEffect === FX_VIBRATO) {
        freq *= 1.0 + 0.02 * Math.sin(7.5 * noteFactor);
      }
      if (currEffect === FX_DROP) {
        freq *= 1.0 - noteFactor;
      }
      if (currEffect === FX_FADE_IN) {
        volume *= noteFactor;
      }
      if (currEffect === FX_FADE_OUT) {
        volume *= 1.0 - noteFactor;
      }
      if (currEffect >= FX_ARP_FAST) {
        // From the documentation:
        //   6 arpeggio fast  //  Iterate over groups of 4 notes at speed of 4
        //   7 arpeggio slow  //  Iterate over groups of 4 notes at speed of 8
        //   If the SFX speed is <= 8, arpeggio speeds are halved to 2, 4
        const m = (speed <= 8 ? 32 : 16) / (currEffect === FX_ARP_FAST ? 4 : 8);
        const n = (m * noteFactor) | 0;
        const arpNote = (i & ~3) | (n & 3);
        freq = getFreq(getSfx(arpNote, 0, 2));
      }

      phi += freq / SAMPLE_RATE;
      if (currWaveform < 8) {
        data[j] += volume * envelope * oscillators[currWaveform](phi % 1, phi);
      }
    }

    offset += samples;
    prevNote = currNote;
    prevFreq = currFreq;
    prevWaveform = currWaveform;
    prevVolume = currVolume;
    prevEffect = currEffect;
    i = getNextIndex(i);
  }
  return audioBuffer;
};

/**
 * Returns a sound buffer.
 * Uses a cached buffer if available.
 * Otherwise builds the sound from scratch.
 * @param sfxIndex
 * @return {!AudioBuffer}
 */
export const getSound = (sfxIndex: number): AudioBuffer => {
  const key = sfxIndex;
  let sound = soundCache[key];
  if (!sound) {
    sound = buildSound(sfxIndex);
    soundCache[key] = sound;
  }
  return sound;
};

/**
 * @param data
 * @param offset
 * @param endOffset
 * @param sfxIndex
 */
export const buildMusic = (
  data: Float32Array,
  offset: number,
  endOffset: number,
  sfxIndex: number
): void => {
  const sfxBuffer = getSound(sfxIndex);
  const sfxBufferData = sfxBuffer.getChannelData(0);
  let i = 0;
  let j = offset;
  while (j < endOffset) {
    data[j] += sfxBufferData[i];
    i = (i + 1) % sfxBufferData.length;
    j++;
  }
};

/**
 * Plays an audio buffer.
 * Optional looping.
 * @param audioBuffer The audio buffer.
 * @param loop Optional flag to loop the audio.
 * @param loopStart Optional loop start time.
 * @return {!AudioBufferSourceNode}
 */
export const playAudioBuffer = (
  audioBuffer: AudioBuffer,
  loop = false,
  loopStart = 0
): AudioBufferSourceNode => {
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = loop;
  source.loopStart = loopStart;
  source.connect(audioCtx.destination);
  source.start();
  return source;
};

/**
 * Plays a sound effect.
 * @param n The number of the sound effect to play (0-63).
 * @return {!AudioBufferSourceNode}
 */
export const playSfx = (n: number): AudioBufferSourceNode => playAudioBuffer(getSound(n));

export const stopMusic = (): void => {
  if (currMusic) {
    currMusic.stop();
    currMusic = undefined;
  }
};

/**
 * Builds and plays a song.
 * @param startPattern
 * @return {!AudioBufferSourceNode}
 */
export async function playMusic(startPattern: number): Promise<void> {
  await audioCtx.resume();
  stopMusic();

  // Preprocess loop
  // Need to do 4 things on this loop:
  // 1) Find the "time" channels
  //    Channels can run at different speeds, and therefore have different lengths
  //    The length of a pattern is defined by the first non-looping channel
  //    See: https://www.lexaloffle.com/bbs/?pid=12781
  // 2) Calculate the pattern lengths
  //    After we know the time channel, we can convert that into number of samples
  // 3) Find the loop start time (if one exists)
  //    Find the pattern with the "start loop" flag set
  //    Otherwise default to beginning of the song
  // 4) Find the end pattern and total song length
  //    Find the pattern with the "end loop" flag set
  //    Otherwise default to end of the song
  const timeChannels = [];
  const patternSamples = [];
  let loopStart = 0;
  let songLength = 0;
  let endPattern = musicData.length - 1;
  for (let pattern = startPattern; pattern <= endPattern; pattern++) {
    const musicRow = musicData[pattern];
    const flags = parseHex(musicRow, 0, 2);

    timeChannels[pattern] = 0;
    for (let channel = 0; channel < 4; channel++) {
      const sfxIndex = parseHex(musicRow, 3 + channel * 2, 2);
      if (sfxIndex < sfxData.length) {
        const sfxRow = sfxData[sfxIndex];
        const loopEnd = parseHex(sfxRow, 6, 2);
        if (loopEnd === 0) {
          timeChannels[pattern] = channel;
          break;
        }
      }
    }

    const sfxIndex = parseHex(musicRow, 3 + timeChannels[pattern] * 2, 2);
    const sfxRow = sfxData[sfxIndex];
    const noteLength = parseHex(sfxRow, 2, 2) / BASE_SPEED;
    patternSamples[pattern] = round(32 * noteLength * SAMPLE_RATE);

    if ((flags & 1) === 1) {
      loopStart = songLength;
    }

    songLength += 32 * noteLength;

    if ((flags & 2) === 2) {
      endPattern = pattern;
      break;
    }
  }

  // Now we have everything we need to build the song
  const frameCount = SAMPLE_RATE * songLength;
  const audioBuffer = audioCtx.createBuffer(1, frameCount, SAMPLE_RATE);
  const data = audioBuffer.getChannelData(0);

  // Main music generator loop
  let offset = 0;
  for (let pattern = startPattern; pattern <= endPattern; pattern++) {
    const musicRow = musicData[pattern];
    const samples = patternSamples[pattern];
    for (let channel = 0; channel < 4; channel++) {
      const sfxIndex = parseHex(musicRow, 3 + channel * 2, 2);
      if (sfxIndex < sfxData.length) {
        buildMusic(data, offset, offset + samples, sfxIndex);
      }
    }
    offset += samples;
  }
  currMusic = playAudioBuffer(audioBuffer, true, loopStart);
}
