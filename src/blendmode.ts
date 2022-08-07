/**
 * The BlendMode enum defines how translucent cells are rendered.
 */
export enum BlendMode {
  /**
   * No blending.  Alpha is ignored.
   */
  None = 0,

  /**
   * Alpha blending.
   *
   * dstRGB = (srcRGB * srcA) + (dstRGB * (1-srcA))
   *
   * dstA = srcA + (dstA * (1-srcA))
   */
  Blend = 1,

  /**
   * Additive blending.
   *
   * dstRGB = (srcRGB * srcA) + dstRGB
   *
   * dstA = dstA
   */
  Add = 2,
}
