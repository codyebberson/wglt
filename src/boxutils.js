
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

function isBoxCell(console, x, y) {
  const charCode = console.getCell(x, y).charCode;
  return charCode >= 0xB3 && charCode <= 0xDA;
}

function getBoxCell(up, right, down, left) {
  for (let i = 0; i < BOX_CHAR_DETAILS.length; i++) {
    const row = BOX_CHAR_DETAILS[i];
    if (row[0] === up && row[1] === right && row[2] === down && row[3] === left) {
      return 0xB3 + i;
    }
  }
  return 0;
}

export function fixBoxCells(console) {
  for (let y = 0; y < console.height; y++) {
    for (let x = 0; x < console.width; x++) {
      if (isBoxCell(console, x, y)) {
        let up = y > 0 && isBoxCell(console, x, y - 1);
        let right = x < console.width - 1 && isBoxCell(console, x + 1, y);
        let down = y < console.height - 1 && isBoxCell(console, x, y + 1);
        let left = x > 0 && isBoxCell(console, x - 1, y);

        if (up && !right && !down && !left) {
          down = true;
        }
        if (!up && right && !down && !left) {
          left = true;
        }
        if (!up && !right && down && !left) {
          up = true;
        }
        if (!up && !right && !down && left) {
          right = true;
        }

        const charCode = getBoxCell(up ? 1 : 0, right ? 1 : 0, down ? 1 : 0, left ? 1 : 0);

        if ((up || right || down || left) && !(charCode >= 0xB3 && charCode <= 0xDA)) {
          throw new Error('invalid char code!');
        }

        console.getCell(x, y).setCharCode(charCode);
      }
    }
  }
}
