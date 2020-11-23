"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlendMode = void 0;
/**
 * The BlendMode enum defines how translucent cells are rendered.
 */
var BlendMode;
(function (BlendMode) {
    /**
     * No blending.  Alpha is ignored.
     */
    BlendMode[BlendMode["None"] = 0] = "None";
    /**
     * Alpha blending.
     *
     * dstRGB = (srcRGB * srcA) + (dstRGB * (1-srcA))
     *
     * dstA = srcA + (dstA * (1-srcA))
     */
    BlendMode[BlendMode["Blend"] = 1] = "Blend";
    /**
     * Additive blending.
     *
     * dstRGB = (srcRGB * srcA) + dstRGB
     *
     * dstA = dstA
     */
    BlendMode[BlendMode["Add"] = 2] = "Add";
})(BlendMode = exports.BlendMode || (exports.BlendMode = {}));
;
