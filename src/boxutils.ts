import { Console } from './console';

/**
 * Details about box characters.
 * The first element is the array of details for the first box char (0xB3).
 * Each sub array is the count of stems for top, right, bottom, and left.
 */
const BOX_CHAR_DETAILS = [
  [1, 0, 1, 0], // 0xB3
  [1, 0, 1, 1], // 0xB4
  [1, 0, 1, 2], // 0xB5
  [2, 0, 2, 1], // 0xB6
  [0, 0, 2, 1], // 0xB7
  [0, 0, 1, 2], // 0xB8
  [2, 0, 2, 2], // 0xB9
  [2, 0, 2, 0], // 0xBA
  [0, 0, 2, 2], // 0xBB
  [2, 0, 0, 2], // 0xBC
  [2, 0, 0, 1], // 0xBD
  [1, 0, 0, 2], // 0xBE
  [0, 0, 1, 1], // 0xBF
  [1, 1, 0, 0], // 0xC0
  [1, 1, 0, 1], // 0xC1
  [0, 1, 1, 1], // 0xC2
  [1, 1, 1, 0], // 0xC3
  [0, 1, 0, 1], // 0xC4
  [1, 1, 1, 1], // 0xC5
  [1, 2, 1, 0], // 0xC6
  [2, 1, 2, 0], // 0xC7
  [2, 2, 0, 0], // 0xC8
  [0, 2, 2, 0], // 0xC9
  [2, 2, 0, 2], // 0xCA
  [0, 2, 2, 2], // 0xCB
  [2, 2, 2, 0], // 0xCC
  [0, 2, 0, 2], // 0xCD
  [2, 2, 2, 2], // 0xCE
  [1, 2, 0, 2], // 0xCF
  [2, 1, 0, 1], // 0xD0
  [0, 2, 1, 2], // 0xD1
  [0, 1, 2, 1], // 0xD2
  [2, 1, 0, 0], // 0xD3
  [1, 2, 0, 0], // 0xD4
  [0, 2, 1, 0], // 0xD5
  [0, 1, 2, 0], // 0xD6
  [2, 1, 2, 1], // 0xD7
  [1, 2, 1, 2], // 0xD8
  [1, 0, 0, 1], // 0xD9
  [0, 1, 1, 0], // 0xDA
];

function isBoxCell(con: Console, x: number, y: number) {
  const charCode = con.getCharCode(x, y);
  return charCode !== undefined && charCode >= 0xB3 && charCode <= 0xDA;
}

function getBoxCount(con: Console, x: number, y: number, index: number) {
  if (x < 0 || y < 0 || x >= con.width || y >= con.height) {
    return 0;
  }
  const charCode = con.getCharCode(x, y);
  if (charCode === undefined || charCode < 0xB3 || charCode > 0xDA) {
    return 0;
  }
  return BOX_CHAR_DETAILS[charCode - 0xB3][index];
}

function getBoxCell(up: number, right: number, down: number, left: number) {
  for (let i = 0; i < BOX_CHAR_DETAILS.length; i++) {
    const row = BOX_CHAR_DETAILS[i];
    if (row[0] === up && row[1] === right && row[2] === down && row[3] === left) {
      return 0xB3 + i;
    }
  }
  return 0;
}

export function fixBoxCells(con: Console) {
  for (let y = 0; y < con.height; y++) {
    for (let x = 0; x < con.width; x++) {
      if (isBoxCell(con, x, y)) {
        let up = getBoxCount(con, x, y - 1, 2);
        let right = getBoxCount(con, x + 1, y, 3);
        let down = getBoxCount(con, x, y + 1, 0);
        let left = getBoxCount(con, x - 1, y, 1);

        // There are no single-direction stubs.
        // If we need one, then we create a full vertical or horizontal pipe.
        if (up > 0 && right === 0 && down === 0 && left === 0) {
          down = up;
        } else if (up === 0 && right > 0 && down === 0 && left === 0) {
          left = right;
        } else if (up === 0 && right === 0 && down > 0 && left === 0) {
          up = down;
        } else if (up === 0 && right === 0 && down === 0 && left > 0) {
          right = left;
        }

        // Vertical and horizontal axis must have same width.
        if (left > 0 && right > 0) {
          left = right = Math.max(left, right);
        }
        if (up > 0 && down > 0) {
          up = down = Math.max(up, down);
        }

        const charCode = getBoxCell(up, right, down, left);

        if ((up || right || down || left) && !(charCode >= 0xB3 && charCode <= 0xDA)) {
          throw new Error('invalid char code! (up=' + up + ', right=' + right + ', down=' + down + ', left=' + left + ')');
        }

        con.drawChar(x, y, charCode);
      }
    }
  }
}
